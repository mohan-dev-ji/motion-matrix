import React from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import { theme } from "../../shared/theme";
import { SceneDefs } from "../../shared/components/SceneDefs";
import { Terminal } from "../../shared/components/Terminal";
import { NumberLine, useNumberLine } from "../../shared/components/NumberLine";
import { GlowDot } from "../../shared/components/GlowDot";
import { UnderlineArrow } from "../../shared/components/UnderlineArrow";

export const TRIPLE_4_MINUS9_PLUS8_DURATION = 910;

const PROMPT = "motiomatrix@v.0.2.3 ~ %";
const RANGE = { min: -10, max: 10 };
const A = 4;
const B = -9;
const C = 8;
const POS1 = A;           // 3
const POS2 = A + B;       // -4
const POS3 = A + B + C;   // 2 (final answer)
const TERM = { widthPct: 0.62, heightPct: 0.34, xPct: 0.19, yPct: 0.13 };

// 6s "Thinking..." pause after typing, then three sequential travels with
// 20-frame transitions between, then 6s hang on the answer.
const TYPING_END = 300;
const THINKING_PAUSE = 180;
const ORIGIN_DROP_FRAME = TYPING_END + THINKING_PAUSE - 15; // 465
const PHASE1_START = TYPING_END + THINKING_PAUSE;           // 480
const PHASE1_END = PHASE1_START + 60;                       // 540
const TRANSITION1 = PHASE1_END;                             // 540
const PHASE2_START = TRANSITION1 + 20;                      // 560
const PHASE2_END = PHASE2_START + 60;                       // 620
const TRANSITION2 = PHASE2_END;                             // 620
const PHASE3_START = TRANSITION2 + 20;                      // 640
const PHASE3_END = PHASE3_START + 90;                       // 730 (climax)
const RESULT_FRAME = PHASE3_END + 10;                       // 740

const signed = (n: number): string => (n >= 0 ? `+${n}` : String(n));
const operandInExpr = (n: number): string =>
	n >= 0 ? `+${n}` : `+(${n})`;

const AnswerLabel: React.FC<{ value: number; appearFrame: number }> = ({
	value,
	appearFrame,
}) => {
	const frame = useCurrentFrame();
	const { mapX, cy } = useNumberLine();
	const opacity = interpolate(
		frame,
		[appearFrame, appearFrame + 15],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	return (
		<text
			x={mapX(value)}
			y={cy - 50}
			textAnchor="middle"
			fill={theme.color.green}
			fontSize={theme.size.arrowLabel}
			fontWeight={500}
			opacity={opacity}
		>
			{value}
		</text>
	);
};

export const Triple4Minus9Plus8: React.FC = () => {
	const { width, height } = useVideoConfig();
	const cy = height * 0.55;

	const expr = `${A}${operandInExpr(B)}${operandInExpr(C)}`;

	return (
		<AbsoluteFill
			style={{ backgroundColor: theme.color.bg, fontFamily: theme.font.sans }}
		>
			<svg width={width} height={height}>
				<SceneDefs width={width} height={height} term={TERM} />
				<NumberLine
					range={RANGE}
					cy={cy}
					drawFromFrame={90}
					drawDuration={60}
					ticksFromFrame={150}
					ticksDuration={60}
				>
					{/* Row 1 — first operand (start at 0). */}
					<UnderlineArrow
						fromValue={0}
						toValue={POS1}
						arrowOffset={130}
						dashedDropFrame={ORIGIN_DROP_FRAME}
						solidDropFrame={0}
						arrowGrowFromFrame={PHASE1_START}
						arrowGrowDuration={PHASE1_END - PHASE1_START}
						label={signed(A)}
						showSolidDrop={false}
					/>
					{/* Row 2 — second operand. Dashed connector at POS1 lands during transition. */}
					<UnderlineArrow
						fromValue={POS1}
						toValue={POS2}
						arrowOffset={250}
						dashedDropFrame={TRANSITION1}
						solidDropFrame={0}
						arrowGrowFromFrame={PHASE2_START}
						arrowGrowDuration={PHASE2_END - PHASE2_START}
						label={signed(B)}
						showSolidDrop={false}
					/>
					{/* Row 3 — third operand. Solid drop at the final answer. */}
					<UnderlineArrow
						fromValue={POS2}
						toValue={POS3}
						arrowOffset={370}
						dashedDropFrame={TRANSITION2}
						solidDropFrame={PHASE3_END}
						arrowGrowFromFrame={PHASE3_START}
						arrowGrowDuration={PHASE3_END - PHASE3_START}
						label={signed(C)}
					/>
					<GlowDot
						appearFrame={210}
						path={[
							{ frame: 210, value: 0 },
							{ frame: PHASE1_START, value: 0 },
							{ frame: PHASE1_END, value: POS1 },
							{ frame: PHASE2_START, value: POS1 },
							{ frame: PHASE2_END, value: POS2 },
							{ frame: PHASE3_START, value: POS2 },
							{ frame: PHASE3_END, value: POS3 },
						]}
						restingColor={theme.color.amber}
						arrivedColor={theme.color.green}
					/>
					<AnswerLabel value={POS3} appearFrame={PHASE3_END} />
				</NumberLine>
				<Terminal
					prompt={PROMPT}
					widthPct={TERM.widthPct}
					heightPct={TERM.heightPct}
					position={{ xPct: TERM.xPct, yPct: TERM.yPct }}
					rows={[
						{
							start: 0,
							prefix: `${PROMPT} `,
							typed: {
								text: `load number_line range(${RANGE.min}..${RANGE.max})`,
								from: 30,
								to: 90,
							},
						},
						{
							start: 210,
							prefix: "number_line loaded successfully",
							dim: true,
						},
						{
							start: 240,
							prefix: `${PROMPT} `,
							typed: { text: `find ${expr}`, from: 270, to: 300 },
						},
						{
							start: 305,
							prefix: "",
							typed: { text: "Thinking...", from: 305, to: 365 },
							dim: true,
						},
						{
							start: RESULT_FRAME,
							prefix: `result: ${POS3}`,
							dim: true,
						},
					]}
				/>
			</svg>
		</AbsoluteFill>
	);
};
