// Word timings per scene: fal Whisper on each VO mp3, mapped onto the script's own words.
// Usage: tsx scripts/align.mjs   -> assets/captions.json
import { fal } from '@fal-ai/client';
import { readFileSync, writeFileSync } from 'node:fs';
import { SCENES } from '../src/script.ts';
import { tokenize, mapToScript } from '../src/captions/align.ts';

process.loadEnvFile('.env');
fal.config({ credentials: process.env.FAL_KEY });

const out = {};
for (const scene of SCENES) {
  const buf = readFileSync(`assets/vo/scene${scene.id}.mp3`);
  const audio_url = await fal.storage.upload(new Blob([buf], { type: 'audio/mpeg' }));
  const { data } = await fal.subscribe('fal-ai/whisper', {
    input: { audio_url, task: 'transcribe', chunk_level: 'word', language: 'en' },
  });
  const whisper = (data.chunks ?? []).map((c) => ({ text: c.text.trim(), start: c.timestamp[0], end: c.timestamp[1] ?? c.timestamp[0] }));
  out[scene.id] = mapToScript(tokenize(scene.text), whisper);
  console.log(`scene${scene.id}: ${whisper.length} whisper words -> ${out[scene.id].length} script words`);
}
writeFileSync('assets/captions.json', JSON.stringify(out, null, 2));
