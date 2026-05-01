import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const BG = "#070A16";
const LINE = "#E6F1FF";
const AMBER = "#FBBF24";
const GREEN = "#34D399";
const GREY = "#9CA3AF";

const rangeMin = -10;
const rangeMax = 10;

const mapX = (value: number, width: number) => {
	const progress = (value - rangeMin) / (rangeMax - rangeMin);
	return 120 + progress * (width - 240);
};

export const NumberLinePulse: React.FC = () => {
	const frame = useCurrentFrame();
	const { width, height, fps } = useVideoConfig();

	// Line draws in over 2s with ease-in-out
	const lineX2 = interpolate(frame, [0, fps * 2], [80, width - 80], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.85, 0, 0.15, 1),
	});

	// 10-frame fade-up on the line
	const lineOpacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Glow fades up starting at frame 114
	const glowOpacity = interpolate(frame, [114, 124], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Smooth sine pulse — one full cycle every 60 frames (2s at 30fps)
	const pulse = (Math.sin((frame / 60) * Math.PI * 2) + 1) / 2;

	const cy = height / 2;
	const zeroX = mapX(0, width);
	const targetX = mapX(-7, width);

	// Glow travels from 0 → -6 starting at 10s, over 1.5s with ease
	const travelStart = fps * 10;
	const travelDuration = fps * 1.5;
	const glowX = interpolate(
		frame,
		[travelStart, travelStart + travelDuration],
		[zeroX, targetX],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: Easing.bezier(0.5, 0, 0.15, 1),
		},
	);
	// Color flips from amber → green once the glow arrives at -6
	const glowFill = frame >= travelStart + travelDuration ? GREEN : AMBER;

	// Underline arrow diagram: dashed drop at 0, solid drop at -7, horizontal
	// arrow that grows leftward in sync with the glow.
	const arrowY = cy + 150;
	const dropTop = cy + 80;
	// Dashed drop at 0 fades in 10 frames before the glow starts moving.
	const dashedDropOpacity = interpolate(
		frame,
		[travelStart - 10, travelStart],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	// Solid drop at -7 fades in once the glow arrives.
	const solidDropOpacity = interpolate(
		frame,
		[travelStart + travelDuration, travelStart + travelDuration + 10],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	// Horizontal arrow tip tracks the glow as it travels.
	const arrowTipX = glowX;

	return (
		<AbsoluteFill
			style={{ backgroundColor: BG, fontFamily: "Inter, system-ui, sans-serif" }}
		>
			<svg width={width} height={height}>
				<defs>
					<marker
						id="arrow"
						markerWidth="8"
						markerHeight="8"
						refX="6"
						refY="4"
						orient="auto"
					>
						<path d="M0,0 L8,4 L0,8 Z" fill={LINE} />
					</marker>
					<marker
						id="arrow-grey"
						markerWidth="8"
						markerHeight="8"
						refX="8"
						refY="4"
						orient="auto"
					>
						<path d="M0,0 L8,4 L0,8 Z" fill={GREY} />
					</marker>
				</defs>

				{/* Main line with arrowhead */}
				<line
					x1={80}
					y1={cy}
					x2={lineX2}
					y2={cy}
					stroke={LINE}
					strokeWidth={4}
					strokeLinecap="round"
					markerEnd="url(#arrow)"
					opacity={lineOpacity}
				/>

				{/* Ticks and labels — big ticks + numeric labels at every multiple of 5,
				    small ticks at each integer unit in between. Ticks fade in one by
				    one across 2s, starting once the line has finished drawing at 2s. */}
				{Array.from({ length: rangeMax - rangeMin + 1 }).map((_, i) => {
					// Build one tick per integer from rangeMin..rangeMax (21 ticks for -10..10).
					const value = rangeMin + i;
					// "Major" ticks land on multiples of 5 — these get longer marks + a label.
					const isFive = value % 5 === 0;
					// Convert the numeric value into an x-pixel position on the line.
					const tx = mapX(value, width);

					// --- Staggered fade-in -------------------------------------------------
					// Total number of ticks to spread across the stagger window.
					const totalTicks = rangeMax - rangeMin + 1;
					// Begin fading ticks the moment the line finishes drawing (frame 60 @ 30fps).
					const ticksStart = fps * 2;
					// Spread the staggered starts across a 2-second window.
					const ticksDuration = fps * 2;
					// Each tick's individual start frame: i=0 fires at ticksStart, the last tick
					// fires (ticksDuration - 10) frames later, so the final tick still has 10
					// frames of fade time inside the window.
					const tickStart =
						ticksStart + (i / (totalTicks - 1)) * (ticksDuration - 10);
					// Per-tick opacity ramp from 0 → 1 over 10 frames, clamped at both ends.
					const tickOpacity = interpolate(
						frame,
						[tickStart, tickStart + 10],
						[0, 1],
						{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
					);

					return (
						// Group wraps tick + label so they share one opacity for the fade.
						<g key={value} opacity={tickOpacity}>
							{/* The tick mark itself — taller and thicker on multiples of 5. */}
							<line
								x1={tx}
								y1={isFive ? cy - 14 : cy - 8}
								x2={tx}
								y2={isFive ? cy + 14 : cy + 8}
								stroke={LINE}
								strokeOpacity={isFive ? 0.85 : 0.5}
								strokeWidth={4}
							/>
							{/* Only major ticks get a numeric label below the line. */}
							{isFive && (
								<text
									x={tx}
									y={cy + 60}
									textAnchor="middle"
									fill={LINE}
									fillOpacity={0.75}
									fontSize={35}
									// Bolder weight on zero so the origin reads as the anchor.
									fontWeight={value === 0 ? 800 : 500}
								>
									{value}
								</text>
							)}
						</g>
					);
				})}

				{/* Underline arrow — dashed drop at 0, horizontal arrow following the
				    glow, solid drop at -7 once arrived, with a "-7" label above. */}
				<g opacity={dashedDropOpacity}>
					<line
						x1={zeroX}
						y1={dropTop}
						x2={zeroX}
						y2={arrowY}
						stroke={GREY}
						strokeWidth={4}
						strokeDasharray="6 6"
					/>
				</g>
				<g opacity={solidDropOpacity}>
					<line
						x1={targetX}
						y1={dropTop}
						x2={targetX}
						y2={arrowY}
						stroke={GREY}
						strokeWidth={4}
					/>
				</g>
				{/* Horizontal arrow body: starts at 0, tip follows the glow leftward.
				    Opacity scales with distance traveled so the arrowhead doesn't
				    sit stuck behind the "0" label at zero length. */}
				{frame >= travelStart && (
					<g>
						{/* Short tick at the start point (x=0) to anchor the arrow. */}
						<line
							x1={zeroX}
							y1={arrowY - 6}
							x2={zeroX}
							y2={arrowY + 6}
							stroke={GREY}
							strokeWidth={4}
						/>
						<line
							x1={zeroX}
							y1={arrowY}
							x2={arrowTipX}
							y2={arrowY}
							stroke={GREY}
							strokeWidth={4}
							markerEnd="url(#arrow-grey)"
							opacity={interpolate(
								zeroX - arrowTipX,
								[0, 30],
								[0, 1],
								{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
							)}
						/>
						{/* "-7" label above the arrow center. */}
						<text
							x={(zeroX + arrowTipX) / 2}
							y={arrowY - 14}
							textAnchor="middle"
							fill={GREY}
							fontSize={40

							}
							fontWeight={500}
							opacity={interpolate(
								frame,
								[travelStart + 10, travelStart + 25],
								[0, 1],
								{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
							)}
						>
							-7
						</text>
					</g>
				)}

				{/* Glow layers — outermost to core. Group fades up at frame 114, then
				    travels from 0 to -6 starting at 10s, turning green on arrival. */}
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

				{/* "go to -7" — top left, per-character fade-in over 1s starting at frame 150 */}
				{(() => {
					const text = "Find -7 on the number line";
					const start = 150;
					const totalDuration = fps; // 1 second
					const charFade = 12; // frames each character takes to fade in
					// Stagger across the remaining window so the last char still fully fades in.
					const stagger = (totalDuration - charFade) / (text.length - 1);
					return (
						<text
							x={180}
							y={190}
							textAnchor="start"
							fill={LINE}
							fontSize={60}
							fontWeight={600}
						>
							{text.split("").map((char, i) => {
								const charStart = start + i * stagger;
								const charOpacity = interpolate(
									frame,
									[charStart, charStart + charFade],
									[0, 1],
									{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
								);
								return (
									<tspan key={i} opacity={charOpacity}>
										{char}
									</tspan>
								);
							})}
						</text>
					);
				})()}
			</svg>
		</AbsoluteFill>
	);
};
