import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../../shared/utils/colors";

export const Title: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 30], [0, 1], {
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
          opacity: titleOpacity,
        }}
      >
        How to shade half of a circle
      </h1>
    </AbsoluteFill>
  );
};
