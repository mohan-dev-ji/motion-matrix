# Terminal × Number Line — Immersive Maths Lesson Pattern

A reusable Remotion pattern for Motion Matrix lessons. A retro CRT terminal in
the upper half "drives" a maths visualisation in the lower half — every action
the learner sees on the number line is mirrored by a typed command and a
console echo above it. The result reads as a programmed, deterministic walk
through the maths rather than a passive animation.

Reference implementation: `src/episodes/002-number-line/NumberLinePulse.tsx`,
registered as composition `002-number-line-pulse` (15s @ 30fps = 450 frames).

---

## 1. Why this pattern works

- **Narrative scaffolding.** A terminal command names the operation
  (`seek -7`) before it happens. The viewer reads the intent, then watches it
  play out. The visualisation becomes the "result" of a clearly stated
  instruction instead of a free-floating animation.
- **Cause and effect.** Each console line is anchored to a specific moment in
  the maths animation. Typing finishes → animation begins. Animation lands →
  system output prints. The two halves are locked together temporally.
- **Tone.** The phosphor-on-black CRT aesthetic frames maths as something
  *operated*, not just observed. It carries authority without feeling
  classroom-stiff.
- **Cognitive separation.** Top half = symbolic (text, intent, language).
  Bottom half = visual (geometry, motion, value). The gradient mask between
  them blends the two registers so the lesson feels like one organism, not
  two stacked panels.

---

## 2. Canvas layout (1920 × 1080)

```
 ┌──────────────────────────────────────────────────────────┐
 │                                                          │  ↑
 │            ╔═══════════════════════════════╗             │  │ top half
 │            ║  RETRO CRT TERMINAL           ║             │  │ (≈0–55%)
 │            ║  motiomatrix@v.0.0.1 ~ %      ║             │  │
 │            ║  > load number_line ...       ║             │  │
 │            ╚═══════════════════════════════╝             │  │
 │                                                          │  │
 │    ░░░░ gradient-mask blend zone ░░░░░░░░░░░░░░░░░░░░    │  ─
 │                                                          │  ↓
 │  ─────────────────────●───────────────────────►          │  │ bottom half
 │  -10    -5            0            5      10             │  │ (≈55–100%)
 │                       │                                  │  │
 │                       └────── -7 ──────────●─────        │  │
 │                                                          │  │
 └──────────────────────────────────────────────────────────┘
```

**Key coordinates** (from `NumberLinePulse.tsx`):

| Element | Position |
|---|---|
| Number line `cy` | `height * 0.72` |
| Terminal `termY` | `height * 0.13` |
| Terminal width | `width * 0.62` |
| Terminal height | `height * 0.34` |
| Underline arrow `arrowY` | `cy + 150` |
| Drop-line top | `cy + 80` |

The two halves are visually fused by **two SVG `<mask>` elements**:

- `termFadeMask` — linear gradient white→transparent down the terminal so its
  bottom edge dissolves into the BG.
- `lineFadeMask` — linear gradient transparent→white down the bottom half so
  the number-line section emerges out of the same haze.

This is the visual hinge of the pattern. Don't skip it. Hard rectangular
boundaries break the "one organism" feeling.

---

## 3. The timing contract

Every frame budget should be expressed as a deliberate hand-off between the
terminal and the number line. The reference 15s breakdown:

| Frame | Time | Terminal | Number line |
|---|---|---|---|
| 0–30 | 0.0–1.0s | Boots in (fade + scale-up). Prompt visible. | — |
| 30–90 | 1.0–3.0s | Types `load number_line range(-10..10)` | — |
| 90–150 | 3.0–5.0s | (idle, cursor blinking) | Line draws in (eased) |
| 150–210 | 5.0–7.0s | (idle, cursor blinking) | Ticks fade in, staggered |
| 210 | 7.0s | Prints `number_line loaded successfully` | Glow appears at 0 (amber) |
| 240 | 8.0s | New prompt line | — |
| 270–300 | 9.0–10.0s | Types `seek -7` | — |
| 300–345 | 10.0–11.5s | (idle) | Glow travels 0 → −7, with grey diagram |
| 345 | 11.5s | Prints `target found: -7` | Glow flips amber → green |
| 345–450 | 11.5–15.0s | (idle, hold) | (hold) |

