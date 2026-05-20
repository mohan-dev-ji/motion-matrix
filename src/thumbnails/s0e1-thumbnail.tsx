import React from "react";
import { ThumbnailLayout } from "./ThumbnailLayout";

export const S0E1Thumbnail: React.FC = () => (
	<ThumbnailLayout
		title="ADDING NUMBERS"
		versionTag="v.0.1.1"
		terminalCmd="find -3+8"
		terminalResult="result: 5"
		range={{ min: -10, max: 10 }}
		answerValue={5}
	/>
);
