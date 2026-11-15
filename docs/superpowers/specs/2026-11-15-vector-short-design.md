# Vector Math YouTube Short — Design (approved)

## Intent
48s vertical (1080x1920, 24fps) educational YouTube Short: "how AI understands words via vectors",
using a horse -> Pegasus / Unicorn metaphor. Voice-over via fal.ai ElevenLabs, six supplied clips
stitched in scene order, animated word-by-word subtitles, MP4 export. All code lives in this repo.

## Goals / Non-goals
- Goals: reproducible pipeline (`npm run build:video`), energetic VO, readable captions, seamless loop.
- Non-goals: new footage, music, thumbnails, upload to YouTube.
- Anti-goal: captions overlapping the burned-in lower-thirds or the subject.

## Constraints
- Clips (7.92s each, 1080x1920, have audio; ~47.5s total) are copied from ~/Downloads into `assets/clips/`.
  All six already contain burned-in lower-third cards at the bottom (~80-92% of height).
  -> We add NO lower thirds; animated captions sit just above them (62-77% height). A Skool CTA card shows over the last 3s of scene 6.
- Clip order: 1 Camera_gliding_through_cosmic_space, 2 Futuristic_horse_standing_on_grid,
  3 Horse_transforming_into_Pegasus, 4 Futuristic_horse_transforms_into… (verified: horse -> unicorn),
  5 Pegasus_transforms_into_unicorn, 6 Macro_zoom_into_futuristic_unicorn.
- fal key lives only in gitignored `.env` (FAL_KEY). Never committed or logged.

## Approaches considered
- A: ffmpeg + ASS karaoke subs — simplest, weakest animation.
- B: Remotion composition — best look, reproducible. **Chosen by user.**
- C: Remotion overlay + ffmpeg composite — same look, more moving parts.

## Design (B)
- `scripts/tts.mjs`: fal `fal-ai/elevenlabs/tts/*` per scene (stability .4, similarity .8, style .15,
  speaker boost), voice Adam. Script text from the "Option 2" scene lines. Output `assets/vo/sceneN.mp3`.
  If a line > 7.5s, regenerate with higher speed (not cut).
- `scripts/align.mjs`: fal Whisper on each scene VO -> word timestamps -> `assets/captions.json`.
- `src/` Remotion project: 6 `<Sequence>`s of 7.92s each with clip video (volume ~0.12) + per-scene VO
  (starts ~0.2s in) + `<Captions>` (2-4 word chunks, current word highlighted, spring pop-in).
  Final ~0.5s crossfade of last frame into first for loop feel.
- Export: `out/short_1080x1920.mp4` (H.264, AAC). Verify with ffprobe + sampled frames.
- Spend: ~6 TTS + 6 Whisper calls (cents).

## Left to builder
Exact caption font/colors, ducking curve, speed tuning, final loop crossfade length.
