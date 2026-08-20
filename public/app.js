const MIN_HZ = 80;
const MAX_HZ = 400;
const HISTORY = 240;
const PITCH_SAMPLE_INTERVAL_MS = 50;
const STEP_MODES = ["pitch", "weight", "size", "fullness", "integration"];
const STEP_PHASES = ["practice", "cold", "working", "recall"];

const NOTES_EN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

const I18N = {
  pt: {
    flag: "🇧🇷",
    switchTo: "Switch to English",
    tagline: "Treinos de feminização vocal com áudio, análise ao vivo e checklist.",
    loadSession: "Carregar Sessão",
    createSession: "Criar Sessão",
    noFile: "Sem arquivo? Comece com o exemplo:",
    openExample: "Abrir exemplo (Glissando)",
    back: "← Início",
    done: "feitos",
    free: "livre",
    startDrill: "Começar drill",
    createTitle: "Criar Sessão",
    sessionTitlePh: "Título da sessão",
    addExercise: "+ Exercício",
    startNow: "Iniciar agora",
    downloadSession: "Baixar Sessão (.ressoar.json)",
    exTitlePh: "Título do exercício",
    exDescPh: "Descrição (opcional)",
    addStep: "+ Passo",
    removeExercise: "Remover exercício",
    removeStep: "Remover passo",
    stepLabelPh: "Instrução do exercício",
    trainingMode: "Foco do exercício",
    checkpoint: "Momento do treino",
    modePitch: "Pitch",
    modeWeight: "Peso",
    modeSize: "Tamanho / ressonância",
    modeFullness: "Plenitude",
    modeIntegration: "Integração",
    phasePractice: "Prática",
    phaseCold: "Início sem aquecimento",
    phaseWorking: "Voz de trabalho",
    phaseRecall: "Retomada",
    secondsPh: "segundos",
    freeTime: "Tempo livre",
    untitledSession: "Sessão sem título",
    defaultExercise: "Exercício",
    close: "Fechar",
    pitchGraph: "Gráfico de pitch ao vivo de 80 a 400 Hz",
    drillReady: "Pronta? Começar",
    stop: "Parar",
    downloadRecording: "Baixar gravação",
    noMedia: "Sem acesso ao microfone:",
    noRecorder: "Este navegador não oferece suporte à gravação de mídia.",
    recordingFailed: "Não foi possível iniciar a gravação:",
    recording: "Gravando…",
    preparing: "Preparando download…",
    downloaded: "Gravação baixada. Use o botão para baixar de novo.",
    repeat: "Repetir",
    invalidFormat: "Formato inválido: a sessão precisa de título e pelo menos um exercício.",
    invalidExercise: "Cada exercício precisa de título e pelo menos um passo.",
    invalidStep: "Cada passo precisa de uma instrução.",
    invalidDuration: "A duração precisa ser um número inteiro positivo ou null para tempo livre.",
    invalidMode: "O foco ou o momento do exercício é inválido.",
    loadFailed: "Não foi possível carregar a sessão:",
    openSource: "Código Aberto",
    createdBy: "Criado por Marina Rosa —",
  },
  en: {
    flag: "🇺🇸",
    switchTo: "Mudar para português",
    tagline: "Voice feminization practice with audio, live analysis, and a checklist.",
    loadSession: "Load Session",
    createSession: "Create Session",
    noFile: "No file? Start with the example:",
    openExample: "Open example (Glissando)",
    back: "← Home",
    done: "done",
    free: "free",
    startDrill: "Start drill",
    createTitle: "Create Session",
    sessionTitlePh: "Session title",
    addExercise: "+ Exercise",
    startNow: "Start now",
    downloadSession: "Download Session (.ressoar.json)",
    exTitlePh: "Exercise title",
    exDescPh: "Description (optional)",
    addStep: "+ Step",
    removeExercise: "Remove exercise",
    removeStep: "Remove step",
    stepLabelPh: "Exercise instruction",
    trainingMode: "Exercise focus",
    checkpoint: "Practice checkpoint",
    modePitch: "Pitch",
    modeWeight: "Weight",
    modeSize: "Size / resonance",
    modeFullness: "Fullness",
    modeIntegration: "Integration",
    phasePractice: "Practice",
    phaseCold: "Cold start",
    phaseWorking: "Working voice",
    phaseRecall: "Recall",
    secondsPh: "seconds",
    freeTime: "Free time",
    untitledSession: "Untitled session",
    defaultExercise: "Exercise",
    close: "Close",
    pitchGraph: "Live pitch graph from 80 to 400 Hz",
    drillReady: "Ready? Start",
    stop: "Stop",
    downloadRecording: "Download recording",
    noMedia: "No microphone access:",
    noRecorder: "This browser does not support media recording.",
    recordingFailed: "Could not start recording:",
    recording: "Recording…",
    preparing: "Preparing download…",
    downloaded: "Recording downloaded. Use the button to download it again.",
    repeat: "Repeat",
    invalidFormat: "Invalid format: the session needs a title and at least one exercise.",
    invalidExercise: "Each exercise needs a title and at least one step.",
    invalidStep: "Each step needs an instruction.",
    invalidDuration: "Duration must be a positive whole number or null for free time.",
    invalidMode: "The exercise focus or checkpoint is invalid.",
    loadFailed: "Could not load the session:",
    openSource: "Open Source",
    createdBy: "Created by Marina Rosa —",
  },
};

