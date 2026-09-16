<script lang="ts">
  import { engine } from "../audio/engine.svelte";
  import { t } from "../i18n/index.svelte";

  let retryButton = $state<HTMLButtonElement | null>(null);

  $effect(() => {
    if (engine.status === "error") retryButton?.focus({ preventScroll: true });
  });
</script>

{#if engine.status === "idle"}
  <div class="gate">
    <button class="primary big" type="button" onclick={() => engine.start()}>🎙 {t().mic.enable}</button>
    <p class="muted small">{t().mic.idleHint}</p>
  </div>
{:else if engine.status === "requesting"}
  <div class="gate" role="status" aria-live="polite">
    <p>{t().mic.connecting}</p>
  </div>
{:else if engine.status === "error"}
  <div class="gate error" role="alert">
    <p>{t().mic[engine.error ?? "unknown"]}</p>
    <button type="button" bind:this={retryButton} onclick={() => engine.start()}>{t().mic.retry}</button>
  </div>
{/if}

<style>
  .gate {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
    text-align: center;
    padding: var(--s-5) var(--s-4);
  }
  .big {
    min-height: 56px;
    padding: 0 var(--s-6);
    font-size: 1.125rem;
    border-radius: 28px;
  }
  .error p {
    color: var(--danger);
    max-width: 40ch;
  }
</style>
