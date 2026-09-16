# Ressoar

A small, private web app for voice training, built for trans women and anyone
working on their voice. It shows your pitch in real time, lets you hear what you
just said, and gives you sentences and reference tones to practice with. No
account, no uploads: nothing leaves your device.

The name comes from the Portuguese verb "to resonate". The feature set is
inspired by the Voice Tools app.

## What it does

- **Pitch.** A live graph of your pitch over the last 12 seconds with three
  colored ranges (masculine, androgynous, feminine), a large Hz readout, the
  nearest note (in English and Portuguese solfège), and a volume meter.
- **Replay.** Hear the last 10, 20 or 30 seconds of your voice. The audio only
  ever lives in memory and is gone as soon as it scrolls out of the buffer.
- **Spectrum.** A scrolling spectrogram with a simple "dark to bright"
  resonance hint.
- **Sentences.** About a hundred short sentences per language, grouped by
  sound (vowels, nasals, fricatives, plosives, liquids, questions, longer
  mixed sentences), to read aloud while you watch your pitch.
- **Tones.** A reference tone you can match by ear: pick a note or an exact
  frequency, choose a soft or bright timbre, and set the volume.
- **Settings.** Language (Portuguese default, English), light or dark theme,
  microphone, graph range, replay length, tone defaults.

The pitch ranges are rough perceptual guides, not classifications. Voices of
any gender can sit in any range, and resonance, intonation and weight matter at
least as much as pitch. The thresholds live in `src/lib/audio/constants.ts`.

## Privacy

Everything runs in your browser. The microphone feeds a live analysis and a
short in-memory buffer for replay. No audio is written to disk or sent
anywhere. Settings are stored in your browser's local storage.

## Running locally

The project uses [mise](https://mise.jdx.dev/) to pin Bun.

```sh
mise install
bun install
bun run dev
```

Open the printed URL. The microphone works on `localhost` without HTTPS; on a
deployed site it requires HTTPS.

## Checks and tests

```sh
bun run check       # svelte-check (TypeScript + Svelte)
bun run test:unit   # Vitest: pitch detection, note names, ring buffer
bun run test        # Playwright end-to-end (builds and previews the app)
```

The Playwright suite uses a system Chromium if one is installed at a standard
path; otherwise run `bunx playwright install chromium` once.

On NixOS the downloaded browser cannot start. Point the suite at a
Nix-provided Chromium instead:

```sh
PLAYWRIGHT_CHROMIUM_PATH="$(nix-shell -p chromium --run 'readlink -f "$(which chromium)"')" bun run test
```

## Deploying

`bun run build` produces a static site in `dist/`. A Vercel configuration is
included; import the repository and deploy. Any static host with HTTPS works.

## Credits and disclaimer

Created by Marina Rosa. Ressoar is a practice aid, not medical advice. Warm up
gently and stop if anything hurts. If you can, work with a speech-language
pathologist or a gender-affirming voice trainer.
