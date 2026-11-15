import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CTA_DISPLAY_URL, CTA_LOGO, CTA_SUB, CTA_TEXT } from './layout';

/** Full-frame, focused end screen: dimmed backdrop, big logo, one message, one URL. */
export const CtaCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 150 } });
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: 900,
          padding: '60px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 30,
          textAlign: 'center',
          borderRadius: 48,
          background: 'linear-gradient(160deg, rgba(20,24,38,0.95), rgba(60,20,90,0.95))',
          border: '4px solid #FFD54A',
          boxShadow: '0 16px 70px rgba(0,0,0,0.7), 0 0 60px rgba(255,213,74,0.4)',
          fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
          color: '#fff',
          transform: `scale(${0.85 + 0.15 * pop})`,
          opacity: Math.min(1, pop * 1.4),
        }}
      >
        <Img src={staticFile(CTA_LOGO)} style={{ width: 340, height: 340, borderRadius: '50%' }} />
        <div style={{ fontSize: 74, fontWeight: 900, lineHeight: 1.08 }}>{CTA_TEXT}</div>
        <div style={{ fontSize: 52, fontWeight: 700, color: '#FFD54A' }}>{CTA_SUB}</div>
        <div style={{ fontSize: 44, fontWeight: 600, opacity: 0.95 }}>{CTA_DISPLAY_URL}</div>
      </div>
    </AbsoluteFill>
  );
};
