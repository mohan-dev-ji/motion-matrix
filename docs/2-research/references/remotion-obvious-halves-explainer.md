# How ObviousHalves.tsx Works — Remotion Explainer

## The Analogy

Think of this like a **traffic light**. At any given moment, the light is in one state — red, amber, or green. It doesn't know about the other lights. It just checks what time it is and shows the right colour.

ObviousHalves works the same way. Every frame, it asks: "What time is it?" and decides what to draw. Frame 10? Draw the circle outline partway. Frame 150? Show the second combination with the fill fading in. It's a single function that runs 480 times (once per frame), and each time it produces a still image.

---

## Where it sits

```
index.tsx
  │
  ├── Sequence: Title            frames 0-120
  ├── Sequence: ObviousHalves    frames 120-600   <── this scene (480 frames / 16s)
  ├── Sequence: UnobviousHalves  frames 600-870
  └── Sequence: AllCombinations  frames 870-1170
```

Inside ObviousHalves, `useCurrentFrame()` returns 0-479. It doesn't know or care that the video is already 4 seconds in.

---

## The imports

```tsx
import {
  AbsoluteFill,      // Full-screen container
  useCurrentFrame,    // "What frame am I on?" (0-479 in this scene)
  useVideoConfig,     // Gives us { fps: 30 } — needed by spring()
  spring,             // Physics animation: 0 → 1 with natural motion
  interpolate,        // "At frame X, give me value Y" — the workhorse
  Easing,             // Curves that make interpolate non-linear
} from "remotion";
```

```tsx
import { SlicedShape } from "../../../shared/components/SlicedShape";
// The circle SVG — we tell it which slices to shade and it draws them

import { COLORS } from "../../../shared/utils/colors";
// { background: "#0a0a0a", fill: "#4f8ff7", outline: "#e0e0e0", ... }

import { Subtitle } from "../../../shared/components/Subtitle";
// Renders text at the bottom of the screen with a fade-in
```

---

## The constants (lines 14-22)

```tsx
const OBVIOUS: number[][] = [
  [0, 1],    // top-right + bottom-right (adjacent)
  [1, 2],    // bottom-right + bottom-left
  [2, 3],    // bottom-left + top-left
  [3, 0],    // top-left + top-right
];
```

The circle has 4 slices numbered 0-3 clockwise from top-right. Each pair here is two slices sitting next to each other — they look like clean, obvious halves when shaded.

```tsx
const SHOW_DURATION = 90; // 3 seconds at 30fps
```

Each combination is on screen for 90 frames. This is the pacing control — change this one number to speed up or slow down the whole scene.

---

## The timeline

```
Frame: 0       40      60      90                  180          270          360        479
       │───────│───────│───────│───────────────────│────────────│────────────│──────────│
       Circle  Dividers Pause  Combo 0 [0,1]       Combo 1 [1,2] Combo 2 [2,3] Combo 3 [3,0]
       draws   fade            fade in → hold →     same          same         fade in → HOLD
       in      in              fade out                                        (no fade out)
```

---

## Walk through the code

### Phase 1: Drawing the circle (frames 0-60)

**Lines 29-33 — Circle outline draws itself in:**

```tsx
const outlineProgress = interpolate(frame, [0, 40], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.quad),
});
```

At frame 0, `outlineProgress` = 0 (nothing drawn). At frame 40, it's 1 (fully drawn). The `Easing.inOut(Easing.quad)` means it draws slowly at first, speeds up in the middle, and slows down again at the end — like a pen accelerating and decelerating.

This value gets passed to `SlicedShape` as `outlineProgress`, which controls the SVG `strokeDashoffset` — the standard trick for animating a line drawing.

**Line 36 — Scale entrance:**

```tsx
const scale = spring({ frame, fps, config: { damping: 200 } });
```

Runs simultaneously with the outline draw. The circle grows from 0 to full size with a smooth spring (damping 200 = no bounce). Applied via `transform: scale(...)` on the wrapper div.

**Lines 39-42 — Divider lines appear:**

```tsx
const dividerOpacity = interpolate(frame, [40, 60], [0, 1], { ... });
```

After the outline finishes drawing (frame 40), the cross-hair lines fade in over 20 frames. Passed to `SlicedShape` as `dividerOpacity`. The `showDividers={frame >= 40}` on line 92 means the divider elements don't even render before frame 40.

