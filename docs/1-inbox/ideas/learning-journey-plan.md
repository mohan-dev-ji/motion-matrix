# Motion Matrix — Long-Range Learning Journey

## Context

You've finished three Season-0 episodes (`s0e0` seek, `s0e1` add, `s0e2` triple-add) on the number line, and you now have a clear long-term vision for the channel: a personalised, programmatic-animation learning journey running from arithmetic through to quantum computing, with hardware build-logs running in parallel.

This plan turns that vision into an ordered curriculum where every topic has its prerequisites covered before it begins, the channel's tooling expands at the right moment (2D → 3D → Blender → hardware), and you keep authoring lessons in the order you want to learn them.

It is a roadmap, **not** a lesson plan. Episode-level scripting happens later, per-season, as you approach each one.

## Decisions locked in

- **Format**: flex per topic. Foundational maths topics keep the 9-version "core" structure (3 ranges × 3 variations). Advanced/applied topics use tighter 3–6 episode "mini-arcs". Each season's entry below names its format.
- **Episode length**: full episodes target **3+ minutes**. Core 9-version episodes get there at ~20–30s per version. Mini-arc episodes are single narratives of 3–5+ minutes each.
- **Audio**: two approved modes — narrated voice-over **or** ambient music + on-screen text explainers. Recording can be done casually on phone (no studio kit required to start).
- **3D pipeline**: both. `@remotion/three` (parametric maths — vectors, planes, gridded surfaces, quantum state visualisations) **and** Blender renders composited into Remotion (cinematic/physics-heavy — spacetime curvature, EM fields, particle systems, hardware mock-ups).
- **Python animation track**: Manim (3Blue1Brown-style maths animation) and Matplotlib (scientific plots, real computed data) become first-class render sources from S2 onward. Rendered to MP4/PNG and composited into Remotion alongside Blender output. Remotion stays the central compositor — Python is a render source, not a replacement.
- **Live-code format**: a new episode idiom where the camera/screen records actual Python (or other-language) code *running* on a problem humans can't solve by hand — backtracking solvers, optimisation, simulations, neural-net training. Sits alongside scripted episodes as its own format.
- **Hardware track**: parallel series `b0`, `b1`, `b2`… ("build" series). Build-log episodes ship alongside the maths/physics seasons, not blocked by them.

## Guiding principles

1. **Earn the next topic.** Each season either uses only ideas from earlier seasons or opens with a short "prereq top-up" arc that fills the gap explicitly.
2. **One concept per episode.** A version is a variation, not a new idea.
3. **Visuals carry the load.** If a concept can't be animated meaningfully, that's a signal the explanation isn't ready yet — keep refining until it can.
4. **Tooling grows with need, not ahead of it.** Don't add 3D until 3D is the next topic. Don't buy hardware until you're filming the build.
5. **Right engine for the job.** Remotion for narrative + terminal beats. Manim for mathematical proof-style animation. Matplotlib for real computed data. Blender for cinematic 3D. `@remotion/three` for parametric 3D inside a composition. Live screen recording for "watch the code think".
6. **Speculative ≠ wrong, but flag it.** String theory, M-theory, multiverse interpretations get clearly marked as "current unproven frontiers".

## Toolchain & engines

The channel has four episode "formats" and six rendering engines. Remotion remains the central compositor — every engine's output flows through it.

**Episode formats**

| Format | Length | Description |
|---|---|---|
| Core (9-version) | 3–4.5 min | Existing pattern: 3 ranges × 3 variations on one operation/concept |
| Mini-arc | 3–5+ min | Single-narrative episode for advanced/applied topics |
| Build-log (Series B) | flexible | Hardware project documentation, partly phone-shot, partly composited |
| Live-solve | 5–15+ min | Screen recording of code running a non-trivial problem, with light narration/text. Examples: backtracking sudoku, TSP heuristics, gradient descent visualisation, training run, FFT on a real audio clip |

**Rendering engines** (each season below names its primary engines)

| Engine | Strengths | Output |
|---|---|---|
| Remotion (TSX) | Terminal UI, narrative beats, composition, final stitch | MP4 |
| `@remotion/three` | Parametric 3D maths inside Remotion (vectors, planes, surfaces, Bloch sphere) | Inline |
| Manim (Python) | Algebra, calculus, linear-algebra animation in 3Blue1Brown style | MP4/PNG → composite |
| Matplotlib (Python) | Real computed plots, scientific data, physics simulation output | PNG/MP4 → composite |
| Blender | Cinematic 3D, EM fields, spacetime curvature, hardware mock-ups | MP4/PNG → composite |
| Screen recording | Live-solve format | MP4 |
| Phone camera | Build-log B-roll, real-world shots | MP4 |

## Series roadmap

Seasons are ordered. "Core" = 9-version format. "Mini" = 3–6 episodes. "Prereq" = a short top-up arc inside another season.

### Series S — Mathematics & Physics (main track)

