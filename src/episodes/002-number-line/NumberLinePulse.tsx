import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const BG = "#070A16";
const LINE = "#E6F1FF";
const AMBER = "#FBBF24";
const GREEN = "#34D399";
const GREY = "#9CA3AF";
const PHOSPHOR = "#50FA7B";

const rangeMin = -10;
const rangeMax = 10;

const mapX = (value: number, width: number) => {
	const progress = (value - rangeMin) / (rangeMax - rangeMin);
	return 120 + progress * (width - 240);
};

export const NumberLinePulse: React.FC = () => {
	const frame = useCurrentFrame();
	const { width, height, fps } = useVideoConfig();

	// Line draws in 90→150 (after the "load number_line" command finishes typing)
	const lineX2 = interpolate(frame, [90, 150], [80, width - 80], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.bezier(0.85, 0, 0.15, 1),
	});

	// Line opacity ramps up alongside the line draw
	const lineOpacity = interpolate(frame, [90, 100], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Glow fades up at frame 210 — the same moment "number_line loaded successfully" prints
	const glowOpacity = interpolate(frame, [210, 220], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Smooth sine pulse — one full cycle every 60 frames (2s at 30fps)
	const pulse = (Math.sin((frame / 60) * Math.PI * 2) + 1) / 2;

	const cy = height * 0.72;
	const zeroX = mapX(0, width);
	const targetX = mapX(-7, width);

	// Retro terminal layout (top half, centered)
	const termW = width * 0.62;
	const termH = height * 0.34;
	const termX = (width - termW) / 2;
	const termY = height * 0.13;
	// Terminal animates in: fade + slight scale-up over the first second
	const termOpacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const termScale = interpolate(frame, [0, 30], [0.94, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	// Blinking cursor (every ~0.5s)
	const cursorOn = Math.floor(frame / 15) % 2 === 0;

	// Terminal sequence — series0 ep1 (v0.0.1). Total runtime: 15s (450 frames).
	// Each row appears at `start`. Rows with `typed` reveal characters one by
	// one between `from` and `to` (after the `prefix` is shown instantly).
	const PROMPT = "motiomatrix@v.0.0.1 ~ %";
	const termRows: Array<{
		start: number;
		prefix: string;
		typed?: { text: string; from: number; to: number };
		dim?: boolean;
	}> = [
		// 1) Prompt + typed "load" command. Prompt visible from frame 0; typing 30→90.
		{
			start: 0,
			prefix: `${PROMPT} `,
			typed: { text: "load number_line range(-10..10)", from: 30, to: 90 },
		},
		// 2) System output — fires when the glow appears at 0.
		{ start: 210, prefix: "number_line loaded successfully", dim: true },
		// 3) Prompt + typed "seek -7" command.
		{
			start: 240,
			prefix: `${PROMPT} `,
			typed: { text: "seek -7", from: 270, to: 300 },
		},
		// 4) System output — fires when the glow arrives at -7 (turns green).
		{ start: 345, prefix: "target found: -7", dim: true },
	];

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

					{/* Horizontal scanlines for the CRT terminal */}
					<pattern
						id="scanlines"
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

					{/* Gradient mask: terminal fades from solid (top) to transparent (bottom) */}
					<linearGradient id="termGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="white" stopOpacity="1" />
						<stop offset="65%" stopColor="white" stopOpacity="1" />
						<stop offset="100%" stopColor="white" stopOpacity="0" />
					</linearGradient>
					<mask id="termFadeMask" maskUnits="userSpaceOnUse">
						<rect
							x={termX - 20}
							y={termY - 20}
							width={termW + 40}
							height={termH + 40}
							fill="url(#termGrad)"
						/>
					</mask>

					{/* Gradient mask: number-line section fades in from the top edge */}
					<linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="white" stopOpacity="0" />
						<stop offset="22%" stopColor="white" stopOpacity="1" />
						<stop offset="100%" stopColor="white" stopOpacity="1" />
					</linearGradient>
					<mask id="lineFadeMask" maskUnits="userSpaceOnUse">
						<rect
							x="0"
							y={height * 0.5}
							width={width}
							height={height * 0.5}
							fill="url(#lineGrad)"
						/>
					</mask>
				</defs>

				{/* Number-line section (bottom half) — wrapped in a top-edge fade mask
				    so the section softly emerges into the terminal area above. */}
				<g mask="url(#lineFadeMask)">
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
					// Begin fading ticks the moment the line finishes drawing (frame 150).
					const ticksStart = 150;
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
				</g>

				{/* Retro CRT terminal — top half, centered. Animates in with fade + scale,
				    then blends downward via gradient mask into the BG. */}
				<g
					mask="url(#termFadeMask)"
					opacity={termOpacity}
					transform={`translate(${termX + termW / 2} ${termY + termH / 2}) scale(${termScale}) translate(${-(termX + termW / 2)} ${-(termY + termH / 2)})`}
				>
					{/* Bezel / outer frame */}
					<rect
						x={termX - 8}
						y={termY - 8}
						width={termW + 16}
						height={termH + 16}
						rx={18}
						fill="#0c0f1a"
						stroke={PHOSPHOR}
						strokeOpacity={0.25}
						strokeWidth={2}
					/>
					{/* Screen interior */}
					<rect
						x={termX}
						y={termY}
						width={termW}
						height={termH}
						rx={10}
						fill="#040a08"
					/>
					{/* Phosphor glow vignette */}
					<rect
						x={termX}
						y={termY}
						width={termW}
						height={termH}
						rx={10}
						fill={PHOSPHOR}
						opacity={0.04}
					/>
					{/* Terminal text content — driven by termRows schedule. */}
					<g
						style={{
							fontFamily:
								"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
						}}
					>
						{termRows.map((row, idx) => {
							if (frame < row.start) return null;

							// Reveal typed text character by character.
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

							// Cursor sits on the latest visible row, blinking.
							const nextRow = termRows[idx + 1];
							const isCurrent = !nextRow || frame < nextRow.start;
							const showCursor = isCurrent && cursorOn;

							const lineY = termY + 50 + idx * 42;
							return (
								<text
									key={idx}
									x={termX + 28}
									y={lineY}
									fill={PHOSPHOR}
									fontSize={24}
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
					{/* Scanline overlay */}
					<rect
						x={termX}
						y={termY}
						width={termW}
						height={termH}
						rx={10}
						fill="url(#scanlines)"
					/>
				</g>

			</svg>
		</AbsoluteFill>
	);
};
