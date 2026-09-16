/**
 * Pitch band thresholds in Hz. Rough perceptual guides, not classifications.
 * TODO: verify/tune. Common references put masculine speaking pitch around 85–155 Hz,
 * feminine around 165–255 Hz, with an androgynous region in between.
 */
export const BANDS = { masculineMaxHz: 150, androgynousMaxHz: 180 } as const;

export type Band = "masculine" | "androgynous" | "feminine";

export function bandFor(hz: number): Band {
  if (hz < BANDS.masculineMaxHz) return "masculine";
  if (hz < BANDS.androgynousMaxHz) return "androgynous";
  return "feminine";
}

export const PITCH = { minHz: 60, maxHz: 500, rmsGate: 0.01, clarityGate: 0.5, intervalMs: 50, fftSize: 4096 } as const;
export const GRAPH = { seconds: 12, defaultMinHz: 80, defaultMaxHz: 400 } as const;
export const SPECTRUM = { minHz: 80, maxHz: 5000, minDb: -100, maxDb: -20 } as const;
export const REPLAY_SECONDS = [10, 20, 30] as const;
export const MAX_REPLAY_SECONDS = 30;
