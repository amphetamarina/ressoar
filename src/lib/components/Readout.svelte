<script lang="ts">
  import { engine } from "../audio/engine.svelte";
  import { settings } from "../stores/settings.svelte";
  import { t } from "../i18n/index.svelte";

  let { compact = false }: { compact?: boolean } = $props();

  const hzText = $derived(engine.hz === null ? t().pitch.noVoice : String(Math.round(engine.hz)));
  const noteText = $derived(
    engine.note === null ? "" : settings.lang === "pt" ? `${engine.note.namePt} · ${engine.note.name}` : `${engine.note.name} · ${engine.note.namePt}`,
  );

  // Screen readers get a throttled announcement instead of 20 updates per second.
  let announced = $state("");
  $effect(() => {
    const timer = setInterval(() => {
      announced = engine.hz === null ? "" : `${Math.round(engine.hz)} ${t().pitch.hz}, ${engine.band ? t().bands[engine.band] : ""}`;
    }, 1000);
    return () => clearInterval(timer);
  });
</script>

<div class="readout" class:compact>
  <div class="hz tabular" aria-hidden="true">
    {hzText}<span class="unit">{t().pitch.hz}</span>
  </div>
  <div class="meta" aria-hidden="true">
    {#if engine.band}
      <span class="pill band-{engine.band}">{t().bands[engine.band]}</span>
    {/if}
    {#if settings.showNoteNames && noteText}
      <span class="note">{noteText}</span>
    {/if}
  </div>
  <span class="visually-hidden" role="status" aria-live="polite">{announced}</span>
</div>

<style>
  .readout {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-1);
  }
  .hz {
    font-size: clamp(3.5rem, 16vw, 5rem);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .unit {
    font-size: 0.35em;
    font-weight: 500;
    color: var(--muted);
    margin-left: 0.15em;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: var(--s-2);
    min-height: 28px;
    color: var(--muted);
  }
  .pill {
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text);
  }
  .band-masculine {
    background: color-mix(in srgb, var(--band-m) 28%, transparent);
  }
  .band-androgynous {
    background: color-mix(in srgb, var(--band-a) 28%, transparent);
  }
  .band-feminine {
    background: color-mix(in srgb, var(--band-f) 28%, transparent);
  }
  .compact {
    flex-direction: row;
    justify-content: center;
    gap: var(--s-3);
  }
  .compact .hz {
    font-size: 1.75rem;
  }
  .compact .meta {
    min-height: 0;
  }
</style>
