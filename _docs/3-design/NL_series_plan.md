# "Moving on the Line" — Series Plan
## Number Line Arithmetic | EP002–EP007

---

## 1. Series Concept

A 6-episode run teaching addition and subtraction on the number line.
Each episode follows the same beat pattern:

```
QUESTION → pause (2–3s) → ANIMATED ANSWER → brief verbal/text explanation → next question
```

Difficulty escalates across the series. The payoff is EP007, where the viewer fully
understands *why* subtracting a negative flips direction — shown visually, not just stated.

---

## 2. Visual Style — "Glass Neon Classroom"

Use the frontend-skills style language directly:
- **Base style:** `glassmorphism` (frosted panels, layered depth)
- **Accent style:** `cyberpunk` (neon contrast, high-clarity motion cues)

This keeps the series visually distinct from source material while giving a reusable, token-driven art direction.

### Design Tokens (for Remotion + CSS parity)
| Element            | Colour            | Hex       |
|--------------------|-------------------|-----------|
| Background         | Deep indigo       | `#070A16` |
| Glass panel fill   | Frosted slate     | `rgba(148,163,184,0.18)` |
| Panel border       | Soft neon edge    | `rgba(125,211,252,0.40)` |
| Number line        | Icy white glow    | `#E6F1FF` |
| Move RIGHT (add+)  | Neon amber        | `#FBBF24` |
| Move LEFT  (add−)  | Neon cyan         | `#22D3EE` |
| Traveller dot      | Bright white      | `#FFFFFF` |
| Positive labels    | Warm off-white    | `#FEF3C7` |
| Negative labels    | Cool sky          | `#BAE6FD` |
| Zero label         | Highlight white   | `#FFFFFF` |
| Pause indicator    | Violet pulse      | `#A78BFA` |
| Answer reveal      | Neon mint         | `#34D399` |

Suggested CSS token mapping (optional, if mirrored in web previews):
`--bg`, `--glass-fill`, `--glass-border`, `--line`, `--hop-right`, `--hop-left`, `--answer`

### Animation language
- **Number line** draws itself left-to-right on first appearance (stroke-dashoffset animation)
- **Glass panel intro** = subtle blur + fade-in before the first question
- **Traveller dot** = glowing white circle that slides smoothly along the line
- **Question text** types in character-by-character (typewriter)
- **Pause beat** = small purple dot pulses 2–3 times before answer starts
- **Answer equation** = assembles left-to-right, final result highlights in mint green
- **− (−n) flip** = direction arrow physically rotates 180° with a spin easing
- **Glow discipline** = keep bloom subtle so labels stay legible on small screens

