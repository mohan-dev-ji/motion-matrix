/**
 * Generate seamless ambient background music for a Motion Matrix episode
 * using stability-ai/stable-audio-2.5 on Replicate.
 *
 * Strategy: generate a single 150-second source clip, then tile it with a
 * 30-second crossfade between iterations to reach the target duration.
 * The crossfade window is exactly 60 beats / 15 bars at 120 BPM — long
 * enough that the seam between "end of clip" and "start of clip" is
 * inaudible against an evolving arpeggio texture.
 *
 *   pass 1 → 150s source (1 Replicate call)
 *   tile N → SOURCE + (N−1) × (SOURCE − CROSSFADE) seconds
 *            with each join blended over CROSSFADE seconds
 *
 * Episode targets at the time of writing:
 *   s0e0 (seek)        211.5s → 2 tiles, trim
 *   s0e1 (addition)    252.0s → 2 tiles, trim
 *   s0e2 (triple-add)  273.0s → 3 tiles, trim
 *
 * Requires:
 *   - REPLICATE_API_TOKEN in .env
 *   - ffmpeg in $PATH (`brew install ffmpeg`)
 *
 * Usage:
 *   npm run gen:music -- --duration 211.5 --out public/music/s0e0.mp3
 *   npm run gen:music -- --duration 252   --out public/music/s0e1.mp3
 *   npm run gen:music -- --duration 273   --out public/music/s0e2.mp3
 *
 * Re-tile from an existing source file (skips the API call):
 *   npm run gen:music -- --duration 273 --out s0e2.mp3 --source loop.mp3
 *
 * The source file is also saved alongside the output (as <out>.source.mp3)
 * so you can re-tile other lengths without burning another generation.
 */

