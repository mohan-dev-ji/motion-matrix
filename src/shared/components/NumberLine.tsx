import React, { createContext, useContext, useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export type NumberLineRange = { min: number; max: number };

export type NumberLineProps = {
	range: NumberLineRange;
	majorEvery?: number;
	cy: number;
	drawFromFrame: number;
	drawDuration: number;
	ticksFromFrame: number;
	ticksDuration: number;
	children?: React.ReactNode;
};

type NumberLineContextValue = {
	mapX: (value: number) => number;
	range: NumberLineRange;
	cy: number;
};

const NumberLineContext = createContext<NumberLineContextValue | null>(null);

export const useNumberLine = (): NumberLineContextValue => {
	const ctx = useContext(NumberLineContext);
	if (!ctx) {
		throw new Error("useNumberLine must be called inside <NumberLine>");
	}
	return ctx;
};

export const NumberLine: React.FC<NumberLineProps> = ({
	range,
	majorEvery = 5,
	cy,
	drawFromFrame,
	drawDuration,
	ticksFromFrame,
	ticksDuration,
	children,
}) => {
	const frame = useCurrentFrame();
	const { width } = useVideoConfig();

	const mapX = useMemo(
		() => (value: number) => {
			const progress = (value - range.min) / (range.max - range.min);
			return 120 + progress * (width - 240);
		},
		[range.min, range.max, width],
	);

	const lineX2 = interpolate(
		frame,
		[drawFromFrame, drawFromFrame + drawDuration],
		[80, width - 80],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.bezier(0.85, 0, 0.15, 1),
		},
	);
	const lineOpacity = interpolate(
		frame,
		[drawFromFrame, drawFromFrame + 10],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const totalTicks = range.max - range.min + 1;

	const contextValue: NumberLineContextValue = { mapX, range, cy };

	return (
		<NumberLineContext.Provider value={contextValue}>
			<g mask="url(#nl-line-fade-mask)">
				<line
					x1={80}
					y1={cy}
					x2={lineX2}
					y2={cy}
					stroke={theme.color.line}
					strokeWidth={4}
					strokeLinecap="round"
					markerEnd="url(#nl-arrow)"
					opacity={lineOpacity}
				/>

				{Array.from({ length: totalTicks }).map((_, i) => {
					const value = range.min + i;
					const isMajor = value % majorEvery === 0;
					const tx = mapX(value);

					const tickStart =
						ticksFromFrame +
						(i / (totalTicks - 1)) * (ticksDuration - 10);
					const tickOpacity = interpolate(
						frame,
						[tickStart, tickStart + 10],
						[0, 1],
						{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
					);

					return (
						<g key={value} opacity={tickOpacity}>
							<line
								x1={tx}
								y1={isMajor ? cy - 14 : cy - 8}
								x2={tx}
								y2={isMajor ? cy + 14 : cy + 8}
								stroke={theme.color.line}
								strokeOpacity={isMajor ? 0.85 : 0.5}
								strokeWidth={4}
							/>
							{isMajor && (
								<text
									x={tx}
									y={cy + 60}
									textAnchor="middle"
									fill={theme.color.line}
									fillOpacity={0.75}
									fontSize={theme.size.tickLabel}
									fontWeight={value === 0 ? 800 : 500}
								>
									{value}
								</text>
							)}
						</g>
					);
				})}

				{children}
			</g>
		</NumberLineContext.Provider>
	);
};
