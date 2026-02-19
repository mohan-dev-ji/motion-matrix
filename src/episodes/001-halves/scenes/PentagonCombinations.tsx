import {
  AbsoluteFill,
  useCurrentFrame,
  spring,
  interpolate,
  useVideoConfig,
} from "remotion";
import { SlicedShape } from "../../../shared/components/SlicedShape";
import { getCombinations } from "../../../shared/utils/combinations";
import { COLORS } from "../../../shared/utils/colors";

// All C(5,2) = 10 combinations
const allCombos = getCombinations(5, 2);

export const PentagonCombinations: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const getItemScale = (index: number) => {
    const delay = index * 18;
    if (frame < delay) return 0;
    return spring({
      frame: frame - delay,
      fps,
      config: { damping: 200 },
    });
  };

  const formulaDelay = (allCombos.length - 1) * 18 + 45;
  const formulaOpacity = interpolate(
    frame,
    [formulaDelay, formulaDelay + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      <AbsoluteFill className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* 5×2 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 28,
            }}
          >
            {allCombos.map((combo, i) => (
              <div
                key={i}
                style={{ transform: `scale(${getItemScale(i)})` }}
              >
                <SlicedShape
                  type="polygon"
                  sliceCount={5}
                  shadedSlices={combo}
                  size={150}
                  fillColor={COLORS.fill}
                  strokeColor={COLORS.outline}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 48,
              opacity: formulaOpacity,
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: COLORS.text,
                fontSize: 64,
                fontWeight: "bold",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              10 combinations
            </p>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: 32,
                marginTop: 12,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              5 slices, choose 2 → C(5, 2) = 10
            </p>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
