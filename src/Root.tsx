import { Composition } from 'remotion';
import { Short } from './Short';
import { TOTAL_FRAMES } from './layout';
import { FPS } from './script';

export const Root = () => (
  <Composition
    id="Short"
    component={Short}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={TOTAL_FRAMES}
  />
);
