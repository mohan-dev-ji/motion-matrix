import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { getCombinations } from "../../../shared/utils/combinations";
import { SlicedShape } from "../../../shared/components/SlicedShape";
import { COLORS } from "../../../shared/utils/colors";

// All C(6,3) = 20 combinations — filter out the 6 consecutive (obvious) ones
// A triplet is "consecutive" if all 3 form an unbroken run around the hexagon
function isConsecutive(combo: number[]): boolean {
  const [a, b, c] = combo;
  // Three in a row going forward
  if (b === a + 1 && c === b + 1) return true;
  // Wrap-arounds: [0,4,5] = slices 4,5,0  |  [0,1,5] = slices 5,0,1
  if (a === 0 && b === 4 && c === 5) return true;
  if (a === 0 && b === 1 && c === 5) return true;
  return false;
}

const UNOBVIOUS = getCombinations(6, 3).filter((c) => !isConsecutive(c));
// 14 non-consecutive triplets

const SHOW_DURATION = 40; // 1.3 seconds each — shapes cycle briskly while narration holds
const COMBO_START = 30;

export const HexagonUnobvious: React.FC = () => {
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
      const fadeIn = interpolate(frameInCombo, [0, 15], [0, 1], {
        extrapolateRight: "clamp",
      });
      const fadeOut = interpolate(
        frameInCombo,
        [SHOW_DURATION - 12, SHOW_DURATION],
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
          sliceCount={6}
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
