import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../../shared/utils/colors";

export const PentagonTitle: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.background }}
      className="flex items-center justify-center"
    >
      <h1
        style={{
          color: COLORS.text,
          fontSize: 72,
          fontWeight: "bold",
          fontFamily: "system-ui, sans-serif",
          opacity,
        }}
      >
        How to shade two fifths of a pentagon
      </h1>
    </AbsoluteFill>
  );
};
