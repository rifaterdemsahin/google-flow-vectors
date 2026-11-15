import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CTA_DISPLAY_URL, CTA_SUB, CTA_TEXT } from './layout';

export const CtaCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 13, stiffness: 140 } });
  return (
    // Upper area, clear of the captions (lower) and the burned-in lower thirds (bottom).
    <AbsoluteFill style={{ top: '12%', height: '24%', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          width: 900,
          padding: '34px 40px',
          textAlign: 'center',
          borderRadius: 36,
          background: 'linear-gradient(135deg, rgba(20,24,38,0.92), rgba(60,20,90,0.92))',
          border: '3px solid #FFD54A',
          boxShadow: '0 12px 50px rgba(0,0,0,0.6), 0 0 40px rgba(255,213,74,0.35)',
          fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
          color: '#fff',
          transform: `scale(${0.85 + 0.15 * pop})`,
          opacity: Math.min(1, pop * 1.4),
        }}
      >
        <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.1 }}>🚀 {CTA_TEXT}</div>
        <div style={{ fontSize: 40, fontWeight: 700, color: '#FFD54A', marginTop: 10 }}>{CTA_SUB}</div>
        <div style={{ fontSize: 38, fontWeight: 600, marginTop: 10, opacity: 0.95 }}>{CTA_DISPLAY_URL}</div>
      </div>
    </AbsoluteFill>
  );
};
