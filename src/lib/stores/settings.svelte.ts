import { GRAPH } from "../audio/constants";
import { migrateLegacyStorage, STORAGE_KEY } from "./migrate";

export type Lang = "pt" | "en";
export type Theme = "system" | "light" | "dark";
export type ReplaySeconds = 10 | 20 | 30;
export type Waveform = "sine" | "triangle";

export type Settings = {
  version: 1;
  lang: Lang;
  theme: Theme;
  replaySeconds: ReplaySeconds;
  minHz: number;
  maxHz: number;
  showNoteNames: boolean;
  micDeviceId: string | null;
  tone: { waveform: Waveform; volume: number; hz: number };
};

export const HZ_LIMITS = { min: 50, max: 800, gap: 50 } as const;

const DEFAULTS: Settings = {
  version: 1,
  lang: "pt",
  theme: "system",
  replaySeconds: 10,
  minHz: GRAPH.defaultMinHz,
  maxHz: GRAPH.defaultMaxHz,
  showNoteNames: true,
  micDeviceId: null,
  tone: { waveform: "sine", volume: 0.4, hz: 196 },
};

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

function oneOf<T>(value: unknown, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly unknown[]).includes(value) ? (value as T) : fallback;
}

export function sanitize(raw: unknown): Settings {
  const input = (raw && typeof raw === "object" ? raw : {}) as Partial<Settings>;
  const tone = (input.tone && typeof input.tone === "object" ? input.tone : {}) as Partial<Settings["tone"]>;
  let minHz = clampNumber(input.minHz, HZ_LIMITS.min, HZ_LIMITS.max - HZ_LIMITS.gap, DEFAULTS.minHz);
  let maxHz = clampNumber(input.maxHz, HZ_LIMITS.min + HZ_LIMITS.gap, HZ_LIMITS.max, DEFAULTS.maxHz);
  if (maxHz - minHz < HZ_LIMITS.gap) {
    minHz = DEFAULTS.minHz;
    maxHz = DEFAULTS.maxHz;
  }
  return {
    version: 1,
    lang: oneOf(input.lang, ["pt", "en"] as const, DEFAULTS.lang),
    theme: oneOf(input.theme, ["system", "light", "dark"] as const, DEFAULTS.theme),
    replaySeconds: oneOf(input.replaySeconds, [10, 20, 30] as const, DEFAULTS.replaySeconds),
    minHz: Math.round(minHz),
    maxHz: Math.round(maxHz),
    showNoteNames: typeof input.showNoteNames === "boolean" ? input.showNoteNames : DEFAULTS.showNoteNames,
    micDeviceId: typeof input.micDeviceId === "string" && input.micDeviceId ? input.micDeviceId : null,
    tone: {
      waveform: oneOf(tone.waveform, ["sine", "triangle"] as const, DEFAULTS.tone.waveform),
      volume: clampNumber(tone.volume, 0, 1, DEFAULTS.tone.volume),
      hz: Math.round(clampNumber(tone.hz, 60, 600, DEFAULTS.tone.hz)),
    },
  };
}

function load(): Settings {
  migrateLegacyStorage();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return sanitize(stored ? JSON.parse(stored) : {});
  } catch {
    return { ...DEFAULTS, tone: { ...DEFAULTS.tone } };
  }
}

export const settings: Settings = $state(load());

let saveTimer: ReturnType<typeof setTimeout> | undefined;

$effect.root(() => {
  $effect(() => {
    const snapshot = JSON.stringify($state.snapshot(settings));
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, snapshot);
      } catch {
        // Storage may be unavailable (private mode, quota); settings still work in memory.
      }
    }, 100);
  });
});

export function resetSettings(): void {
  Object.assign(settings, sanitize({}));
}
