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
import { Subtitle } from "../../../shared/components/Subtitle";

const allCombos = getCombinations(4, 2);

export const AllCombinations: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Each small circle springs in one by one, 15 frames apart
  const getItemScale = (index: number) => {
    const delay = index * 15;
    if (frame < delay) return 0;
    return spring({
      frame: frame - delay,
      fps,
      config: { damping: 200 },
    });
  };

  // Formula fades in after all circles have appeared
  const formulaDelay = allCombos.length * 15 + 30;
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
          {/* 2x3 grid of all combinations */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {allCombos.map((combo, i) => (
              <div
                key={i}
                style={{ transform: `scale(${getItemScale(i)})` }}
              >
                <SlicedShape
                  type="circle"
                  sliceCount={4}
                  shadedSlices={combo}
                  size={160}
                  fillColor={COLORS.fill}
                  strokeColor={COLORS.outline}
                />
              </div>
            ))}
          </div>

          {/* Formula */}
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
              6 combinations
            </p>
            <p
              style={{
                color: COLORS.textSecondary,
                fontSize: 32,
                marginTop: 12,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              4 slices, choose 2 → C(4, 2) = 6
            </p>
          </div>
        </div>
      </AbsoluteFill>
      <Subtitle text="All the ways to shade half of a circle" delay={20} />
    </AbsoluteFill>
  );
};
