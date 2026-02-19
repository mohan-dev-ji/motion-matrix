import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { SlicedShape } from "../../../shared/components/SlicedShape";
import { COLORS } from "../../../shared/utils/colors";

// Consecutive triplets — the "obvious" halves of a hexagon
// These are 3 slices that sit next to each other
const OBVIOUS: number[][] = [
  [0, 1, 2],
  [1, 2, 3],
  [2, 3, 4],
  [3, 4, 5],
  [0, 4, 5], // wraps: slices 4, 5, 0
  [0, 1, 5], // wraps: slices 5, 0, 1
];

const SHOW_DURATION = 75; // 2.5 seconds each
const COMBO_START = 60;

export const HexagonObvious: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hexagon springs in
  const scale = spring({ frame, fps, config: { damping: 200 } });

  // Dividers fade in after shape appears
  const dividerOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
    const isLastCombo = comboIndex === OBVIOUS.length - 1;
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
        <div style={{ transform: `scale(${scale})` }}>
          <SlicedShape
            type="polygon"
            sliceCount={6}
            shadedSlices={shadedSlices}
            size={400}
            fillColor={COLORS.fill}
            fillOpacity={fillOpacity}
            strokeColor={COLORS.outline}
            showDividers={frame >= 30}
            dividerOpacity={dividerOpacity}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
