import React from "react";
import { Series } from "remotion";
import { SeekMinus7, SEEK_MINUS_7_DURATION } from "./v0.0.1-seek-minus7";
import { Seek4, SEEK_4_DURATION } from "./v0.0.2-seek-4";
import { SeekMinus3, SEEK_MINUS3_DURATION } from "./v0.0.3-seek-minus3";
import { Seek9, SEEK_9_DURATION } from "./v0.0.4-seek-9";
import { SeekMinus13, SEEK_MINUS13_DURATION } from "./v0.0.5-seek-minus13";
import { Seek17, SEEK_17_DURATION } from "./v0.0.6-seek-17";
import { SeekMinus18, SEEK_MINUS_18_DURATION } from "./v0.0.7-seek-minus18";
import { Seek37, SEEK_37_DURATION } from "./v0.0.8-seek-37";
import { SeekMinus44, SEEK_MINUS44_DURATION } from "./v0.0.9-seek-minus44";

type EpisodeClip = { component: React.FC; durationInFrames: number };

// 3 variations × 3 number-line ranges = 9 versions.
const clips: EpisodeClip[] = [
	{ component: SeekMinus7, durationInFrames: SEEK_MINUS_7_DURATION },
	{ component: Seek4, durationInFrames: SEEK_4_DURATION },
	{ component: SeekMinus3, durationInFrames: SEEK_MINUS3_DURATION },
	{ component: Seek9, durationInFrames: SEEK_9_DURATION },
	{ component: SeekMinus13, durationInFrames: SEEK_MINUS13_DURATION },
	{ component: Seek17, durationInFrames: SEEK_17_DURATION },
	{ component: SeekMinus18, durationInFrames: SEEK_MINUS_18_DURATION },
	{ component: Seek37, durationInFrames: SEEK_37_DURATION },
	{ component: SeekMinus44, durationInFrames: SEEK_MINUS44_DURATION },
];

export const Episode0: React.FC = () => (
	<Series>
		{clips.map(({ component: Clip, durationInFrames }, i) => (
			<Series.Sequence key={i} durationInFrames={durationInFrames}>
				<Clip />
			</Series.Sequence>
		))}
	</Series>
);

export const EPISODE_0_DURATION = clips.reduce(
	(sum, c) => sum + c.durationInFrames,
	0,
);
