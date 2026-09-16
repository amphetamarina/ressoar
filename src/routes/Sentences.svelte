<script lang="ts">
  import MicGate from "../lib/components/MicGate.svelte";
  import Readout from "../lib/components/Readout.svelte";
  import SentenceCard from "../lib/components/SentenceCard.svelte";
  import { sentencesFor } from "../lib/sentences";
  import { settings } from "../lib/stores/settings.svelte";
  import { t } from "../lib/i18n/index.svelte";

  const list = $derived(sentencesFor(settings.lang));
  let index = $state(0);

  $effect(() => {
    if (index >= list.length) index = 0;
  });

  function shuffle() {
    if (list.length < 2) return;
    let next = index;
    while (next === index) next = Math.floor(Math.random() * list.length);
    index = next;
  }
</script>

<section class="sentences">
  <header>
    <h2>{t().sentences.title}</h2>
    <p class="muted">{t().sentences.intro}</p>
  </header>
  <div class="live">
    <Readout compact />
    <MicGate />
  </div>
  <SentenceCard
    sentence={list[index]}
    {index}
    total={list.length}
    onprevious={() => (index = (index - 1 + list.length) % list.length)}
    onnext={() => (index = (index + 1) % list.length)}
    onshuffle={shuffle}
  />
</section>

<style>
  .sentences {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
    max-width: 720px;
    margin: 0 auto;
    width: 100%;
  }
  header {
    display: flex;
    flex-direction: column;
    gap: var(--s-1);
  }
  .live {
    display: flex;
    flex-direction: column;
    gap: var(--s-2);
  }
</style>
