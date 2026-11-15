import { describe, it, expect } from 'vitest';
import { tokenize, mapToScript } from '../src/captions/align';

describe('tokenize', () => {
  it('splits on whitespace and em-dashes, keeps punctuation attached', () => {
    expect(tokenize("It doesn't read letters—it turns")).toEqual(["It", "doesn't", "read", "letters—", "it", "turns"]);
  });
});

describe('mapToScript', () => {
  it('uses script words with whisper timings when counts match', () => {
    const out = mapToScript(['Token', '9246'], [
      { text: 'token', start: 0, end: 0.5 },
      { text: '9246', start: 0.5, end: 1.2 },
    ]);
    expect(out).toEqual([
      { text: 'Token', start: 0, end: 0.5 },
      { text: '9246', start: 0.5, end: 1.2 },
    ]);
  });
  it('still yields one monotonic entry per script word when whisper splits/merges words', () => {
    const out = mapToScript(['Pegasus,', 'minus', 'Wings'], [
      { text: 'Peg', start: 0, end: 0.3 },
      { text: 'asus', start: 0.3, end: 0.7 },
      { text: 'minus', start: 0.8, end: 1.1 },
    ]);
    expect(out.map((w) => w.text)).toEqual(['Pegasus,', 'minus', 'Wings']);
    for (let i = 1; i < out.length; i++) expect(out[i].start).toBeGreaterThanOrEqual(out[i - 1].start);
    for (const w of out) expect(w.end).toBeGreaterThanOrEqual(w.start);
  });
});