| # | Season | Format | Primary engines | Why it comes here |
|---|---|---|---|---|
| **S0** | **Number Line Foundations** *(in flight)* | Core | Remotion | Already underway |
| **S1** | The Coordinate Plane (2D) | Core | Remotion | Generalises S0 to two dimensions |
| **S2** | Algebra & Functions | Core | Remotion + Matplotlib | Functions live on the plane from S1; Matplotlib enters for real plots |
| **S3** | Trigonometry & Waves | Core | Remotion + Manim | Manim debuts for wave superposition; unit circle sits on the plane |
| **S4** | Complex Numbers | Mini | Manim + Remotion | Extends trig & the plane; prereq for waves/quantum/signals |
| **S5** | 2D Vectors | Mini | Manim + Remotion | Lets you talk about direction + magnitude before going 3D |
| **S6** | 3D Coordinate Space & 3D Vectors | Core | `@remotion/three` + Blender + Manim | First **3D pipeline milestone** — adds `@remotion/three`, first Blender composite, and Manim's 3D scenes |
| **S7** | Matrices & Linear Algebra | Core | Manim + `@remotion/three` | Manim's signature territory — matrix transformations |
| **S8** | Calculus I — Differentiation | Core | Manim + Matplotlib | Builds on functions, slopes, vectors |
| **S9** | Calculus II — Integration | Core | Manim + Matplotlib | Builds on S8; unlocks physics |
| **S10** | Probability & Statistics | Mini | Matplotlib + Manim | Light topical detour; needed for quantum, signals, algorithms |
| **S11** | Classical Mechanics | Core | Matplotlib (sims) + Blender + Remotion | Kinematics simulations in Python; cinematic in Blender |
| **S12** | Electromagnetism | Core | Blender (heavy) + Matplotlib | E & B fields as vector fields in 3D |
| **S13** | Relativity (Special → General) | Mini | Blender + Manim | SR: linear algebra animation. GR: spacetime curvature in Blender |
| **S14** | Digital Signal Processing & Video | Core | Python (NumPy/SciPy) + Remotion + live-solve | Fourier on real audio, real DCT blocks, hex-dump views |
| **S15** | Quantum Mechanics | Core | Manim + `@remotion/three` + Qiskit | Hilbert space + Bloch sphere parametrically |
| **S16** | Quantum Computing | Mini | Qiskit + `@remotion/three` + live-solve | Applied QM; pairs with hardware track `b3` |
| **S17** | Algorithms & Computer Maths | Core | Manim + live-solve + Matplotlib | Late synthesis season; interstitials feed it throughout — see "Interstitials" below |

### Series B — Hardware Build-Logs (parallel track)

These ship in parallel with the maths/physics seasons. Episode count is flexible; format is documentary build-log, not lecture.

