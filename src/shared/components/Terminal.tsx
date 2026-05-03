import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export type TerminalRow = {
	start: number;
	prefix: string;
	typed?: { text: string; from: number; to: number };
	dim?: boolean;
};

export type TerminalProps = {
	prompt: string;
	rows: TerminalRow[];
	widthPct: number;
	heightPct: number;
	position: { xPct: number; yPct: number };
	fadeInFrom?: number;
	fadeInDuration?: number;
};

export const Terminal: React.FC<TerminalProps> = ({
	rows,
	widthPct,
	heightPct,
	position,
	fadeInFrom = 0,
	fadeInDuration = 30,
}) => {
	const frame = useCurrentFrame();
	const { width, height } = useVideoConfig();

	const termW = width * widthPct;
	const termH = height * heightPct;
	const termX = width * position.xPct;
	const termY = height * position.yPct;

	const termOpacity = interpolate(
		frame,
		[fadeInFrom, fadeInFrom + fadeInDuration],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const termScale = interpolate(
		frame,
		[fadeInFrom, fadeInFrom + fadeInDuration],
		[0.94, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.out(Easing.cubic),
		},
	);

	const cursorOn = Math.floor(frame / 15) % 2 === 0;

	return (
		<g
			mask="url(#nl-term-fade-mask)"
			opacity={termOpacity}
			transform={`translate(${termX + termW / 2} ${termY + termH / 2}) scale(${termScale}) translate(${-(termX + termW / 2)} ${-(termY + termH / 2)})`}
		>
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
			<g style={{ fontFamily: theme.font.mono }}>
				{rows.map((row, idx) => {
					if (frame < row.start) return null;

					let typedSubstring = "";
					if (row.typed && frame >= row.typed.from) {
						const dur = row.typed.to - row.typed.from;
						const progress = Math.min(
							1,
							Math.max(0, (frame - row.typed.from) / dur),
						);
						typedSubstring = row.typed.text.slice(
							0,
							Math.floor(progress * row.typed.text.length),
						);
					}

					const nextRow = rows[idx + 1];
					const isCurrent = !nextRow || frame < nextRow.start;
					const showCursor = isCurrent && cursorOn;

					const lineY = termY + 50 + idx * 42;
					return (
						<text
							key={idx}
							x={termX + 28}
							y={lineY}
							fill={theme.color.phosphor}
							fontSize={theme.size.terminalText}
							opacity={row.dim ? 0.7 : 0.95}
							xmlSpace="preserve"
						>
							<tspan>{row.prefix}</tspan>
							<tspan>{typedSubstring}</tspan>
							{showCursor ? <tspan>█</tspan> : null}
						</text>
					);
				})}
			</g>
			<rect
				x={termX}
				y={termY}
				width={termW}
				height={termH}
				rx={10}
				fill="url(#nl-scanlines)"
			/>
		</g>
	);
};
