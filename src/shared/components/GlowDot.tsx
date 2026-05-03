import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useNumberLine } from "./NumberLine";

export type GlowDotProps = {
	from: number;
	to: number;
	appearFrame: number;
	appearDuration?: number;
	travelStartFrame: number;
	travelDuration: number;
	restingColor: string;
	arrivedColor: string;
};

export const GlowDot: React.FC<GlowDotProps> = ({
	from,
	to,
	appearFrame,
	appearDuration = 10,
	travelStartFrame,
	travelDuration,
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

	const glowX = interpolate(
		frame,
		[travelStartFrame, travelStartFrame + travelDuration],
		[mapX(from), mapX(to)],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.bezier(0.5, 0, 0.15, 1),
		},
	);
	const glowFill =
		frame >= travelStartFrame + travelDuration ? arrivedColor : restingColor;

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
