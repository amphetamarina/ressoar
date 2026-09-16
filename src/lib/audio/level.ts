export const LEVEL_FLOOR_DB = -100;

export function rmsDbfs(buf: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
  const rms = Math.sqrt(sum / buf.length);
  return rms > 0 ? Math.max(LEVEL_FLOOR_DB, 20 * Math.log10(rms)) : LEVEL_FLOOR_DB;
}

/** Fast attack, slow release, so peaks show immediately and the bar falls smoothly. */
export class LevelSmoother {
  private value = LEVEL_FLOOR_DB;

  constructor(
    private readonly attack = 0.8,
    private readonly release = 0.25,
  ) {}

  push(db: number): number {
    const k = db > this.value ? this.attack : this.release;
    this.value += k * (db - this.value);
    return this.value;
  }

  reset(): void {
    this.value = LEVEL_FLOOR_DB;
  }
}
