# Motion Matrix — Initial Thoughts

## The Name

Motion Matrix — named after the existing YouTube channel showcasing DVD/Blu-ray menu motion graphics and opening sequences created in After Effects during the early career in graphic/motion design.

## The Rebrand

- Move all existing motion graphics work into an unlisted playlist
- Rebrand the channel around a new direction: **maths-driven motion design built with code**

## The Vision

Use the **Remotion** framework (React-based video creation) to produce educational maths content for YouTube, starting simple and growing in complexity alongside a personal maths learning journey.

### Phase 1: Maths Visualisation

The initial focus is purely on **visualising the maths** — animated explanations of concepts using Remotion. Get the production pipeline solid first: scripting, animation, narration, music, export, upload.

### Phase 2 (later): The Code-Maths-Visual Triangle

Once the Remotion workflow is refined, introduce the connective thread between three things:

1. **The maths** — the formula, theorem, or concept
2. **The code** — how it's expressed programmatically (React/TypeScript)
3. **The visual** — the animated, on-screen representation

Example: sine and cosine — a formula, a few lines of code, and a beautiful wave/circle animation. This triple connection becomes the channel's unique angle once the production fundamentals are locked in.

## Starting Point

- Begin with **geometry fundamentals** — the most visual branch of maths
- Keep early videos deliberately simple (shapes, angles, basic transformations)
- Progress as the online maths course progresses

## Maths Topics Roadmap

Aligned with the online course, roughly ordered by progression:

| Phase | Topics | Visual Potential |
|-------|--------|-----------------|
| 1 - Foundations | Geometry basics (shapes, angles, symmetry, area) | High — immediately visual |
| 2 - Trigonometry | Sine, cosine, tangent, unit circle | Very high — the code-maths-visual sweet spot |
| 3 - Calculus | Derivatives, integrals, rates of change | High — curves, areas under curves, tangent lines |
| 4 - Probability & Statistics | Distributions, combinatorics, data viz | Medium-high — simulations, charts, randomness |
| 5 - Advanced | Linear algebra, fractals, complex numbers | Very high — transformations, Mandelbrot, etc. |

---

## Thoughts & Suggestions

### What makes this compelling

- **Authentic learning arc** — the audience follows a real journey, not a polished expert lecturing. This is genuinely engaging content.
- **Unique niche** — "maths visualised through React code" is a very specific positioning. Channels like 3Blue1Brown do maths visualisation brilliantly, but nobody is doing it through a web dev / Remotion lens. That's your gap.
- **Compounds on existing skills** — motion design instincts from the After Effects era + React/TypeScript from the current stack = Remotion is the natural intersection.
- **Portfolio synergy** — every video is also a code project, a portfolio piece, and a learning milestone.

### Considerations before building

#### 1. Define the minimum first video

Don't plan 50 videos. Define one. Something like:

> "Animate the interior angles of a triangle summing to 180°"

Ship that. Learn the Remotion workflow end-to-end. Then iterate.

#### 2. Remotion learning curve

Remotion has its own mental model — compositions, sequences, `useCurrentFrame()`, `interpolate()`, spring animations. Budget time to learn the framework before trying to produce polished content. Build throwaway experiments first.

Key Remotion concepts to front-load:
- Frame-based animation (not time-based like After Effects)
- `<Sequence>` for scene ordering
- `interpolate()` for easing/mapping values
- Audio sync
- Rendering/exporting pipeline (can be slow — understand this early)

#### 3. Audio — Narration

Start with **own voice** narration. It builds authentic connection with the audience and fits the personal learning journey angle. A decent USB mic and a quiet room is enough — audio can be cleaned up in post with tools like Adobe Podcast (AI noise removal) or Audacity. If recording becomes a bottleneck that slows down video output, **ElevenLabs** is a viable fallback to speed up production.

#### 4. Audio — Music

The soundtrack direction is: **no beats, arpeggiating soft synth or acid line, looping with subtle evolving changes.** Think warm, detuned arpeggios (Boards of Canada), generative slow shifts (Eno meets Aphex Twin's ambient work), or clean melodic arps with gentle filter sweeps (Tycho's quieter moments). A soft 303-style arp with a slow filter cutoff sweep and subtle resonance changes gives that evolving quality without competing with narration.

For generating music, several options are worth exploring. **Suno and Udio** are prompt-based and can get close to this aesthetic, though they offer less control over precise loop points and structure — results can be hit or miss for something this specific. **AIVA and Amper** provide more control over mood and instrumentation but may lack the acid/synth character. A more on-brand approach would be **programmatic music generation using Tone.js** alongside Remotion — a basic arpeggiator with a soft synth and an LFO on the filter cutoff is roughly 50 lines of code, and music generated by code for a channel about maths and code has a nice symmetry. Finally, **supplying a reference WAV/MP3 to an AI generation tool** works well if there's a short loop to use as a starting point and the goal is to generate variations of it. For v1, using an AI tool with a reference track is the pragmatic choice, with programmatic generation as a compelling future direction.

#### 5. Video format decisions

Decide early on:
- **Aspect ratio** — 16:9 standard YouTube? 9:16 for Shorts? Both?
- **Duration target** — 60-second explainers? 5-minute deep dives? Shorts?

#### 6. Content structure template

Having a repeatable structure makes production faster:

```
1. Hook — "What does sine actually look like?"
2. The maths — show the concept/formula
3. The visual — the animated result
4. (Phase 2) The code — show/build the Remotion component
5. (Phase 2) The connection — tie all three together
```

#### 7. Branding and visual identity

Since this is a rebrand, think about:
- Channel banner, logo, colour palette
- Consistent intro/outro (built in Remotion — meta and on-brand)
- Thumbnail style — maths channels thrive on bold, clean thumbnails
- Channel description and keywords for discoverability

#### 8. Project structure

Consider organising the Remotion project so each video is self-contained:

```
motion-matrix/
├── src/
│   ├── shared/          # Reusable components (axes, grids, labels)
│   ├── videos/
│   │   ├── 001-triangle-angles/
│   │   ├── 002-unit-circle/
│   │   └── ...
│   └── Root.tsx
├── public/
└── package.json
```

Shared components (coordinate grids, animated labels, colour themes) will compound in value as you make more videos.

#### 9. Don't skip the boring maths

The temptation will be to jump to the visually exciting stuff (fractals, Fourier transforms). Resist. The early, simple geometry videos will:
- Be easier to produce while learning Remotion
- Build a library of reusable components
- Establish the channel's style
- Match where you actually are in the course (authenticity)

#### 10. Potential expansion paths (later, not now)

- Interactive web versions of each video (Remotion Player embeds)
- Blog posts or tutorials pairing the video with a code walkthrough
- Community challenges ("animate this formula")
- Shorts/clips cut from longer videos
- Collaboration with other maths or creative coding channels

---

## Immediate Next Steps

1. Set up a Remotion project in this repo
2. Build one throwaway experiment (animate a shape, learn the API)
3. Define the first real video topic (geometry basics)
4. Produce and export it — full pipeline, no shortcuts
5. Upload, get feedback, iterate
