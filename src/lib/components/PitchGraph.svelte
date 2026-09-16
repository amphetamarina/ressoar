<script lang="ts">
  import { engine, history, HISTORY_LENGTH } from "../audio/engine.svelte";
  import { BANDS } from "../audio/constants";
  import { settings } from "../stores/settings.svelte";
  import { t } from "../i18n/index.svelte";
  import { cssVars, drawContext, logScale, sizedCanvas, withAlpha } from "../canvas";

  let canvas = $state<HTMLCanvasElement | null>(null);

  function y(hz: number, height: number): number {
    return height - logScale(hz, settings.minHz, settings.maxHz) * height;
  }

  function draw() {
    if (!canvas) return;
    const frame = drawContext(canvas);
    if (!frame) return;
    const { ctx, width, height } = frame;
    const dpr = width / canvas.clientWidth || 1;
    const vars = cssVars(["--canvas-bg", "--band-m", "--band-a", "--band-f", "--band-alpha", "--grid", "--muted", "--trace", "--text"]);
    const alpha = Number(vars["--band-alpha"]) || 0.14;
    const { minHz, maxHz } = settings;

    ctx.fillStyle = vars["--canvas-bg"];
    ctx.fillRect(0, 0, width, height);

    const bands: [number, number, string, string][] = [
      [minHz, BANDS.masculineMaxHz, vars["--band-m"], t().bands.masculine],
      [BANDS.masculineMaxHz, BANDS.androgynousMaxHz, vars["--band-a"], t().bands.androgynous],
      [BANDS.androgynousMaxHz, maxHz, vars["--band-f"], t().bands.feminine],
    ];
    ctx.font = `600 ${12 * dpr}px ${getComputedStyle(canvas).fontFamily}`;
    ctx.textBaseline = "middle";
    for (const [from, to, color, label] of bands) {
      const lo = Math.max(minHz, from);
      const hi = Math.min(maxHz, to);
      if (hi <= lo) continue;
      const top = y(hi, height);
      const bottom = y(lo, height);
      ctx.fillStyle = withAlpha(color, alpha);
      ctx.fillRect(0, top, width, bottom - top);
      ctx.fillStyle = color;
      ctx.textAlign = "right";
      ctx.fillText(label, width - 8 * dpr, Math.min(bottom - 10 * dpr, Math.max(top + 10 * dpr, (top + bottom) / 2)));
    }

    ctx.strokeStyle = vars["--grid"];
    ctx.lineWidth = 1 * dpr;
    ctx.fillStyle = vars["--muted"];
    ctx.textAlign = "left";
    ctx.font = `${11 * dpr}px ${getComputedStyle(canvas).fontFamily}`;
    for (let hz = 50; hz <= maxHz; hz += 50) {
      if (hz <= minHz) continue;
      const line = y(hz, height);
      ctx.beginPath();
      ctx.moveTo(0, line);
      ctx.lineTo(width, line);
      ctx.stroke();
      ctx.fillText(`${hz}`, 6 * dpr, line - 7 * dpr);
    }

    ctx.strokeStyle = vars["--trace"];
    ctx.lineWidth = 2.5 * dpr;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    let drawing = false;
    const step = width / (HISTORY_LENGTH - 1);
    for (let i = 0; i < HISTORY_LENGTH; i++) {
      const hz = history[i];
      if (Number.isNaN(hz)) {
        drawing = false;
        continue;
      }
      const px = i * step;
      const py = Math.min(height + 4, Math.max(-4, y(hz, height)));
      if (drawing) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
      drawing = true;
    }
    ctx.stroke();

    if (engine.hz !== null) {
      const py = Math.min(height, Math.max(0, y(engine.hz, height)));
      ctx.fillStyle = vars["--trace"];
      ctx.beginPath();
      ctx.arc(width - 1, py, 5 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  $effect(() => {
    void engine.tick;
    void settings.minHz;
    void settings.maxHz;
    void settings.theme;
    void settings.lang;
    draw();
  });
</script>

<div class="frame" role="img" aria-label={t().pitch.graphLabel}>
  <canvas bind:this={canvas} use:sizedCanvas={draw}></canvas>
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
