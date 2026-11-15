// Generates one ElevenLabs voice-over mp3 per scene through fal.ai.
// Usage: tsx scripts/tts.mjs [--force]
import { fal } from '@fal-ai/client';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { SCENES } from '../src/script.ts';

process.loadEnvFile('.env');
fal.config({ credentials: process.env.FAL_KEY });

const ENDPOINT = 'fal-ai/elevenlabs/tts/turbo-v2.5';
const MAX_SECONDS = 7.5;
const force = process.argv.includes('--force');

const duration = (f) =>
  parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());

export async function generateScene(scene, speed = 1.0) {
  const { data } = await fal.subscribe(ENDPOINT, {
    input: { text: scene.text, voice: 'Adam', stability: 0.4, similarity_boost: 0.8, style: 0.15, speed },
  });
  const res = await fetch(data.audio.url);
  if (!res.ok) throw new Error(`download failed ${res.status}`);
  const path = `assets/vo/scene${scene.id}.mp3`;
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  return path;
}

mkdirSync('assets/vo', { recursive: true });
for (const scene of SCENES) {
  const path = `assets/vo/scene${scene.id}.mp3`;
  if (existsSync(path) && !force) { console.log(`scene${scene.id}: exists, skipping`); continue; }
  let speed = 1.0;
  for (let attempt = 0; attempt < 4; attempt++) {
    await generateScene(scene, speed);
    const d = duration(path);
    console.log(`scene${scene.id}: speed ${speed.toFixed(2)} -> ${d.toFixed(2)}s`);
    if (d <= MAX_SECONDS) break;
    speed = Math.min(1.2, speed + 0.05);
  }
}
