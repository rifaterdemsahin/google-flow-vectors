# 🗺️ How this Short was created: Google Flow → Claude Code → YouTube

The video was started in **Google Flow** (idea, storyboard, clips, voice-over script) and finished in **Claude Code** (voice-over, captions, composition, export, publishing). Everything after the hand-off is code in this repo.

## 1. The whole journey

```mermaid
flowchart LR
  subgraph FLOW["Phase 1 · Google Flow"]
    direction TB
    A["Idea: how does AI understand words?"] --> B["King - Man + Woman = Queen"]
    B --> C["Simplify for a 4-year-old: Kitty + Wings"]
    C --> D["Age up: Horse + Wings = Pegasus, Horse + Horn = Unicorn"]
    D --> E["Storyboard images: 6 panels, 9:16, lower thirds"]
    E --> F["Script and ElevenLabs voice-over text"]
    F --> G["6 video clips, 8 s each"]
  end
  subgraph CLAUDE["Phase 2 · Claude Code with superpowers"]
    direction TB
    H["Hand-off: 6 clips, scene list, VO script"] --> I["Brainstorm: pick Remotion"]
    I --> J["Design doc"]
    J --> K["Implementation plan"]
    K --> L["Execute test-first, commit to main"]
  end
  subgraph SHIP["Phase 3 · Ship"]
    direction TB
    M["Export MP4"] --> N["GitHub Pages site"]
    N --> O["YouTube page: title, description, thumbnails, pinned comment"]
  end
  G -->|"download to Downloads"| H
  L --> M
```

## 2. What the code does (build pipeline)

```mermaid
flowchart TD
  CL["assets/clips: 6 Flow clips"] --> ING["npm run ingest"]
  SC["src/script.ts: scene lines"] --> TTS["npm run tts: fal.ai ElevenLabs"]
  TTS --> VO["assets/vo: scene1-6.mp3"]
  VO --> AL["npm run align: fal.ai Whisper"]
  SC --> AL
  AL --> CAP["assets/captions.json: word timings on script words"]
  ING --> RM["Remotion composition"]
  VO --> RM
  CAP --> RM
  LOGO["skool-logo.png"] --> RM
  RM --> MP4["out/short_1080x1920.mp4"]
  MP4 --> VER["verify-export: format, 49.5 s, under 25 MB, audible"]
  VER --> GIT["git commit and push to main"]
  GIT --> PG["GitHub Pages workflow: static.yml"]
  TH["scripts/thumbnails.mjs: fal.ai nano-banana-2"] --> YT["youtube.html"]
  PG --> YT
```

## 3. Who did what

```mermaid
sequenceDiagram
  autonumber
  participant You
  participant Flow as Google Flow
  participant CC as Claude Code
  participant Fal as fal.ai
  participant GH as GitHub
  You->>Flow: Idea, then simplified, then Horse/Pegasus/Unicorn
  Flow-->>You: Storyboard, script, 6 clips
  You->>CC: 6 newest videos, scene list, VO script, fal key
  CC->>You: Approaches (Remotion chosen), design, plan
  CC->>Fal: ElevenLabs TTS per scene
  Fal-->>CC: Voice-over mp3 files
  CC->>Fal: Whisper for word timings
  Fal-->>CC: Timestamps mapped onto script words
  CC->>CC: Remotion render and verify-export
  You->>CC: Add CTA, move captions, thumbnails, pinned comment
  CC->>Fal: nano-banana-2 vertical thumbnails
  CC->>GH: Commit and push to main
  GH-->>You: Pages site and YouTube page
```

## 4. The superpowers process used in Claude

```mermaid
flowchart LR
  B["brainstorming: approaches A / B / C"] --> D["design doc"]
  D --> W["writing-plans"]
  W --> E["executing-plans"]
  E --> T["test-first per task"]
  T --> V["verification before completion"]
  V --> M["trunk-based commit to main"]
```

## Notes
- The clips already had lower-third cards burned in, so captions sit just above them instead of adding more.
- The `.github/workflows/static.yml` workflow publishes the repo root to GitHub Pages on every push to `main`.
- Secrets live only in the gitignored `.env`.
