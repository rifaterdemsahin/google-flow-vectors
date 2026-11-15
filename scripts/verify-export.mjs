// Verifies out/short_1080x1920.mp4: format, duration, audio presence/level.
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const F = 'out/short_1080x1920.mp4';
const fail = (m) => { console.error('FAIL:', m); process.exit(1); };
let info;
try { statSync(F); } catch { fail(`${F} does not exist`); }
info = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', F]).toString());
const v = info.streams.find((s) => s.codec_type === 'video');
const a = info.streams.find((s) => s.codec_type === 'audio');
if (!v || v.codec_name !== 'h264') fail('video must be h264');
if (v.width !== 1080 || v.height !== 1920) fail(`size ${v.width}x${v.height}`);
if (v.r_frame_rate !== '24/1') fail(`fps ${v.r_frame_rate}`);
if (!a || a.codec_name !== 'aac') fail('audio must be aac');
const d = parseFloat(info.format.duration);
if (Math.abs(d - 49.5) > 0.3) fail(`duration ${d}`);
const mb = statSync(F).size / 1e6;
if (mb > 25) fail(`file is ${mb.toFixed(1)}MB (> 25MB limit for git)`);
const vd = execFileSync('ffmpeg', ['-i', F, '-af', 'volumedetect', '-f', 'null', '-'], { stdio: ['ignore', 'pipe', 'pipe'] });
const out = (vd.toString() + ''); // volumedetect prints to stderr; re-run capturing it
const err = (() => { try { return execFileSync('sh', ['-c', `ffmpeg -i ${F} -af volumedetect -f null - 2>&1 | grep mean_volume`]).toString(); } catch { return ''; } })();
const mean = parseFloat(err.split('mean_volume:')[1]);
if (!(mean > -40)) fail(`mean volume ${mean} dB — voice-over missing?`);
console.log(`OK: h264/aac 1080x1920@24, ${d.toFixed(2)}s, ${mb.toFixed(1)}MB, mean ${mean} dB`);
