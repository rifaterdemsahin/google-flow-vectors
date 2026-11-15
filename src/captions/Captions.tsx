import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CaptionWord } from './align';
import { chunkWords } from './chunk';

const MAX_WIDTH = 940;
const BASE_SIZE = 96;
const ACCENT = '#FFD54A';

export const Captions = ({ words, offsetSeconds }: { words: CaptionWord[]; offsetSeconds: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - offsetSeconds;
  const chunks = chunkWords(words);

  // Active chunk: the latest one that has started; the last chunk lingers briefly.
  let idx = -1;
  chunks.forEach((c, i) => { if (t >= c.start) idx = i; });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  if (idx === chunks.length - 1 && t > chunk.end + 0.6) return null;

  const pop = spring({ frame: Math.round((t - chunk.start) * fps), fps, config: { damping: 12, stiffness: 180 } });
  const text = chunk.words.map((w) => w.text).join(' ');
  // Auto-scale so the widest chunk always fits inside the frame (~0.56em average glyph width, bold).
  const size = Math.min(BASE_SIZE, Math.floor(MAX_WIDTH / (text.length * 0.56)));

  return (
    // Upper third (15%-30% of the frame), clear of the burned-in lower-third cards.
    <AbsoluteFill style={{ top: '15%', height: '15%', justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          maxWidth: MAX_WIDTH,
          textAlign: 'center',
          fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
          fontWeight: 900,
          fontSize: size,
          lineHeight: 1.05,
          color: '#fff',
          textShadow: '0 4px 18px rgba(0,0,0,0.85), 0 0 4px #000',
          WebkitTextStroke: '3px rgba(0,0,0,0.65)',
          paintOrder: 'stroke fill',
          transform: `scale(${0.8 + 0.2 * pop})`,
          opacity: Math.min(1, pop * 1.5),
        }}
      >
        {chunk.words.map((w, i) => {
          const active = t >= w.start && t <= Math.max(w.end, w.start + 0.15);
          return (
            <span key={i} style={{ color: active ? ACCENT : '#fff' }}>
              {w.text}
              {i < chunk.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
