# Motion Matrix — Workflow v1

## Production Pipeline Overview

```
 PLAN          BUILD           POLISH          PUBLISH
  |              |               |               |
  v              v               v               v
┌──────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│SCRIPT│───>│ ANIMATE  │───>│  AUDIO   │───>│ EXPORT & │
│      │    │          │    │          │    │ UPLOAD   │
└──────┘    └──────────┘    └──────────┘    └──────────┘
 Topic       Remotion         Narrate         Render
 Research    components       Record/AI       Thumbnail
 Script      Preview          Music gen       Upload
 Storyboard  Iterate          Mix             Metadata
```

---

## Step-by-Step Workflow

### 1. PLAN — Script & Storyboard

```
 Pick topic from course
        |
        v
 Research the concept
        |
        v
 Write narration script
        |
        v
 Sketch visual storyboard
        |
        +──> What shapes/animations?
        +──> What appears when?
        +──> What does the viewer see at each beat?
```

**Inputs:** Maths course topic, notes, references
**Outputs:** `script.md` + rough storyboard (pen & paper or quick sketches)

> Keep it simple. The script drives everything — if the explanation
> doesn't work as plain text, animation won't save it.

---

### 2. BUILD — Animate in Remotion

```
 Create video directory
        |
        v
 Build scene components ──────> Reuse from shared/ where possible
        |
        v
 Compose scenes with <Sequence>
        |
        v
 Preview in Remotion Studio ──> Iterate here until visuals land
        |
        v
 Lock animation timing
```

**Inputs:** Script + storyboard
**Outputs:** Working Remotion composition (no audio yet)

**Key Remotion patterns at this stage:**
- `useCurrentFrame()` + `interpolate()` for all motion
- `<Sequence from={frame}>` to order scenes
- Keep each scene as its own component
- Hard-code durations initially — refine later

---

### 3. POLISH — Audio Production

```
 ┌─────────────────────────────────┐
 │         NARRATION               │
 │                                 │
 │  Option A: Record own voice     │
 │     Record ──> Clean up ──>     │──┐
 │     (Audacity / Adobe Podcast)  │  │
 │                                 │  │
 │  Option B: ElevenLabs           │  │
 │     Script ──> Generate ──>     │──┤
 │     Review ──> Tweak            │  │
 └─────────────────────────────────┘  │
                                      │
 ┌─────────────────────────────────┐  │    ┌─────────────┐
 │         MUSIC                   │  ├───>│ MIX & SYNC  │
 │                                 │  │    │             │
 │  Generate from reference track  │  │    │ Align to    │
 │  using Suno/Udio               │──┘    │ animation   │
 │  (AI tool + supplied WAV/MP3)  │       │ timing      │
 │                                 │       └─────────────┘
 │  Soft arp, no beats, subtle     │
 │  evolving changes               │
 └─────────────────────────────────┘
```

**Inputs:** Locked animation, narration script, reference music track
**Outputs:** Narration audio file + music track, synced to animation

**Audio in Remotion:**
- Use `<Audio src={narration} />` and `<Audio src={music} volume={0.3} />`
- Adjust `startFrom` and `volume` per sequence
- Music sits well under narration at ~20-30% volume

---

### 4. PUBLISH — Export & Upload

```
 Render final video (npx remotion render)
        |
        v
 Review exported MP4
        |
        v
 Create thumbnail ──────────> Bold, clean, one concept per image
        |
        v
 Upload to YouTube
        |
        v
 Add metadata
   +── Title
   +── Description (with timestamps)
   +── Tags
   +── Thumbnail
```

**Inputs:** Final composition with audio
**Outputs:** Published YouTube video

---

## Project Structure

Code and content are separated so the project stays clean at scale. Episode numbering (`001-`, `002-`) keeps both directories in sync.

```
motion-matrix/
│
├── src/                                 # ── SOURCE CODE ──
│   │
│   ├── shared/                          # Reusable across all episodes
│   │   ├── components/                  # Grids, axes, labels, shapes
│   │   ├── styles/                      # Colours, fonts, themes
│   │   └── utils/                       # Animation helpers
│   │
│   ├── episodes/                        # One directory per episode (code only)
│   │   ├── 001-triangle-angles/
│   │   │   ├── index.tsx                # Composition entry
│   │   │   └── scenes/
│   │   │       ├── Intro.tsx            # Hook / title
│   │   │       ├── Explain.tsx          # The maths concept
│   │   │       └── Visualise.tsx        # The animated proof/demo
│   │   ├── 002-unit-circle/
│   │   │   ├── index.tsx
│   │   │   └── scenes/
│   │   └── ...
│   │
│   └── Root.tsx                         # Remotion root — registers all episodes
│
├── content/                             # ── PRODUCTION CONTENT ──
│   │                                    # (scripts, audio, planning — not code)
│   ├── 001-triangle-angles/
│   │   ├── script.md                    # Narration script
│   │   ├── storyboard.md               # Visual plan
│   │   └── assets/
│   │       ├── narration.mp3
│   │       └── music.mp3
│   ├── 002-unit-circle/
│   │   ├── script.md
│   │   ├── storyboard.md
│   │   └── assets/
│   └── ...
│
├── public/                              # Remotion static assets (fonts, images)
└── package.json
```

