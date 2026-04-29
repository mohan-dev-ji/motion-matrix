import React, {useMemo} from "react";
import {
	AbsoluteFill,
	Easing,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";
import {Audio} from "@remotion/media";

const BG = "#070A16";
const LINE = "#E6F1FF";
const RIGHT = "#FBBF24";
const LEFT = "#22D3EE";
const MINT = "#34D399";
const PURPLE = "#A78BFA";

// Tiny synthetic click wav for tick crossings.
const CLICK_SFX =
	"data:audio/wav;base64,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";

type Question = {
	question: string;
	start: number;
	delta: number;
	explainer: string;
};

const questions: Question[] = [
	{
		question: "Where does -4 live? Left or right of zero?",
		start: 0,
		delta: -4,
		explainer: "Negative numbers live left of zero.",
	},
	{
		question: "Start at -3. Add 7. Where do you land?",
		start: -3,
		delta: 7,
		explainer: "Adding a positive moves right.",
	},
	{
		question: "Start at 5. Add -8. Where do you land?",
		start: 5,
		delta: -8,
		explainer: "Adding a negative moves left.",
	},
];

const FRAMES = {
	intro: 90,
	questionIn: 40,
	pause: 26,
	move: 72,
	equationReveal: 34,
	finishZoom: 36,
	outro: 70,
};

const sceneDuration =
	FRAMES.questionIn +
	FRAMES.pause +
	FRAMES.move +
	FRAMES.equationReveal +
	FRAMES.finishZoom;

const rangeMin = -10;
const rangeMax = 10;
const tickStep = 0.5;

const mapX = (value: number, width: number) => {
	const progress = (value - rangeMin) / (rangeMax - rangeMin);
	return 120 + progress * (width - 240);
};

const TickSounds: React.FC<{
	start: number;
	end: number;
	moveStartFrame: number;
	moveDuration: number;
}> = ({start, end, moveStartFrame, moveDuration}) => {
	const points = useMemo(() => {
		const dir = end >= start ? 1 : -1;
		const arr: number[] = [];
		let current = start;
		while ((dir > 0 && current < end) || (dir < 0 && current > end)) {
			current = Number((current + dir * tickStep).toFixed(3));
			if ((dir > 0 && current <= end) || (dir < 0 && current >= end)) {
				arr.push(current);
			}
		}
		return arr;
	}, [start, end]);

	return (
		<>
			{points.map((p) => {
				const segmentProgress = Math.abs((p - start) / (end - start || 1));
				const from = moveStartFrame + Math.floor(segmentProgress * moveDuration);
				return (
					<Sequence key={`tick-${p}`} from={from} durationInFrames={6}>
						<Audio src={CLICK_SFX} volume={0.18} />
					</Sequence>
				);
			})}
		</>
	);
};

const NumberLineScene: React.FC<{q: Question}> = ({q}) => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();

	const moveStart = FRAMES.questionIn + FRAMES.pause;
	const moveEnd = moveStart + FRAMES.move;
	const eqStart = moveEnd;
	const finishStart = eqStart + FRAMES.equationReveal;

	const moveT = interpolate(frame, [moveStart, moveEnd], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.22, 1, 0.36, 1),
	});

	const startX = mapX(q.start, width);
	const end = q.start + q.delta;
	const endX = mapX(end, width);
	const x = interpolate(moveT, [0, 1], [startX, endX]);
	const yLift = -Math.sin(moveT * Math.PI) * 90;

	const questionOpacity = interpolate(frame, [0, FRAMES.questionIn - 6], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const eqProgress = interpolate(frame, [eqStart, eqStart + FRAMES.equationReveal], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const finishProgress = interpolate(frame, [finishStart, sceneDuration], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const panelScale = interpolate(finishProgress, [0, 1], [1, 1.045]);
	const explainerY = interpolate(finishProgress, [0, 1], [22, 0]);
	const lineDraw = spring({
		frame,
		fps: 30,
		config: {damping: 14, stiffness: 90},
		durationInFrames: 45,
	});

	return (
		<AbsoluteFill style={{backgroundColor: BG, color: "white", fontFamily: "Inter, system-ui, sans-serif"}}>
			<TickSounds
				start={q.start}
				end={end}
				moveStartFrame={moveStart}
				moveDuration={FRAMES.move}
			/>

			<div
				style={{
					position: "absolute",
					top: 88,
					left: 140,
					right: 140,
					padding: "24px 28px",
					borderRadius: 20,
					backgroundColor: "rgba(148,163,184,0.18)",
					border: "1px solid rgba(125,211,252,0.40)",
					backdropFilter: "blur(8px)",
					opacity: questionOpacity,
					fontSize: 52,
					fontWeight: 700,
					letterSpacing: 0.6,
				}}
			>
				{q.question}
			</div>

			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 370,
					height: 280,
					transform: `scale(${panelScale})`,
					transformOrigin: "center center",
				}}
			>
				<svg width={width} height={280}>
					<line
						x1={120}
						y1={145}
						x2={120 + (width - 240) * lineDraw}
						y2={145}
						stroke={LINE}
						strokeWidth={5}
						strokeLinecap="round"
					/>
					{Array.from({length: (rangeMax - rangeMin) * 2 + 1}).map((_, i) => {
						const value = rangeMin + i * 0.5;
						const isWhole = Number.isInteger(value);
						const tx = mapX(value, width);
						return (
							<g key={`tick-${value}`}>
								<line
									x1={tx}
									y1={isWhole ? 132 : 138}
									x2={tx}
									y2={isWhole ? 158 : 152}
									stroke={LINE}
									strokeOpacity={isWhole ? 0.9 : 0.35}
									strokeWidth={isWhole ? 2.5 : 1.5}
								/>
								{isWhole ? (
									<text
										x={tx}
										y={198}
										textAnchor="middle"
										fill={value < 0 ? "#BAE6FD" : "#FEF3C7"}
										fontSize={26}
										fontWeight={value === 0 ? 800 : 600}
									>
										{value}
									</text>
								) : null}
							</g>
						);
					})}

					<path
						d={`M ${startX} 145 Q ${(startX + endX) / 2} 72 ${endX} 145`}
						fill="none"
						stroke={q.delta >= 0 ? RIGHT : LEFT}
						strokeWidth={5}
						strokeLinecap="round"
						strokeDasharray={400}
						strokeDashoffset={400 - 400 * moveT}
						opacity={frame >= moveStart ? 0.95 : 0}
					/>

					<circle cx={x} cy={145 + yLift} r={14} fill="#FFFFFF" opacity={frame >= moveStart ? 1 : 0} />
					<circle cx={x} cy={145 + yLift} r={28} fill="#FFFFFF" opacity={(frame >= moveStart ? 0.24 : 0) * (1 - moveT * 0.2)} />
				</svg>
			</div>

			<div
				style={{
					position: "absolute",
					bottom: 96,
					left: 140,
					right: 140,
					padding: "20px 28px",
					borderRadius: 16,
					backgroundColor: "rgba(15,23,42,0.7)",
					border: "1px solid rgba(125,211,252,0.25)",
					fontSize: 48,
					fontWeight: 700,
					letterSpacing: 0.4,
				}}
			>
				<span style={{opacity: eqProgress > 0 ? 1 : 0}}>
					{q.start} {q.delta >= 0 ? "+" : "-"} {Math.abs(q.delta)} ={" "}
				</span>
				<span style={{color: MINT, opacity: interpolate(eqProgress, [0.55, 0.95], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>
					{end}
				</span>
			</div>

			<div
				style={{
					position: "absolute",
					bottom: 32,
					left: 200,
					right: 200,
					textAlign: "center",
					fontSize: 34,
					color: PURPLE,
					fontWeight: 600,
					opacity: finishProgress,
					transform: `translateY(${explainerY}px)`,
				}}
			>
				{q.explainer}
			</div>
		</AbsoluteFill>
	);
};

const totalDuration = FRAMES.intro + questions.length * sceneDuration + FRAMES.outro;

export const Episode002NumberLine: React.FC = () => {
	const frame = useCurrentFrame();
	const introOpacity = interpolate(frame, [0, 24, FRAMES.intro - 10], [0, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{backgroundColor: BG}}>
			<Sequence durationInFrames={FRAMES.intro}>
				<AbsoluteFill
					style={{
						alignItems: "center",
						justifyContent: "center",
						color: "white",
						fontFamily: "Inter, system-ui, sans-serif",
						opacity: introOpacity,
					}}
				>
					<div style={{fontSize: 72, fontWeight: 800, letterSpacing: 1.2}}>The Number Line</div>
					<div style={{fontSize: 36, marginTop: 18, color: "#BAE6FD"}}>EP002 - Orientation</div>
				</AbsoluteFill>
			</Sequence>

			{questions.map((q, i) => (
				<Sequence
					key={q.question}
					from={FRAMES.intro + i * sceneDuration}
					durationInFrames={sceneDuration}
				>
					<NumberLineScene q={q} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

export const episode002DurationInFrames = totalDuration;
