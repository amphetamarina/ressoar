<script lang="ts">
  import { engine } from "../audio/engine.svelte";
  import { t } from "../i18n/index.svelte";

  const percent = $derived(Math.round(engine.brightness * 100));
</script>

<div class="hint">
  <div class="row">
    <span class="small muted">{t().spectrogram.dark}</span>
    <div class="track" role="meter" aria-label={t().spectrogram.brightness} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
      <div class="marker" style="left: {percent}%"></div>
    </div>
    <span class="small muted">{t().spectrogram.bright}</span>
  </div>
  <p class="small muted">{t().spectrogram.hint}</p>
</div>

<style>
  .hint {
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
  }
  .row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--s-3);
  }
  .track {
    position: relative;
    height: 12px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--band-m), var(--band-a), var(--band-f));
    opacity: 0.9;
  }
  .marker {
    position: absolute;
    top: 50%;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--surface);
    border: 3px solid var(--text);
    transform: translate(-50%, -50%);
    transition: left 120ms linear;
  }
</style>
