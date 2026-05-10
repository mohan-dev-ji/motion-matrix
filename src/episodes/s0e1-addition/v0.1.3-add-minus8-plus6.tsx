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

export const ADD_MINUS8_PLUS6_DURATION = 840;

const PROMPT = "motiomatrix@v.0.1.3 ~ %";
const RANGE = { min: -10, max: 10 };
const START = -8;
const ADDEND = 6;
const ANSWER = START + ADDEND;
const TERM = { widthPct: 0.62, heightPct: 0.34, xPct: 0.19, yPct: 0.13 };

// ── Timeline ─────────────────────────────────────────────────────────────
// 0–300     setup (load, line, ticks, type "find -3+8")
// 305–365   "Thinking..." types in
// 305–480   6s "thinking" pause for the viewer
// 465       dashed drop at 0 fades in (origin marker)
// 480–540   ⬅ GLOW TRAVELS 0 → -3 (2s) + upper arrow grows
// 540–555   dashed drop at -3 fades in (transition connector)
// 560–650   ➡ GLOW TRAVELS -3 → +5 (3s) + lower arrow grows
// 650       solid drop + glow turns green + answer label fades in
// 660       "result: 5" prints
// 660–840   6s hang on the answer
const TYPING_END = 300;
const THINKING_PAUSE = 180; // 6s @ 30fps
const ORIGIN_DROP_FRAME = TYPING_END + THINKING_PAUSE - 15; // 465
const PHASE1_START = TYPING_END + THINKING_PAUSE; // 480
const PHASE1_END = PHASE1_START + 60; // 540
const TRANSITION_START = PHASE1_END; // 540
const PHASE2_START = TRANSITION_START + 20; // 560
const PHASE2_END = PHASE2_START + 90; // 650
const RESULT_FRAME = PHASE2_END + 10; // 660

// Render the answer numeral above the dot once it arrives. Lives inside
// <NumberLine> so it can read mapX/cy from context.
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

export const AddMinus8Plus6: React.FC = () => {
	const { width, height } = useVideoConfig();
	// Lift the number line so two stacked arrow rows fit underneath.
	const cy = height * 0.55;

	const addendSigned = ADDEND >= 0 ? `+${ADDEND}` : String(ADDEND);
	const expr = `${START}${ADDEND >= 0 ? `+${ADDEND}` : `+(${ADDEND})`}`;

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
					{/* Upper row — start indicator. Dashed drop at origin (0),
					    leftward arrow tail at 0 → arrowhead at start (-3). */}
					<UnderlineArrow
						fromValue={0}
						toValue={START}
						arrowOffset={150}
						dashedDropFrame={ORIGIN_DROP_FRAME}
						solidDropFrame={0}
						arrowGrowFromFrame={PHASE1_START}
						arrowGrowDuration={PHASE1_END - PHASE1_START}
						label={String(START)}
						showSolidDrop={false}
					/>
					{/* Lower row — addition. Dashed drop at start (-3) becomes the
					    transition connector when the glow arrives there; rightward
					    arrow grows in sync with the second travel; solid drop at
					    answer marks the result. */}
					<UnderlineArrow
						fromValue={START}
						toValue={ANSWER}
						arrowOffset={300}
						dashedDropFrame={TRANSITION_START}
						solidDropFrame={PHASE2_END}
						arrowGrowFromFrame={PHASE2_START}
						arrowGrowDuration={PHASE2_END - PHASE2_START}
						label={addendSigned}
					/>
					<GlowDot
						appearFrame={210}
						path={[
							{ frame: 210, value: 0 },
							{ frame: PHASE1_START, value: 0 },
							{ frame: PHASE1_END, value: START },
							{ frame: PHASE2_START, value: START },
							{ frame: PHASE2_END, value: ANSWER },
						]}
						restingColor={theme.color.amber}
						arrivedColor={theme.color.green}
					/>
					<AnswerLabel value={ANSWER} appearFrame={PHASE2_END} />
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
							prefix: `result: ${ANSWER}`,
							dim: true,
						},
					]}
				/>
			</svg>
		</AbsoluteFill>
	);
};
