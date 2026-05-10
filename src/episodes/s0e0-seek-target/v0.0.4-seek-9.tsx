import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { theme } from "../../shared/theme";
import { SceneDefs } from "../../shared/components/SceneDefs";
import { Terminal } from "../../shared/components/Terminal";
import { NumberLine } from "../../shared/components/NumberLine";
import { GlowDot } from "../../shared/components/GlowDot";
import { UnderlineArrow } from "../../shared/components/UnderlineArrow";

export const SEEK_9_DURATION = 705;

const PROMPT = "motiomatrix@v.0.0.4 ~ %";
const RANGE = { min: -20, max: 20 };
const TARGET = 9;
const TERM = { widthPct: 0.62, heightPct: 0.34, xPct: 0.19, yPct: 0.13 };

const TRAVEL_START = 480;
const TRAVEL_DURATION = 45;
const ANSWER_FRAME = TRAVEL_START + TRAVEL_DURATION;

export const Seek9: React.FC = () => {
	const { width, height } = useVideoConfig();
	const cy = height * 0.72;

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
					<UnderlineArrow
						fromValue={0}
						toValue={TARGET}
						dashedDropFrame={TRAVEL_START - 10}
						solidDropFrame={ANSWER_FRAME}
						arrowGrowFromFrame={TRAVEL_START}
						arrowGrowDuration={TRAVEL_DURATION}
						label={String(TARGET)}
					/>
					<GlowDot
						from={0}
						to={TARGET}
						appearFrame={210}
						travelStartFrame={TRAVEL_START}
						travelDuration={TRAVEL_DURATION}
						restingColor={theme.color.amber}
						arrivedColor={theme.color.green}
					/>
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
							typed: { text: `seek ${TARGET}`, from: 270, to: 300 },
						},
						{
							start: 305,
							prefix: "",
							typed: { text: "Thinking...", from: 305, to: 365 },
							dim: true,
						},
						{
							start: ANSWER_FRAME,
							prefix: `target found: ${TARGET}`,
							dim: true,
						},
					]}
				/>
			</svg>
		</AbsoluteFill>
	);
};