| # | Project | When it can start | Pairs with |
|---|---|---|---|
| **b0** | Bench setup, multimeter, breadboard literacy | After S2 (algebra is enough for Ohm's law) | — |
| **b1** | Multi-source energy harvester (solar + piezo + thermoelectric → charge controller → supercap/battery) | After S11 | S12 (EM), S13 not required |
| **b2** | Mechanical/analog video transmitter (raster scan, slow-scan TV, or single-line CRT-style) | After S14 begins | S14 (DSP & video) |
| **b3** | Quantum experiments via IBM Quantum / Qiskit (cloud, no cryostat needed) | After S15 | S16 (QC) |
| **b∞** | Open slots for future build curiosity | Anywhere | — |

### Interstitials (cross-cutting, slot-as-needed)

Short 1–3 episode arcs dropped between seasons when a prereq gap surfaces. Live as their own folders (e.g. `src/episodes/i-pythagoras/`):

- **Pythagoras & distance** — before S1
- **Logarithms refresher** — inside S2
- **Set notation & functions formalism** — inside S2
- **Sigma notation** — before S8
- **Hex, binary, and how a video file is bytes** — before S14
- **Algorithms drip-feed** — sorting, searching, graphs, complexity, cryptography. Drop one interstitial every 2–3 seasons rather than waiting for S17. S17 becomes the *synthesis* season, not the *introduction*.

## Tooling milestones

Mapped to the season where each lift happens. Anything earlier than its row is not needed yet.

| Season | What's added to the stack | Notes |
|---|---|---|
| S1 | `CoordinatePlane.tsx` shared component | Generalisation of `NumberLine.tsx` to 2D |
| S2 | **Python entry**: Matplotlib install + repo conventions for Python renders → composite | Decide folder layout (e.g. `python/` sibling to `src/`, `out/` for generated MP4/PNG) |
| S2 | `FunctionPlot.tsx` (curve renderer over a plane) | Replaces ad-hoc plotting |
| S3 | **Manim entry**: install, first scene render, composite into Remotion | Big tooling lift — Manim Community vs ManimGL; pick one |
| S3 | `UnitCircle.tsx`, waveform renderer | Reusable across S3/S4/S14 |
| S6 | **`@remotion/three` added** + first Blender → MP4 round-trip | This is the 3D pipeline milestone. Decide on Blender export format (PNG sequence vs MP4 vs glTF) before authoring S6 |
| S7 | `MatrixGrid.tsx` (animated matrix transformations) | Visualises change-of-basis; complemented by Manim renders |
| S8/S9 | Tangent/area-under-curve animation helpers | Calculus-specific; Manim does the heavy lifting |
| S11 | Units + physics-quantity number formatting; Python simulation scripts (`projectile.py`, `pendulum.py`, etc.) | Display kg·m/s², etc.; sims output to MP4 |
| S12 | 3D vector-field renderer (Blender heavy) + Matplotlib quiver plots | E & B field arrows in 3D |
| S14 | **Live-solve workflow**: screen-record tooling, hex-dump renderer, spectrogram, DCT-block visualiser | FFmpeg deep-dive needs these. First Live-solve episode goes here |
| S15 | Complex amplitude / Bloch-sphere component | Reused in S16; combine `@remotion/three` + Manim |
| S16 | **Qiskit** (Python) for real quantum circuits | Free IBM Quantum tier — no extra hardware |
| S17 | Visualiser templates for algorithm classes (sort, search, graph traversal) | Mix Manim (concept) + Live-solve (real run) |
| b1–b3 | Photo/video documentation workflow, schematic capture (KiCad?), and either a stable hardware shooting setup or a "studio" subfolder for B-roll | One-time investment, pays off for every build episode |

## Critical files to be created or generalised

These are the load-bearing components that need to exist for the curriculum to scale. Build them at the season they're first needed, not upfront.

- `src/shared/components/CoordinatePlane.tsx` — generalisation of [NumberLine.tsx](src/shared/components/NumberLine.tsx) to 2D, exposing `mapX, mapY` via context. Mirrors the existing context pattern.
- `src/shared/components/FunctionPlot.tsx` — renders y = f(x) as an animated stroke over a `CoordinatePlane`. Should accept a JS function and a frame range for the draw.
- `src/shared/components/Vector2D.tsx` and later `Vector3D.tsx` — animated arrow primitives. The 2D version can lean on the existing [UnderlineArrow.tsx](src/shared/components/UnderlineArrow.tsx) patterns.
- `src/shared/three/` (new directory at S6) — wraps `@remotion/three` so episode code doesn't import three.js directly.
- `src/shared/blender/` (new directory at S6) — conventions for composited Blender renders (folder layout, frame-rate match, alpha handling).
- `src/shared/components/HexDump.tsx` (S14) — terminal-style hex view, reuses [Terminal.tsx](src/shared/components/Terminal.tsx) aesthetic.
- `python/` (new top-level directory at S2) — Manim scenes, Matplotlib plots, simulation scripts. Organised mirroring `src/episodes/` (e.g. `python/s8e0-derivative-intuition/scene.py`). Renders write to `python/out/` which gets `.gitignore`'d.
- `python/requirements.txt` or `pyproject.toml` (S2) — pinned versions for Manim, Matplotlib, NumPy, SciPy. Add Qiskit at S15.
- `recordings/` (new top-level directory at S14) — raw screen-record MP4s for Live-solve episodes. Probably `.gitignore`'d or pointed at external storage.

Everything else (Terminal, NumberLine, GlowDot, SceneDefs, theme tokens) stays as-is.

## Refactors that can wait

Don't pre-emptively refactor for hypothetical needs. Specifically:

- The current `episodes/s0e*` folder structure is fine — no need to introduce `series/`, `topics/`, or any further nesting until you actually hit naming collisions.
- The exporter `episode.tsx` `<Series>` pattern works — keep using it.
- Don't migrate to a CMS / data-driven episode registry. The flat compositions in [Root.tsx](src/Root.tsx) are readable and grep-able.

## Verification

This plan is a roadmap, not code, so "verification" means iterating on it with you, not running tests. Concretely:

1. Read the plan end-to-end and flag any season ordering you'd swap, any topic missing, or any prerequisite you think I've over- or under-estimated.
2. Pick the **next** season-or-interstitial to author (likely `s0e3` subtraction, or an interstitial `i-pythagoras` if you'd rather pivot now to set up S1).
3. When that pick is locked in, we draft an episode-level plan for it as a separate task.

## Open questions to resolve before authoring

These don't block writing the plan but will need answers before specific seasons start:

1. **Naming overflow at S10+.** Once seasons cross 9, the `v0.E.V` slot label needs revisiting — do you bump to `v1.0.0` and start over per series, or extend the version pattern? Resolve before S10.
2. **Hardware budget & cadence.** Build-log episodes need real money + bench time. Roughly when do you want `b0` to start filming?
3. **Algorithms — early drip vs. late synthesis.** Plan above assumes both (interstitials throughout, then S17 as synthesis). Confirm or override.
4. **Manim flavour.** Manim Community Edition (well-supported, modern) vs ManimGL (3Blue1Brown's own, less stable but cutting-edge). Decide before S3.
5. **Python ↔ Remotion handoff format.** PNG sequence (best quality, easy alpha) vs MP4 (smaller files, faster). Affects `python/out/` conventions.
6. **Live-solve episode pacing.** Real algorithm runs can be slow. Decide: real-time vs sped-up vs interactive narration over the run. Resolve before first live-solve episode (around S14).
