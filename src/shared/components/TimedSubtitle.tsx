import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../utils/colors";

interface TimedSubtitleEntry {
  frame: number;
  text: string;
}

interface TimedSubtitleProps {
  entries: TimedSubtitleEntry[];
}

export const TimedSubtitle: React.FC<TimedSubtitleProps> = ({ entries }) => {
  const frame = useCurrentFrame();

  // Find the latest entry whose frame has been reached
  let activeIndex = -1;
  for (let i = 0; i < entries.length; i++) {
    if (frame >= entries[i].frame) activeIndex = i;
  }

  if (activeIndex === -1) return null;

  const activeEntry = entries[activeIndex];
  const nextEntry = entries[activeIndex + 1];

  // Fade in over 20 frames from when this entry becomes active
  const fadeIn = interpolate(
    frame,
    [activeEntry.frame, activeEntry.frame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Fade out over 15 frames before the next entry takes over
  const fadeOut = nextEntry
    ? interpolate(frame, [nextEntry.frame - 15, nextEntry.frame], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const opacity = Math.min(fadeIn, fadeOut);

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
        {activeEntry.text}
      </span>
    </div>
  );
};
