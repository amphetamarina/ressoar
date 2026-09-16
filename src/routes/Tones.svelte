<script lang="ts">
  import MicGate from "../lib/components/MicGate.svelte";
  import Readout from "../lib/components/Readout.svelte";
  import ToneControl from "../lib/components/ToneControl.svelte";
  import { t } from "../lib/i18n/index.svelte";
</script>

<section class="tones">
  <header>
    <h2>{t().tones.title}</h2>
    <p class="muted">{t().tones.intro}</p>
  </header>
  <ToneControl />
  <div class="live">
    <Readout compact />
    <MicGate />
  </div>
</section>

<style>
  .tones {
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
