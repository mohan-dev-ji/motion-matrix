# Episode 001 — Halves — Storyboard

## General Layout

- 1920 x 1080, shapes centred on screen
- Dark background, light shape outlines, blue accent fill for shaded slices
- Clean, minimal — no clutter

---

## Hook (0:00 - 0:08) — ~240 frames @ 30fps

1. Hexagon scales up from centre with a smooth spring entrance
2. A vertical line divides it — the left half fills with the accent colour (the obvious half)
3. All 20 possible half-combinations flash in rapid succession (~4 frames each)
4. Hard cut to black. Beat of silence.

---

## Scene 1: The Circle (0:08 - 0:35) — ~810 frames

1. Circle draws itself in (stroke animation, 0 to full circumference)
2. Cross-hair lines animate in, dividing the circle into 4 equal quarters
3. Two adjacent slices shade in — "That's one way"
4. Reset (unshade). Two opposite slices shade in — "But what about this?"
5. Cycle through the remaining combinations, resetting between each
6. All 6 combinations appear as a 2x3 grid of small circles
7. The number "6" fades in below the grid

**Combinations (slices numbered 1-4 clockwise from top-right):**
1. [1,2] — adjacent top-right
2. [2,3] — adjacent bottom-right
3. [3,4] — adjacent bottom-left
4. [4,1] — adjacent top-left
5. [1,3] — opposite diagonal
6. [2,4] — opposite diagonal

---

## Scene 2: The Hexagon (0:35 - 1:25) — ~1500 frames

1. Hexagon draws in, then internal lines animate to create 6 triangular slices
2. The obvious half shades in (3 adjacent slices)
3. 3-4 more combinations shown individually, holding ~1 second each
4. Tempo increases — combinations cycle faster and faster
5. Single large hexagon shrinks and transitions into a 4x5 grid
6. All 20 combinations visible simultaneously, each in its own small hexagon
7. The number "20" springs in below the grid

**Pacing for the cycle:**
- Combos 1-4: ~30 frames each (1 second)
- Combos 5-10: ~15 frames each (0.5 seconds)
- Combos 11-20: ~6 frames each (rapid fire)

---

## Scene 3: The Pattern (1:25 - 2:00) — ~1050 frames

1. Small circle slides in from the left with label "4 slices / 6 ways"
2. Small hexagon slides in from the right with label "6 slices / 20 ways"
3. Hold side by side for a beat
4. Octagon springs in beside them
5. 70 combinations ripple across the octagon in rapid fire (2-3 frames each)
6. The number "70" appears below — no explanation, just the visual impact
7. All three shapes fade out. Screen holds on black.
8. Text fades in: "And that's just halves."

---

## End Card (2:00 - 2:15) — ~450 frames

1. Circle with 6 slices fades in, 2 slices shade (showing one third)
2. "Next: Thirds" text fades in
3. Motion Matrix logo and subscribe prompt fade in below
4. Hold for 5 seconds

---

## Colour Palette (initial)

| Element | Colour | Usage |
|---------|--------|-------|
| Background | `#0a0a0a` | Near-black |
| Shape outlines | `#e0e0e0` | Light grey, clean |
| Shaded fill | `#4f8ff7` | Blue accent |
| Text | `#ffffff` | White |
| Secondary text | `#888888` | Grey for labels |

---

## Animation Timing Reference

| Animation | Duration | Easing |
|-----------|----------|--------|
| Shape entrance | 20-30 frames | Spring `{ damping: 200 }` |
| Slice shade in | 8-12 frames | `Easing.inOut(Easing.quad)` |
| Slice reset | 6 frames | Linear fade |
| Grid entrance | 20 frames | Spring `{ damping: 200 }` |
| Text fade in | 15-20 frames | `Easing.out(Easing.quad)` |
| Scene transitions | 15 frames | Fade through black |
