import React from "react";
import { Series } from "remotion";
import { SeekMinus7 } from "./F01-seek-target/v0.0.1-seek-minus7";
import { Seek9 } from "./F01-seek-target/v0.0.2-seek-9";
import { SeekMinus18 } from "./F01-seek-target/v0.0.3-seek-minus18";

export const FUNCTION_DURATION = 450;

const clips: React.FC[] = [SeekMinus7, Seek9, SeekMinus18];

export const Episode0: React.FC = () => (
	<Series>
		{clips.map((Clip, i) => (
			<Series.Sequence key={i} durationInFrames={FUNCTION_DURATION}>
				<Clip />
			</Series.Sequence>
		))}
	</Series>
);

export const episode0DurationInFrames = clips.length * FUNCTION_DURATION;