### Phase 2: Showing combinations (frames 90-479)

**Lines 48-49 — Starting state:**

```tsx
let shadedSlices: number[] = [];
let fillOpacity = 0;
```

Before frame 90, nothing is shaded. These are the defaults.

**Lines 51-56 — Which combination to show:**

```tsx
if (frame >= COMBO_START) {
  const comboFrame = frame - COMBO_START;  // Reset to 0 at the start of combos
  const comboIndex = Math.min(
    Math.floor(comboFrame / SHOW_DURATION),
    OBVIOUS.length - 1,
  );
```

`comboFrame` is how far into the combo phase we are. Dividing by `SHOW_DURATION` (90) tells us which combo:

| comboFrame | comboFrame / 90 | comboIndex | Showing |
|-----------|----------------|------------|---------|
| 0-89 | 0 | 0 | [0, 1] |
| 90-179 | 1 | 1 | [1, 2] |
| 180-269 | 2 | 2 | [2, 3] |
| 270+ | 3+ | 3 (clamped) | [3, 0] |

The `Math.min(..., OBVIOUS.length - 1)` stops the index going past the last combo — so combo 3 stays on screen for the rest of the scene.

**Line 57 — Where are we within this combo's 90-frame block:**

```tsx
const frameInCombo = comboFrame % SHOW_DURATION;
```

The modulo (`%`) wraps the frame back to 0 at the start of each combo block. So `frameInCombo` always goes 0 → 89, then resets to 0 for the next combo.

**The fade in / fade out:**

Two overlapping animations within each 90-frame block:

```
frameInCombo:  0         20                    70        90
               │─────────│─────────────────────│─────────│
fadeIn:        0 ──────> 1                     1         1
fadeOut:       1         1                     1 ──────> 0
Math.min:      0 ──────> 1 (holds at 1)       1 ──────> 0
```

`Math.min(fadeIn, fadeOut)` picks whichever is lower. During the first 20 frames, `fadeIn` is the lower value (fading in). During the middle, both are 1 (full opacity). During the last 20, `fadeOut` is lower (fading out).

**Last combo hold (the bug fix):**

```tsx
const isLastCombo = comboIndex === OBVIOUS.length - 1;
const pastFirstBlock = comboFrame >= (comboIndex + 1) * SHOW_DURATION;

if (isLastCombo && pastFirstBlock) {
  fillOpacity = 1;
}
```

Because `frameInCombo` uses modulo, it keeps cycling 0-89 even after the last combo is clamped. Without this check, the last combo would fade in again every 90 frames. The fix: once the last combo has finished its initial 90-frame block, just hold `fillOpacity = 1` for the rest of the scene.

### The JSX

```tsx
<AbsoluteFill style={{ backgroundColor: COLORS.background }}>
  <AbsoluteFill className="flex items-center justify-center">
    <div style={{ transform: `scale(${scale})` }}>
      <SlicedShape
        type="circle"
        sliceCount={4}
        shadedSlices={shadedSlices}    // which 2 slices to fill
        fillOpacity={fillOpacity}       // how visible the fill is
        showDividers={frame >= 40}      // don't render dividers until frame 40
        dividerOpacity={dividerOpacity} // fade them in gradually
        outlineProgress={outlineProgress} // how much of the circle is drawn
      />
    </div>
  </AbsoluteFill>
  <Subtitle text="Here are the obvious ones" />
</AbsoluteFill>
```

Two layers stacked:
1. The circle (centred, scaled)
2. The subtitle (positioned at the bottom by the Subtitle component)

Every frame, React re-renders this with fresh values. The `SlicedShape` doesn't animate itself — it just draws whatever it's told to. All the animation logic lives here in ObviousHalves, and `SlicedShape` is a dumb renderer.

---

## Gotcha: `let` vs `const` for animated values

Notice `shadedSlices` and `fillOpacity` use `let` (lines 48-49) while everything else uses `const`. That's because these two values are conditionally assigned inside the `if` block — they depend on whether we've reached the combo phase yet. The Remotion animation functions (`interpolate`, `spring`) always return a value for any frame, so those can be `const`. But when a value only makes sense during part of the timeline, `let` with a default is the cleaner pattern.
