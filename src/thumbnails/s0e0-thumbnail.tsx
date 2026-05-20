import React from "react";
import { ThumbnailLayout } from "./ThumbnailLayout";

export const S0E0Thumbnail: React.FC = () => (
	<ThumbnailLayout
		title="FIND ANY NUMBER"
		versionTag="v.0.0.1"
		terminalCmd="seek -7"
		terminalResult="target found: -7"
		range={{ min: -10, max: 10 }}
		answerValue={-7}
	/>
);
