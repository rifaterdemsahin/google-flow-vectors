import { Composition } from 'remotion';
import { Short } from './Short';
import { FPS, SCENES, SCENE_FRAMES } from './script';

export const Root = () => (
  <Composition
    id="Short"
    component={Short}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={SCENES.length * SCENE_FRAMES}
  />
);
