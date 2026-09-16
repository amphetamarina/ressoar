<script lang="ts">
  import MicGate from "../lib/components/MicGate.svelte";
  import Readout from "../lib/components/Readout.svelte";
  import SpectrogramCanvas from "../lib/components/SpectrogramCanvas.svelte";
  import BrightnessHint from "../lib/components/BrightnessHint.svelte";
</script>

<section class="spectrogram">
  <Readout compact />
  <div class="graph-area">
    <div class="graph"><SpectrogramCanvas /></div>
    <div class="gate"><MicGate /></div>
  </div>
  <div class="card"><BrightnessHint /></div>
</section>

<style>
  .spectrogram {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }
  .graph-area {
    position: relative;
  }
  .graph {
    height: min(52vh, 480px);
  }
  .gate {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
  .gate > :global(*) {
    pointer-events: auto;
    background: color-mix(in srgb, var(--surface) 88%, transparent);
    border-radius: var(--r-l);
    backdrop-filter: blur(4px);
  }
</style>
