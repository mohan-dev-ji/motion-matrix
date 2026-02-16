import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../utils/colors";

interface SubtitleProps {
  text: string;
  delay?: number;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text, delay = 0 }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
      }}
    >
      <span
        style={{
          color: COLORS.text,
          fontSize: 42,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "12px 32px",
          borderRadius: 8,
        }}
      >
        {text}
      </span>
    </div>
  );
};
