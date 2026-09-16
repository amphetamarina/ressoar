import { bandFor, GRAPH, MAX_REPLAY_SECONDS, PITCH, type Band } from "./constants";
import { classifyMicError, openMic, type MicErrorKind } from "./mic";
import { autoCorrelate, noteFromHz, PitchSmoother, type Note } from "./pitch";
import { LevelSmoother, LEVEL_FLOOR_DB, rmsDbfs } from "./level";
import { brightness, BrightnessSmoother } from "./spectrum";
import { RingBuffer } from "./ringBuffer";
import { ToneGenerator } from "./tones";
import { settings } from "../stores/settings.svelte";

export type EngineStatus = "idle" | "requesting" | "listening" | "replaying" | "error";

export const HISTORY_LENGTH = Math.round((GRAPH.seconds * 1000) / PITCH.intervalMs);

const state = $state({
  status: "idle" as EngineStatus,
  error: null as MicErrorKind | null,
  hz: null as number | null,
  band: null as Band | null,
  note: null as Note | null,
  dbfs: LEVEL_FLOOR_DB,
  brightness: 0,
  bufferedSeconds: 0,
  replayProgress: 0,
  /** Increments on every analysis frame; canvases redraw when it changes. */
  tick: 0,
});

/** Pitch history in Hz, oldest first; NaN marks unvoiced frames. Not reactive: read on `tick`. */
export const history = new Float32Array(HISTORY_LENGTH).fill(NaN);

let spectrum = new Float32Array(PITCH.fftSize / 2).fill(-Infinity);
let spectrumBinHz = 0;

let ctx: AudioContext | null = null;
let stream: MediaStream | null = null;
let source: MediaStreamAudioSourceNode | null = null;
let analyser: AnalyserNode | null = null;
let captureNode: AudioNode | null = null;
let workletLoaded = false;
let ring: RingBuffer | null = null;
let interval: ReturnType<typeof setInterval> | undefined;
let replaySource: AudioBufferSourceNode | null = null;
let replayTimer: ReturnType<typeof setInterval> | undefined;
let toneGenerator: ToneGenerator | null = null;
let granted = false;
let resumeOnVisible = false;
let timeBuffer = new Float32Array(PITCH.fftSize);

const pitchSmoother = new PitchSmoother();
const levelSmoother = new LevelSmoother();
const brightnessSmoother = new BrightnessSmoother();

function audioContext(): AudioContext {
  ctx ??= new AudioContext();
  return ctx;
}

async function attachCapture(context: AudioContext, input: AudioNode): Promise<AudioNode> {
  if (context.audioWorklet) {
    if (!workletLoaded) {
      await context.audioWorklet.addModule("/capture-worklet.js");
      workletLoaded = true;
    }
    const node = new AudioWorkletNode(context, "ressoar-capture", { numberOfInputs: 1, numberOfOutputs: 1 });
    node.port.onmessage = (event: MessageEvent<Float32Array>) => ring?.write(event.data);
    input.connect(node).connect(context.destination);
    return node;
  }
  const node = context.createScriptProcessor(4096, 1, 1);
  node.onaudioprocess = (event) => {
    ring?.write(event.inputBuffer.getChannelData(0).slice());
    event.outputBuffer.getChannelData(0).fill(0);
  };
  input.connect(node).connect(context.destination);
  return node;
}

function analyse(): void {
  if (!analyser || !ctx) return;
  analyser.getFloatTimeDomainData(timeBuffer);
  analyser.getFloatFrequencyData(spectrum);
  const raw = autoCorrelate(timeBuffer, ctx.sampleRate);
  const hz = pitchSmoother.push(raw);
  history.copyWithin(0, 1);
  history[history.length - 1] = hz ?? NaN;
  state.hz = hz;
  state.band = hz === null ? null : bandFor(hz);
  state.note = hz === null ? null : noteFromHz(hz);
  state.dbfs = levelSmoother.push(rmsDbfs(timeBuffer));
  state.brightness = brightnessSmoother.push(hz === null ? 0 : brightness(spectrum, spectrumBinHz));
  state.bufferedSeconds = ring?.filledSeconds ?? 0;
  state.tick += 1;
}

function clearReadouts(): void {
  state.hz = null;
  state.band = null;
  state.note = null;
  state.dbfs = LEVEL_FLOOR_DB;
  state.brightness = 0;
  pitchSmoother.reset();
  levelSmoother.reset();
  history.fill(NaN);
  state.tick += 1;
}

