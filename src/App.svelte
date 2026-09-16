<script lang="ts">
  import TabBar from "./lib/components/TabBar.svelte";
  import ThemeToggle from "./lib/components/ThemeToggle.svelte";
  import LangToggle from "./lib/components/LangToggle.svelte";
  import Pitch from "./routes/Pitch.svelte";
  import Spectrogram from "./routes/Spectrogram.svelte";
  import Sentences from "./routes/Sentences.svelte";
  import Tones from "./routes/Tones.svelte";
  import Settings from "./routes/Settings.svelte";
  import { route } from "./lib/stores/route.svelte";
  import { settings } from "./lib/stores/settings.svelte";
  import { applyTheme } from "./lib/stores/theme";
  import { engine } from "./lib/audio/engine.svelte";
  import { untrack } from "svelte";
  import { locale, t } from "./lib/i18n/index.svelte";

  $effect(() => {
    void settings.theme;
    applyTheme();
  });

  $effect(() => {
    document.documentElement.lang = locale();
  });

  $effect(() => {
    const tab = route.current;
    untrack(() => {
      if (tab === "settings") engine.stop();
      else if (engine.granted && engine.status === "idle") void engine.start();
    });
  });

  $effect(() => {
    if (!location.hash) history.replaceState(null, "", route.href("pitch"));
  });
</script>

<div class="shell">
  <header class="top">
    <h1 class="brand"><a href={route.href("pitch")}>{t().appName}</a></h1>
    <div class="tabs"><TabBar /></div>
    <div class="actions">
      <LangToggle />
      <ThemeToggle />
    </div>
  </header>
  <main>
    {#if route.current === "pitch"}
      <Pitch />
    {:else if route.current === "spectrogram"}
      <Spectrogram />
    {:else if route.current === "sentences"}
      <Sentences />
    {:else if route.current === "tones"}
      <Tones />
    {:else}
      <Settings />
    {/if}
  </main>
  <div class="bottom"><TabBar /></div>
</div>

<style>
  .shell {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  .top {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--s-3);
    height: var(--header-h);
    padding: 0 var(--s-4);
    padding-top: env(safe-area-inset-top);
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
  }
  .brand {
    font-weight: 800;
    font-size: 1.25rem;
    letter-spacing: -0.01em;
  }
  .brand a {
    color: var(--accent);
    text-decoration: none;
  }
  .tabs {
    display: none;
  }
  .actions {
    display: flex;
    gap: var(--s-2);
  }
  main {
    flex: 1;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: var(--s-4);
    padding-bottom: calc(var(--tabbar-h) + env(safe-area-inset-bottom) + var(--s-4));
  }
  @media (min-width: 768px) {
    .tabs {
      display: block;
    }
    .bottom {
      display: none;
    }
    main {
      padding: var(--s-5);
    }
  }
</style>
