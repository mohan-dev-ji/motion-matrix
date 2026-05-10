import React from "react";
import { Series } from "remotion";
import {
	Triple3Minus7Plus6,
	TRIPLE_3_MINUS7_PLUS6_DURATION,
} from "./v0.2.1-triple-3-minus7-plus6";
import {
	TripleMinus2Plus5Minus6,
	TRIPLE_MINUS2_PLUS5_MINUS6_DURATION,
} from "./v0.2.2-triple-minus2-plus5-minus6";
import {
	Triple4Minus9Plus8,
	TRIPLE_4_MINUS9_PLUS8_DURATION,
} from "./v0.2.3-triple-4-minus9-plus8";
import {
	TripleMinus7Plus16Minus12,
	TRIPLE_MINUS7_PLUS16_MINUS12_DURATION,
} from "./v0.2.4-triple-minus7-plus16-minus12";
import {
	Triple11Minus18Plus5,
	TRIPLE_11_MINUS18_PLUS5_DURATION,
} from "./v0.2.5-triple-11-minus18-plus5";
import {
	TripleMinus16Plus9Minus4,
	TRIPLE_MINUS16_PLUS9_MINUS4_DURATION,
} from "./v0.2.6-triple-minus16-plus9-minus4";
import {
	TripleMinus22Plus38Minus29,
	TRIPLE_MINUS22_PLUS38_MINUS29_DURATION,
} from "./v0.2.7-triple-minus22-plus38-minus29";
import {
	Triple31Minus47Plus18,
	TRIPLE_31_MINUS47_PLUS18_DURATION,
} from "./v0.2.8-triple-31-minus47-plus18";
import {
	TripleMinus33Plus44Minus19,
	TRIPLE_MINUS33_PLUS44_MINUS19_DURATION,
} from "./v0.2.9-triple-minus33-plus44-minus19";

type EpisodeClip = { component: React.FC; durationInFrames: number };

// 3 variations × 3 number-line ranges = 9 versions.
const clips: EpisodeClip[] = [
	{
		component: Triple3Minus7Plus6,
		durationInFrames: TRIPLE_3_MINUS7_PLUS6_DURATION,
	},
	{
		component: TripleMinus2Plus5Minus6,
		durationInFrames: TRIPLE_MINUS2_PLUS5_MINUS6_DURATION,
	},
	{
		component: Triple4Minus9Plus8,
		durationInFrames: TRIPLE_4_MINUS9_PLUS8_DURATION,
	},
	{
		component: TripleMinus7Plus16Minus12,
		durationInFrames: TRIPLE_MINUS7_PLUS16_MINUS12_DURATION,
	},
	{
		component: Triple11Minus18Plus5,
		durationInFrames: TRIPLE_11_MINUS18_PLUS5_DURATION,
	},
	{
		component: TripleMinus16Plus9Minus4,
		durationInFrames: TRIPLE_MINUS16_PLUS9_MINUS4_DURATION,
	},
	{
		component: TripleMinus22Plus38Minus29,
		durationInFrames: TRIPLE_MINUS22_PLUS38_MINUS29_DURATION,
	},
	{
		component: Triple31Minus47Plus18,
		durationInFrames: TRIPLE_31_MINUS47_PLUS18_DURATION,
	},
	{
		component: TripleMinus33Plus44Minus19,
		durationInFrames: TRIPLE_MINUS33_PLUS44_MINUS19_DURATION,
	},
];

export const Episode2: React.FC = () => (
	<Series>
		{clips.map(({ component: Clip, durationInFrames }, i) => (
			<Series.Sequence key={i} durationInFrames={durationInFrames}>
				<Clip />
			</Series.Sequence>
		))}
	</Series>
);

export const EPISODE_2_DURATION = clips.reduce(
	(sum, c) => sum + c.durationInFrames,
	0,
);
