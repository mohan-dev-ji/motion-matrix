import "./index.css";
import { Composition, Folder } from "remotion";

// ── Episode 0 — Seek target ────────────────────────────────────────────
import { SeekMinus7, SEEK_MINUS_7_DURATION } from "./episodes/s0e0-seek-target/v0.0.1-seek-minus7";
import { Seek4, SEEK_4_DURATION } from "./episodes/s0e0-seek-target/v0.0.2-seek-4";
import { SeekMinus3, SEEK_MINUS3_DURATION } from "./episodes/s0e0-seek-target/v0.0.3-seek-minus3";
import { Seek9, SEEK_9_DURATION } from "./episodes/s0e0-seek-target/v0.0.4-seek-9";
import { SeekMinus13, SEEK_MINUS13_DURATION } from "./episodes/s0e0-seek-target/v0.0.5-seek-minus13";
import { Seek17, SEEK_17_DURATION } from "./episodes/s0e0-seek-target/v0.0.6-seek-17";
import { SeekMinus18, SEEK_MINUS_18_DURATION } from "./episodes/s0e0-seek-target/v0.0.7-seek-minus18";
import { Seek37, SEEK_37_DURATION } from "./episodes/s0e0-seek-target/v0.0.8-seek-37";
import { SeekMinus44, SEEK_MINUS44_DURATION } from "./episodes/s0e0-seek-target/v0.0.9-seek-minus44";
import { Episode0, EPISODE_0_DURATION } from "./episodes/s0e0-seek-target/episode";

// ── Episode 1 — Addition ───────────────────────────────────────────────
import { AddMinus3Plus8, ADD_MINUS3_PLUS8_DURATION } from "./episodes/s0e1-addition/v0.1.1-add-minus3-plus8";
import { Add7Minus3, ADD_7_MINUS3_DURATION } from "./episodes/s0e1-addition/v0.1.2-add-7-minus3";
import { AddMinus8Plus6, ADD_MINUS8_PLUS6_DURATION } from "./episodes/s0e1-addition/v0.1.3-add-minus8-plus6";
import { Add12Minus19, ADD_12_MINUS_19_DURATION } from "./episodes/s0e1-addition/v0.1.4-add-12-minus19";
import { AddMinus14Plus11, ADD_MINUS14_PLUS11_DURATION } from "./episodes/s0e1-addition/v0.1.5-add-minus14-plus11";
import { Add6Plus8, ADD_6_PLUS8_DURATION } from "./episodes/s0e1-addition/v0.1.6-add-6-plus8";
import { AddMinus18Minus26, ADD_MINUS18_MINUS_26_DURATION } from "./episodes/s0e1-addition/v0.1.7-add-minus18-minus26";
import { AddMinus27Plus41, ADD_MINUS27_PLUS41_DURATION } from "./episodes/s0e1-addition/v0.1.8-add-minus27-plus41";
import { Add32Minus39, ADD_32_MINUS39_DURATION } from "./episodes/s0e1-addition/v0.1.9-add-32-minus39";
import { Episode1, EPISODE_1_DURATION } from "./episodes/s0e1-addition/episode";

// ── Episode 2 — Triple addition ────────────────────────────────────────
import { Triple3Minus7Plus6, TRIPLE_3_MINUS7_PLUS6_DURATION } from "./episodes/s0e2-triple-add/v0.2.1-triple-3-minus7-plus6";
import { TripleMinus2Plus5Minus6, TRIPLE_MINUS2_PLUS5_MINUS6_DURATION } from "./episodes/s0e2-triple-add/v0.2.2-triple-minus2-plus5-minus6";
import { Triple4Minus9Plus8, TRIPLE_4_MINUS9_PLUS8_DURATION } from "./episodes/s0e2-triple-add/v0.2.3-triple-4-minus9-plus8";
import { TripleMinus7Plus16Minus12, TRIPLE_MINUS7_PLUS16_MINUS12_DURATION } from "./episodes/s0e2-triple-add/v0.2.4-triple-minus7-plus16-minus12";
import { Triple11Minus18Plus5, TRIPLE_11_MINUS18_PLUS5_DURATION } from "./episodes/s0e2-triple-add/v0.2.5-triple-11-minus18-plus5";
import { TripleMinus16Plus9Minus4, TRIPLE_MINUS16_PLUS9_MINUS4_DURATION } from "./episodes/s0e2-triple-add/v0.2.6-triple-minus16-plus9-minus4";
import { TripleMinus22Plus38Minus29, TRIPLE_MINUS22_PLUS38_MINUS29_DURATION } from "./episodes/s0e2-triple-add/v0.2.7-triple-minus22-plus38-minus29";
import { Triple31Minus47Plus18, TRIPLE_31_MINUS47_PLUS18_DURATION } from "./episodes/s0e2-triple-add/v0.2.8-triple-31-minus47-plus18";
import { TripleMinus33Plus44Minus19, TRIPLE_MINUS33_PLUS44_MINUS19_DURATION } from "./episodes/s0e2-triple-add/v0.2.9-triple-minus33-plus44-minus19";
import { Episode2, EPISODE_2_DURATION } from "./episodes/s0e2-triple-add/episode";

