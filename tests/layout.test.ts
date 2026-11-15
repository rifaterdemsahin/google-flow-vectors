import { describe, it, expect } from 'vitest';
import { CAPTION_TOP_PCT, CAPTION_HEIGHT_PCT, CTA_FRAMES, CTA_TEXT, CTA_URL } from '../src/layout';
import { SCENE_FRAMES } from '../src/script';

describe('layout', () => {
  it('captions sit in the lower half but above the burned-in lower-third cards (~80%)', () => {
    expect(CAPTION_TOP_PCT).toBeGreaterThanOrEqual(55);
    expect(CAPTION_TOP_PCT + CAPTION_HEIGHT_PCT).toBeLessThanOrEqual(79);
  });
  it('CTA points to the Skool community and fits inside the last scene', () => {
    expect(CTA_URL).toBe('https://www.skool.com/delivery-pilot-8938');
    expect(CTA_TEXT).toMatch(/Delivery Pilot/);
    expect(CTA_FRAMES).toBeGreaterThanOrEqual(48);
    expect(CTA_FRAMES).toBeLessThanOrEqual(SCENE_FRAMES);
  });
});
