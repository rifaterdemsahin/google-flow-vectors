// Generates three vertical (9:16) Shorts thumbnails with fal.ai nano-banana-2.
// Usage: node scripts/thumbnails.mjs   -> assets/thumbnails/short{1,2,3}-*.png
import { fal } from '@fal-ai/client';
import { mkdirSync, writeFileSync } from 'node:fs';

process.loadEnvFile('.env');
fal.config({ credentials: process.env.FAL_KEY });

const STYLE = 'Vertical 9:16 YouTube Shorts thumbnail, full-bleed artwork filling the entire frame edge to edge, no borders or letterboxing, high contrast, curiosity-provoking, very readable on a phone. The artwork must continue all the way to the bottom edge as the same scene (extend the background and glow there), with no black bars and no empty black area; just put no text in the bottom 18 percent.';
const THUMBS = [
  ['short1-equation', `${STYLE} Top third: huge bold white text with yellow outline on two lines "PEGASUS - WINGS" and "+ HORN = ?". Middle and lower: a sleek black cyber horse with glowing cyan circuit lines and small wings, a giant glowing golden question mark above it, floating math symbols, dark starry space, neon cyan and magenta rim light.`],
  ['short2-token9246', `${STYLE} Top: huge bold white text with yellow outline on two lines "WHAT IS HIDING" and "INSIDE?". Below: macro shot of a glowing golden spiral unicorn horn filling the frame, a small crystalline number tag "9246" hidden in the energy spiral, with a big red circle and red arrow pointing at the number. Dark cosmic background with sparkles.`],
  ['short3-ai-math', `${STYLE} Top: huge bold white text with yellow outline on two lines "AI DOESN'T" and "READ WORDS". Below, stacked vertically: a black futuristic horse on a neon coordinate grid, a glowing plus sign with cyan wings, then a majestic white unicorn with a glowing golden horn, glowing vector arrows between them, floating numbers in dark space. Vibrant neon.`],
];

mkdirSync('assets/thumbnails', { recursive: true });
// Optional filter: node scripts/thumbnails.mjs short1-equation
const only = process.argv[2];
await Promise.all(THUMBS.filter(([n]) => !only || n === only).map(async ([name, prompt]) => {
  const { data } = await fal.subscribe('fal-ai/nano-banana-2', {
    input: { prompt, aspect_ratio: '9:16', resolution: '1K', output_format: 'png', num_images: 1 },
  });
  const img = data.images[0];
  const buf = Buffer.from(await (await fetch(img.url)).arrayBuffer());
  writeFileSync(`assets/thumbnails/${name}.png`, buf);
  console.log(`${name}: ${img.width}x${img.height} ${(buf.length / 1e6).toFixed(2)}MB`);
}));
