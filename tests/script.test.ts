import { describe, it, expect } from 'vitest';
import { SCENES, SCENE_FRAMES, FPS } from '../src/script';

describe('scene script', () => {
  it('has six scenes with ids 1..6 in order', () => {
    expect(SCENES.map((s) => s.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it('has no spoken stage markers', () => {
    for (const s of SCENES) expect(s.text).not.toMatch(/\[|pause/i);
  });
  it('scene 5 carries the equation', () => {
    expect(SCENES[4].text).toContain('Pegasus, minus Wings, plus Horn, equals Unicorn');
  });
  it('scene 6 mentions Token 9246', () => {
    expect(SCENES[5].text).toContain('Token 9246');
  });
  it('timing constants', () => {
    expect(FPS).toBe(24);
    expect(SCENE_FRAMES).toBe(190);
  });
});
