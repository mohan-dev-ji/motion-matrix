import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Title } from "./scenes/Title";
import { ObviousHalves } from "./scenes/ObviousHalves";
import { UnobviousHalves } from "./scenes/UnobviousHalves";
import { AllCombinations } from "./scenes/AllCombinations";
import { PentagonTitle } from "./scenes/PentagonTitle";
import { PentagonObvious } from "./scenes/PentagonObvious";
import { PentagonUnobvious } from "./scenes/PentagonUnobvious";
import { PentagonCombinations } from "./scenes/PentagonCombinations";
import { HexagonTitle } from "./scenes/HexagonTitle";
import { HexagonObvious } from "./scenes/HexagonObvious";
import { HexagonUnobvious } from "./scenes/HexagonUnobvious";
import { HexagonCombinations } from "./scenes/HexagonCombinations";

// ─── Circle ────────────────────────────────────────────────────────────────────
const TITLE            = 120; // 4s
const OBVIOUS_HALVES   = 480; // 16s — 4 combos × 90f + 60f intro
const UNOBVIOUS_HALVES = 270; // 9s  — 2 combos × 90f + 30f pause
const ALL_COMBINATIONS = 300; // 10s — grid + formula

// ─── Pentagon ──────────────────────────────────────────────────────────────────
const PENTAGON_TITLE        =  90; // 3s
const PENTAGON_OBVIOUS      = 510; // 17s — 5 combos × 90f + 60f intro
const PENTAGON_UNOBVIOUS    = 480; // 16s — narration-heavy, 4 subtitle beats
const PENTAGON_COMBINATIONS = 330; // 11s — grid + formula

// ─── Hexagon ───────────────────────────────────────────────────────────────────
const HEXAGON_TITLE        =  90; // 3s
const HEXAGON_OBVIOUS      = 510; // 17s — 6 combos × 75f + 60f intro
const HEXAGON_UNOBVIOUS    = 660; // 22s — 14 combos cycle, 5 subtitle beats
const HEXAGON_COMBINATIONS = 420; // 14s — grid + formula

// ─── Audio ──────────────────────────────────────────────────────────────────────
// True peak: -18.3 dBFS | Integrated: -40.0 LUFS | Target: -23 LUFS (+17 dB = ×7)
const AUDIO_FILE          = "001-halves-comm.m4a";
const AUDIO_START_OFFSET  = 0;    // frames to delay audio start (0 = immediate)
const AUDIO_VOLUME        = 7;    // linear multiplier — ×7 ≈ +17 dB → peaks ~-1.3 dBFS
const AUDIO_TRIM_BEFORE   = 120;  // frames to skip from the start of the audio file

// ─── Music ──────────────────────────────────────────────────────────────────────
// Generated with Stable Audio 2.5
const MUSIC_FILE          = "001-replicate-prediction-anxnps3ashrmw0cwep6avs430c.mp3";
const MUSIC_START_OFFSET  = 0;    // frames to delay music start
const MUSIC_VOLUME        = 0.12; // background bed — tune relative to voiceover

// ─── Cumulative start times ─────────────────────────────────────────────────────
const S = {
  title:              0,
  obviousHalves:      TITLE,
  unobviousHalves:    TITLE + OBVIOUS_HALVES,
  allCombinations:    TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES,

  pentagonTitle:      TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES + ALL_COMBINATIONS,
  pentagonObvious:    TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES + ALL_COMBINATIONS + PENTAGON_TITLE,
  pentagonUnobvious:  TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES + ALL_COMBINATIONS + PENTAGON_TITLE + PENTAGON_OBVIOUS,
  pentagonAll:        TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES + ALL_COMBINATIONS + PENTAGON_TITLE + PENTAGON_OBVIOUS + PENTAGON_UNOBVIOUS,

  hexagonTitle:       TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES + ALL_COMBINATIONS + PENTAGON_TITLE + PENTAGON_OBVIOUS + PENTAGON_UNOBVIOUS + PENTAGON_COMBINATIONS,
  hexagonObvious:     TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES + ALL_COMBINATIONS + PENTAGON_TITLE + PENTAGON_OBVIOUS + PENTAGON_UNOBVIOUS + PENTAGON_COMBINATIONS + HEXAGON_TITLE,
  hexagonUnobvious:   TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES + ALL_COMBINATIONS + PENTAGON_TITLE + PENTAGON_OBVIOUS + PENTAGON_UNOBVIOUS + PENTAGON_COMBINATIONS + HEXAGON_TITLE + HEXAGON_OBVIOUS,
  hexagonAll:         TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES + ALL_COMBINATIONS + PENTAGON_TITLE + PENTAGON_OBVIOUS + PENTAGON_UNOBVIOUS + PENTAGON_COMBINATIONS + HEXAGON_TITLE + HEXAGON_OBVIOUS + HEXAGON_UNOBVIOUS,
};

export const Episode001: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* ── Audio ── */}
      <Sequence from={AUDIO_START_OFFSET}>
        <Audio
          src={staticFile(AUDIO_FILE)}
          volume={AUDIO_VOLUME}
          trimBefore={AUDIO_TRIM_BEFORE}
        />
      </Sequence>

      {/* ── Music ── */}
      <Sequence from={MUSIC_START_OFFSET}>
        <Audio
          src={staticFile(MUSIC_FILE)}
          volume={MUSIC_VOLUME}
        />
      </Sequence>

      {/* ── Circle ── */}
      <Sequence from={S.title} durationInFrames={TITLE}>
        <Title />
      </Sequence>
      <Sequence from={S.obviousHalves} durationInFrames={OBVIOUS_HALVES}>
        <ObviousHalves />
      </Sequence>
      <Sequence from={S.unobviousHalves} durationInFrames={UNOBVIOUS_HALVES}>
        <UnobviousHalves />
      </Sequence>
      <Sequence from={S.allCombinations} durationInFrames={ALL_COMBINATIONS}>
        <AllCombinations />
      </Sequence>

      {/* ── Pentagon ── */}
      <Sequence from={S.pentagonTitle} durationInFrames={PENTAGON_TITLE}>
        <PentagonTitle />
      </Sequence>
      <Sequence from={S.pentagonObvious} durationInFrames={PENTAGON_OBVIOUS}>
        <PentagonObvious />
      </Sequence>
      <Sequence from={S.pentagonUnobvious} durationInFrames={PENTAGON_UNOBVIOUS}>
        <PentagonUnobvious />
      </Sequence>
      <Sequence from={S.pentagonAll} durationInFrames={PENTAGON_COMBINATIONS}>
        <PentagonCombinations />
      </Sequence>

      {/* ── Hexagon ── */}
      <Sequence from={S.hexagonTitle} durationInFrames={HEXAGON_TITLE}>
        <HexagonTitle />
      </Sequence>
      <Sequence from={S.hexagonObvious} durationInFrames={HEXAGON_OBVIOUS}>
        <HexagonObvious />
      </Sequence>
      <Sequence from={S.hexagonUnobvious} durationInFrames={HEXAGON_UNOBVIOUS}>
        <HexagonUnobvious />
      </Sequence>
      <Sequence from={S.hexagonAll} durationInFrames={HEXAGON_COMBINATIONS}>
        <HexagonCombinations />
      </Sequence>
    </AbsoluteFill>
  );
};
