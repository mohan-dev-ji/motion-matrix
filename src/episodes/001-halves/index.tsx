import { AbsoluteFill, Sequence } from "remotion";
import { Title } from "./scenes/Title";
import { ObviousHalves } from "./scenes/ObviousHalves";
import { UnobviousHalves } from "./scenes/UnobviousHalves";
import { AllCombinations } from "./scenes/AllCombinations";

// Scene durations in frames (at 30fps)
const TITLE = 120;              // 4s
const OBVIOUS_HALVES = 480;     // 16s  (draw circle + show 4 combos)
const UNOBVIOUS_HALVES = 270;   // 9s   (show 2 combos)
const ALL_COMBINATIONS = 300;   // 10s  (grid + formula)

export const Episode001: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={TITLE}>
        <Title />
      </Sequence>
      <Sequence from={TITLE} durationInFrames={OBVIOUS_HALVES}>
        <ObviousHalves />
      </Sequence>
      <Sequence from={TITLE + OBVIOUS_HALVES} durationInFrames={UNOBVIOUS_HALVES}>
        <UnobviousHalves />
      </Sequence>
      <Sequence
        from={TITLE + OBVIOUS_HALVES + UNOBVIOUS_HALVES}
        durationInFrames={ALL_COMBINATIONS}
      >
        <AllCombinations />
      </Sequence>
    </AbsoluteFill>
  );
};
