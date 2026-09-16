<script lang="ts">
  import MicGate from "../lib/components/MicGate.svelte";
  import Readout from "../lib/components/Readout.svelte";
  import PitchGraph from "../lib/components/PitchGraph.svelte";
  import LevelMeter from "../lib/components/LevelMeter.svelte";
  import ReplayButton from "../lib/components/ReplayButton.svelte";
  import BandLegend from "../lib/components/BandLegend.svelte";
  import { t } from "../lib/i18n/index.svelte";
</script>

<section class="pitch">
  <div class="side">
    <Readout />
    <div class="controls">
      <LevelMeter />
      <ReplayButton />
    </div>
  </div>
  <div class="graph-area">
    <div class="graph"><PitchGraph /></div>
    <div class="gate"><MicGate /></div>
  </div>
  <div class="foot">
    <BandLegend />
    <p class="small muted">{t().mic.headphones}</p>
  </div>
</section>

<style>
  .pitch {
    display: flex;
    flex-direction: column;
    gap: var(--s-4);
  }
  .side {
    display: contents;
  }
  .graph-area {
    order: 1;
  }
  .controls {
    order: 2;
  }
  .foot {
    order: 3;
  }
  .controls {
    display: flex;
    flex-direction: column;
    gap: var(--s-3);
  }
  .graph-area {
    position: relative;
  }
  .graph {
    height: min(46vh, 420px);
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
  .foot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-2);
    text-align: center;
  }
  @media (min-width: 768px) {
    .pitch {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-areas:
        "graph side"
        "foot foot";
      align-items: start;
      gap: var(--s-5);
    }
    .graph-area {
      grid-area: graph;
    }
    .graph {
      height: 440px;
    }
    .side {
      display: flex;
      flex-direction: column;
      grid-area: side;
      justify-content: center;
      min-height: 440px;
      gap: var(--s-6);
    }
    .foot {
      grid-area: foot;
    }
  }
</style>
