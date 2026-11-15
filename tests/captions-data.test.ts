import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { SCENES } from '../src/script';
import { tokenize } from '../src/captions/align';

const data = JSON.parse(readFileSync('assets/captions.json', 'utf8'));
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

describe('assets/captions.json', () => {
  it('has all six scenes, non-empty', () => {
    expect(Object.keys(data).sort()).toEqual(['1', '2', '3', '4', '5', '6']);
    for (const k of Object.keys(data)) expect(data[k].length).toBeGreaterThan(3);
  });
  for (const s of SCENES) {
    it(`scene ${s.id}: script words, monotonic timings`, () => {
      const words = data[String(s.id)] as { text: string; start: number; end: number }[];
      expect(norm(words.map((w) => w.text).join(''))).toBe(norm(s.text));
      expect(words.map((w) => w.text)).toEqual(tokenize(s.text));
      for (let i = 0; i < words.length; i++) {
        expect(words[i].end).toBeGreaterThanOrEqual(words[i].start);
        if (i) expect(words[i].start).toBeGreaterThanOrEqual(words[i - 1].start);
      }
    });
  }
});
