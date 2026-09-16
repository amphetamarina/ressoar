export type DrawContext = { ctx: CanvasRenderingContext2D; width: number; height: number };

/**
 * Svelte action: keeps a canvas sized to its CSS box at device pixel ratio (max 2)
 * and calls `redraw` after each resize. Returns the current drawing context.
 */
export function sizedCanvas(node: HTMLCanvasElement, onResize: () => void) {
  const observer = new ResizeObserver(() => {
    resize();
    onResize();
  });
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = node.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (node.width !== width || node.height !== height) {
      node.width = width;
      node.height = height;
    }
  }
  resize();
  observer.observe(node);
  return {
    destroy() {
      observer.disconnect();
    },
  };
}

export function drawContext(node: HTMLCanvasElement): DrawContext | null {
  const ctx = node.getContext("2d");
  return ctx ? { ctx, width: node.width, height: node.height } : null;
}

let cachedVars: Record<string, string> | null = null;
let cachedTheme = "";

/** Reads CSS custom properties once per theme so canvases follow the design tokens. */
export function cssVars(names: string[]): Record<string, string> {
  const theme = document.documentElement.getAttribute("data-theme") ?? `system:${matchMedia("(prefers-color-scheme: dark)").matches}`;
  if (!cachedVars || cachedTheme !== theme) {
    const style = getComputedStyle(document.documentElement);
    cachedVars = Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()]));
    cachedTheme = theme;
  }
  return cachedVars;
}

export function invalidateCssVars(): void {
  cachedVars = null;
}

export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function logScale(hz: number, minHz: number, maxHz: number): number {
  return (Math.log(hz) - Math.log(minHz)) / (Math.log(maxHz) - Math.log(minHz));
}