async function start(): Promise<void> {
  if (state.status === "requesting" || state.status === "listening" || state.status === "replaying") return;
  state.status = "requesting";
  state.error = null;
  try {
    const context = audioContext();
    if (context.state !== "running") await context.resume();
    stream = await openMic(settings.micDeviceId);
    source = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    analyser.fftSize = PITCH.fftSize;
    analyser.smoothingTimeConstant = 0.65;
    source.connect(analyser);
    timeBuffer = new Float32Array(analyser.fftSize);
    spectrum = new Float32Array(analyser.frequencyBinCount).fill(-Infinity);
    spectrumBinHz = context.sampleRate / analyser.fftSize;
    ring ??= new RingBuffer(MAX_REPLAY_SECONDS * context.sampleRate, context.sampleRate);
    captureNode = await attachCapture(context, source);
    granted = true;
    interval = setInterval(analyse, PITCH.intervalMs);
    state.status = "listening";
  } catch (error) {
    releaseMic();
    state.error = classifyMicError(error);
    state.status = "error";
  }
}

function releaseMic(): void {
  clearInterval(interval);
  interval = undefined;
  stream?.getTracks().forEach((track) => track.stop());
  stream = null;
  source?.disconnect();
  source = null;
  captureNode?.disconnect();
  captureNode = null;
  analyser = null;
}

function stop(): void {
  stopReplay();
  releaseMic();
  clearReadouts();
  state.bufferedSeconds = 0;
  ring?.clear();
  if (state.status !== "error") state.status = "idle";
}

async function restart(): Promise<void> {
  stop();
  await start();
}

function stopReplay(): void {
  clearInterval(replayTimer);
  replayTimer = undefined;
  if (!replaySource) return;
  const node = replaySource;
  replaySource = null;
  node.onended = null;
  try {
    node.stop();
  } catch {
    // Already stopped.
  }
  node.disconnect();
  state.replayProgress = 0;
  if (state.status === "replaying") {
    state.status = "listening";
    interval ??= setInterval(analyse, PITCH.intervalMs);
  }
}

async function replay(): Promise<void> {
  if (state.status !== "listening" || !ctx || !ring) return;
  const samples = ring.read(Math.round(settings.replaySeconds * ctx.sampleRate));
  if (samples.length < ctx.sampleRate * 0.5) return;
  const buffer = ctx.createBuffer(1, samples.length, ctx.sampleRate);
  buffer.copyToChannel(samples, 0);
  const node = ctx.createBufferSource();
  node.buffer = buffer;
  node.connect(ctx.destination);
  clearInterval(interval);
  interval = undefined;
  state.status = "replaying";
  state.replayProgress = 0;
  replaySource = node;
  const startedAt = ctx.currentTime;
  const duration = buffer.duration;
  replayTimer = setInterval(() => {
    state.replayProgress = Math.min(1, (ctx!.currentTime - startedAt) / duration);
  }, 100);
  node.onended = () => stopReplay();
  node.start();
}

function tone(): ToneGenerator {
  toneGenerator ??= new ToneGenerator(audioContext());
  return toneGenerator;
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      resumeOnVisible = state.status === "listening" || state.status === "replaying";
      if (resumeOnVisible) stop();
      toneGenerator?.stop();
    } else if (resumeOnVisible) {
      resumeOnVisible = false;
      void start();
    }
  });
}

export const engine = {
  get status() {
    return state.status;
  },
  get error() {
    return state.error;
  },
  get hz() {
    return state.hz;
  },
  get band() {
    return state.band;
  },
  get note() {
    return state.note;
  },
  get dbfs() {
    return state.dbfs;
  },
  get brightness() {
    return state.brightness;
  },
  get bufferedSeconds() {
    return state.bufferedSeconds;
  },
  get replayProgress() {
    return state.replayProgress;
  },
  get tick() {
    return state.tick;
  },
  get granted() {
    return granted;
  },
  get sampleRate() {
    return ctx?.sampleRate ?? 48000;
  },
  /** Latest dB magnitude spectrum from the analyser. Not reactive: read on `tick`. */
  get spectrum() {
    return spectrum;
  },
  get spectrumBinHz() {
    return spectrumBinHz;
  },
  start,
  stop,
  restart,
  replay,
  stopReplay,
  tone,
};
