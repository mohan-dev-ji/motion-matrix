# EP001 — Hidden Halves

**YouTube title:** Why a Hexagon Has 20 Different Halves
**Uploaded:** 2026-02-19
**Status:** Live

---

## Concept

### Origin
From lesson 1 of the maths course (see `_docs/2-research/BRLT_01.md`):
- To shade ½ of a circle, colour any 2 of 4 equal parts
- To shade ½ of a hexagon, colour any 3 of 6 equal parts

The insight: there are more ways than the obvious ones. That gap between "obvious" and "all of them" is the video.

### Mathematical core
| Shape | Slices | Formula | Combinations |
|---|---|---|---|
| Circle | 4 | C(4,2) | 6 |
| Pentagon | 5 | C(5,2) | 10 |
| Hexagon | 6 | C(6,3) | 20 |

The video walks through each shape — obvious halves first, non-obvious second, then all combinations in a grid — building intuition for why C(n,k) counts them.

---

## Production

### Tech stack
- **Framework:** Remotion 4.0.422
- **Language:** TypeScript / React 19
- **Styling:** TailwindCSS v4 (utility classes) + inline styles for precise layout
- **Audio:** `@remotion/media` (`<Audio>` component)
- **Fonts:** `@remotion/google-fonts/SpaceGrotesk` (thumbnail only, weight 500)

### Composition
| Property | Value |
|---|---|
| Resolution | 1920 × 1080 |
| FPS | 30 |
| Duration | 4260 frames (142s / 2:22) |
| Thumbnail | 1280 × 720 (Remotion Still) |

### Scene structure
| Scene | Start (frames) | Start (time) | Duration |
|---|---|---|---|
| Title | 0 | 0:00 | 120f / 4s |
| Circle — obvious halves | 120 | 0:04 | 480f / 16s |
| Circle — non-obvious halves | 600 | 0:20 | 270f / 9s |
| Circle — all 6 combinations | 870 | 0:29 | 300f / 10s |
| Pentagon title | 1170 | 0:39 | 90f / 3s |
| Pentagon — obvious | 1260 | 0:42 | 510f / 17s |
| Pentagon — non-obvious | 1770 | 0:59 | 480f / 16s |
| Pentagon — all 10 combinations | 2250 | 1:15 | 330f / 11s |
| Hexagon title | 2580 | 1:26 | 90f / 3s |
| Hexagon — obvious | 2670 | 1:29 | 510f / 17s |
| Hexagon — non-obvious | 3180 | 1:46 | 660f / 22s |
| Hexagon — all 20 combinations | 3840 | 2:08 | 420f / 14s |

### Key components
- `SlicedShape` — SVG component, handles circle and polygon, accepts `shadedSlices[]`
- `TimedSubtitle` — frame-accurate subtitle with entry array (removed before upload — voiceover made it redundant)
- Shared `COLORS` palette: `#0a0a0a` bg, `#4f8ff7` fill, `#e0e0e0` outline

---

## Audio

### Voiceover
| Property | Value |
|---|---|
| File | `001-halves-comm.m4a` |
| Duration | 2:26.30 |
| True peak | -18.3 dBFS |
| Integrated loudness | -40.0 LUFS |
| LRA | 9.9 LU |
| Target | -23 LUFS (broadcast) |
| Volume boost applied | ×7 linear ≈ +17 dB |
| Trim before | 120 frames (4s room tone removed) |

**Measure audio with ffmpeg:**
```bash
ffmpeg -i _audio/your-file.m4a -af "volumedetect,ebur128=peak=true" -f null /dev/null 2>&1 | tail -30
```

**Boost formula:** target gain in dB → linear multiplier = `10^(dB/20)`
e.g. +17dB = `10^(17/20)` ≈ 7.0 → set `volume={7}` in Remotion

### Music
| Property | Value |
|---|---|
| File | `001-replicate-prediction-anxnps3ashrmw0cwep6avs430c.mp3` |
| Generated with | Stable Audio 2.5 (via web UI) |
| Volume in Remotion | 0.12 (background bed) |

