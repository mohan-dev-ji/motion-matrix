import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { theme } from "../shared/theme";

export type ThumbnailLayoutProps = {
	// Hero text — describes the episode topic.
	title: string;
	// Channel version tag baked into the terminal prompt, e.g. "v.0.0.1".
	versionTag: string;
	// The user-command row (e.g. "seek -7").
	terminalCmd: string;
	// The system-output row (e.g. "target found: -7").
	terminalResult: string;
	// Number-line range shown along the bottom.
	range: { min: number; max: number };
	// Value to highlight with the green dot.
	answerValue: number;
};

// Static thumbnail at 1280×720 — three horizontal zones:
//   Top:    big title text                    y ≈ 130
//   Middle: compact terminal panel            y ≈ 250–420
//   Bottom: faded number line + answer dot    cy ≈ 600
export const ThumbnailLayout: React.FC<ThumbnailLayoutProps> = ({
	title,
	versionTag,
	terminalCmd,
	terminalResult,
	range,
	answerValue,
}) => {
	const { width, height } = useVideoConfig();

	const mapX = (value: number) => {
		const progress = (value - range.min) / (range.max - range.min);
		return 100 + progress * (width - 200);
	};

	const titleY = 130;
	const termW = width - 400;
	const termH = 170;
	const termX = (width - termW) / 2;
	const termY = 250;
	const cy = 600;
	const dotX = mapX(answerValue);

	const prompt = `motiomatrix@${versionTag} ~ %`;

	const ticks: { value: number; x: number; isMajor: boolean }[] = [];
	for (let v = range.min; v <= range.max; v++) {
		ticks.push({ value: v, x: mapX(v), isMajor: v % 5 === 0 });
	}

	return (
		<AbsoluteFill
			style={{ backgroundColor: theme.color.bg, fontFamily: theme.font.sans }}
		>
			<svg width={width} height={height}>
				<defs>
					<marker
						id="tn-arrow"
						markerWidth="8"
						markerHeight="8"
						refX="6"
						refY="4"
						orient="auto"
					>
						<path d="M0,0 L8,4 L0,8 Z" fill={theme.color.line} />
					</marker>
				</defs>

				{/* Title — biggest, brightest element. */}
				<text
					x={width / 2}
					y={titleY}
					textAnchor="middle"
					fill={theme.color.line}
					fontSize={88}
					fontWeight={800}
					style={{ letterSpacing: "0.02em" }}
				>
					{title}
				</text>

				{/* Terminal panel — channel identity. */}
				<g style={{ fontFamily: theme.font.mono }}>
					<rect
						x={termX - 8}
						y={termY - 8}
						width={termW + 16}
						height={termH + 16}
						rx={18}
						fill="#0c0f1a"
						stroke={theme.color.phosphor}
						strokeOpacity={0.25}
						strokeWidth={2}
					/>
					<rect
						x={termX}
						y={termY}
						width={termW}
						height={termH}
						rx={10}
						fill="#040a08"
					/>
					<rect
						x={termX}
						y={termY}
						width={termW}
						height={termH}
						rx={10}
						fill={theme.color.phosphor}
						opacity={0.04}
					/>
					<text
						x={termX + 28}
						y={termY + 55}
						fill={theme.color.phosphor}
						fontSize={28}
						opacity={0.95}
						xmlSpace="preserve"
					>
						{`${prompt} ${terminalCmd}`}
					</text>
					<text
						x={termX + 28}
						y={termY + 110}
						fill={theme.color.phosphor}
						fontSize={28}
						opacity={0.7}
						xmlSpace="preserve"
					>
						{terminalResult}
					</text>
				</g>

				{/* Faded number line — visual context, not the focus. */}
				<g opacity={0.45}>
					<line
						x1={mapX(range.min) - 20}
						y1={cy}
						x2={mapX(range.max) + 20}
						y2={cy}
						stroke={theme.color.line}
						strokeWidth={4}
						strokeLinecap="round"
						markerEnd="url(#tn-arrow)"
					/>
					{ticks.map(({ value, x, isMajor }) => (
						<g key={value}>
							<line
								x1={x}
								y1={isMajor ? cy - 14 : cy - 8}
								x2={x}
								y2={isMajor ? cy + 14 : cy + 8}
								stroke={theme.color.line}
								strokeOpacity={isMajor ? 0.9 : 0.5}
								strokeWidth={4}
							/>
							{isMajor && (
								<text
									x={x}
									y={cy + 50}
									textAnchor="middle"
									fill={theme.color.line}
									fillOpacity={0.85}
									fontSize={26}
									fontWeight={value === 0 ? 800 : 500}
								>
									{value}
								</text>
							)}
						</g>
					))}
				</g>

				{/* Green answer dot — full opacity, draws the eye against the faded line. */}
				<g>
					<circle cx={dotX} cy={cy} r={48} fill={theme.color.green} opacity={0.12} />
					<circle cx={dotX} cy={cy} r={26} fill={theme.color.green} opacity={0.35} />
					<circle cx={dotX} cy={cy} r={12} fill={theme.color.green} />
				</g>

				{/* Answer label above the dot. */}
				<text
					x={dotX}
					y={cy - 36}
					textAnchor="middle"
					fill={theme.color.green}
					fontSize={42}
					fontWeight={700}
				>
					{answerValue}
				</text>
			</svg>
		</AbsoluteFill>
	);
};