let lang = localStorage.getItem("ressoar:lang") === "en" ? "en" : "pt";

function t(key) {
  return I18N[lang][key] ?? I18N.pt[key] ?? key;
}

function modeLabel(mode) {
  return t(`mode${mode[0].toUpperCase()}${mode.slice(1)}`);
}

function phaseLabel(phase) {
  return t(`phase${phase[0].toUpperCase()}${phase.slice(1)}`);
}

function selectOptions(values, labeler, selected) {
  return values
    .map((value) => `<option value="${value}" ${value === selected ? "selected" : ""}>${labeler(value)}</option>`)
    .join("");
}

function noteFromHz(hz) {
  if (hz <= 0) return null;
  const midi = Math.round(69 + 12 * Math.log2(hz / 440));
  const index = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return { en: `${NOTES_EN[index]}${octave}`, pt: `${NOTES_PT[index]}${octave}` };
}

function autoCorrelate(buf, sampleRate) {
  let size = buf.length;
  let rms = 0;
  for (let i = 0; i < size; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) return -1;

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

  const trimmed = buf.slice(start, end);
  size = trimmed.length;

  const maxLag = Math.min(size - 2, Math.ceil(sampleRate / MIN_HZ) + 1);
  const correlation = new Float32Array(maxLag + 1);
  for (let lag = 0; lag <= maxLag; lag++) {
    for (let i = 0; i < size - lag; i++) {
      correlation[lag] += trimmed[i] * trimmed[i + lag];
    }
  }

  let lag = 0;
  while (lag < maxLag && correlation[lag] > correlation[lag + 1]) lag++;

  let peak = -1;
  let peakLag = -1;
  for (let i = lag; i <= maxLag; i++) {
    if (correlation[i] > peak) {
      peak = correlation[i];
      peakLag = i;
    }
  }
  if (peakLag <= 0) return -1;

  let period = peakLag;
  const left = correlation[peakLag - 1];
  const mid = correlation[peakLag];
  const right = correlation[peakLag + 1] ?? mid;
  const shapeA = (left + right - 2 * mid) / 2;
  const shapeB = (right - left) / 2;
  if (shapeA) period = peakLag - shapeB / (2 * shapeA);

  const freq = sampleRate / period;
  return freq >= MIN_HZ && freq <= MAX_HZ ? freq : -1;
}

