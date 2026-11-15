// Copies the six source clips from ~/Downloads into assets/clips/sceneN.mp4 in scene order.
import { readdirSync, copyFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const SRC = join(homedir(), 'Downloads');
const PREFIXES = [
  'Camera_gliding_through_cosmic_space',
  'Futuristic_horse_standing_on_grid',
  'Horse_transforming_into_Pegasus',
  'Futuristic_horse_transforms_into',
  'Pegasus_transforms_into_unicorn',
  'Macro_zoom_into_futuristic_unicorn',
];
const files = readdirSync(SRC).filter((f) => f.endsWith('.mp4'));
mkdirSync('assets/clips', { recursive: true });
PREFIXES.forEach((p, i) => {
  const hits = files.filter((f) => f.startsWith(p));
  if (hits.length !== 1) throw new Error(`Expected exactly one clip for ${p}, found ${hits.length}`);
  copyFileSync(join(SRC, hits[0]), `assets/clips/scene${i + 1}.mp4`);
  console.log(`scene${i + 1} <- ${hits[0]}`);
});
