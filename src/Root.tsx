import "./index.css";
import { Composition, Folder } from "remotion";
import { SeekMinus7 } from "./episodes/s0e0-number-line/F01-seek-target/v0.0.1-seek-minus7";
import { Seek9 } from "./episodes/s0e0-number-line/F01-seek-target/v0.0.2-seek-9";
import { SeekMinus18 } from "./episodes/s0e0-number-line/F01-seek-target/v0.0.3-seek-minus18";
import {
  Episode0,
  episode0DurationInFrames,
} from "./episodes/s0e0-number-line/episode";

const FUNCTION_COMMON = {
  durationInFrames: 450,
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

const EPISODE_COMMON = {
  fps: 30,
  width: 1920,
  height: 1080,
} as const;

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="series-0">
      <Folder name="e0-number-line">
        <Composition
          id="s0e0-episode"
          component={Episode0}
          durationInFrames={episode0DurationInFrames}
          {...EPISODE_COMMON}
        />
        <Folder name="f01-seek-target">
          <Composition
            id="s0e0-f01-v001-seek-minus7"
            component={SeekMinus7}
            {...FUNCTION_COMMON}
          />
          <Composition
            id="s0e0-f01-v002-seek-9"
            component={Seek9}
            {...FUNCTION_COMMON}
          />
          <Composition
            id="s0e0-f01-v003-seek-minus18"
            component={SeekMinus18}
            {...FUNCTION_COMMON}
          />
        </Folder>
      </Folder>
    </Folder>
  );
};
