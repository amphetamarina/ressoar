<script lang="ts">
  import { engine } from "../audio/engine.svelte";
  import { settings } from "../stores/settings.svelte";
  import { t } from "../i18n/index.svelte";

  const replaying = $derived(engine.status === "replaying");
  const ready = $derived(engine.status === "listening" && engine.bufferedSeconds >= 1);
</script>

<div class="replay">
  <button
    type="button"
    class:primary={replaying}
    disabled={!ready && !replaying}
    onclick={() => (replaying ? engine.stopReplay() : engine.replay())}
    style="--progress: {Math.round(engine.replayProgress * 100)}%"
  >
    {#if replaying}
      ■ {t().replay.stop}
    {:else}
      ▶ {t().replay.listen(engine.bufferedSeconds >= 1 ? Math.min(settings.replaySeconds, Math.floor(engine.bufferedSeconds)) : settings.replaySeconds)}
    {/if}
  </button>
  <span class="small muted" role="status">
    {#if replaying}{t().replay.playing}{:else if !ready && engine.status === "listening"}{t().replay.buffering}{/if}
  </span>
</div>

<style>
  .replay {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-1);
  }
  button {
    width: 100%;
    max-width: 320px;
    position: relative;
    overflow: hidden;
  }
  button.primary::after {
    content: "";
    position: absolute;
    inset: auto 0 0 0;
    height: 4px;
    width: var(--progress);
    background: var(--accent-text);
    opacity: 0.7;
    transition: width 100ms linear;
  }
</style>
