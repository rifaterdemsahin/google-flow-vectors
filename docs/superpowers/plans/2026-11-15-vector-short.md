# Vector Math YouTube Short Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce `out/short_1080x1920.mp4`: six clips stitched, fal.ai ElevenLabs voice-over, animated word-by-word captions, seamless loop.

**Architecture:** Node scripts generate VO (fal ElevenLabs TTS) and word timings (fal Whisper) into `assets/`; a Remotion project composes clips + VO + captions from that data and renders the MP4. Pure logic (script data, caption chunking) is unit-tested with vitest; media outputs are verified with ffprobe.

**Tech Stack:** Node 20+, TypeScript, Remotion 4, @fal-ai/client, vitest, ffmpeg/ffprobe (installed).

**Spec:** `docs/superpowers/specs/2026-11-15-vector-short-design.md`

## Global Constraints

- Output 1080x1920, 24fps, H.264 video + AAC audio, file `out/short_1080x1920.mp4`.
- Each scene is exactly 7.92s (190 frames at 24fps); six scenes (~47.5s).
- Clip order: Camera_gliding_through_cosmic_space, Futuristic_horse_standing_on_grid, Horse_transforming_into_Pegasus, Futuristic_horse_transforms_into… (glob `Futuristic_horse_transforms_into*`), Pegasus_transforms_into_unicorn, Macro_zoom_into_futuristic_unicorn. Source: `~/Downloads`.
- No added lower thirds (clips have them burned in at ~80-92% height). Captions live in the upper third (15-30% height).
- TTS settings: stability 0.4, similarity 0.8, style 0.15, speaker boost on, voice Adam. VO text is the spec's "Option 2" scene lines, with `[pause]` markers removed (they would be spoken).
- Clip audio ducked to volume 0.12 under VO. VO per scene must be <= 7.5s.
- `FAL_KEY` only in gitignored `.env`; never printed, committed, or put in docs. Endpoint ids for fal ElevenLabs TTS and Whisper must be confirmed from fal's model pages at implementation time.

## Review Focus

- VO line longer than 7.5s overruns its clip: regenerate faster, never truncate.
- Whisper mishears or drops "9246", "Pegasus", "minus"/"plus": captions must use script words, with Whisper used only for timing.
- Caption chunk too wide for 1080px: must wrap/scale, never clip off-screen.
- Clip audio masking the voice: verify mixed loudness with ffmpeg `volumedetect`/ebur128, VO audible.
- API key leaking via logs/git: test greps tracked files for `fal_sk`.

---

### Task 1: Scaffold + ingest clips

**Files:**
- Create: `package.json`, `tsconfig.json`, `.gitignore` (`.env`, `node_modules`, `out`, `assets/clips`), `.env.example` (`FAL_KEY=`), `.env` (real key, ignored), `scripts/ingest-clips.mjs`, `tests/ingest.test.ts`
- Produces: `assets/clips/scene1.mp4 … scene6.mp4`; `src/script.ts` is Task 2.

- [ ] **Step 1:** Write `tests/ingest.test.ts`: for n in 1..6, `ffprobe` of `assets/clips/scene${n}.mp4` reports width 1080, height 1920, duration within 7.92±0.05; and `git ls-files | xargs grep -l fal_sk` returns nothing.
- [ ] **Step 2:** Run `npx vitest run tests/ingest.test.ts`; Expected: FAIL (files missing).
- [ ] **Step 3:** Implement `scripts/ingest-clips.mjs` copying the six source clips (order above) to `assets/clips/sceneN.mp4`; add npm scripts `ingest`, `test`. Install deps.
- [ ] **Step 4:** Run `node scripts/ingest-clips.mjs && npx vitest run`; Expected: PASS.
- [ ] **Step 5:** Commit `chore: scaffold project and ingest clips`.

### Task 2: Scene script data

**Files:** Create `src/script.ts`, `tests/script.test.ts`
**Produces:** `export type Scene = { id: 1|2|3|4|5|6; clip: string; text: string }`; `export const SCENES: Scene[]`; `export const SCENE_FRAMES = 190; export const FPS = 24`.

- [ ] **Step 1:** Test: `SCENES.length === 6`; ids 1..6 in order; no `text` contains `[` or `pause`; scene 5 text contains "Pegasus, minus Wings, plus Horn, equals Unicorn"; scene 6 text contains "Token 9246".
- [ ] **Step 2:** Run; Expected FAIL. **Step 3:** Implement with the Option 2 lines verbatim (quotes/ellipses kept). **Step 4:** Run; PASS. **Step 5:** Commit.

### Task 3: Voice-over generation

