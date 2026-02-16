import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { SlicedShape } from "../../../shared/components/SlicedShape";
import { COLORS } from "../../../shared/utils/colors";
import { Subtitle } from "../../../shared/components/Subtitle";

// The 2 diagonal pairs — these look "un-obvious"
const UNOBVIOUS: number[][] = [
  [0, 2],
  [1, 3],
];

const SHOW_DURATION = 90; // 3 seconds each

export const UnobviousHalves: React.FC = () => {
  const frame = useCurrentFrame();

  const COMBO_START = 30; // short pause then start showing

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

    // On the last combo, fade in once then hold forever
    const isLastCombo = comboIndex === UNOBVIOUS.length - 1;
    const pastFirstBlock = comboFrame >= (comboIndex + 1) * SHOW_DURATION;

    if (isLastCombo && pastFirstBlock) {
      fillOpacity = 1;
    } else {
      // Fade in over 20 frames, hold, fade out over 20 frames
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
          type="circle"
          sliceCount={4}
          shadedSlices={shadedSlices}
          size={400}
          fillColor={COLORS.fill}
          fillOpacity={fillOpacity}
          strokeColor={COLORS.outline}
          showDividers
        />
      </AbsoluteFill>
      <Subtitle text="And now the un-obvious ones" />
    </AbsoluteFill>
  );
};