function pickMimeType() {
  if (!globalThis.MediaRecorder?.isTypeSupported) return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/ogg;codecs=opus",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/webm",
    "audio/ogg",
    "audio/mp4",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function extensionFromMimeType(mimeType) {
  const container = String(mimeType).split(";", 1)[0].toLowerCase();
  if (container === "audio/mp4") return "m4a";
  if (container === "audio/ogg") return "ogg";
  if (container === "audio/webm") return "webm";
  return "webm";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slug(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "sessao";
}

function el(html) {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild;
}

function newSessionId() {
  return globalThis.crypto?.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sessionFingerprint(data) {
  const content = JSON.stringify({
    title: data.title,
    createdAt: data.createdAt ?? null,
    exercises: data.exercises,
  });
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < content.length; index++) {
    hash ^= BigInt(content.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return `session-${hash.toString(16).padStart(16, "0")}`;
}

class Drill {
  constructor(overlay, step) {
    this.overlay = overlay;
    this.step = step;
    this.pitches = new Array(HISTORY).fill(null);
    this.running = false;
    this.closed = false;
    this.discardRecording = false;
    this.previousFocus = document.activeElement;
    this.handleKeydown = (event) => this.onKeydown(event);
    this.render();
  }

  render() {
    const durationText = this.step.duration === null ? t("freeTime") : `${this.step.duration}s`;
    this.overlay.innerHTML = `
      <div class="drill" role="dialog" aria-modal="true" aria-labelledby="drill-instruction">
        <button class="drill-close" aria-label="${t("close")}">×</button>
        <p id="drill-instruction" class="drill-instruction">${escapeHtml(this.step.label).replace(/\n/g, "<br>")}</p>
        <div class="drill-context">
          <span class="badge">${modeLabel(this.step.mode)}</span>
          <span class="badge">${phaseLabel(this.step.phase)}</span>
        </div>
        <div class="drill-stage">
          <canvas class="drill-pitch" width="960" height="380" role="img" aria-label="${t("pitchGraph")}"></canvas>
        </div>
        <div class="drill-readout">
          <span class="drill-hz">—</span>
          <span class="drill-note">—</span>
          <span class="drill-timer">${durationText}</span>
        </div>
        <div class="drill-controls">
          <button class="drill-go">${t("drillReady")}</button>
          <button class="drill-stop" hidden>${t("stop")}</button>
          <a class="drill-download" hidden>${t("downloadRecording")}</a>
          <span class="drill-status" role="status" aria-live="polite"></span>
        </div>
      </div>`;
    this.overlay.hidden = false;

    this.closeBtn = this.overlay.querySelector(".drill-close");
    this.canvas = this.overlay.querySelector(".drill-pitch");
    this.ctx = this.canvas.getContext("2d");
    this.hzEl = this.overlay.querySelector(".drill-hz");
    this.noteEl = this.overlay.querySelector(".drill-note");
    this.timerEl = this.overlay.querySelector(".drill-timer");
    this.goBtn = this.overlay.querySelector(".drill-go");
    this.stopBtn = this.overlay.querySelector(".drill-stop");
    this.downloadEl = this.overlay.querySelector(".drill-download");
    this.statusEl = this.overlay.querySelector(".drill-status");

    this.closeBtn.addEventListener("click", () => this.close());
    this.goBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.stop());

    this.drawGraph();
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", this.handleKeydown);
    this.goBtn.focus();
    this.openMedia();
  }

  onKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...this.overlay.querySelectorAll("button:not([disabled]):not([hidden]), a[href]:not([hidden])")]
      .filter((node) => node.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || !this.overlay.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async openMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      if (this.closed) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      this.stream = stream;
    } catch (err) {
      this.statusEl.textContent = `${t("noMedia")} ${err.message}`;
      this.goBtn.disabled = true;
      this.closeBtn.focus();
      return;
    }
    this.audioCtx = new AudioContext();
    const source = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    source.connect(this.analyser);
    this.buffer = new Float32Array(this.analyser.fftSize);
  }

  start() {
    if (!this.stream || this.running) return;
    if (!globalThis.MediaRecorder) {
      this.statusEl.textContent = t("noRecorder");
      this.goBtn.disabled = true;
      this.closeBtn.focus();
      return;
    }

    this.chunks = [];
    this.discardRecording = false;
    const mimeType = pickMimeType();
    try {
      this.recorder = new MediaRecorder(this.stream, mimeType ? { mimeType } : undefined);
      this.recorder.ondataavailable = (event) => {
        if (event.data.size > 0) this.chunks.push(event.data);
      };
      this.recorder.onstop = () => {
        if (this.discardRecording || this.closed) {
          this.chunks = [];
          return;
        }
        this.finalize();
      };
      this.recorder.start();
    } catch (err) {
      this.statusEl.textContent = `${t("recordingFailed")} ${err.message}`;
      return;
    }

    this.running = true;
    this.goBtn.hidden = true;
    this.stopBtn.hidden = false;
    this.downloadEl.hidden = true;
    this.statusEl.textContent = t("recording");
    this.stopBtn.focus();
    this.audioCtx.resume();

    this.pitches = new Array(HISTORY).fill(null);
    this.lastAnalysisAt = 0;
    this.analyse(performance.now());

    if (this.step.duration !== null) {
      this.remaining = this.step.duration;
      this.timerEl.textContent = `${this.remaining}s`;
      this.countdown = setInterval(() => {
        this.remaining -= 1;
        this.timerEl.textContent = `${Math.max(this.remaining, 0)}s`;
        if (this.remaining <= 0) this.stop();
      }, 1000);
    } else {
      this.elapsed = 0;
      this.countdown = setInterval(() => {
        this.elapsed += 1;
        this.timerEl.textContent = `${this.elapsed}s`;
      }, 1000);
    }
  }

  analyse(timestamp) {
    if (!this.running) return;
    if (timestamp - this.lastAnalysisAt >= PITCH_SAMPLE_INTERVAL_MS) {
      this.lastAnalysisAt = timestamp;
      this.analyser.getFloatTimeDomainData(this.buffer);
      const hz = autoCorrelate(this.buffer, this.audioCtx.sampleRate);
      this.pitches.push(hz > 0 ? hz : null);
      if (this.pitches.length > HISTORY) this.pitches.shift();
      this.hzEl.textContent = hz > 0 ? `${Math.round(hz)} Hz` : "—";
      const note = noteFromHz(hz);
      this.noteEl.textContent = note ? `${note.en} · ${note.pt}` : "—";
      this.drawGraph();
    }
    this.raf = requestAnimationFrame((nextTimestamp) => this.analyse(nextTimestamp));
  }

  drawGraph() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#1a1326";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#3a2d52";
    ctx.fillStyle = "#8a7aa8";
    ctx.font = "13px 'Monaspace Radon', monospace";
    for (const hz of [100, 150, 200, 250, 300, 350]) {
      const y = h - ((hz - MIN_HZ) / (MAX_HZ - MIN_HZ)) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.fillText(`${hz}`, 4, y - 2);
    }

    ctx.strokeStyle = "#ff79c6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    let drawing = false;
    this.pitches.forEach((hz, i) => {
      if (hz === null) {
        drawing = false;
        return;
      }
      const x = (i / HISTORY) * w;
      const y = h - ((hz - MIN_HZ) / (MAX_HZ - MIN_HZ)) * h;
      if (drawing) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
      drawing = true;
    });
    ctx.stroke();
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    clearInterval(this.countdown);
    cancelAnimationFrame(this.raf);
    this.stopBtn.disabled = true;
    this.statusEl.textContent = t("preparing");
    if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
  }

  finalize() {
    if (this.closed || this.discardRecording || !this.chunks.length) return;
    const recordingType = this.recorder.mimeType || "audio/webm";
    const blob = new Blob(this.chunks, { type: recordingType });
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = extensionFromMimeType(recordingType);
    const name = `${this.step.fileBase}-${stamp}.${extension}`;

    this.downloadEl.href = this.objectUrl;
    this.downloadEl.download = name;
    this.downloadEl.hidden = false;
    this.downloadEl.click();

    this.statusEl.textContent = t("downloaded");
    this.stopBtn.hidden = true;
    this.goBtn.hidden = false;
    this.goBtn.textContent = t("repeat");
    this.goBtn.disabled = false;
    this.stopBtn.disabled = false;
    this.goBtn.focus();
    if (this.step.onDone) this.step.onDone();
  }

  close() {
    if (this.closed) return;
    this.running = false;
    this.closed = true;
    this.discardRecording = true;
    clearInterval(this.countdown);
    cancelAnimationFrame(this.raf);
    if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
    if (this.audioCtx) this.audioCtx.close();
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    document.removeEventListener("keydown", this.handleKeydown);
    document.body.classList.remove("modal-open");
    this.overlay.hidden = true;
    this.overlay.innerHTML = "";
    if (this.previousFocus?.isConnected) this.previousFocus.focus();
  }
}

