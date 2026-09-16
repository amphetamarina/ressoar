<script lang="ts">
  import { t } from "../i18n/index.svelte";
  import type { Sentence } from "../sentences";

  let {
    sentence,
    index,
    total,
    onprevious,
    onnext,
    onshuffle,
  }: { sentence: Sentence; index: number; total: number; onprevious: () => void; onnext: () => void; onshuffle: () => void } =
    $props();
</script>

<div class="card sentence">
  <div class="top small muted">
    <span class="tag">{t().sentences.tags[sentence.tag]}</span>
    <span class="tabular">{t().sentences.counter(index + 1, total)}</span>
  </div>
  <p class="text" aria-live="polite">{sentence.text}</p>
  <div class="actions">
    <button type="button" onclick={onprevious}>‹ {t().sentences.previous}</button>
    <button type="button" onclick={onshuffle}>⤮ {t().sentences.shuffle}</button>
    <button type="button" class="primary" onclick={onnext}>{t().sentences.next} ›</button>
  </div>
</div>

<style>
  .sentence {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }
  .top {
    display: flex;
    justify-content: space-between;
  }
  .tag {
    text-transform: lowercase;
    background: var(--surface-2);
    padding: 1px 8px;
    border-radius: 999px;
  }
  .text {
    font-size: clamp(1.375rem, 5vw, 1.75rem);
    line-height: 1.35;
    text-align: center;
    min-height: 3lh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--s-2);
  }
  .actions button {
    padding: 0 var(--s-2);
    white-space: nowrap;
    font-size: 0.9375rem;
  }
</style>
