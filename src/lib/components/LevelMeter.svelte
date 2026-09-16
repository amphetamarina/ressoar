<script lang="ts">
  import { engine } from "../audio/engine.svelte";
  import { t } from "../i18n/index.svelte";

  const MIN_DB = -60;
  const percent = $derived(Math.round(Math.min(100, Math.max(0, ((engine.dbfs - MIN_DB) / -MIN_DB) * 100))));
  const zone = $derived(engine.dbfs < -40 ? "quiet" : engine.dbfs > -6 ? "hot" : "ok");
</script>

<div class="meter" role="meter" aria-label={t().pitch.level} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
  <span class="label small muted">{t().pitch.level}</span>
  <div class="track">
    <div class="fill {zone}" style="width: {percent}%"></div>
  </div>
  <span class="zone small muted">{t().pitch[zone]}</span>
</div>

<style>
  .meter {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--s-3);
  }
  .track {
    height: 10px;
    border-radius: 999px;
    background: var(--surface-2);
    overflow: hidden;
  }
  .fill {
    height: 100%;
    border-radius: 999px;
    background: var(--band-a);
    transition: width 80ms linear;
  }
  .fill.quiet {
    background: var(--muted);
  }
  .fill.hot {
    background: var(--danger);
  }
  .zone {
    min-width: 3.5em;
    text-align: right;
  }
</style>
