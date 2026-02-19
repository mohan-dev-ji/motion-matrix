/**
 * Music generation script using Replicate + MiniMax music-01
 * Usage: npm run gen:music
 *
 * Output is saved to public/<OUTPUT_FILE>
 * Tune the constants below, then re-run to regenerate.
 */

import Replicate from "replicate";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Config ──────────────────────────────────────────────────────────────────
const PROMPT = `
  Calm, minimal ambient background music for a maths education video.
  Soft piano and light synthesiser pads. Gentle, curious, and encouraging.
  No drums, no vocals. Slow tempo. Suitable for children.
`.trim();

const OUTPUT_FILE = "001-halves-music.wav";
const MODEL       = "meta/musicgen";
// ─────────────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

if (!process.env.REPLICATE_API_TOKEN) {
  console.error("❌  REPLICATE_API_TOKEN is not set.");
  console.error("    Add it to .env or export it in your shell.");
  process.exit(1);
}

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

console.log("🎵  Generating music with MusicGen (meta)...");
console.log(`    Prompt:   ${PROMPT.split("\n")[0]}…`);
console.log(`    Duration: 147s`);
console.log();

const output = await replicate.run(MODEL, {
  input: {
    prompt:                   PROMPT,
    duration:                 147,
    model_version:            "stereo-large",
    output_format:            "wav",
    normalization_strategy:   "peak",
    top_k:                    250,
    top_p:                    0,
    temperature:              1,
    classifier_free_guidance: 3,
  },
});

console.log("    Raw output:", JSON.stringify(output, null, 2));

// MiniMax returns either a URL string or an object with an audio field
const url = typeof output === "string"
  ? output
  : output?.audio ?? output?.url ?? Object.values(output ?? {})[0];

if (!url || typeof url !== "string") {
  console.error("❌  Could not extract audio URL from output:", output);
  process.exit(1);
}

console.log("⬇️   Downloading audio...");
const response = await fetch(url);
if (!response.ok) throw new Error(`Download failed: ${response.status}`);

const buffer = Buffer.from(await response.arrayBuffer());
mkdirSync(publicDir, { recursive: true });
const outPath = join(publicDir, OUTPUT_FILE);
writeFileSync(outPath, buffer);

console.log(`✅  Saved to public/${OUTPUT_FILE}`);
console.log();
console.log("Next — add to index.tsx:");
console.log(`  const MUSIC_FILE   = "${OUTPUT_FILE}";`);
console.log(`  const MUSIC_VOLUME = 0.15;  // background — tune alongside voiceover`);
