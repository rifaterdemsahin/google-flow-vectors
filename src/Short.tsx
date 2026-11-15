import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { SceneView } from './SceneView';
import { SCENES, SCENE_FRAMES } from './script';

const LOOP_FADE_FRAMES = 12;

export const Short = () => {
  const frame = useCurrentFrame();
  const total = SCENES.length * SCENE_FRAMES;
  // Loop feel: the last frames cross-fade into scene 1's first frame (also a dark star-field).
  const loopOpacity = interpolate(frame, [total - LOOP_FADE_FRAMES, total - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {SCENES.map((scene, i) => (
        <Sequence key={scene.id} from={i * SCENE_FRAMES} durationInFrames={SCENE_FRAMES}>
          <SceneView scene={scene} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ opacity: loopOpacity }}>
        <Freeze frame={0}>
          <OffthreadVideo src={staticFile(SCENES[0].clip)} muted />
        </Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
