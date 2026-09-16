<script lang="ts">
  import { route, TABS, type Tab } from "../stores/route.svelte";
  import { t } from "../i18n/index.svelte";

  const icons: Record<Tab, string> = {
    pitch: "〰",
    spectrogram: "▦",
    sentences: "❝",
    tones: "♪",
    settings: "⚙",
  };
</script>

<nav class="tabbar" aria-label={t().appName}>
  {#each TABS as tab (tab)}
    <a href={route.href(tab)} class="tab" aria-current={route.current === tab ? "page" : undefined}>
      <span class="icon" aria-hidden="true">{icons[tab]}</span>
      <span class="label">{t().tabs[tab]}</span>
    </a>
  {/each}
</nav>

<style>
  .tabbar {
    position: fixed;
    inset: auto 0 0 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: var(--surface);
    border-top: 1px solid var(--border);
    z-index: 10;
  }
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.75rem;
    min-height: var(--tabbar-h);
  }
  .tab[aria-current="page"] {
    color: var(--accent);
    font-weight: 600;
  }
  .icon {
    font-size: 1.25rem;
    line-height: 1;
  }
  @media (min-width: 768px) {
    .tabbar {
      position: static;
      display: flex;
      height: auto;
      padding: 0;
      background: transparent;
      border: 0;
      gap: var(--s-1);
    }
    .tab {
      flex-direction: row;
      gap: var(--s-2);
      min-height: 40px;
      padding: 0 var(--s-3);
      border-radius: var(--r-m);
      font-size: 0.9375rem;
    }
    .tab:hover {
      background: var(--surface-2);
    }
    .tab[aria-current="page"] {
      background: var(--surface-2);
    }
    .icon {
      font-size: 1rem;
    }
  }
</style>