### Layout
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [Glass panel] QUESTION TEXT (top third, large)    │
│                                                     │
│   ←─────────────────────────────────────────→       │
│  -10  -8  -6  -4  -2   0   2   4   6   8  10       │
│            ↑ arc sweeps above line                  │
│                                                     │
│   EQUATION:  −3 + 7 = [ 4 ]   (bottom strip)        │
└─────────────────────────────────────────────────────┘
```

### Typography + UI motifs
- **Display text:** geometric sans, semi-bold, high tracking for title cards
- **Equation strip:** monospaced or tabular-friendly numerals for stable alignment
- **Panels/chips:** rounded glass cards for prompts, hints, and reveal states
- **Depth system:** 2 layers max (scene background + foreground panel) to keep motion clean
- **End explainer card:** short animated "why this is the answer" line after final zoom

---

## 3. Reference Assets (PNG Inputs)

Primary reference folder:
- `_docs/1-inbox/screenshots/01 number line`

Attached PNG set:
- `Screenshot 2026-04-13 at 01.45.50.png`
- `Screenshot 2026-04-13 at 01.46.09.png`
- `Screenshot 2026-04-13 at 01.46.33.png`
- `Screenshot 2026-04-13 at 01.47.35.png`
- `Screenshot 2026-04-13 at 01.48.34.png`
- `Screenshot 2026-04-13 at 01.49.35.png`
- `Screenshot 2026-04-13 at 01.50.37.png`
- `Screenshot 2026-04-13 at 01.51.13.png`
- `Screenshot 2026-04-13 at 01.51.59.png`
- `Screenshot 2026-04-13 at 01.52.23.png`
- `Screenshot 2026-04-13 at 01.53.05.png`

How to use references:
- Keep **math flow + pedagogy** from references, but not literal color/style duplication
- Use references to validate spacing, readability, tick density, and pacing
- Every new shot should pass a quick check: "clear at phone size, clear at desktop size"

---

## 4. Episode Arc

### EP002 — "The Number Line" *(orientation)*
Concepts: positive/negative, zero, symmetry, locating points

**Scene structure**
1. Title card — "The Number Line" types in, line draws itself
2. Concept beat — zero is the middle; right is positive, left is negative
3. Q1 → A1
4. Q2 → A2
5. Q3 → A3 (symmetry pair — shows both sides light up)
6. Summary beat — "Every number has a home on this line"

**Original questions**
- Q1: "Where does −4 live? Left or right of zero?"
  - Answer: Left. Dot slides left, lands on −4.
- Q2: "Which is further from zero — −9 or 6?"
  - Answer: −9. Both dots appear; distance brackets shown above line.
- Q3: "Place −15 and 15 on the line. What do you notice?"
  - Answer: Mirror images. Both dots appear, dashed vertical at 0, symmetry highlighted.

---

### EP003 — "Moving Right" *(adding positive numbers)*
Concepts: positive number + positive number, negative number + positive number

**Original questions**
- Q1: "Start at 2. Add 5. Where do you land?"
  - One amber arc, +5 label. Lands on 7.
- Q2: "Start at −6. Add 4. Where do you land?"
  - Amber arc from −6 jumping +4 right. Lands on −2.
- Q3: "Start at −3. Add 7. Where do you land?"
  - Amber arc crosses zero. Lands on 4.
- Q4: "Start at −10. Add 3. Where do you land?"
  - Larger scale. Lands on −7.

**Key narration beat (after Q3):**
"Adding a positive number always moves you to the right — even if you start in negative territory."

---

### EP004 — "Moving Left" *(adding negative numbers)*
Concepts: adding a negative = moving left

**Original questions**
- Q1: "Start at 5. Add −3. Where do you land?"
  - Blue arc sweeping left, −3 label. Lands on 2.
- Q2: "Start at 1. Add −8. Where do you land?"
  - Crosses zero into negatives. Lands on −7.
- Q3: "Start at −2. Add −5. Where do you land?"
  - Already negative, moves further left. Lands on −7.
- Q4: "Start at 0. Add −4. Where do you land?"
  - Clear demonstration: from zero, left = negative. Lands on −4.

**Key narration beat:**
"Adding a negative number always moves you to the left. It doesn't matter where you start."

---

### EP005 — "Chain Hops" *(multi-term addition)*
Concepts: chaining 3–4 hops, colour-coding by direction

Each hop gets its own arc in the correct colour (amber right, blue left), animated one at a time.

**Original questions**
- Q1: "Find 4 + (−6) + 3"
  - Hop 1: +4 amber. Hop 2: −6 blue. Hop 3: +3 amber. Lands on 1.
- Q2: "Find −3 + 8 + (−4)"
  - Three hops. Lands on 1.
- Q3: "Find −6 + 4 + (−1) + 5"
  - Four hops. Lands on 2.
- Q4: "Find 2 + (−9) + 6 + (−3)"
  - Four hops, wider scale. Lands on −4.

**Pause beat** is longer here (3s) — give the viewer time to try the chain.

---

### EP006 — "Subtraction as Reverse" *(subtracting positive numbers)*
Concepts: subtracting a positive = moving left, setting up the contrast for EP007

**Original questions**
- Q1: "Start at 6. Subtract 4. Where do you land?"
  - Arrow reversal shown: subtraction flips the direction. Lands on 2.
- Q2: "Start at 3. Subtract 7. Where do you land?"
  - Crosses zero. Lands on −4.
- Q3: "Find −2 − 5"
  - Already negative, move further left. Lands on −7.
- Q4: "Find 1 − 9 on the number line"
  - Lands on −8.

**Setup beat at end:**
"Subtraction always moves you left... but what happens when you subtract a *negative* number?"
Cliffhanger. No answer — resolved in EP007.

---

### EP007 — "The Double Negative" *(−(−n) = +n)*
The payoff episode. Multiple examples, visual proof, the 180° flip metaphor.

**Opening concept beat (no question, just explanation):**
Show an arrow pointing LEFT. Label it "−2" (moving left 2).
Now show "subtracting" that arrow = flip it 180°. It now points RIGHT.
Text reveals: "−(−2) = +2"

**Original questions (each one reinforces the flip)**
- Q1: "What does −(−3) equal?"
  - Arrow flip animation. Answer: +3.
- Q2: "Find 5 − (−2) on the number line"
  - Start at 5. −(−2) flips to +2. Amber arc right. Lands on 7.
- Q3: "Find −4 − (−6) on the number line"
  - Start at −4. −(−6) flips to +6. Lands on 2.
- Q4: "Find 0 − (−5) on the number line"
  - Zero start makes it clear: answer is +5.
- Q5: "Find −8 − (−3) on the number line"
  - Lands on −5.
- Q6: "Find 2 − (−9) on the number line"
  - Larger jump. Lands on 11 (scale adjusts).

**Explanation beat (mid-episode):**
"When you subtract a negative, you're removing a leftward force. That always pushes you right."
Show side-by-side: `5 − (−2)` vs `5 + 2` — same dot, same destination. 

**Closing beat:**
Replay the flip animation one more time, slowly.
Text: "Subtracting a negative = adding a positive. Always."

---

## 5. Reusable Components to Build

These can be shared across all 6 episodes:

| Component            | Description                                          |
|----------------------|------------------------------------------------------|
| `NumberLine`         | Draws itself, configurable range, tick marks, labels |
| `TravellerDot`       | Animated dot with glow, slides to a position        |
| `TickClickTrack`     | Utility that schedules click SFX at each crossed tick/sub-unit |
| `HopArc`             | Curved arc above line, labelled, amber or blue       |
| `QuestionText`       | Typewriter reveal, large display font                |
| `PausePulse`         | 2–3 pulse beats before answer begins                 |
| `EquationReveal`     | Assembles equation, highlights answer in mint green  |
| `FinalZoomBeat`      | Subtle camera/scene zoom for final equation emphasis  |
| `AnswerExplainer`    | Animated one-line explanation after answer lands      |
| `FlipArrow`          | Rotating direction arrow for EP007 flip metaphor     |
| `ScaleLabel`         | Number labels that fade/scale when range changes     |

---

## 6. Production Notes

- **FPS:** 30 (matching EP001)
- **Typical scene:** 150–240 frames (5–8s per question including pause)
- **Target episode length:** 90–180s (EP002 shorter, EP007 longer)
- **Audio:** voiceover optional initially; text + animation should be self-sufficient
- **SFX:** light click per tick (or sub-tick) crossing; keep mixed low so it supports, not distracts
- **Motion quality:** dot movement should use curved interpolation + easing in every hop
- **Ending cadence:** each solved question gets a short final zoom + animated explainer beat
- **Questions are original** — no overlap with source course phrasing or numbers
- **Visual identity:** frontend-skills-based (`glassmorphism` + `cyberpunk`) with custom tokens
