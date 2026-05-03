# How Hook.tsx Works — Remotion Explainer

## The Analogy

Think of this like a **theatre production**:

- **Root.tsx** is the **theatre** — it defines the stage size (1920x1080) and how long the show runs (4050 frames)
- **Episode001 (index.tsx)** is the **director's script** — it decides the running order and how long each act gets on stage
- **Hook.tsx** is **Act 1** — the actual performers doing their thing within their allocated time
- **SlicedShape** is a **prop** that the actors use — a configurable hexagon the scene controls
- **getCombinations** and **COLORS** are **backstage tools** — the maths helper and the paint palette

---

## How Hook.tsx gets onto the screen

Here's the chain from top to bottom:

```
Root.tsx
  │
  │  Registers Episode001 as a Composition
  │  (4050 frames, 30fps, 1920x1080)
  │
  └──> Episode001 (index.tsx)
         │
         │  Wraps each scene in a <Sequence>
         │  Hook gets: from=0, durationInFrames=240
         │
         └──> Hook.tsx
                │
                │  Uses useCurrentFrame() — but frame 0
                │  is relative to THIS sequence, not the
                │  whole video
                │
                └──> SlicedShape (SVG hexagon)
```

The critical thing: when `Episode001` wraps `Hook` in `<Sequence from={0} durationInFrames={240}>`, Remotion resets the frame counter. So inside `Hook.tsx`, `useCurrentFrame()` returns 0-239, not the global video frame. This is why each scene can be written as if it starts at frame 0.

---

## The imports, one by one

**From Remotion:**

```tsx
import {
  AbsoluteFill,      // Full-screen container (position: absolute, 100% width/height)
  useCurrentFrame,    // Returns the current frame number (0-239 inside this Sequence)
  useVideoConfig,     // Returns { fps, width, height, durationInFrames }
  spring,             // Physics-based animation (0 → 1 with natural motion)
  interpolate,        // Maps a frame range to a value range (like keyframes)
} from "remotion";
```

**From shared components:**

```tsx
import { SlicedShape } from "../../../shared/components/SlicedShape";
// The SVG component that draws a polygon/circle divided into slices
// Hook tells it: "draw a 6-sided polygon, shade these slices, at this opacity"

import { getCombinations } from "../../../shared/utils/combinations";
// getCombinations(6, 3) returns all 20 ways to pick 3 slices from 6
// This runs ONCE outside the component (line 12) — not every frame

import { COLORS } from "../../../shared/utils/colors";
// The colour palette: background (#0a0a0a), fill (#4f8ff7), outline (#e0e0e0)
```

---

## Walk through Hook.tsx frame by frame

The scene is 240 frames (8 seconds at 30fps). Here's what happens:

**Frames 0-30 — Hexagon scales up**

```tsx
const scale = spring({ frame, fps, config: { damping: 200 } });
```

`spring` animates from 0 to 1 with smooth motion (damping: 200 means no bounce). The hexagon starts invisible and grows to full size. This value is applied via `transform: scale(...)` on the wrapper div.

**Frames 30-55 — Divider lines fade in**

```tsx
const dividerOpacity = interpolate(frame, [30, 55], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});
```

`interpolate` maps frame 30→0 and frame 55→1, creating a linear fade. The `"clamp"` stops the value going below 0 before frame 30 or above 1 after frame 55. This opacity is passed to `SlicedShape` as `dividerOpacity`.

**Frames 55-70 — Left half fills with blue**

```tsx
const halfFillOpacity = interpolate(frame, [55, 70], [0, 1], { ... });
```

Same technique — fades the fill in over 15 frames. The slices `[3, 4, 5]` are the left three triangles of a pointy-top hexagon.

**Frames 75-155 — All 20 combinations flash**

```tsx
const isFlashing = frame >= 75 && frame < 155;
const flashIndex = isFlashing
  ? Math.min(Math.floor((frame - 75) / 4), allCombos.length - 1)
  : -1;
```

This divides the flashing window into 4-frame blocks. `Math.floor((frame - 75) / 4)` gives us which combination to show: frames 75-78 show combo 0, frames 79-82 show combo 1, etc. The `Math.min` caps it at the last combo so it doesn't overflow.

**Frames 160-175 — Fade to black**

```tsx
const fadeOut = interpolate(frame, [160, 175], [1, 0], { ... });
```

Opacity goes from 1 to 0. Applied to the wrapper div so the entire hexagon fades away.

**The decision logic (lines 46-54)** ties it all together — it picks which slices to shade and at what opacity based on where we are in the timeline:

- Frames 55-74: show the obvious left half, fading in
- Frames 75-155: cycle through all 20 combinations
- Everything else: no shading

---

## Gotcha: `useCurrentFrame()` is relative, not global

The most common mistake with Remotion is assuming `useCurrentFrame()` returns the frame in the overall video. It doesn't — it returns the frame **relative to the nearest `<Sequence>` parent**.

Hook sits inside `<Sequence from={0} durationInFrames={240}>`. So inside Hook, frame 0 is frame 0 of the video. But CircleScene sits inside `<Sequence from={240} durationInFrames={810}>` — inside CircleScene, `useCurrentFrame()` returns 0 when the global frame is 240. This is why every scene can write its animations starting from frame 0 without worrying about what comes before it.

If you ever wrapped a `<Sequence>` *inside* Hook.tsx (say, to delay a sub-element), that inner element's frame counter would reset again. It's sequences all the way down.