**Music generation journey (what didn't work):**
- `meta/musicgen` via Replicate API → version hash goes stale, `meta/musicgen` without hash returns 404 (no active deployment)
- `minimax/music-01` via Replicate → style transfer model, requires a reference audio file, not text-to-music
- **Winner: Stable Audio 2.5 web UI** — generated directly, downloaded, placed in `/public`

**Audio file workflow:**
```
/_audio          ← raw recordings (gitignored, your working source)
     ↓ copy
/public          ← Remotion staticFile() reads from here (media extensions gitignored)
     ↓ render
/out             ← final MP4 (gitignored)
```

`staticFile()` only resolves from `/public` — no exceptions.

---

## Thumbnail

**Composition ID:** `001-thumbnail` (Remotion Still, 1280×720)
**File:** `src/episodes/001-halves/scenes/Thumbnail.tsx`

**Design:**
- Left: 4-slice circle with adjacent pair shaded `[0,1]` → labelled "Obvious"
- Centre: `= ½` (stacked fraction)
- Right: Hexagon with alternating slices `[0,2,4]` shaded → labelled "Also half"
- Title: "HIDDEN HALVES" — Space Grotesk 500, bottom centre
- Badge: "EP. 001" top-left
- Background: subtle grid overlay at 4% opacity for depth

**Export thumbnail:**
```bash
npx remotion still 001-thumbnail out/001-thumbnail.png
```

---

## YouTube metadata

### Title
```
Why a Hexagon Has 20 Different Halves
```

### Description
```
A circle can be shaded in half 6 ways. A pentagon: 10. A hexagon: 20.
But why? And how do you find them all without missing one?

This video builds the answer visually — starting with the obvious halves
you already know, then uncovering the ones hiding in plain sight, and
finally revealing the formula that counts them all.

No algebra required.

─────────────────────────────────────
CHAPTERS
0:00 Intro
0:04 The obvious halves of a circle
0:20 The ones you might miss
0:29 All 6 — and a pattern appears
0:39 Pentagon: 5 slices, 10 halves
0:42 The obvious two-fifths
0:59 The hidden ones
1:15 All 10 pentagon combinations
1:26 Hexagon: where it gets interesting
1:29 The obvious halves of a hexagon
1:46 The non-obvious ones pile up fast
2:08 All 20 — and the formula behind them

─────────────────────────────────────
If you like visual maths, subscribe — every episode takes one idea
and makes it impossible to unsee.

#maths #visualmaths #combinations #geometry #learnmaths
```

---

## Render commands

```bash
# Full video
npx remotion render 001-halves out/ep001-halves.mp4

# Thumbnail PNG
npx remotion still 001-thumbnail out/001-thumbnail.png
```

---

## Lessons learned

### Production pipeline
- Define all scene durations as named constants at the top of the episode file — makes timing easy to reason about and adjust
- Cumulative start times as a `const S = {}` object means one change cascades correctly
- Subtitles used during build to scaffold narration timing — removed once real voiceover was recorded. Good pattern for future episodes.

### Audio
- Record voiceover early — it drives the final timing more than the animation does
- Measure peaks before setting volume: `ffmpeg volumedetect + ebur128` gives everything needed
- Speech recorded at home tends to land around -35 to -45 LUFS — expect to boost ×5–8
- Music at `volume={0.10}–{0.15}` sits cleanly under speech; above `0.20` starts competing
- `trimBefore` in frames is the cleanest way to remove room tone from the start of a recording

### Music generation
- Stable Audio 2.5 web UI is currently the most reliable route for ambient/textural background music
- MiniMax music-01 is style-transfer (needs reference audio), not text-to-music
- Replicate MusicGen requires a pinned version hash — the model has no active deployment so `"meta/musicgen"` without a hash returns 404

### YouTube
- The specific number in the title ("20 different halves") does more work than a vague hook
- First two lines of description are what shows before "Show more" on mobile — make them the pitch
- YouTube chapters require 0:00 as the first timestamp or they won't activate
- Thumbnail: two contrasting examples side by side (obvious vs surprising) communicates the video's premise without any text
