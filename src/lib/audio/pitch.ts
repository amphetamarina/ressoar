import { PITCH } from "./constants";

const NOTES_EN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

export type Note = { name: string; namePt: string; midi: number; cents: number };

export function noteFromHz(hz: number): Note {
  const exact = 69 + 12 * Math.log2(hz / 440);
  const midi = Math.round(exact);
  const index = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return {
    name: `${NOTES_EN[index]}${octave}`,
    namePt: `${NOTES_PT[index]}${octave}`,
    midi,
    cents: Math.round((exact - midi) * 100),
  };
}

export function hzFromMidi(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

/**
 * Time-domain autocorrelation pitch estimate with parabolic peak interpolation.
 * Returns null when the frame is too quiet, unclear, or outside [minHz, maxHz].
 */
export function autoCorrelate(
  buf: Float32Array,
  sampleRate: number,
  minHz: number = PITCH.minHz,
  maxHz: number = PITCH.maxHz,
): number | null {
  let size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < PITCH.rmsGate) return null;

  let start = 0;
  let end = size - 1;
  const threshold = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < threshold) {
      start = i;
      break;
    }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < threshold) {
      end = size - i;
      break;
    }
  }
  const trimmed = buf.subarray(start, end);
  size = trimmed.length;

  const maxLag = Math.min(size - 2, Math.ceil(sampleRate / minHz) + 1);
  const minLag = Math.max(1, Math.floor(sampleRate / maxHz));
  if (maxLag <= minLag) return null;
  const correlation = new Float32Array(maxLag + 1);
  for (let lag = 0; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < size - lag; i++) sum += trimmed[i] * trimmed[i + lag];
    correlation[lag] = sum;
  }
  if (correlation[0] <= 0) return null;

  let lag = 0;
  while (lag < maxLag && correlation[lag] > correlation[lag + 1]) lag++;
  lag = Math.max(lag, minLag);

  let peak = -Infinity;
  let peakLag = -1;
  for (let i = lag; i <= maxLag; i++) {
    if (correlation[i] > peak) {
      peak = correlation[i];
      peakLag = i;
    }
  }
  if (peakLag <= 0 || peak / correlation[0] < PITCH.clarityGate) return null;

  let period = peakLag;
  const left = correlation[peakLag - 1];
  const mid = correlation[peakLag];
  const right = correlation[peakLag + 1] ?? mid;
  const shapeA = (left + right - 2 * mid) / 2;
  const shapeB = (right - left) / 2;
  if (shapeA) period = peakLag - shapeB / (2 * shapeA);

  const hz = sampleRate / period;
  return hz >= minHz && hz <= maxHz ? hz : null;
}

/** Median-of-3 (rejects single-frame octave jumps) followed by exponential smoothing. */
export class PitchSmoother {
  private window: number[] = [];
  private ema: number | null = null;
  private silentFrames = 0;

  constructor(
    private readonly windowSize = 3,
    private readonly alpha = 0.4,
  ) {}

  push(hz: number | null): number | null {
    if (hz === null) {
      this.silentFrames += 1;
      if (this.silentFrames >= 3) this.reset();
      return null;
    }
    this.silentFrames = 0;
    this.window.push(hz);
    if (this.window.length > this.windowSize) this.window.shift();
    const sorted = [...this.window].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    this.ema = this.ema === null ? median : this.ema + this.alpha * (median - this.ema);
    return this.ema;
  }

  reset(): void {
    this.window = [];
    this.ema = null;
    this.silentFrames = 0;
  }
}
