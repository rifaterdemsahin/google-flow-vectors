import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';

const probe = (f: string) =>
  JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,duration', '-of', 'json', f]).toString()).streams[0];

describe('ingested clips', () => {
  for (let n = 1; n <= 6; n++) {
    it(`scene${n}.mp4 is 1080x1920 and ~7.92s`, () => {
      const s = probe(`assets/clips/scene${n}.mp4`);
      expect(s.width).toBe(1080);
      expect(s.height).toBe(1920);
      expect(Math.abs(parseFloat(s.duration) - 7.92)).toBeLessThan(0.05);
    });
  }
  it('no tracked file contains the fal key', () => {
    let out = '';
    try { out = execFileSync('sh', ['-c', 'git ls-files | xargs grep -l fal_sk_ || true']).toString(); } catch {}
    expect(out.trim()).toBe('');
  });
});