const COMMON = { fps: 30, width: 1920, height: 1080 } as const;

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="series-0">
      <Folder name="e0-seek-target">
        <Composition id="s0e0-episode" component={Episode0} {...COMMON} durationInFrames={EPISODE_0_DURATION} />
        <Composition id="s0e0-v001-seek-minus7"  component={SeekMinus7}  {...COMMON} durationInFrames={SEEK_MINUS_7_DURATION} />
        <Composition id="s0e0-v002-seek-4"       component={Seek4}       {...COMMON} durationInFrames={SEEK_4_DURATION} />
        <Composition id="s0e0-v003-seek-minus3"  component={SeekMinus3}  {...COMMON} durationInFrames={SEEK_MINUS3_DURATION} />
        <Composition id="s0e0-v004-seek-9"       component={Seek9}       {...COMMON} durationInFrames={SEEK_9_DURATION} />
        <Composition id="s0e0-v005-seek-minus13" component={SeekMinus13} {...COMMON} durationInFrames={SEEK_MINUS13_DURATION} />
        <Composition id="s0e0-v006-seek-17"      component={Seek17}      {...COMMON} durationInFrames={SEEK_17_DURATION} />
        <Composition id="s0e0-v007-seek-minus18" component={SeekMinus18} {...COMMON} durationInFrames={SEEK_MINUS_18_DURATION} />
        <Composition id="s0e0-v008-seek-37"      component={Seek37}      {...COMMON} durationInFrames={SEEK_37_DURATION} />
        <Composition id="s0e0-v009-seek-minus44" component={SeekMinus44} {...COMMON} durationInFrames={SEEK_MINUS44_DURATION} />
      </Folder>
      <Folder name="e1-addition">
        <Composition id="s0e1-episode" component={Episode1} {...COMMON} durationInFrames={EPISODE_1_DURATION} />
        <Composition id="s0e1-v001-add-minus3-plus8"   component={AddMinus3Plus8}    {...COMMON} durationInFrames={ADD_MINUS3_PLUS8_DURATION} />
        <Composition id="s0e1-v002-add-7-minus3"       component={Add7Minus3}        {...COMMON} durationInFrames={ADD_7_MINUS3_DURATION} />
        <Composition id="s0e1-v003-add-minus8-plus6"   component={AddMinus8Plus6}    {...COMMON} durationInFrames={ADD_MINUS8_PLUS6_DURATION} />
        <Composition id="s0e1-v004-add-12-minus19"     component={Add12Minus19}      {...COMMON} durationInFrames={ADD_12_MINUS_19_DURATION} />
        <Composition id="s0e1-v005-add-minus14-plus11" component={AddMinus14Plus11}  {...COMMON} durationInFrames={ADD_MINUS14_PLUS11_DURATION} />
        <Composition id="s0e1-v006-add-6-plus8"        component={Add6Plus8}         {...COMMON} durationInFrames={ADD_6_PLUS8_DURATION} />
        <Composition id="s0e1-v007-add-minus18-minus26" component={AddMinus18Minus26} {...COMMON} durationInFrames={ADD_MINUS18_MINUS_26_DURATION} />
        <Composition id="s0e1-v008-add-minus27-plus41" component={AddMinus27Plus41}  {...COMMON} durationInFrames={ADD_MINUS27_PLUS41_DURATION} />
        <Composition id="s0e1-v009-add-32-minus39"     component={Add32Minus39}      {...COMMON} durationInFrames={ADD_32_MINUS39_DURATION} />
      </Folder>
      <Folder name="e2-triple-add">
        <Composition id="s0e2-episode" component={Episode2} {...COMMON} durationInFrames={EPISODE_2_DURATION} />
        <Composition id="s0e2-v001-triple-3-minus7-plus6"        component={Triple3Minus7Plus6}        {...COMMON} durationInFrames={TRIPLE_3_MINUS7_PLUS6_DURATION} />
        <Composition id="s0e2-v002-triple-minus2-plus5-minus6"   component={TripleMinus2Plus5Minus6}   {...COMMON} durationInFrames={TRIPLE_MINUS2_PLUS5_MINUS6_DURATION} />
        <Composition id="s0e2-v003-triple-4-minus9-plus8"        component={Triple4Minus9Plus8}        {...COMMON} durationInFrames={TRIPLE_4_MINUS9_PLUS8_DURATION} />
        <Composition id="s0e2-v004-triple-minus7-plus16-minus12" component={TripleMinus7Plus16Minus12} {...COMMON} durationInFrames={TRIPLE_MINUS7_PLUS16_MINUS12_DURATION} />
        <Composition id="s0e2-v005-triple-11-minus18-plus5"      component={Triple11Minus18Plus5}      {...COMMON} durationInFrames={TRIPLE_11_MINUS18_PLUS5_DURATION} />
        <Composition id="s0e2-v006-triple-minus16-plus9-minus4"  component={TripleMinus16Plus9Minus4}  {...COMMON} durationInFrames={TRIPLE_MINUS16_PLUS9_MINUS4_DURATION} />
        <Composition id="s0e2-v007-triple-minus22-plus38-minus29" component={TripleMinus22Plus38Minus29} {...COMMON} durationInFrames={TRIPLE_MINUS22_PLUS38_MINUS29_DURATION} />
        <Composition id="s0e2-v008-triple-31-minus47-plus18"     component={Triple31Minus47Plus18}     {...COMMON} durationInFrames={TRIPLE_31_MINUS47_PLUS18_DURATION} />
        <Composition id="s0e2-v009-triple-minus33-plus44-minus19" component={TripleMinus33Plus44Minus19} {...COMMON} durationInFrames={TRIPLE_MINUS33_PLUS44_MINUS19_DURATION} />
      </Folder>
    </Folder>
  );
};
