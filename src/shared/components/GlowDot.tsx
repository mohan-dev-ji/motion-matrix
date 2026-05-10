import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useNumberLine } from "./NumberLine";

export type GlowDotPathPoint = { frame: number; value: number };

export type GlowDotProps = {
	// Simple two-point travel — provide all four:
	from?: number;
	to?: number;
	travelStartFrame?: number;
	travelDuration?: number;
	// OR multi-waypoint path (overrides the simple props when present):
	path?: GlowDotPathPoint[];
	// Common:
	appearFrame: number;
	appearDuration?: number;
	restingColor: string;
	arrivedColor: string;
};

const TRAVEL_EASING = Easing.bezier(0.5, 0, 0.15, 1);

export const GlowDot: React.FC<GlowDotProps> = ({
	from,
	to,
	appearFrame,
	appearDuration = 10,
	travelStartFrame,
	travelDuration,
	path,
	restingColor,
	arrivedColor,
}) => {
	const frame = useCurrentFrame();
	const { mapX, cy } = useNumberLine();

	const glowOpacity = interpolate(
		frame,
		[appearFrame, appearFrame + appearDuration],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const pulse = (Math.sin((frame / 60) * Math.PI * 2) + 1) / 2;

	let glowX: number;
	let arrived: boolean;

	if (path && path.length >= 2) {
		glowX = interpolate(
			frame,
			path.map((p) => p.frame),
			path.map((p) => mapX(p.value)),
			{
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: TRAVEL_EASING,
			},
		);
		arrived = frame >= path[path.length - 1].frame;
	} else if (
		from !== undefined &&
		to !== undefined &&
		travelStartFrame !== undefined &&
		travelDuration !== undefined
	) {
		glowX = interpolate(
			frame,
			[travelStartFrame, travelStartFrame + travelDuration],
			[mapX(from), mapX(to)],
			{
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: TRAVEL_EASING,
			},
		);
		arrived = frame >= travelStartFrame + travelDuration;
	} else {
		throw new Error(
			"GlowDot: provide either `path` (>=2 points) or all of `from`/`to`/`travelStartFrame`/`travelDuration`",
		);
	}

	const glowFill = arrived ? arrivedColor : restingColor;

	return (
		<g opacity={glowOpacity}>
			<circle
				cx={glowX}
				cy={cy}
				r={52 + pulse * 18}
				fill={glowFill}
				opacity={0.05 + pulse * 0.08}
			/>
			<circle
				cx={glowX}
				cy={cy}
				r={28 + pulse * 10}
				fill={glowFill}
				opacity={0.15 + pulse * 0.25}
			/>
			<circle cx={glowX} cy={cy} r={13} fill={glowFill} />
		</g>
	);
};
