# Ressoar

A small, private web app for practicing voice feminization. It guides you
through drills, runs a live pitch graph while you speak, shows your camera so
you can watch your mouth and jaw, and lets you keep recordings of your own
takes. It is built for trans women and anyone working toward a more feminine
voice, at their own pace, with no account and no data leaving the device.

The name comes from the Portuguese word for "to resonate." Resonance, not just
pitch, is what makes a voice read as feminine, and this tool is meant to help
you hear and see both.

## What it does

- **Guided drills.** A session is a list of exercises, each broken into timed
  steps (for example, a 90-second glissando). Start a step when you are ready
  and a timer counts down.
- **Live pitch tracking.** While you speak, a graph plots your pitch in real
  time across the 80-400 Hz range, with the current value shown in Hz and as a
  musical note in both English (A3) and Portuguese solfege (Lá3).
- **Camera feedback.** Your webcam is mirrored next to the graph so you can
  watch your articulation, smile, and jaw position.
- **Recordings you control.** Each take is recorded (video and audio) and
  downloaded to your device when you stop. Nothing is uploaded anywhere.
- **Checklist progress.** Mark off the steps you have completed. Progress is
  saved in your browser per session.
- **Your own sessions.** Load a session from a file, or build one in the editor
  and download it to reuse and share.
- **Portuguese and English.** The interface defaults to Portuguese; use the
  flag in the top-right corner to switch to English.

## A note on privacy

Everything runs in your browser. Your camera and microphone are used only to
draw the live graph and to create recordings that download straight to your
device. There is no server storing your audio, video, or progress. If you host
the app yourself, the same is true: the deployed copy serves static files only.

## Using the app

1. On the home screen, choose **Load Session**, **Create Session**, or open the
   built-in Glissando example.
2. In a session, each step has a checkbox and a **Start drill** button.
3. When you open a drill, allow camera and microphone access. Press
   **Ready? Start** to begin. The timer runs, the pitch graph draws live, and
   recording begins automatically.
4. When the timer ends (or you press **Stop**), the recording downloads to your
   device. Use **Download recording** to save it again if needed.
5. Check off steps as you finish them. Your progress is remembered the next time
   you open the same session in the same browser.

A few practical notes:

- This tool shows **pitch**. Pitch matters, but resonance, intonation, and
  weight matter at least as much. Use the camera and your own ear alongside the
  graph, not the number alone.
- Warm up gently and stop if anything hurts. Strain is never the goal.

## Session file format

Sessions are plain JSON files with a `.ressoar.json` extension, so they are easy
to read, edit, and share. A `duration` of `null` means an untimed ("free") step.

```json
{
  "title": "My session",
  "createdAt": "2026-05-23",
  "exercises": [
    {
      "title": "Sustained vowel",
      "description": "Optional notes shown above the steps.",
      "steps": [
        { "label": "Hold an /i/ at a comfortable high pitch.", "duration": 90 },
        { "label": "Read a paragraph aloud, twice.", "duration": null }
      ]
    }
  ]
}
```

The **Create Session** editor produces exactly this format and downloads it as
`<title>-<dd-mm-yyyy>.ressoar.json`. You can keep personal sessions outside the
project (this repo ignores a `saved-sessions/` folder for that purpose) and load
them with **Load Session**.

## Running locally

This project uses [mise](https://mise.jdx.dev/) to pin the toolchain (Bun) and
serves the `public/` folder as a static site.

```sh
mise install        # installs the pinned Bun version
bun run dev         # starts the server with hot reload
```

Then open the printed URL (default http://localhost:3000). The camera and
microphone work on `localhost` without HTTPS.

## Deploying

The app is fully static, so any static host works. A [Vercel](https://vercel.com)
configuration is included (`vercel.json`); it serves the `public/` directory.

1. Push the repository to a Git provider Vercel can read.
2. Import the project in Vercel. No build command is needed; the included config
   sets the output directory to `public`.
3. Deploy.

**Important:** the camera and microphone require a secure context. They work on
`localhost`, and on any deployed site they require **HTTPS** (Vercel and most
static hosts provide this automatically). They will not work over plain HTTP.

## Credits

Typeface: [Monaspace Radon](https://github.com/githubnext/monaspace) by GitHub
Next, used under the SIL Open Font License.

## Disclaimer

Ressoar is a practice aid, not medical advice. Voice training carries some risk
of strain if done aggressively. If you can, work with a speech-language
pathologist or a qualified gender-affirming voice trainer, especially when
starting out. Be patient and kind to yourself; voice change takes time.