const app = document.getElementById("app");
const overlay = document.getElementById("drill-overlay");
const fileInput = document.getElementById("file-input");
const langToggle = document.getElementById("lang-toggle");
const githubText = document.getElementById("github-text");
const footerAuthor = document.getElementById("footer-author");

let activeDrill = null;
let currentSession = null;
let view = "home";

function validateSession(data) {
  if (
    !data ||
    Array.isArray(data) ||
    typeof data !== "object" ||
    typeof data.title !== "string" ||
    !data.title.trim() ||
    !Array.isArray(data.exercises) ||
    !data.exercises.length
  ) {
    throw new Error(t("invalidFormat"));
  }
  if (data.createdAt !== undefined && typeof data.createdAt !== "string") {
    throw new Error(t("invalidFormat"));
  }
  for (const exercise of data.exercises) {
    if (
      !exercise ||
      Array.isArray(exercise) ||
      typeof exercise !== "object" ||
      typeof exercise.title !== "string" ||
      !exercise.title.trim() ||
      !Array.isArray(exercise.steps) ||
      !exercise.steps.length ||
      (exercise.description !== undefined && typeof exercise.description !== "string")
    ) {
      throw new Error(t("invalidExercise"));
    }
    for (const step of exercise.steps) {
      if (!step || Array.isArray(step) || typeof step !== "object" || typeof step.label !== "string" || !step.label.trim()) {
        throw new Error(t("invalidStep"));
      }
      if (step.duration !== null && (!Number.isInteger(step.duration) || step.duration <= 0)) {
        throw new Error(t("invalidDuration"));
      }
      if ((step.mode !== undefined && !STEP_MODES.includes(step.mode)) ||
          (step.phase !== undefined && !STEP_PHASES.includes(step.phase))) {
        throw new Error(t("invalidMode"));
      }
    }
  }
  const validId = typeof data.id === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/.test(data.id);
  const exercises = data.exercises.map((exercise) => ({
    ...exercise,
    steps: exercise.steps.map((step) => ({
      ...step,
      mode: step.mode ?? "pitch",
      phase: step.phase ?? "practice",
    })),
  }));
  return { ...data, exercises, id: validId ? data.id : sessionFingerprint(data) };
}

