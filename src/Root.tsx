import "./index.css";
import { Composition, Folder, Still } from "remotion";
import { Episode001 } from "./episodes/001-halves";
import { Ep001Thumbnail } from "./episodes/001-halves/scenes/Thumbnail";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Thumbnails">
        <Still
          id="001-thumbnail"
          component={Ep001Thumbnail}
          width={1280}
          height={720}
        />
      </Folder>

      <Folder name="Episodes">
        <Composition
          id="001-halves"
          component={Episode001}
          durationInFrames={4260}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
