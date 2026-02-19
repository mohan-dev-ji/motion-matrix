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

// All C(6,3) = 20 combinations
const allCombos = getCombinations(6, 3);

export const HexagonCombinations: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const getItemScale = (index: number) => {
    const delay = index * 10;
    if (frame < delay) return 0;
    return spring({
      frame: frame - delay,
      fps,
      config: { damping: 200 },
    });
  };

  const formulaDelay = (allCombos.length - 1) * 10 + 45;
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
          {/* 5×4 grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 20,
            }}
          >
            {allCombos.map((combo, i) => (
              <div
                key={i}
                style={{ transform: `scale(${getItemScale(i)})` }}
              >
                <SlicedShape
                  type="polygon"
                  sliceCount={6}
                  shadedSlices={combo}
                  size={130}
                  fillColor={COLORS.fill}
                  strokeColor={COLORS.outline}
                />
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 40,
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
              20 combinations
            </p>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: 32,
                marginTop: 12,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              6 slices, choose 3 → C(6, 3) = 20
            </p>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