**The contract:**

1. **A typed command always precedes the maths event it describes.** The
   viewer reads it before they see it.
2. **A maths event always triggers a system-output line at its landing
   frame.** The console echoes what just happened.
3. **Idle gaps are intentional.** Frames 90–150 (line drawing) have no
   terminal activity — the cursor just blinks. Don't fill silence with
   chatter; let the animation breathe.
4. **The first prompt is "free".** The opening
   `motiomatrix@v.0.0.1 ~ %` line appears with the terminal's fade-in, no
   typing animation. It establishes the user identity and shell context, like
   walking into a room with a session already open.

---

## 4. The two terminal "voices"

The terminal speaks in exactly two registers. Keep them distinct:

| Voice | Style | Examples |
|---|---|---|
| **User input** (typed) | full opacity (~0.95), preceded by prompt, character-by-character reveal | `load number_line range(-10..10)`, `seek -7` |
| **System output** (instant) | dim opacity (~0.7), no prompt, instant appearance | `number_line loaded successfully`, `target found: -7` |

The dim opacity does two things: (a) signals "this wasn't typed by the user"
without needing colour or icon differentiation, and (b) keeps the eye on the
freshest typed command and the visual that follows.

---

## 5. Style tokens

```ts
const BG       = "#070A16";  // near-black navy backdrop
const LINE     = "#E6F1FF";  // primary line / number labels
const AMBER    = "#FBBF24";  // glow before it has reached its target
const GREEN    = "#34D399";  // glow once it has arrived (success state)
const GREY     = "#9CA3AF";  // working-out diagram (drops, arrows)
const PHOSPHOR = "#50FA7B";  // CRT terminal text
```

**Colour grammar:**

- **AMBER** = "in motion" / "seeking". Use while a value is being computed,
  approached, or held in suspense.
- **GREEN** = "arrived" / "verified". Hard switch at the landing frame, no
  cross-fade — the snap-to-green is a small reward.
- **GREY** = working-out marks. Drop lines, distance arrows, intermediate
  scaffolding. Lower visual weight than the main line.
- **PHOSPHOR** = the voice of the terminal. Don't bleed it into the maths
  layer; keep it confined to the CRT.

**Stroke weights are uniform.** Every line, tick, drop, and dash uses
`strokeWidth={4}`. This is deliberate — visual flatness keeps the diagram
calm and the colour/animation differences do all the work.

---

## 6. The terminal as a state machine

In code, the terminal is driven by a declarative `termRows` array:

```ts
const termRows: Array<{
  start: number;                                 // frame the row first appears
  prefix: string;                                // shown instantly at `start`
  typed?: { text: string; from: number; to: number }; // optional typing window
  dim?: boolean;                                 // system-output styling
}> = [
  { start: 0, prefix: `${PROMPT} `, typed: { text: "load number_line range(-10..10)", from: 30, to: 90 } },
  { start: 210, prefix: "number_line loaded successfully", dim: true },
  { start: 240, prefix: `${PROMPT} `, typed: { text: "seek -7", from: 270, to: 300 } },
  { start: 345, prefix: "target found: -7", dim: true },
];
```

This is the entire script of the lesson. To author a new episode, edit this
array and align the maths-side `interpolate` ranges to its frame markers.

The renderer:

- Shows a row only when `frame >= row.start`
- For typed rows, slices `text` by progress between `from` and `to`
- Places a blinking `█` cursor at the end of the latest-visible row

---

## 7. The grey "working-out" diagram

Below the number line, the lesson draws how it got the answer — in grey, with
the same stroke weight as the main line:

- **Dashed vertical drop** at the start point (`0`), fades in just before the
  glow begins moving.
