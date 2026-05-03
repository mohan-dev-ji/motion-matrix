import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { useNumberLine } from "./NumberLine";

export type UnderlineArrowProps = {
	fromValue: number;
	toValue: number;
	arrowOffset?: number;
	dropTopOffset?: number;
	dashedDropFrame: number;
	solidDropFrame: number;
	arrowGrowFromFrame: number;
	arrowGrowDuration: number;
	label: string;
};

export const UnderlineArrow: React.FC<UnderlineArrowProps> = ({
	fromValue,
	toValue,
	arrowOffset = 150,
	dropTopOffset = 80,
	dashedDropFrame,
	solidDropFrame,
	arrowGrowFromFrame,
	arrowGrowDuration,
	label,
}) => {
	const frame = useCurrentFrame();
	const { mapX, cy } = useNumberLine();

	const arrowY = cy + arrowOffset;
	const dropTop = cy + dropTopOffset;
	const fromX = mapX(fromValue);
	const toX = mapX(toValue);

	const dashedDropOpacity = interpolate(
		frame,
		[dashedDropFrame, dashedDropFrame + 10],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const solidDropOpacity = interpolate(
		frame,
		[solidDropFrame, solidDropFrame + 10],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	const arrowTipX = interpolate(
		frame,
		[arrowGrowFromFrame, arrowGrowFromFrame + arrowGrowDuration],
		[fromX, toX],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.bezier(0.5, 0, 0.15, 1),
		},
	);

	return (
		<>
			<g opacity={dashedDropOpacity}>
				<line
					x1={fromX}
					y1={dropTop}
					x2={fromX}
					y2={arrowY}
					stroke={theme.color.grey}
					strokeWidth={4}
					strokeDasharray="6 6"
				/>
			</g>
			<g opacity={solidDropOpacity}>
				<line
					x1={toX}
					y1={dropTop}
					x2={toX}
					y2={arrowY}
					stroke={theme.color.grey}
					strokeWidth={4}
				/>
			</g>
			{frame >= arrowGrowFromFrame && (
				<g>
					<line
						x1={fromX}
						y1={arrowY - 6}
						x2={fromX}
						y2={arrowY + 6}
						stroke={theme.color.grey}
						strokeWidth={4}
					/>
					<line
						x1={fromX}
						y1={arrowY}
						x2={arrowTipX}
						y2={arrowY}
						stroke={theme.color.grey}
						strokeWidth={4}
						markerEnd="url(#nl-arrow-grey)"
						opacity={interpolate(
							Math.abs(fromX - arrowTipX),
							[0, 30],
							[0, 1],
							{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
						)}
					/>
					<text
						x={(fromX + arrowTipX) / 2}
						y={arrowY - 14}
						textAnchor="middle"
						fill={theme.color.grey}
						fontSize={theme.size.arrowLabel}
						fontWeight={500}
						opacity={interpolate(
							frame,
							[arrowGrowFromFrame + 10, arrowGrowFromFrame + 25],
							[0, 1],
							{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
						)}
					>
						{label}
					</text>
				</g>
			)}
		</>
	);
};
