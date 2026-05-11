import React from "react";
import { Audio, Series, staticFile } from "remotion";

// Background music. Tune the volume down once narration is layered in post —
// 0.6 is a sensible starting point for a music-only mix.
const MUSIC_FILE = "music/s0e1.mp3";
const MUSIC_VOLUME = 0.6;
import {
	AddMinus3Plus8,
	ADD_MINUS3_PLUS8_DURATION,
} from "./v0.1.1-add-minus3-plus8";
import { Add7Minus3, ADD_7_MINUS3_DURATION } from "./v0.1.2-add-7-minus3";
import {
	AddMinus8Plus6,
	ADD_MINUS8_PLUS6_DURATION,
} from "./v0.1.3-add-minus8-plus6";
import {
	Add12Minus19,
	ADD_12_MINUS_19_DURATION,
} from "./v0.1.4-add-12-minus19";
import {
	AddMinus14Plus11,
	ADD_MINUS14_PLUS11_DURATION,
} from "./v0.1.5-add-minus14-plus11";
import { Add6Plus8, ADD_6_PLUS8_DURATION } from "./v0.1.6-add-6-plus8";
import {
	AddMinus18Minus26,
	ADD_MINUS18_MINUS_26_DURATION,
} from "./v0.1.7-add-minus18-minus26";
import {
	AddMinus27Plus41,
	ADD_MINUS27_PLUS41_DURATION,
} from "./v0.1.8-add-minus27-plus41";
import {
	Add32Minus39,
	ADD_32_MINUS39_DURATION,
} from "./v0.1.9-add-32-minus39";

type EpisodeClip = { component: React.FC; durationInFrames: number };

// 3 variations × 3 number-line ranges = 9 versions.
const clips: EpisodeClip[] = [
	{ component: AddMinus3Plus8, durationInFrames: ADD_MINUS3_PLUS8_DURATION },
	{ component: Add7Minus3, durationInFrames: ADD_7_MINUS3_DURATION },
	{ component: AddMinus8Plus6, durationInFrames: ADD_MINUS8_PLUS6_DURATION },
	{ component: Add12Minus19, durationInFrames: ADD_12_MINUS_19_DURATION },
	{
		component: AddMinus14Plus11,
		durationInFrames: ADD_MINUS14_PLUS11_DURATION,
	},
	{ component: Add6Plus8, durationInFrames: ADD_6_PLUS8_DURATION },
	{
		component: AddMinus18Minus26,
		durationInFrames: ADD_MINUS18_MINUS_26_DURATION,
	},
	{
		component: AddMinus27Plus41,
		durationInFrames: ADD_MINUS27_PLUS41_DURATION,
	},
	{ component: Add32Minus39, durationInFrames: ADD_32_MINUS39_DURATION },
];

export const Episode1: React.FC = () => (
	<>
		<Audio src={staticFile(MUSIC_FILE)} volume={MUSIC_VOLUME} />
		<Series>
			{clips.map(({ component: Clip, durationInFrames }, i) => (
				<Series.Sequence key={i} durationInFrames={durationInFrames}>
					<Clip />
				</Series.Sequence>
			))}
		</Series>
	</>
);

export const EPISODE_1_DURATION = clips.reduce(
	(sum, c) => sum + c.durationInFrames,
	0,
);