### Why this separation

```
 src/episodes/              content/
 ┌────────────────┐        ┌────────────────────┐
 │ Pure code       │        │ Scripts & planning  │
 │ Clean git diffs │        │ Audio files         │
 │ .tsx only       │        │ .md + .mp3/.wav     │
 │ Imports from    │───────>│ Audio served via    │
 │ shared/         │        │ staticFile() or     │
 │                 │        │ public/             │
 └────────────────┘        └────────────────────┘
                            Can .gitignore audio
                            or use Git LFS later
```

- **Finding things is obvious** — script? `content/`. Code? `src/episodes/`. Reusable grid component? `src/shared/`.
- **Git stays clean** — large audio files don't bloat the repo. Code diffs are pure code.
- **Scales to 50+ episodes** — each episode is self-contained in both directories, shared components grow independently.

---

## Claude Skill: `motion-matrix-video`

A Claude skill to accelerate the PLAN stage and scaffold the BUILD stage.

### What it does

```
 User provides:                  Skill outputs:
 ┌──────────────┐               ┌────────────────────────────────┐
 │ Maths topic  │               │  script.md                     │
 │ (e.g.        │──────────────>│  storyboard.md                 │
 │ "angles in   │               │  Scaffolded Remotion components│
 │ a triangle") │               │  with scene structure +        │
 │              │               │  placeholder animations        │
 └──────────────┘               └────────────────────────────────┘
```

### Skill workflow

```
            ┌─────────────────────────┐
            │  INPUT: Maths topic     │
            └────────────┬────────────┘
                         │
                         v
            ┌─────────────────────────┐
            │  1. Research the topic   │
            │     - Core concept       │
            │     - Key visual moments │
            │     - Common pitfalls    │
            └────────────┬────────────┘
                         │
                         v
            ┌─────────────────────────┐
            │  2. Generate script.md   │
            │     - Hook               │
            │     - Explanation flow    │
            │     - Narration text     │
            │     - Scene breakpoints  │
            └────────────┬────────────┘
                         │
                         v
            ┌─────────────────────────┐
            │  3. Generate storyboard  │
            │     - Scene descriptions │
            │     - What animates when │
            │     - Duration estimates │
            └────────────┬────────────┘
                         │
                         v
            ┌─────────────────────────┐
            │  4. Scaffold components  │
            │     - Video directory    │
            │     - Scene .tsx files   │
            │     - Composition config │
            │     - Placeholder code   │
            └─────────────────────────┘
```

### Example usage

```
> /motion-matrix-video "Interior angles of a triangle sum to 180°"
```

**Output:**
- `content/001-triangle-angles/script.md` — narration script with scene beats
- `content/001-triangle-angles/storyboard.md` — what each scene shows
- `src/episodes/001-triangle-angles/index.tsx` — composition with sequences
- `src/episodes/001-triangle-angles/scenes/Intro.tsx` — hook scene scaffold
- `src/episodes/001-triangle-angles/scenes/Explain.tsx` — concept scene scaffold
- `src/episodes/001-triangle-angles/scenes/Visualise.tsx` — animation scene scaffold

Each scaffold contains working Remotion code with `useCurrentFrame()`, `interpolate()`, and `<Sequence>` patterns already wired up — ready to fill in with real animation logic.

### What stays manual (for now)

```
 Skill handles:              You handle:
 ┌────────────────────┐     ┌────────────────────────────┐
 │ Script writing      │     │ Animation refinement        │
 │ Scene planning      │     │ Visual design decisions     │
 │ Component scaffold  │     │ Recording narration         │
 │ Boilerplate code    │     │ Music generation            │
 │ Remotion setup      │     │ Thumbnail creation          │
 └────────────────────┘     │ Final review & upload       │
                             └────────────────────────────┘
```

The creative and quality-control steps stay with you. The skill eliminates the blank page problem and the repetitive setup.

---

## v1 Checklist — First Video

```
 [ ] Set up Remotion project
 [ ] Learn core API (useCurrentFrame, interpolate, Sequence)
 [ ] Build one throwaway experiment
 [ ] Pick first topic (geometry basics)
 [ ] Write script
 [ ] Sketch storyboard
 [ ] Build animation scenes
 [ ] Record narration (or generate via ElevenLabs)
 [ ] Generate background music from reference track
 [ ] Mix and sync audio
 [ ] Render and review
 [ ] Create thumbnail
 [ ] Upload to YouTube
 [ ] Retrospective — what to improve for video 2
```

---

## Future Automation Opportunities (parked)

These are worth revisiting once the manual workflow feels solid:

| Area | Automation | When |
|------|-----------|------|
| Music | Programmatic generation with Tone.js | After 3-5 videos, ties into Mo Tabla |
| Thumbnails | Template-based generation from video metadata | When a visual style is established |
| Upload | YouTube API integration for metadata + upload | When the manual process feels repetitive |
| Shorts | Auto-cut key moments from long-form videos | When long-form content exists |
| Code reveal | Phase 2 — show the code alongside the visual | When Remotion pipeline is refined |
