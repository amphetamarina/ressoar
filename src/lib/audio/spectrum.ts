const CENTROID_LOW_HZ = 800;
const CENTROID_HIGH_HZ = 3000;

/**
 * Spectral centroid of the dB magnitude spectrum within [lo, hi] Hz, mapped
 * log-linearly to 0..1 (800 Hz -> 0, 3000 Hz -> 1). A cheap "dark vs bright" hint.
 */
export function brightness(magsDb: Float32Array, binHz: number, lo = 300, hi = 5000): number {
  const start = Math.max(1, Math.ceil(lo / binHz));
  const end = Math.min(magsDb.length - 1, Math.floor(hi / binHz));
  let weighted = 0;
  let total = 0;
  for (let bin = start; bin <= end; bin++) {
    const power = 10 ** (magsDb[bin] / 10);
    weighted += bin * binHz * power;
    total += power;
  }
  if (!total) return 0;
  const centroid = weighted / total;
  const position = (Math.log(centroid) - Math.log(CENTROID_LOW_HZ)) / (Math.log(CENTROID_HIGH_HZ) - Math.log(CENTROID_LOW_HZ));
  return Math.min(1, Math.max(0, position));
}

export class BrightnessSmoother {
  private value = 0;

  constructor(private readonly alpha = 0.2) {}

  push(next: number): number {
    this.value += this.alpha * (next - this.value);
    return this.value;
  }
}
