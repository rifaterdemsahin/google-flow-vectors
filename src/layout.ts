import { SCENES, SCENE_FRAMES } from './script';

// Caption band: lower part of the frame, just above the clips' burned-in lower-third cards (~80-94%).
export const CAPTION_TOP_PCT = 62;
export const CAPTION_HEIGHT_PCT = 15;

// Dedicated end screen appended after the six scenes.
export const CTA_FRAMES = 48; // 2s
export const CTA_TEXT = 'Join the Delivery Pilot community';
export const CTA_SUB = 'Free on Skool';
export const CTA_URL = 'https://www.skool.com/delivery-pilot-8938';
export const CTA_DISPLAY_URL = 'skool.com/delivery-pilot-8938';
export const CTA_LOGO = 'skool-logo.png';

export const TOTAL_FRAMES = SCENES.length * SCENE_FRAMES + CTA_FRAMES;
