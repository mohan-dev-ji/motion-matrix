# Audio pipeline: from prompt to YouTube MP4

How background music gets from a text prompt into the final rendered episode, and what every step actually does.

---

## Overview

```
   Text prompt
       │
       ▼
   ┌────────────────────────────┐
   │  Stage 1                   │
   │  Replicate API call        │   stability-ai/stable-audio-2.5
   │  → 150s MP3 source         │   1 generation, ~30–60s of compute
   └────────────┬───────────────┘
                │
                ▼
   ┌────────────────────────────┐
   │  Stage 2                   │
   │  ffmpeg crossfade + tile   │   local, instant (a few seconds)
   │  → episode-length MP3      │   acrossfade · atrim · afade
   └────────────┬───────────────┘
                │
                ▼
   ┌────────────────────────────┐
   │  Stage 3                   │
   │  Remotion render           │   ~3–5 min per episode
   │  → 1080p H.264 + AAC MP4   │   <Audio> + ffmpeg encode + mux
   └────────────────────────────┘
                │
                ▼
            YouTube
```

Three stages, three different responsibilities. Stage 1 is the only one that costs money (~$0.03 per generation). Everything else is local CPU.

---

## Stage 1 — Music generation (Replicate API)

### Why 150 seconds and not the full episode

Stable Audio 2.5's hard ceiling is 190 seconds per call. Even at 190s, the model treats the output as a "complete piece" with built-in intro and outro fades — which is the opposite of what we want for a background track. Generating shorter (150s) gives us:

- Headroom under the 190s limit
- A clip with mostly "middle content" (less proportional fade waste)
- A loop-friendly length that tiles cleanly to any episode duration

The Open weights version (Stable Audio Open 1.0) is more restrictive — trained on 47-second clips, so going much past that produces noise. The hosted 2.5 model is the only Stable Audio with the 190s envelope.

### The prompt does more work than people realise

Our default prompt is engineered for three properties at once:

```
"120 BPM, no beats, arpeggiating soft synth or dub techno stabs and delays
looping with subtle evolving changes. Think warm, detuned arpeggios
(Boards of Canada), generative slow shifts (Eno meets Aphex Twin's ambient
work), or clean melodic arps with gentle filter sweeps (Tycho's quieter
moments). A soft 303-style arp with a slow filter cutoff sweep and subtle
resonance changes gives that evolving quality without competing with
narration. Consistent steady texture throughout, no intro, no outro, no fade."
```

What each part is doing:

| Phrase | Purpose |
|---|---|
| `120 BPM` | Locks the arpeggio cycle rate. Makes the seam math work (30s crossfade = 60 beats = 15 bars). |
| `no beats` | Suppresses the model's tendency to add drums. Drums would expose the loop seam. |
| `arpeggiating soft synth` | Sets the texture. Steady-state arpeggios don't have musical "phrases" that would feel repetitive when tiled. |
| `Boards of Canada / Eno / Aphex / Tycho` | Style anchors. These artists have well-represented training data, so referencing them is a reliable way to steer the texture. |
| `no intro, no outro, no fade` | Asks the model to skip its compose-a-complete-piece habit. Doesn't always work, but tilts the dice. |
| `without competing with narration` | Implicitly asks for a wide register with no melody hooks that would draw focus. |

### Seeds and reproducibility

Stable Audio accepts a `seed` integer. Same seed + same prompt + same duration = byte-identical output. We use this so each episode's music is reproducible:

```bash
npm run gen:music -- --duration 252 --out s0e1.mp3 --seed 2
```

