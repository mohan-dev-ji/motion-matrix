import "./index.css";
import { Composition, Folder } from "remotion";
import { Episode001 } from "./episodes/001-halves";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Episodes">
        <Composition
          id="001-halves"
          component={Episode001}
          durationInFrames={1170}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
