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
- **Episode** — one operation type, demonstrated 9 times (~3 minutes of animation). Each episode focuses on a single function (e.g. seeking a target, two-number addition, three-number addition).
- **Version** — one ~15–30s composition. An episode has 9 versions: 3 variations on each of 3 number-line ranges (-10..10, -20..20, -50..50).

Numbering is **flat** across the 9 versions in an episode:

```
v0.E.1 ┐
v0.E.2 ├─ -10..10 (three variations)
v0.E.3 ┘
v0.E.4 ┐
v0.E.5 ├─ -20..20 (three variations)
v0.E.6 ┘
v0.E.7 ┐
v0.E.8 ├─ -50..50 (three variations)
v0.E.9 ┘
```

- File naming: `s{S}e{E}-{slug}/v{S}.{E}.{V}-{slug}.tsx`
- Composition id for a version: `s{S}e{E}-v{VVV}-{slug}`
- Composition id for the full episode: `s{S}e{E}-episode`
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
    ├── s0e0-seek-target/         # episode 0: find a value on the line
    │   ├── episode.tsx
    │   ├── v0.0.1-seek-minus7.tsx     # range -10..10
    │   ├── v0.0.4-seek-9.tsx          # range -20..20
    │   └── v0.0.7-seek-minus18.tsx    # range -50..50
    ├── s0e1-addition/            # episode 1: add two signed numbers
    │   ├── episode.tsx
    │   ├── v0.1.1-add-minus3-plus8.tsx
    │   ├── v0.1.4-add-12-minus19.tsx
    │   └── v0.1.7-add-minus18-minus26.tsx
    └── s0e2-triple-add/          # episode 2: add three signed numbers
        ├── episode.tsx
        ├── v0.2.1-triple-3-minus7-plus6.tsx
        ├── v0.2.4-triple-minus7-plus16-minus12.tsx
        └── v0.2.7-triple-minus22-plus38-minus29.tsx

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

Each `episodes/s{S}e{E}-{slug}/episode.tsx` stitches its episode's versions end-to-end with Remotion's `<Series>`. Render `s{S}e{E}-episode` to ship that episode as one MP4 (audio laid down in post against this). As new variations are authored, import them and insert into the `clips` array in slot order — `EPISODE_E_DURATION` auto-grows.

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