Without a seed, the model uses a random one (the first call for s0e0 was unseeded, so that one isn't reproducible from prompt alone unless you saved the file).

### What you get back

The Replicate response is an MP3 file:
- 150 seconds (or whatever `duration` you requested)
- 44.1 kHz stereo
- 128 kbps CBR (constant bitrate)
- Roughly 2.4 MB

The script saves it as `<out>.source.mp3` so you can re-tile it later without burning another API call.

---

## Stage 2 — ffmpeg crossfade tiling

### The problem we're solving

A 150s clip needs to become a 211.5s / 252s / 273s clip. Three naive approaches and why they fail:

| Approach | Why it fails |
|---|---|
| Generate longer at the API | Model maxes at 190s |
| Chain two API calls with audio continuation seeding | The model treats the seed as style reference and still produces a complete piece — you get fade-out followed by fade-in at the join |
| Hard-cut concatenate two copies | Audible click at the seam, plus the listener hears the exact same opening twice |

What works: **tile copies of the same clip and crossfade the join over 30 seconds**. Because ambient arpeggios have no transient hits, a slow crossfade between the file's "end" and "start" is inaudible — your ear can't detect that the two regions come from different points in the source.

### The actual ffmpeg command

For s0e1 (252s, needs 2 tiles):

```bash
ffmpeg -y \
  -i source.mp3 \
  -i source.mp3 \
  -filter_complex "\
    [0:a][1:a]acrossfade=d=30:c1=tri:c2=tri[crossed];\
    [crossed]atrim=0:252,afade=out:st=249:d=3[out]\
  " \
  -map "[out]" \
  s0e1.mp3
```

For s0e2 (273s, needs 3 tiles), the filter graph chains:

```bash
ffmpeg -y \
  -i source.mp3 \
  -i source.mp3 \
  -i source.mp3 \
  -filter_complex "\
    [0:a][1:a]acrossfade=d=30:c1=tri:c2=tri[mix1];\
    [mix1][2:a]acrossfade=d=30:c1=tri:c2=tri[crossed];\
    [crossed]atrim=0:273,afade=out:st=270:d=3[out]\
  " \
  -map "[out]" \
  s0e2.mp3
```

### Breaking the command down

**`ffmpeg -y`** — `-y` means "overwrite the output file without asking". Without this, ffmpeg pauses for `y/n` input.

**`-i source.mp3` (three times)** — declares three separate input streams, all reading the same file. In the filter graph each is referenced as `[0:a]`, `[1:a]`, `[2:a]` (input index `:` stream type `a` for audio). They're loaded independently so the filter can process different time positions of each.

**`-filter_complex "..."`** — runs a graph of filter nodes connected by named edges. Different from the simpler `-af` which is a single linear filter chain. A `_complex` graph can have multiple inputs and multiple outputs, with branching.

**`-map "[out]"`** — selects which labelled output from the graph goes into the actual output file. The graph computes many intermediate streams (`[mix1]`, `[crossed]`, `[out]`); `-map` picks one.

**`s0e2.mp3`** (positional) — the output file. ffmpeg infers the format from the extension (MP3 here).

### Filter graph syntax in detail

Each statement in the graph is `[inputs] filtername=args [outputs];` separated by semicolons. Reading the s0e2 example top to bottom:

```
[0:a][1:a]acrossfade=d=30:c1=tri:c2=tri[mix1]
```
Take stream 0's audio and stream 1's audio. Crossfade them over 30 seconds using triangular curves on both sides. Emit the result as named edge `[mix1]`.

```
[mix1][2:a]acrossfade=d=30:c1=tri:c2=tri[crossed]
```
Take the `[mix1]` result and stream 2's audio. Crossfade them. Emit as `[crossed]`.

```
[crossed]atrim=0:273,afade=out:st=270:d=3[out]
```
Take `[crossed]`. Apply two filters in sequence (comma-separated within one node): first trim to exactly 0–273s, then fade out over 3 seconds starting at 270s. Emit as `[out]`.

### The filters we use

**`acrossfade=d=30:c1=tri:c2=tri`** — crossfade between two audio inputs.
- `d=30` — duration of the crossfade in seconds. The overlap region is 30s, so the output is `len(A) + len(B) - 30s` long.
- `c1=tri` — curve for the **f**ading-out side (input 1). `tri` is a triangular (linear) ramp from full volume to silence.
- `c2=tri` — curve for the fading-in side (input 2). Also triangular.

Why both triangular: for ambient texture the simplest linear blend sounds smoothest. Equal-power curves (`esin`, `qsin`) are better when crossfading content with sharp transients, but they over-attenuate the middle of ambient material.

**`atrim=0:273`** — clip the audio to a time window.
- `start=0` — keep from second 0.
- `end=273` — keep until second 273. Everything after gets dropped.
- The implicit form `atrim=START:END` is shorthand for `atrim=start=START:end=END`.

**`afade=out:st=270:d=3`** — apply a fade.
- `t=out` (or just `out` positionally) — direction. `in` or `out`.
- `st=270` — **s**tart **t**ime in seconds. Fade begins at 270s.
- `d=3` — **d**uration of the fade in seconds. Goes from full volume at 270s to silence at 273s.

Default curve is `tri` (linear). Other options: `exp`, `log`, `qsin`, `esin` etc. For closing fades on ambient material, linear sounds natural.

### Why a single `-filter_complex` instead of three ffmpeg passes

Three reasons:

1. **No intermediate files.** A multi-pass pipeline writes MP3s to disk in between, which means re-encoding each pass. Each MP3 encode is lossy, so chained passes accumulate audio quality loss. The single-pass approach decodes once, processes in 32-bit float internally, encodes once.

2. **Speed.** ffmpeg pre-fetches all three inputs in parallel. Multi-pass would be sequential.

3. **One source of truth for the math.** The filter graph encodes the whole tiling plan declaratively. If you change `CROSSFADE` from 30 to 40 in the script, only one place changes.

The script's `buildFilter()` function in [`scripts/generate-music.mjs`](../../scripts/generate-music.mjs) generates this graph dynamically based on how many tiles the target duration needs.

### Verifying the output

We use `ffprobe` (ships with ffmpeg) to sanity-check duration after each step:

```bash
ffprobe -v error \
  -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 \
  s0e1.mp3
```

Flag breakdown:
- `-v error` — only print errors, no info banner
- `-show_entries format=duration` — only show the `duration` field from the `format` section (other sections: `stream`, `chapter`, `packet`)
- `-of default=noprint_wrappers=1:nokey=1` — **o**utput **f**ormat. `default` means key=value; `noprint_wrappers=1` strips section headers; `nokey=1` strips the key, leaving just the bare number

The result is `252.054000` — a single float we can parse.

---

## Stage 3 — Remotion render

### How `<Audio>` plugs in

Each episode comp imports the music file via `staticFile()`:

```tsx
import { Audio, staticFile } from "remotion";

const MUSIC_FILE = "music/s0e1.mp3";
const MUSIC_VOLUME = 0.6;

export const Episode1: React.FC = () => (
  <>
    <Audio src={staticFile(MUSIC_FILE)} volume={MUSIC_VOLUME} />
    <Series>{/* video clips */}</Series>
  </>
);
```

`staticFile()` resolves paths relative to `public/`, so `music/s0e1.mp3` points to `public/music/s0e1.mp3`. Remotion's bundler picks this up and the renderer streams the file during encoding.

`volume={0.6}` is a multiplier from 0.0 (silent) to 1.0 (original). 0.6 gives roughly −4 dB of gain reduction. When narration is added on top in post, this typically wants to drop to **0.15–0.25** (−16 to −12 dB) so the music sits below the dialog. With no narration yet, 0.6 is loud enough to register as the main audio element.

The `<Audio>` component has no `from` or `endAt` prop here, so it plays for the entire composition duration. Since the music file and the comp duration are both 252s, they align naturally. If the music were shorter, it would simply stop early; if longer, it would get truncated.

### What Remotion does under the hood

When you run `npx remotion render s0e1-episode out/s0e1-episode.mp4`:

1. **Bundle** — webpack compiles the React/TS code into a single JS bundle that the headless Chrome renderer can run.
2. **Render frames** — Remotion launches headless Chrome, sets the viewport to 1920×1080, renders each of the 7560 frames at 30 fps as JPEG images into a temp directory.
3. **Resolve audio** — walks the React tree for `<Audio>` and `<Video>` components, gathers their `src` URLs, time positions, and volume settings.
4. **Mix audio** — runs ffmpeg on each audio source, applies volume/trimming/timing, and produces a single mixed WAV.
5. **Encode video** — runs ffmpeg again to encode all the JPEG frames as H.264 video, mux in the mixed audio as AAC, and write the final MP4.

You see the encoding progress because step 5 is the slow one — about 1 second of encode per second of output on a modern Mac, hence the ~3–5 minute render time.

### Output MP4 format

```
Container:   MP4 (ISO base media file format)
Video:       H.264 (AVC), 1920×1080, 30 fps, ~470 kbps avg, ~5 Mbps max
Audio:       AAC LC, 48 kHz, stereo, 192 kbps
```

YouTube specifically wants:
- **Container**: MP4 ✓
- **Video codec**: H.264 ✓ (also accepts H.265, VP9, AV1)
- **Audio codec**: AAC-LC ✓
- **Resolution**: 1080p ✓
- **Frame rate**: 30 fps ✓ (also accepts 24, 25, 50, 60)

So nothing needs transcoding before upload — drag the MP4 from `out/` into YouTube Studio.

If you ever need a higher bitrate (for archive or 4K future-proofing), pass `--codec h264 --crf 18` to the render command. Lower CRF = higher quality = bigger file. Default is around 23.

---

## Reference: ffmpeg flag cheat sheet

### Input/output flags

| Flag | Meaning |
|---|---|
| `-i FILE` | Add an input file. Can be specified multiple times. |
| `-y` | Overwrite output file without prompting. |
| `-n` | Never overwrite (fail if output exists). |
| `-v LEVEL` | Verbosity. `quiet`, `error`, `warning`, `info` (default), `verbose`, `debug`. |
| `-c:a CODEC` | Audio codec. `aac`, `libmp3lame`, `flac`, `copy`. |
| `-c:v CODEC` | Video codec. `libx264`, `libx265`, `copy`. |
| `-c copy` | Don't re-encode — stream copy. Fast and lossless but only works when not changing format/codec. |
| `-t SECONDS` | Stop output after N seconds. |
| `-ss SECONDS` | Seek input to position before reading. |
| `-sseof SECONDS` | Seek **f**rom **e**nd **o**f **f**ile. Use negative values (e.g. `-15` = last 15s). |
| `-map STREAM` | Pick which input stream(s) appear in the output. `[label]` for filter outputs, `0:a` for input 0's audio. |

### Filter flags

| Flag | Meaning |
|---|---|
| `-af "CHAIN"` | Apply an **a**udio **f**ilter chain. Single linear chain, single audio input. |
| `-vf "CHAIN"` | Apply a video filter chain. |
| `-filter_complex "GRAPH"` | Apply a filter graph. Multiple inputs, multiple outputs, branching, named edges. |

### Filters used in this project

| Filter | What it does | Key args |
|---|---|---|
| `acrossfade` | Crossfade two audio streams. | `d=` duration, `c1=` / `c2=` curve names |
| `atrim` | Clip audio to a time window. | `start=` and `end=`, or positional `START:END` |
| `afade` | Fade audio in or out. | `t=in\|out`, `st=` start time, `d=` duration, `curve=` curve name |
| `anull` | Pass audio through unchanged. Useful as a no-op connector in graphs. | — |
| `concat` | Stitch streams end-to-end (no crossfade). | `n=` count, `v=` videos per segment, `a=` audios per segment |

### Filter curve names (used in `afade`, `acrossfade`)

| Name | Shape | When to use |
|---|---|---|
| `tri` | Linear ramp | Ambient/textural material, default for `afade`. |
| `qsin` | Quarter-sine | Crossfading content with vocals or transients. Equal-power. |
| `esin` | Exponential sine | Similar to `qsin`, slightly more aggressive. |
| `exp` | Exponential | Mimics natural sound decay. |
| `log` | Logarithmic | Quick start, slow finish. |
| `hsin` | Half-sine | "S-curve" — slow on both ends. |

### Format/codec flags for renders

| Flag | Meaning |
|---|---|
| `-pix_fmt yuv420p` | Pixel format. `yuv420p` is the YouTube-compatible default. |
| `-crf N` | **C**onstant **R**ate **F**actor for x264. Lower = better quality. 18=visually lossless, 23=default, 28=lossy. |
| `-preset NAME` | x264 encoding speed/quality tradeoff. `ultrafast` → `placebo`. `medium` is the default. |
| `-b:a BITRATE` | Audio bitrate. `192k`, `320k`. AAC at 192k is transparent for most material. |
| `-ar RATE` | Audio sample rate. `44100`, `48000`. YouTube prefers `48000`. |

---

## Troubleshooting

### "Audio is too loud / quiet relative to the visuals"

Adjust `MUSIC_VOLUME` at the top of the episode's `episode.tsx` file. Typical values:

| Situation | Volume |
|---|---|
| Music-only mix | 0.5 – 0.7 |
| Music under voiceover | 0.15 – 0.25 |
| Music under both VO and sound effects | 0.10 – 0.15 |

Re-render after changing. Cheap — the music file doesn't change.

### "I want to keep the same music but change the episode length"

Re-tile from the saved source — no API call needed:

```bash
npm run gen:music -- --duration NEW_LENGTH \
  --out public/music/s0eN.mp3 \
  --source public/music/s0eN.source.mp3
```

### "The seam between tiles is audible"

Three knobs in [`scripts/generate-music.mjs`](../../scripts/generate-music.mjs):

1. **`CROSSFADE`** — increase from 30 to 40 or 60 seconds. Longer crossfade smooths bigger tempo drifts.
2. **`SOURCE_DURATION`** — bump from 150 to 180 (still safely under 190). More source = more material to crossfade with.
3. **Curve** — change `c1=tri:c2=tri` to `c1=qsin:c2=qsin` (in the script's `buildFilter()` function). Equal-power curves preserve perceived loudness through the crossfade.

### "The music has a noticeable fade-in / fade-out from the model"

Trim the source before tiling. The script doesn't currently do this — modify the filter graph to add `atrim=8:142` after each input. This skips the first 8s (where fade-ins live) and last 8s of each 150s source. With a 150s source minus 16s of trim = 134s usable per tile, then `STRIDE = 134 - CROSSFADE`. You'd need to update the iteration count math accordingly.

### "Why is the rendered MP4 222 seconds when I asked for 211.5?"

It isn't. ffprobe reports the actual duration with millisecond precision — for s0e0 we get `211.563000`, which rounds up to 211.56s. The extra 60 ms is MP3 frame boundary alignment. YouTube's player handles this fine and viewers don't perceive sub-100ms duration differences.

### "Replicate API returned 429 Too Many Requests"

You're below \$5 in Replicate credit, which triggers a "burst of 1 request" rate limit. Add credit or just run generations sequentially with a few seconds between them. The script already does this when called sequentially; parallel runs of the script will collide.

---

## Cost summary

For a fresh, fully-original score across the three episodes:

| Item | Cost |
|---|---|
| 3 × Replicate generation @ ~$0.03 each | ~$0.09 |
| Local ffmpeg processing | $0 |
| Local Remotion render | $0 |
| **Total per series** | **~$0.09** |

Reusing the same source via `--source` drops it to $0.03 for a series (one generation, three re-tilings).
