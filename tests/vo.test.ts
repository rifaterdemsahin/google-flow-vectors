import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';

const dur = (f: string) =>
  parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

describe('voice-over files', () => {
  for (let n = 1; n <= 6; n++) {
    it(`scene${n}.mp3 is between 2s and 7.5s`, () => {
      const d = dur(`assets/vo/scene${n}.mp3`);
      expect(d).toBeGreaterThan(2);
      expect(d).toBeLessThanOrEqual(7.5);
    });
  }
});
