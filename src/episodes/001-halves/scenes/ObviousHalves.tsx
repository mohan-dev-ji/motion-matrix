import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { SlicedShape } from "../../../shared/components/SlicedShape";
import { COLORS } from "../../../shared/utils/colors";
import { Subtitle } from "../../../shared/components/Subtitle";

// The 4 adjacent pairs — these look like "obvious" halves
const OBVIOUS: number[][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

// How long each combo is shown (frames)
const SHOW_DURATION = 90; // 3 seconds each

export const ObviousHalves: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Circle draws in (0-40)
  const outlineProgress = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Scale entrance
  const scale = spring({ frame, fps, config: { damping: 200 } });

  // Dividers fade in (40-60)
  const dividerOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Combos start at frame 90 (after circle is fully drawn + a pause)
  const COMBO_START = 90;

  // Work out which combo to show
  let shadedSlices: number[] = [];
  let fillOpacity = 0;

  if (frame >= COMBO_START) {
    const comboFrame = frame - COMBO_START;
    const comboIndex = Math.min(
      Math.floor(comboFrame / SHOW_DURATION),
      OBVIOUS.length - 1,
    );
    const frameInCombo = comboFrame % SHOW_DURATION;

    shadedSlices = OBVIOUS[comboIndex];

    // On the last combo, fade in once then hold forever
    const isLastCombo = comboIndex === OBVIOUS.length - 1;
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
        <div style={{ transform: `scale(${scale})` }}>
          <SlicedShape
            type="circle"
            sliceCount={4}
            shadedSlices={shadedSlices}
            size={400}
            fillColor={COLORS.fill}
            fillOpacity={fillOpacity}
            strokeColor={COLORS.outline}
            showDividers={frame >= 40}
            dividerOpacity={dividerOpacity}
            outlineProgress={outlineProgress}
          />
        </div>
      </AbsoluteFill>
      <Subtitle text="Here are the obvious ones" />
    </AbsoluteFill>
  );
};
