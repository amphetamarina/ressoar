<script lang="ts">
  import { engine, history, HISTORY_LENGTH } from "../audio/engine.svelte";
  import { SPECTRUM } from "../audio/constants";
  import { settings } from "../stores/settings.svelte";
  import { t } from "../i18n/index.svelte";
  import { cssVars, drawContext, logScale, sizedCanvas } from "../canvas";

  let canvas = $state<HTMLCanvasElement | null>(null);
  const data = document.createElement("canvas");
  let lut: string[] = [];
  let lutTheme = "";
  let lastTick = -1;

  function buildLut(bg: string, dark: boolean) {
    const stops = dark ? [bg, "#2f2a6e", "#7b5cf0", "#ff7ab6", "#ffd166"] : [bg, "#d9d1ff", "#7b5cf0", "#d43f8d", "#ff9f1c"];
    const scratch = document.createElement("canvas");
    scratch.width = 256;
    scratch.height = 1;
    const ctx = scratch.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    stops.forEach((color, index) => gradient.addColorStop(index / (stops.length - 1), color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 1);
    const pixels = ctx.getImageData(0, 0, 256, 1).data;
    lut = Array.from({ length: 256 }, (_, i) => `rgb(${pixels[i * 4]}, ${pixels[i * 4 + 1]}, ${pixels[i * 4 + 2]})`);
  }

  function reset() {
    if (!canvas) return;
    data.width = canvas.width;
    data.height = canvas.height;
    lastTick = -1;
    draw();
  }

  function draw() {
    if (!canvas) return;
    const frame = drawContext(canvas);
    if (!frame) return;
    const { ctx, width, height } = frame;
    const dpr = width / canvas.clientWidth || 1;
    const vars = cssVars(["--canvas-bg", "--grid", "--muted", "--trace"]);
    const themeKey = vars["--canvas-bg"];
    if (lutTheme !== themeKey) {
      buildLut(themeKey, themeKey.toLowerCase() !== "#ffffff");
      lutTheme = themeKey;
    }
    if (data.width !== width || data.height !== height) {
      data.width = width;
      data.height = height;
    }
    const step = width / HISTORY_LENGTH;
    const column = Math.ceil(step);
    const dctx = data.getContext("2d")!;

    if (engine.tick !== lastTick && engine.status !== "idle") {
      lastTick = engine.tick;
      dctx.drawImage(data, -step, 0);
      dctx.fillStyle = vars["--canvas-bg"];
      dctx.fillRect(width - column, 0, column, height);
      const spectrum = engine.spectrum;
      const binHz = engine.spectrumBinHz;
      if (binHz > 0) {
        const rows = 2 * dpr;
        for (let py = 0; py < height; py += rows) {
          const ratio = 1 - py / height;
          const hz = SPECTRUM.minHz * (SPECTRUM.maxHz / SPECTRUM.minHz) ** ratio;
          const bin = Math.min(spectrum.length - 1, Math.round(hz / binHz));
          const level = Math.min(1, Math.max(0, (spectrum[bin] - SPECTRUM.minDb) / (SPECTRUM.maxDb - SPECTRUM.minDb)));
          dctx.fillStyle = lut[Math.round(level * 255)];
          dctx.fillRect(width - column, py, column, rows);
        }
      }
    }

    ctx.fillStyle = vars["--canvas-bg"];
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(data, 0, 0);

    ctx.strokeStyle = vars["--grid"];
    ctx.fillStyle = vars["--muted"];
    ctx.lineWidth = dpr;
    ctx.font = `${11 * dpr}px ${getComputedStyle(canvas).fontFamily}`;
    ctx.textBaseline = "bottom";
    for (const hz of [100, 200, 500, 1000, 2000, 3000, 4000]) {
      const py = height - logScale(hz, SPECTRUM.minHz, SPECTRUM.maxHz) * height;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();
      ctx.fillText(hz >= 1000 ? `${hz / 1000}k` : `${hz}`, 6 * dpr, py - 2 * dpr);
    }

    ctx.strokeStyle = vars["--trace"];
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath();
    let drawing = false;
    for (let i = 0; i < HISTORY_LENGTH; i++) {
      const hz = history[i];
      if (Number.isNaN(hz)) {
        drawing = false;
        continue;
      }
      const px = i * step + step / 2;
      const py = height - logScale(hz, SPECTRUM.minHz, SPECTRUM.maxHz) * height;
      if (drawing) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
      drawing = true;
    }
    ctx.stroke();
  }

  $effect(() => {
    void engine.tick;
    void settings.theme;
    draw();
  });
</script>

<div class="frame" role="img" aria-label={t().spectrogram.graphLabel}>
  <canvas bind:this={canvas} use:sizedCanvas={reset}></canvas>
</div>

<style>
  .frame {
    width: 100%;
    height: 100%;
  }
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: var(--r-m);
    background: var(--canvas-bg);
  }
</style>
