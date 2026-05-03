# Motion Matrix

Video content pipeline for an animated maths YouTube channel. Built with Remotion (programmatic video in React). Future episodes may also use Manim and matplotlib for advanced topics (calculus, data visualisation).

## House style

Two-region layout shared by every episode in the series:

- **Top half** — a retro CRT terminal panel that types out commands and confirmations. This drives the narration beat-by-beat.
- **Bottom half** — an animated visualisation (number line, axis, plot, geometry…). The terminal "loads" the visualisation, then "runs" a function on it.

Reference implementation: composition `s0e0-f01-v001-seek-minus7` ([src](src/episodes/s0e0-number-line/F01-seek-target/v0.0.1-seek-minus7.tsx)).

### Beat pattern (15s = 450 frames @ 30fps)

| Frames    | What happens                                                          |
|-----------|-----------------------------------------------------------------------|
| 0–30      | Terminal fades in (scale + opacity)                                   |
| 0–90      | Terminal types `load <interface> range(...)`                          |
| 90–150    | Visualisation draws itself (e.g. number-line stroke-dashoffset)       |
| 150–210   | Tick marks / labels stagger in                                        |
| 210       | `<interface> loaded successfully` prints; the actor (e.g. dot) appears |
| 240–300   | Terminal types the function command (e.g. `seek -7`)                  |
| 300–345   | Visualisation animates the function                                   |
| 345+      | Terminal confirms (e.g. `target found: -7`); colour flips to green    |

## Versioning convention

- **Series** — a thematic arc. `s0` = number-line foundations.
- **Episode** — a ~2-minute YouTube video composed of 9 functions (~135s of animation + audio).
- **Function** — one ~15s composition demonstrating one mathematical idea.
- **Variation** — each function has 3 variations to vary example values without changing visual structure.

Numbering is **flat** across the 27 clips that make up an episode:

```
v0.0.1 ┐
v0.0.2 ├─ function 1's three variations
v0.0.3 ┘
v0.0.4 ┐
v0.0.5 ├─ function 2's three variations
v0.0.6 ┘
...
```

- File naming: `s{S}e{E}-{slug}/F{FF}-{slug}/v{S}.{E}.{F}-{slug}.tsx`
- Composition id: `s{S}e{E}-f{FF}-v{VVV}-{slug}`
- The version string also appears in-frame in the terminal prompt: `motiomatrix@v.{S}.{E}.{V} ~ %`

## Project layout

```
src/
├── Root.tsx                       # Remotion composition registry
├── shared/
│   ├── theme.ts                   # design tokens (colors, fonts, sizes)
│   └── components/
│       ├── SceneDefs.tsx          # shared SVG <defs>: markers, scanline pattern, fade masks
│       ├── Terminal.tsx           # CRT panel: typed rows, blinking cursor, fade-in
│       ├── NumberLine.tsx         # axis with ticks/labels, exposes mapX via context
│       ├── GlowDot.tsx            # pulsing traveller dot (renders inside <NumberLine>)
│       └── UnderlineArrow.tsx    # dashed/solid drops + labelled arrow (renders inside <NumberLine>)
└── episodes/
    └── s0e0-number-line/
        ├── episode.tsx              # exporter comp: stitches all functions via <Series>
        └── F01-seek-target/
            ├── v0.0.1-seek-minus7.tsx   # range -10..10, target -7
            ├── v0.0.2-seek-9.tsx        # range -20..20, target 9
            └── v0.0.3-seek-minus18.tsx  # range -50..50, target -18

docs/
├── 1-inbox/                       # raw incoming material (screenshots, ideas, links)
├── 2-research/                    # cross-episode reference notes
├── archive/                       # retired episode assets (audio, renders, notes)
└── episodes/
    └── s0e0-number-line/
        ├── spec.md                # episode spec (visual style, timings, dialogue, beats)
        └── reference/             # reference PNGs/screenshots for this episode
```

## Reusable components

| Component       | Renders inside | Key props                                                                 |
|-----------------|----------------|---------------------------------------------------------------------------|
| `Terminal`      | `<svg>`        | `prompt`, `rows`, `widthPct/heightPct`, `position`                        |
| `NumberLine`    | `<svg>`        | `range`, `cy`, `drawFromFrame/Duration`, `ticksFromFrame/Duration`        |
| `GlowDot`       | `<NumberLine>` | `from`, `to`, `appearFrame`, `travelStartFrame/Duration`, colours         |
| `UnderlineArrow`| `<NumberLine>` | `fromValue`, `toValue`, `dashedDropFrame`, `solidDropFrame`, `label`      |
| `SceneDefs`     | `<svg>`        | `width`, `height`, `term` (terminal rect for fade-mask geometry)           |

Children of `<NumberLine>` consume `useNumberLine()` to read `mapX` (value→pixel) and `cy`. Render order matters: put `<UnderlineArrow>` before `<GlowDot>` so the dot paints over the arrow.

## Episode exporter comp

`episodes/s{S}e{E}-{slug}/episode.tsx` stitches all of an episode's function compositions end-to-end using Remotion's `<Series>`. This is the comp you render to ship the full episode as one MP4 (audio is laid down in post against this). The composition id is `s{S}e{E}-episode`. As new functions land, just import them and append to the `clips` array — duration auto-grows. Each clip plays its own 450-frame timeline starting from frame 0 inside the episode.

## Common commands

| Command                                         | What it does                                  |
|------------------------------------------------|-----------------------------------------------|
| `npm run dev`                                   | Remotion Studio for live preview              |
| `npm run render -- <composition-id>`            | Render a single composition to MP4            |
| `npx remotion still <id> <out.png> --frame=<n>` | Render a single still PNG at one frame        |
| `npm run lint`                                  | ESLint + `tsc --noEmit`                       |
| `npm run gen:music`                             | Generate background music via Replicate API   |

## Where to file new material

- A raw screenshot or note → `docs/1-inbox/`
- A new episode being planned → `docs/episodes/s{S}e{E}-{slug}/spec.md` + `/reference/`
- Reusable visual components → `src/shared/components/`
- Design tokens → `src/shared/theme.ts`
