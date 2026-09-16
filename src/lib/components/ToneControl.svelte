<script lang="ts">
  import { engine } from "../audio/engine.svelte";
  import { hzFromMidi, noteFromHz } from "../audio/pitch";
  import { settings } from "../stores/settings.svelte";
  import { t } from "../i18n/index.svelte";
  import Segmented from "./Segmented.svelte";

  const PRESETS = [150, 175, 200, 220, 250];
  const NOTE_OPTIONS = Array.from({ length: 37 }, (_, i) => 36 + i); // C2..C5

  let playing = $state(false);
  const note = $derived(noteFromHz(settings.tone.hz));

  function setHz(hz: number) {
    settings.tone.hz = Math.round(Math.min(600, Math.max(60, hz)));
    if (playing) engine.tone().setHz(settings.tone.hz);
  }

  async function toggle() {
    if (playing) {
      engine.tone().stop();
      playing = false;
      return;
    }
    await engine.tone().play(settings.tone.hz, settings.tone.waveform, settings.tone.volume);
    playing = true;
  }

  $effect(() => () => {
    if (playing) engine.tone().stop();
  });
</script>

<div class="tone card">
  <div class="hz tabular" aria-live="polite">
    {settings.tone.hz}<span class="unit">Hz</span>
    <span class="note muted">{settings.lang === "pt" ? note.namePt : note.name}</span>
  </div>

  <button type="button" class="primary play" class:playing onclick={toggle} aria-pressed={playing}>
    {playing ? `■ ${t().tones.stop}` : `▶ ${t().tones.play}`}
  </button>

  <div class="steppers">
    <button type="button" onclick={() => setHz(hzFromMidi(note.midi - 1))} aria-label={t().tones.semitoneDown}>♭</button>
    <button type="button" onclick={() => setHz(settings.tone.hz - 1)} aria-label={t().tones.hzDown}>−1</button>
    <label class="select">
      <span class="visually-hidden">{t().tones.note}</span>
      <select value={note.midi} onchange={(event) => setHz(hzFromMidi(Number(event.currentTarget.value)))}>
        {#each NOTE_OPTIONS as midi (midi)}
          {@const option = noteFromHz(hzFromMidi(midi))}
          <option value={midi}>{settings.lang === "pt" ? option.namePt : option.name}</option>
        {/each}
      </select>
    </label>
    <button type="button" onclick={() => setHz(settings.tone.hz + 1)} aria-label={t().tones.hzUp}>+1</button>
    <button type="button" onclick={() => setHz(hzFromMidi(note.midi + 1))} aria-label={t().tones.semitoneUp}>♯</button>
  </div>

  <div class="presets" aria-label={t().tones.presets}>
    {#each PRESETS as preset (preset)}
      <button type="button" class:active={settings.tone.hz === preset} onclick={() => setHz(preset)}>{preset}</button>
    {/each}
  </div>

  <div class="options">
    <Segmented
      label={t().tones.waveform}
      bind:value={settings.tone.waveform}
      options={[
        { value: "sine", label: t().tones.sine },
        { value: "triangle", label: t().tones.triangle },
      ]}
      onchange={(waveform) => playing && engine.tone().play(settings.tone.hz, waveform, settings.tone.volume)}
    />
    <label class="volume">
      <span class="small muted">{t().tones.volume}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        bind:value={settings.tone.volume}
        oninput={() => engine.tone().setVolume(settings.tone.volume)}
      />
    </label>
  </div>
  <p class="small muted">{t().tones.headphones}</p>
</div>

<style>
  .tone {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-4);
  }
  .hz {
    font-size: 3rem;
    font-weight: 700;
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: var(--s-2);
  }
  .unit {
    font-size: 1rem;
    color: var(--muted);
  }
  .note {
    font-size: 1.25rem;
    font-weight: 500;
  }
  .play {
    min-height: 56px;
    min-width: 200px;
    font-size: 1.125rem;
    border-radius: 28px;
  }
  .steppers {
    display: grid;
    grid-template-columns: 44px 52px 1fr 52px 44px;
    gap: var(--s-2);
    width: 100%;
    max-width: 480px;
  }
  .steppers button {
    padding: 0;
  }
  .select select {
    min-width: 0;
  }
  .presets {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--s-2);
  }
  .presets button {
    min-height: 36px;
    padding: 0 var(--s-3);
    border-radius: 999px;
  }
  .presets button.active {
    border-color: var(--accent);
    color: var(--accent);
    font-weight: 600;
  }
  .options {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--s-4);
    width: 100%;
  }
  .volume {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    min-width: 200px;
    flex: 1;
  }
</style>