function doneKey(session) {
  return `ressoar:done:${session.id}`;
}

function validDoneKeys(session) {
  return new Set(session.exercises.flatMap((exercise, ei) => exercise.steps.map((_, si) => `step:${ei}:${si}`)));
}

function loadDone(session) {
  try {
    const key = doneKey(session);
    let saved = localStorage.getItem(key);
    let migrated = false;
    if (saved === null) {
      saved = localStorage.getItem(`ressoar:done:${session.title}`);
      migrated = saved !== null;
    }
    const parsed = JSON.parse(saved ?? "[]");
    const allowed = validDoneKeys(session);
    const done = new Set(Array.isArray(parsed) ? parsed.filter((item) => allowed.has(item)) : []);
    if (migrated || (Array.isArray(parsed) && done.size !== parsed.length)) {
      localStorage.setItem(key, JSON.stringify([...done]));
      if (migrated) localStorage.removeItem(`ressoar:done:${session.title}`);
    }
    return done;
  } catch {
    return new Set();
  }
}

function saveDone(session, set) {
  localStorage.setItem(doneKey(session), JSON.stringify([...set]));
}

function renderHome() {
  view = "home";
  currentSession = null;
  app.innerHTML = `
    <section class="home">
      <p class="tagline">${t("tagline")}</p>
      <div class="home-actions">
        <button id="btn-load" class="primary">${t("loadSession")}</button>
        <button id="btn-create" class="primary">${t("createSession")}</button>
      </div>
      <div class="home-example">
        <span>${t("noFile")}</span>
        <button id="btn-example" class="ghost">${t("openExample")}</button>
      </div>
    </section>`;

  document.getElementById("btn-load").addEventListener("click", () => fileInput.click());
  document.getElementById("btn-create").addEventListener("click", () => renderCreate());
  document.getElementById("btn-example").addEventListener("click", async () => {
    const res = await fetch("/sessions/exemplo-glissando.ressoar.json");
    openSession(validateSession(await res.json()));
  });
}

function openSession(session) {
  currentSession = session;
  renderSession();
}