- **Horizontal arrow** under the number line, growing leftward in sync with
  the glow. Its opacity scales with how far it has travelled, so the
  arrowhead never sits stuck at zero length behind the start label.
- **Solid vertical drop** at the destination (`-7`), fades in once the glow
  arrives.
- **Numeric label** (`-7`) above the arrow centre, fading in mid-travel.

This diagram is what makes the lesson read as maths and not just a pretty
animation. It's the equivalent of "showing your working." Always include it
when the lesson involves moving from one value to another.

**Arrowhead alignment trap:** SVG `<marker>` with default `markerUnits` scales
with `strokeWidth`, and `refX` controls where the marker anchors relative to
the line endpoint. Use `refX={markerWidth}` (e.g. `refX="8"` on a width-8
marker) to put the tip exactly at the line endpoint. Lower `refX` values
cause overshoot.

---

## 8. Versioning convention

Episodes are stamped into the prompt itself:

```
motiomatrix@v.0.0.1 ~ %
```

- `motiomatrix` — the user/shell name. Treat as a fixed brand mark; do not
  "correct" it.
- `v.0.0.1` — `vSERIES.EPISODE.PATCH`. So this file is *series 0, episode 1*.
- Increment the patch on revisions of the same lesson; bump the episode for a
  new lesson; bump the series for a new format.

The version appearing in the terminal *is* the episode label. No external
title card is needed.

---

## 9. Authoring checklist (use this for every new episode)

When building a new lesson in this style, work in this order:

1. **Write the script as a `termRows` array first.** Decide what gets typed,
   what the system echoes back, and roughly when. Don't draw anything yet.
2. **Place the maths landmarks on the same frame timeline.** Line draw,
   element fade-ins, motion start, motion end. Each one should align to a
   row's `start`, `from`, or `to`.
3. **Reserve idle space.** Every multi-second animation should have the
   terminal *quiet* (cursor blinking, no new lines) while it plays. Don't
   over-narrate.
4. **Pick the success colour switch.** Identify the moment when the value is
   "found" and snap from AMBER to GREEN at that frame. No cross-fade.
5. **Add the working-out diagram in grey.** Same stroke weight as the main
   line. Drops, arrows, mid-action labels.
6. **Wrap both halves in the gradient masks.** Never ship two hard panels.
7. **Set `durationInFrames` in `Root.tsx`** to the last frame index + the
   hold time you want.
8. **Validate with the `cursorOn` blink in the preview.** If the cursor ever
   sits on a row that's about to be replaced *during* its blink-on phase, it
   looks glitchy. Adjust the row `start` by ~5 frames.

---

## 10. Things to *not* do

- Don't add background music notes / pulse effects in the terminal area —
  the CRT should feel deterministic, not ambient.
- Don't animate the terminal text colour. Phosphor green is the only voice.
  Differentiate user vs system with **opacity**, not hue.
- Don't add a heading or title card above the terminal. The terminal *is*
  the title card. The version string is the episode label.
- Don't use hard rectangular boundaries between the halves. Always mask.
- Don't make every frame busy. The reference video has long stretches where
  only a cursor blinks. That stillness is the point.
- Don't change `strokeWidth` per element. One weight, everywhere.

---

## 11. Quick-extend ideas (same ethos)

Each of these is a single new `termRows` script + matching maths-side
animations. The chrome stays.

- **Addition / subtraction on the number line.** `add 5`, `subtract 3`,
  multiple chained jumps, each echoed by `result: x`.
- **Solving an equation.** `solve x + 3 = 10`, with the number line
  illustrating the "undo" step.
- **Inequalities.** `select where x > -2`, with a shaded region drawing in.
- **Coordinate plane.** Replace the number line with axes; commands like
  `plot (3, -2)`, `connect`, `reflect across y-axis`.
- **Function probing.** `f(x) = 2x + 1`, then `evaluate f(3)`, with the
  point appearing on a graph and the system echoing `f(3) = 7`.

In every case the rule is the same: the terminal *says* what's about to
happen, the maths *does* it, the terminal *confirms* it. Lock those three
beats and the format works.
