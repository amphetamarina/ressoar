<script lang="ts">
  import { onMount } from "svelte";
  import Segmented from "../lib/components/Segmented.svelte";
  import { listMics } from "../lib/audio/mic";
  import { REPLAY_SECONDS } from "../lib/audio/constants";
  import { HZ_LIMITS, resetSettings, sanitize, settings } from "../lib/stores/settings.svelte";
  import { t } from "../lib/i18n/index.svelte";
  import pkg from "../../package.json";

  let mics = $state<MediaDeviceInfo[]>([]);
  let message = $state("");

  onMount(async () => {
    mics = await listMics().catch(() => []);
  });

  function applyRange(field: "minHz" | "maxHz", raw: string) {
    const clean = sanitize({ ...settings, [field]: Number(raw) });
    settings.minHz = clean.minHz;
    settings.maxHz = clean.maxHz;
  }

  function reset() {
    resetSettings();
    message = t().settings.resetDone;
  }
</script>

<section class="settings">
  <h2>{t().settings.title}</h2>

  <div class="card group">
    <div class="row">
      <span class="label">{t().settings.language}</span>
      <Segmented
        label={t().settings.language}
        bind:value={settings.lang}
        options={[
          { value: "pt", label: "Português" },
          { value: "en", label: "English" },
        ]}
      />
    </div>
    <div class="row">
      <span class="label">{t().settings.theme}</span>
      <Segmented
        label={t().settings.theme}
        bind:value={settings.theme}
        options={[
          { value: "system", label: t().theme.system },
          { value: "light", label: t().theme.light },
          { value: "dark", label: t().theme.dark },
        ]}
      />
    </div>
  </div>

  <div class="card group">
    <label class="row column">
      <span class="label">{t().settings.microphone}</span>
      <select bind:value={settings.micDeviceId}>
        <option value={null}>{t().settings.micDefault}</option>
        {#each mics as mic (mic.deviceId)}
          <option value={mic.deviceId}>{mic.label || mic.deviceId.slice(0, 8)}</option>
        {/each}
      </select>
      {#if mics.some((mic) => !mic.label)}
        <span class="small muted">{t().settings.micLabelsHint}</span>
      {/if}
    </label>
  </div>

  <div class="card group">
    <span class="label">{t().settings.graph}</span>
    <div class="range">
      <label>
        <span class="small muted">{t().settings.minHz}</span>
        <input type="number" min={HZ_LIMITS.min} max={HZ_LIMITS.max - HZ_LIMITS.gap} step="10" value={settings.minHz} onchange={(e) => applyRange("minHz", e.currentTarget.value)} />
      </label>
      <label>
        <span class="small muted">{t().settings.maxHz}</span>
        <input type="number" min={HZ_LIMITS.min + HZ_LIMITS.gap} max={HZ_LIMITS.max} step="10" value={settings.maxHz} onchange={(e) => applyRange("maxHz", e.currentTarget.value)} />
      </label>
    </div>
    <label class="check">
      <input type="checkbox" bind:checked={settings.showNoteNames} />
      {t().settings.showNotes}
    </label>
  </div>

  <div class="card group">
    <div class="row">
      <span class="label">{t().settings.replay}</span>
      <Segmented
        label={t().settings.replay}
        bind:value={settings.replaySeconds}
        options={REPLAY_SECONDS.map((seconds) => ({ value: seconds, label: t().settings.seconds(seconds) }))}
      />
    </div>
  </div>

  <div class="card group">
    <div class="row">
      <span class="label">{t().settings.tone}</span>
      <Segmented
        label={t().tones.waveform}
        bind:value={settings.tone.waveform}
        options={[
          { value: "sine", label: t().tones.sine },
          { value: "triangle", label: t().tones.triangle },
        ]}
      />
    </div>
    <label class="row">
      <span class="label">{t().tones.volume}</span>
      <input type="range" min="0" max="1" step="0.05" bind:value={settings.tone.volume} />
    </label>
  </div>

  <div class="card group">
    <button type="button" onclick={reset}>{t().settings.reset}</button>
    <span class="small muted" role="status">{message}</span>
  </div>

  <div class="card group about">
    <span class="label">{t().settings.about}</span>
    <p class="small">{t().settings.privacy}</p>
    <p class="small muted">{t().settings.bandsCaveat}</p>
    <p class="small muted">{t().settings.inspiredBy}</p>
    <p class="small muted">
      {t().settings.version} {pkg.version} ·
      <a href="https://github.com/amphetamarina/ressoar" target="_blank" rel="noopener noreferrer">{t().settings.source}</a> ·
      {t().settings.createdBy} · <a href="https://marinarosa.net" target="_blank" rel="noopener noreferrer">marinarosa.net</a>
    </p>
  </div>
</section>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
    max-width: 720px;
    margin: 0 auto;
    width: 100%;
  }
  .group {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-2) var(--s-4);
  }
  .row.column {
    flex-direction: column;
    align-items: stretch;
  }
  .label {
    font-weight: 600;
  }
  .range {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--s-3);
  }
  .range label {
    display: flex;
    flex-direction: column;
    gap: var(--s-1);
  }
  .check {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    min-height: 44px;
  }
  .check input {
    width: 20px;
    height: 20px;
    accent-color: var(--accent);
  }
  input[type="range"] {
    flex: 1;
    min-width: 160px;
  }
  .about {
    gap: var(--s-2);
  }
</style>