function renderSession() {
  view = "session";
  const session = currentSession;
  const done = loadDone(session);
  const total = session.exercises.reduce((n, exercise) => n + exercise.steps.length, 0);
  const completed = done.size;

  const exercises = session.exercises
    .map((exercise, ei) => {
      const steps = exercise.steps
        .map((step, si) => {
          const key = `step:${ei}:${si}`;
          const duration = step.duration === null ? t("free") : `${step.duration}s`;
          const checked = done.has(key) ? "checked" : "";
          return `<li class="step ${done.has(key) ? "is-done" : ""}" data-key="${key}" data-ex="${ei}" data-step="${si}">
            <label class="step-check">
              <input type="checkbox" ${checked} />
              <span class="step-label">${escapeHtml(step.label).replace(/\n/g, "<br>")}</span>
            </label>
            <div class="step-meta">
              <span class="badge">${ei + 1}.${si + 1}</span>
              <span class="badge">${duration}</span>
              <span class="badge badge-mode">${modeLabel(step.mode)}</span>
              ${step.phase !== "practice" ? `<span class="badge badge-phase">${phaseLabel(step.phase)}</span>` : ""}
              <button class="drill-start">${t("startDrill")}</button>
            </div>
          </li>`;
        })
        .join("");
      return `<article class="exercise">
        <h3>${ei + 1}. ${escapeHtml(exercise.title)}</h3>
        ${exercise.description ? `<p class="description">${escapeHtml(exercise.description)}</p>` : ""}
        <ul class="steps">${steps}</ul>
      </article>`;
    })
    .join("");

  app.innerHTML = `
    <section class="session">
      <button class="back ghost">${t("back")}</button>
      <div class="session-head">
        <h2>${escapeHtml(session.title)}</h2>
        <span class="progress">${completed}/${total} ${t("done")}</span>
      </div>
      ${exercises}
    </section>`;

  app.querySelector(".back").addEventListener("click", renderHome);

  app.querySelectorAll(".step input[type=checkbox]").forEach((box) => {
    box.addEventListener("change", (event) => {
      const li = event.target.closest(".step");
      const set = loadDone(session);
      if (event.target.checked) set.add(li.dataset.key);
      else set.delete(li.dataset.key);
      saveDone(session, set);
      renderSession();
    });
  });

  app.querySelectorAll(".drill-start").forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest(".step");
      const ei = Number(li.dataset.ex);
      const si = Number(li.dataset.step);
      const step = session.exercises[ei].steps[si];
      if (activeDrill) activeDrill.close();
      activeDrill = new Drill(overlay, {
        label: step.label,
        duration: step.duration ?? null,
        mode: step.mode,
        phase: step.phase,
        fileBase: `${slug(session.title)}-${ei + 1}.${si + 1}`,
        onDone: () => {
          const set = loadDone(session);
          set.add(li.dataset.key);
          saveDone(session, set);
        },
      });
    });
  });
}

function stepEditor(step) {
  const mode = step?.mode ?? "pitch";
  const phase = step?.phase ?? "practice";
  const node = el(`
    <li class="step-edit">
      <textarea class="step-label-input" rows="2" placeholder="${t("stepLabelPh")}" aria-label="${t("stepLabelPh")}"></textarea>
      <div class="step-edit-meta">
        <label class="step-select-label">${t("trainingMode")}
          <select class="step-mode-input">${selectOptions(STEP_MODES, modeLabel, mode)}</select>
        </label>
        <label class="step-select-label">${t("checkpoint")}
          <select class="step-phase-input">${selectOptions(STEP_PHASES, phaseLabel, phase)}</select>
        </label>
        <input class="step-duration-input" type="number" min="1" step="1" placeholder="${t("secondsPh")}" aria-label="${t("secondsPh")}" />
        <label class="free-toggle"><input type="checkbox" class="step-free-input" /> ${t("freeTime")}</label>
        <button class="ghost remove-step">${t("removeStep")}</button>
      </div>
    </li>`);
  if (step) {
    node.querySelector(".step-label-input").value = step.label ?? "";
    if (step.duration === null) node.querySelector(".step-free-input").checked = true;
    else node.querySelector(".step-duration-input").value = step.duration ?? "";
  }
  return node;
}

function exerciseEditor(exercise) {
  const node = el(`
    <article class="exercise-edit">
      <input class="ex-title-input" placeholder="${t("exTitlePh")}" aria-label="${t("exTitlePh")}" />
      <textarea class="ex-desc-input" rows="2" placeholder="${t("exDescPh")}" aria-label="${t("exDescPh")}"></textarea>
      <ul class="steps-edit"></ul>
      <div class="exercise-edit-actions">
        <button class="ghost add-step">${t("addStep")}</button>
        <button class="ghost remove-exercise">${t("removeExercise")}</button>
      </div>
    </article>`);
  const stepsList = node.querySelector(".steps-edit");
  if (exercise) {
    node.querySelector(".ex-title-input").value = exercise.title ?? "";
    node.querySelector(".ex-desc-input").value = exercise.description ?? "";
    (exercise.steps ?? []).forEach((step) => stepsList.appendChild(stepEditor(step)));
  }
  if (!stepsList.children.length) stepsList.appendChild(stepEditor());
  node.querySelector(".add-step").addEventListener("click", () => stepsList.appendChild(stepEditor()));
  node.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-step")) event.target.closest(".step-edit").remove();
    if (event.target.classList.contains("remove-exercise")) node.remove();
  });
  return node;
}

