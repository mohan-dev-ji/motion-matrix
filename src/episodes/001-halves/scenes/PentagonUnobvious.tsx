import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { SlicedShape } from "../../../shared/components/SlicedShape";
import { COLORS } from "../../../shared/utils/colors";

// Non-adjacent pairs — the less obvious two-fifths
const UNOBVIOUS: number[][] = [
  [0, 2],
  [0, 3],
  [1, 3],
  [1, 4],
  [2, 4],
];

const SHOW_DURATION = 72; // 2.4 seconds each
const COMBO_START = 30;

export const PentagonUnobvious: React.FC = () => {
  const frame = useCurrentFrame();

  let shadedSlices: number[] = [];
  let fillOpacity = 0;

  if (frame >= COMBO_START) {
    const comboFrame = frame - COMBO_START;
    const comboIndex = Math.min(
      Math.floor(comboFrame / SHOW_DURATION),
      UNOBVIOUS.length - 1,
    );
    const frameInCombo = comboFrame % SHOW_DURATION;

    shadedSlices = UNOBVIOUS[comboIndex];
    const isLastCombo = comboIndex === UNOBVIOUS.length - 1;
    const pastFirstBlock = comboFrame >= (comboIndex + 1) * SHOW_DURATION;

    if (isLastCombo && pastFirstBlock) {
      fillOpacity = 1;
    } else {
      const fadeIn = interpolate(frameInCombo, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      const fadeOut = interpolate(
        frameInCombo,
        [SHOW_DURATION - 20, SHOW_DURATION],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      fillOpacity = isLastCombo ? fadeIn : Math.min(fadeIn, fadeOut);
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AbsoluteFill className="flex items-center justify-center">
        <SlicedShape
          type="polygon"
          sliceCount={5}
          shadedSlices={shadedSlices}
          size={400}
          fillColor={COLORS.fill}
          fillOpacity={fillOpacity}
          strokeColor={COLORS.outline}
          showDividers
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
