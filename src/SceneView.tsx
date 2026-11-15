import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile } from 'remotion';
import captionData from '../assets/captions.json';
import type { CaptionWord } from './captions/align';
import { Captions } from './captions/Captions';
import { FPS, type Scene } from './script';

export const CLIP_VOLUME = 0.12;
export const VO_DELAY_FRAMES = 5;

const data = captionData as Record<string, CaptionWord[]>;

export const SceneView = ({ scene }: { scene: Scene }) => {
  const words = data[String(scene.id)] ?? [];
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(scene.clip)} volume={CLIP_VOLUME} />
      <Sequence from={VO_DELAY_FRAMES}>
        <Audio src={staticFile(`vo/scene${scene.id}.mp3`)} />
      </Sequence>
      <Captions words={words} offsetSeconds={VO_DELAY_FRAMES / FPS} />
    </AbsoluteFill>
  );
};
