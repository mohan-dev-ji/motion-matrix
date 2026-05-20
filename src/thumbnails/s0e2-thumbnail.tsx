import React from "react";
import { ThumbnailLayout } from "./ThumbnailLayout";

export const S0E2Thumbnail: React.FC = () => (
	<ThumbnailLayout
		title="ADDING THREE NUMBERS"
		versionTag="v.0.2.4"
		terminalCmd="find -7+16+(-12)"
		terminalResult="result: -3"
		range={{ min: -20, max: 20 }}
		answerValue={-3}
	/>
);