**Files:** Create `scripts/tts.mjs`, `tests/vo.test.ts`; outputs `assets/vo/sceneN.mp3`.
**Consumes:** `SCENES` (import via `tsx` or a JSON export `assets/script.json` written by Task 2's build step).

- [ ] **Step 1:** Test: each `assets/vo/sceneN.mp3` exists, ffprobe duration > 2s and <= 7.5s.
- [ ] **Step 2:** Run; FAIL.
- [ ] **Step 3:** Implement `generateScene(scene: Scene, speed = 1.0): Promise<string>` using `@fal-ai/client` (`fal.config({credentials: process.env.FAL_KEY})`, fal ElevenLabs TTS endpoint, settings per Global Constraints), downloading the audio URL to `assets/vo/`. If duration > 7.5s, retry with speed +0.05 up to 3 times. Skip scenes whose file already exists unless `--force`. Never log the key.
- [ ] **Step 4:** Run `node scripts/tts.mjs` then tests; PASS. Listen-check one file by playing it (`afplay`) and report to the user.
- [ ] **Step 5:** Commit mp3s and script.

### Task 4: Word timings

**Files:** Create `scripts/align.mjs`, `tests/captions-data.test.ts`; output `assets/captions.json`.
**Produces:** `type CaptionWord = { text: string; start: number; end: number }` (seconds, relative to scene start); file shape `{ [sceneId: string]: CaptionWord[] }`.

- [ ] **Step 1:** Test: six keys; each list non-empty; `start` strictly non-decreasing and `end >= start`; the joined words of each scene normalize (lowercase, strip punctuation) to the scene text, so the script words (not Whisper's) are what appear.
- [ ] **Step 2:** Run; FAIL.
- [ ] **Step 3:** Implement `alignScene(audioPath: string, text: string): Promise<CaptionWord[]>`: fal Whisper with word timestamps on the VO file, then map timings onto the script's own words (sequence-align; fall back to even spacing across the VO duration if counts differ).
- [ ] **Step 4:** Run; PASS. **Step 5:** Commit.

### Task 5: Caption chunking (pure logic)

**Files:** Create `src/captions/chunk.ts`, `tests/chunk.test.ts`
**Produces:** `chunkWords(words: CaptionWord[], maxWords = 3, maxChars = 22): CaptionChunk[]` with `CaptionChunk = { words: CaptionWord[]; start: number; end: number }`.

- [ ] **Step 1:** Tests: 7 short words -> chunks of <=3 words; no chunk exceeds 22 chars (long words alone); chunk `start` = first word start, `end` = last word end; order preserved; empty input -> `[]`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement greedy chunking. **Step 4:** PASS. **Step 5:** Commit.

### Task 6: Remotion composition

**Files:** Create `src/index.ts`, `src/Root.tsx`, `src/Short.tsx`, `src/SceneView.tsx`, `src/captions/Captions.tsx`, `remotion.config.ts`
**Consumes:** `SCENES`, `SCENE_FRAMES`, `FPS`, `chunkWords`, `assets/captions.json`.
**Produces:** composition id `Short`, 1080x1920, 24fps, duration `6 * SCENE_FRAMES`.

- [ ] **Step 1:** `SceneView({scene, words})`: `<OffthreadVideo src=staticFile('clips/sceneN.mp4') volume={0.12}>`, `<Audio src=staticFile('vo/sceneN.mp3') startFrom 0>` offset 5 frames; `<Captions>` positioned top 15-30%; active word highlighted (accent color), chunk pops in with `spring()`; font size auto-scaled so chunk width <= 960px.
- [ ] **Step 2:** `Short`: six `<Sequence from={i*SCENE_FRAMES} durationInFrames={SCENE_FRAMES}>`; last 12 frames of scene 6 fade out while scene 1's first frame fades in via a looping overlay for loop feel (final-frame crossfade length is the builder's call).
- [ ] **Step 3:** Verify with `npx remotion still src/index.ts Short out/check_s3.png --frame=<mid scene 3>` and one frame each from scenes 1 and 6; read the images and confirm captions sit in the upper third, clear of the burned-in lower thirds, and are fully inside the frame. Fix until true.
- [ ] **Step 4:** Commit `feat: remotion composition with animated captions`.

### Task 7: Render and verify export

**Files:** Create `scripts/verify-export.mjs`; npm script `build:video` = ingest -> tts -> align -> `remotion render src/index.ts Short out/short_1080x1920.mp4 --codec=h264`.

- [ ] **Step 1:** `verify-export.mjs` asserts via ffprobe: 1080x1920, 24fps, h264 + aac, duration 47.5 ± 0.3s; via ffmpeg `volumedetect` that mean volume is above -40 dB (VO present).
- [ ] **Step 2:** Run `npm run build:video && node scripts/verify-export.mjs`; Expected: all assertions pass.
- [ ] **Step 3:** Extract frames at ~3s, 12s, 20s, 28s, 36s, 44s; read them and confirm captions visible/legible. Report any issue honestly.
- [ ] **Step 4:** Commit `feat: render pipeline and export verification`.

### Task 8: README

- [ ] Create `README.md`: prerequisites, `.env` setup, `npm run build:video`, output path, how to re-voice (`--force`). Commit.

---

## Self-review

- Spec coverage: VO (T3), clips order and ingest (T1), word-timed animated captions (T4-6), no lower thirds/upper-third captions (T6), ducking (T6/T7), loop (T6), MP4 export + verification (T7), key handling (T1). All covered.
- Types consistent: `Scene`, `CaptionWord`, `CaptionChunk`, `SCENE_FRAMES`/`FPS` named identically across tasks.
- Proportion: bodies left to the implementer; only signatures, values and assertions fixed.