import Replicate from "replicate";
import { writeFile } from "fs/promises";
import { mkdirSync, mkdtempSync, rmSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { tmpdir } from "os";
import { spawnSync } from "child_process";

// ─── Config ──────────────────────────────────────────────────────────────────
const MODEL = "stability-ai/stable-audio-2.5";
const SOURCE_DURATION = 150; // seconds requested from the model
const CROSSFADE = 30; // seconds of overlap between tiles
const FINAL_FADE_OUT = 3; // seconds of closing fade

const DEFAULT_PROMPT =
	"120 BPM, no beats, arpeggiating soft synth or dub techno stabs and delays looping with subtle evolving changes. " +
	"Think warm, detuned arpeggios (Boards of Canada), generative slow shifts (Eno meets Aphex Twin's ambient work), " +
	"or clean melodic arps with gentle filter sweeps (Tycho's quieter moments). " +
	"A soft 303-style arp with a slow filter cutoff sweep and subtle resonance changes gives that evolving quality without competing with narration. " +
	"Consistent steady texture throughout, no intro, no outro, no fade.";
// ─────────────────────────────────────────────────────────────────────────────

// ── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const argMap = {};
for (let i = 0; i < args.length; i++) {
	if (args[i].startsWith("--")) {
		argMap[args[i].slice(2)] = args[i + 1];
		i++;
	}
}
const TARGET = parseFloat(argMap.duration);
const OUT_PATH = argMap.out;
const SOURCE_PATH_OVERRIDE = argMap.source;
const PROMPT = argMap.prompt ?? DEFAULT_PROMPT;
const SEED = argMap.seed ? parseInt(argMap.seed, 10) : undefined;

if (!TARGET || !OUT_PATH) {
	console.error(
		"Usage: npm run gen:music -- --duration <seconds> --out <path.mp3> [--source <existing.mp3>] [--prompt <text>] [--seed <int>]",
	);
	process.exit(1);
}

// ── Pre-flight ──────────────────────────────────────────────────────────────
if (!SOURCE_PATH_OVERRIDE && !process.env.REPLICATE_API_TOKEN) {
	console.error("❌ REPLICATE_API_TOKEN is not set. Add it to .env, or pass --source to skip the API call.");
	process.exit(1);
}

const ffmpegCheck = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
if (ffmpegCheck.status !== 0) {
	console.error("❌ ffmpeg not found in $PATH. Install via `brew install ffmpeg`.");
	process.exit(1);
}

// ── ffmpeg helpers ──────────────────────────────────────────────────────────
function ff(args, errMsg) {
	const result = spawnSync("ffmpeg", ["-y", ...args], {
		stdio: ["ignore", "ignore", "inherit"],
	});
	if (result.status !== 0) throw new Error(errMsg);
}

const probeDuration = (path) => {
	const r = spawnSync("ffprobe", [
		"-v", "error",
		"-show_entries", "format=duration",
		"-of", "default=noprint_wrappers=1:nokey=1",
		path,
	]);
	return parseFloat(r.stdout.toString());
};

// Build a filter_complex graph that:
//   1. Crossfades N copies of the source (each one input slot)
//   2. Trims the result to TARGET seconds
//   3. Applies a closing fade-out
function buildFilter(iterations, target, fadeOut) {
	const fadeStart = Math.max(0, target - fadeOut);
	const parts = [];

	if (iterations === 1) {
		parts.push(`[0:a]anull[crossed]`);
	} else {
		parts.push(
			`[0:a][1:a]acrossfade=d=${CROSSFADE}:c1=tri:c2=tri` +
				(iterations === 2 ? "[crossed]" : "[mix1]"),
		);
		for (let i = 2; i < iterations; i++) {
			const inTag = `mix${i - 1}`;
			const outTag = i === iterations - 1 ? "crossed" : `mix${i}`;
			parts.push(
				`[${inTag}][${i}:a]acrossfade=d=${CROSSFADE}:c1=tri:c2=tri[${outTag}]`,
			);
		}
	}

	parts.push(
		`[crossed]atrim=0:${target},afade=out:st=${fadeStart}:d=${fadeOut}[out]`,
	);
	return parts.join(";");
}

// ── Generate the source clip via Replicate ─────────────────────────────────
async function generateSource(outPath) {
	const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

	const input = { prompt: PROMPT, duration: SOURCE_DURATION };
	if (SEED !== undefined) input.seed = SEED;

	console.log(`🎵 Generating ${SOURCE_DURATION}s source with ${MODEL}...`);
	console.log(`   Prompt: ${PROMPT.slice(0, 80)}…`);
	if (SEED !== undefined) console.log(`   Seed:   ${SEED}`);

	const output = await replicate.run(MODEL, { input });
	try {
		console.log(`   URL:    ${output.url()}`);
	} catch {
		// older SDK shape — ignore
	}
	await writeFile(outPath, output);
	console.log(`   ✓ Source saved (${probeDuration(outPath).toFixed(1)}s)\n`);
}

// ── Main ────────────────────────────────────────────────────────────────────
mkdirSync(dirname(OUT_PATH), { recursive: true });

const work = mkdtempSync(join(tmpdir(), "musicgen-"));
const sourcePath = join(work, "source.mp3");

if (SOURCE_PATH_OVERRIDE) {
	copyFileSync(SOURCE_PATH_OVERRIDE, sourcePath);
	console.log(`📁 Using existing source: ${SOURCE_PATH_OVERRIDE}\n`);
} else {
	await generateSource(sourcePath);
}

const sourceLen = probeDuration(sourcePath);
const stride = sourceLen - CROSSFADE;
const iterations =
	TARGET <= sourceLen ? 1 : Math.ceil((TARGET - sourceLen) / stride) + 1;
const projected = sourceLen + (iterations - 1) * stride;

console.log(`🧵 Tiling plan:`);
console.log(`   Source:     ${sourceLen.toFixed(1)}s`);
console.log(`   Crossfade:  ${CROSSFADE}s between tiles`);
console.log(`   Iterations: ${iterations} → ${projected.toFixed(1)}s raw`);
console.log(`   Target:     ${TARGET}s (with ${FINAL_FADE_OUT}s closing fade)\n`);

// Build ffmpeg invocation
const inputArgs = [];
for (let i = 0; i < iterations; i++) {
	inputArgs.push("-i", sourcePath);
}
const filter = buildFilter(iterations, TARGET, FINAL_FADE_OUT);

console.log("🎚️  Crossfading, trimming, fading out...");
ff(
	[...inputArgs, "-filter_complex", filter, "-map", "[out]", OUT_PATH],
	"tile/crossfade failed",
);

// Save the source alongside the output so re-tiling is one ffmpeg call away.
const sourceCopyPath = OUT_PATH.replace(/\.[^.]+$/, ".source.mp3");
copyFileSync(sourcePath, sourceCopyPath);

rmSync(work, { recursive: true, force: true });

const finalDuration = probeDuration(OUT_PATH);
console.log();
console.log(`✅ Saved to ${OUT_PATH}`);
console.log(`   Length: ${finalDuration.toFixed(2)}s (target ${TARGET}s)`);
console.log(`   Source: ${sourceCopyPath} (re-use with --source)`);
