import { describe, it, expect } from 'vitest';
import { chunkWords } from '../src/captions/chunk';
import type { CaptionWord } from '../src/captions/align';

const w = (text: string, start: number, end: number): CaptionWord => ({ text, start, end });

describe('chunkWords', () => {
  it('returns [] for empty input', () => {
    expect(chunkWords([])).toEqual([]);
  });
  it('groups at most 3 words per chunk and preserves order', () => {
    const words = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((t, i) => w(t, i, i + 0.9));
    const chunks = chunkWords(words);
    expect(chunks.map((c) => c.words.length)).toEqual([3, 3, 1]);
    expect(chunks.flatMap((c) => c.words.map((x) => x.text)).join('')).toBe('abcdefg');
  });
  it('never exceeds 22 characters unless a single word is longer', () => {
    const words = [w('Pegasus,', 0, 1), w('minus', 1, 2), w('Wings', 2, 3), w('plus', 3, 4), w('Horn,', 4, 5)];
    for (const c of chunkWords(words)) {
      if (c.words.length > 1) expect(c.words.map((x) => x.text).join(' ').length).toBeLessThanOrEqual(22);
    }
  });
  it('chunk start/end come from first/last word', () => {
    const c = chunkWords([w('a', 1, 1.5), w('b', 1.6, 2.2)])[0];
    expect(c.start).toBe(1);
    expect(c.end).toBe(2.2);
  });
});
