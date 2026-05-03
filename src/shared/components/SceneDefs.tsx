import React from "react";
import { theme } from "../theme";

export type TerminalRect = {
	widthPct: number;
	heightPct: number;
	xPct: number;
	yPct: number;
};

export type SceneDefsProps = {
	width: number;
	height: number;
	term: TerminalRect;
};

export const SceneDefs: React.FC<SceneDefsProps> = ({ width, height, term }) => {
	const termW = width * term.widthPct;
	const termH = height * term.heightPct;
	const termX = width * term.xPct;
	const termY = height * term.yPct;

	return (
		<defs>
			<marker
				id="nl-arrow"
				markerWidth="8"
				markerHeight="8"
				refX="6"
				refY="4"
				orient="auto"
			>
				<path d="M0,0 L8,4 L0,8 Z" fill={theme.color.line} />
			</marker>
			<marker
				id="nl-arrow-grey"
				markerWidth="8"
				markerHeight="8"
				refX="8"
				refY="4"
				orient="auto"
			>
				<path d="M0,0 L8,4 L0,8 Z" fill={theme.color.grey} />
			</marker>

			<pattern
				id="nl-scanlines"
				width="4"
				height="4"
				patternUnits="userSpaceOnUse"
			>
				<rect width="4" height="4" fill="transparent" />
				<line
					x1="0"
					y1="0"
					x2="4"
					y2="0"
					stroke="#000"
					strokeOpacity="0.35"
					strokeWidth="1"
				/>
			</pattern>

			<linearGradient id="nl-term-grad" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="white" stopOpacity="1" />
				<stop offset="65%" stopColor="white" stopOpacity="1" />
				<stop offset="100%" stopColor="white" stopOpacity="0" />
			</linearGradient>
			<mask id="nl-term-fade-mask" maskUnits="userSpaceOnUse">
				<rect
					x={termX - 20}
					y={termY - 20}
					width={termW + 40}
					height={termH + 40}
					fill="url(#nl-term-grad)"
				/>
			</mask>

			<linearGradient id="nl-line-grad" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stopColor="white" stopOpacity="0" />
				<stop offset="22%" stopColor="white" stopOpacity="1" />
				<stop offset="100%" stopColor="white" stopOpacity="1" />
			</linearGradient>
			<mask id="nl-line-fade-mask" maskUnits="userSpaceOnUse">
				<rect
					x="0"
					y={height * 0.5}
					width={width}
					height={height * 0.5}
					fill="url(#nl-line-grad)"
				/>
			</mask>
		</defs>
	);
};
