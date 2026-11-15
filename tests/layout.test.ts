import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { CAPTION_TOP_PCT, CAPTION_HEIGHT_PCT, CTA_FRAMES, CTA_LOGO, CTA_TEXT, CTA_URL, TOTAL_FRAMES } from '../src/layout';
import { SCENE_FRAMES } from '../src/script';

describe('layout', () => {
  it('captions sit in the lower half but above the burned-in lower-third cards (~80%)', () => {
    expect(CAPTION_TOP_PCT).toBeGreaterThanOrEqual(55);
    expect(CAPTION_TOP_PCT + CAPTION_HEIGHT_PCT).toBeLessThanOrEqual(79);
  });
  it('CTA is a dedicated 2-second end screen appended after the six scenes', () => {
    expect(CTA_URL).toBe('https://www.skool.com/delivery-pilot-8938');
    expect(CTA_TEXT).toMatch(/Delivery Pilot/);
    expect(CTA_FRAMES).toBe(48);
    expect(TOTAL_FRAMES).toBe(6 * SCENE_FRAMES + CTA_FRAMES);
  });
  it('CTA logo file exists in assets/', () => {
    expect(existsSync(`assets/${CTA_LOGO}`)).toBe(true);
  });
});
