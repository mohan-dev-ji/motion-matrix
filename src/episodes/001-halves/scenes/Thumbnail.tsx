import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/SpaceGrotesk";
import { SlicedShape } from "../../../shared/components/SlicedShape";
import { COLORS } from "../../../shared/utils/colors";

const { fontFamily } = loadFont("normal", {
  weights: ["500"],
  subsets: ["latin"],
});

const SHAPE_SIZE = 310;

export const Ep001Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Subtle grid overlay for depth */}
      <svg
        style={{ position: "absolute", inset: 0, opacity: 0.04 }}
        width="1280"
        height="720"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 64} y1={0} x2={i * 64} y2={720} stroke="#fff" strokeWidth={1} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 64} x2={1280} y2={i * 64} stroke="#fff" strokeWidth={1} />
        ))}
      </svg>

      {/* Left — circle, obvious half */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: "50%",
          transform: "translateY(-52%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <SlicedShape
          type="circle"
          sliceCount={4}
          shadedSlices={[0, 1]}
          size={SHAPE_SIZE}
          fillColor={COLORS.fill}
          strokeColor={COLORS.outline}
          strokeWidth={2.5}
        />
        <span
          style={{
            color: COLORS.textSecondary,
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          Obvious
        </span>
      </div>

      {/* Centre — equals + fraction */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -54%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        <span style={{ color: COLORS.outline, fontSize: 90, lineHeight: 1, fontWeight: 500 }}>=</span>
        {/* ½ as a stacked fraction */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
          <span style={{ color: COLORS.fill, fontSize: 64, fontWeight: 500, lineHeight: 1 }}>1</span>
          <div style={{ width: 52, height: 3, backgroundColor: COLORS.fill, margin: "4px 0" }} />
          <span style={{ color: COLORS.fill, fontSize: 64, fontWeight: 500, lineHeight: 1 }}>2</span>
        </div>
      </div>

      {/* Right — hexagon, non-obvious half */}
      <div
        style={{
          position: "absolute",
          right: 110,
          top: "50%",
          transform: "translateY(-52%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <SlicedShape
          type="polygon"
          sliceCount={6}
          shadedSlices={[0, 2, 4]}
          size={SHAPE_SIZE}
          fillColor={COLORS.fill}
          strokeColor={COLORS.outline}
          strokeWidth={2.5}
        />
        <span
          style={{
            color: COLORS.fill,
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          Also half
        </span>
      </div>

      {/* Title — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          color: COLORS.text,
          fontSize: 80,
          fontWeight: 500,
          letterSpacing: 12,
          textTransform: "uppercase",
        }}
      >
        Hidden Halves
      </div>

      {/* Episode badge */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 50,
          color: COLORS.textSecondary,
          fontSize: 18,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        EP. 001
      </div>
    </AbsoluteFill>
  );
};
