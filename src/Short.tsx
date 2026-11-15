import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CtaCard } from './CtaCard';
import { CTA_FRAMES, TOTAL_FRAMES } from './layout';
import { SceneView } from './SceneView';
import { SCENES, SCENE_FRAMES } from './script';

const LOOP_FADE_FRAMES = 10;

export const Short = () => {
  const frame = useCurrentFrame();
  // Loop feel: the end screen fades into scene 1's first frame (a dark star-field).
  const loopOpacity = interpolate(frame, [TOTAL_FRAMES - LOOP_FADE_FRAMES, TOTAL_FRAMES - 1], [0, 1], {
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
      <Sequence from={SCENES.length * SCENE_FRAMES} durationInFrames={CTA_FRAMES}>
        <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, #151a33 0%, #05060e 70%)' }} />
        <CtaCard />
      </Sequence>
      <AbsoluteFill style={{ opacity: loopOpacity }}>
        <Freeze frame={0}>
          <OffthreadVideo src={staticFile(SCENES[0].clip)} muted />
        </Freeze>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