function collectDraft() {
  const sessionId = app.querySelector(".create").dataset.sessionId;
  const title = app.querySelector(".session-title-input").value.trim() || t("untitledSession");
  const exercises = [...app.querySelectorAll(".exercise-edit")].map((exNode) => ({
    title: exNode.querySelector(".ex-title-input").value.trim() || t("defaultExercise"),
    description: exNode.querySelector(".ex-desc-input").value.trim(),
    steps: [...exNode.querySelectorAll(".step-edit")].map((stepNode) => {
      const free = stepNode.querySelector(".step-free-input").checked;
      const durationValue = Number(stepNode.querySelector(".step-duration-input").value);
      return {
        label: stepNode.querySelector(".step-label-input").value.trim(),
        duration: free || !durationValue ? null : durationValue,
        mode: stepNode.querySelector(".step-mode-input").value,
        phase: stepNode.querySelector(".step-phase-input").value,
      };
    }),
  }));
  return { id: sessionId, title, createdAt: new Date().toISOString().slice(0, 10), exercises };
}

function showDraftError(error) {
  const errorEl = app.querySelector(".create-error");
  errorEl.textContent = error.message;
  errorEl.hidden = false;
  errorEl.focus();
}

function validateDraft() {
  const errorEl = app.querySelector(".create-error");
  errorEl.hidden = true;
  errorEl.textContent = "";
  return validateSession(collectDraft());
}

function renderCreate(draft) {
  view = "create";
  const sessionId = draft?.id ?? newSessionId();
  app.innerHTML = `
    <section class="create" data-session-id="${escapeHtml(sessionId)}">
      <button class="back ghost">${t("back")}</button>
      <h2>${t("createTitle")}</h2>
      <input class="session-title-input" placeholder="${t("sessionTitlePh")}" aria-label="${t("sessionTitlePh")}" />
      <p class="create-error" role="alert" tabindex="-1" hidden></p>
      <div id="exercises-editor"></div>
      <button id="add-exercise" class="ghost">${t("addExercise")}</button>
      <div class="create-actions">
        <button id="start-draft" class="primary">${t("startNow")}</button>
        <button id="download-draft" class="primary">${t("downloadSession")}</button>
      </div>
    </section>`;

  const editor = document.getElementById("exercises-editor");
  if (draft) {
    app.querySelector(".session-title-input").value = draft.title ?? "";
    (draft.exercises ?? []).forEach((exercise) => editor.appendChild(exerciseEditor(exercise)));
  }
  if (!editor.children.length) editor.appendChild(exerciseEditor());

  app.querySelector(".back").addEventListener("click", renderHome);
  document.getElementById("add-exercise").addEventListener("click", () => editor.appendChild(exerciseEditor()));
  document.getElementById("start-draft").addEventListener("click", () => {
    try {
      openSession(validateDraft());
    } catch (error) {
      showDraftError(error);
    }
  });
  document.getElementById("download-draft").addEventListener("click", () => {
    let session;
    try {
      session = validateDraft();
    } catch (error) {
      showDraftError(error);
      return;
    }
    const date = new Date();
    const stamp = `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug(session.title)}-${stamp}.ressoar.json`;
    link.click();
    URL.revokeObjectURL(url);
  });
}

function rerender() {
  if (view === "session" && currentSession) renderSession();
  else if (view === "create") renderCreate(collectDraft());
  else renderHome();
}

function applyLang() {
  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  langToggle.textContent = I18N[lang].flag;
  langToggle.title = I18N[lang].switchTo;
  langToggle.setAttribute("aria-label", I18N[lang].switchTo);
  githubText.textContent = t("openSource");
  footerAuthor.innerHTML = `${t("createdBy")} <a href="https://marinarosa.net" target="_blank" rel="noopener noreferrer">marinarosa.net</a>`;
}

langToggle.addEventListener("click", () => {
  lang = lang === "pt" ? "en" : "pt";
  localStorage.setItem("ressoar:lang", lang);
  applyLang();
  rerender();
});

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const session = validateSession(JSON.parse(await file.text()));
    openSession(session);
  } catch (err) {
    alert(`${t("loadFailed")} ${err.message}`);
  }
  fileInput.value = "";
});

document.getElementById("home-link").addEventListener("click", (event) => {
  event.preventDefault();
  renderHome();
});

applyLang();
renderHome();
