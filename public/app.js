const MIN_HZ = 80;
const MAX_HZ = 400;
const HISTORY = 240;
const PITCH_SAMPLE_INTERVAL_MS = 50;
const SPECTRUM_MIN_HZ = 80;
const SPECTRUM_MAX_HZ = 5000;
const SPECTRUM_SHIFT_PX = 4;
const VOICE_DB_NAME = "ressoar-voice";
const VOICE_DB_VERSION = 1;
const ANCHOR_KINDS = ["baseline", "target", "larger", "smaller", "lighter", "heavier"];
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
    voiceAnchors: "Âncoras de voz",
    anchorsTitle: "Âncoras de voz",
    anchorsIntro: "Exemplos pessoais salvos apenas neste navegador para comparação e imitação.",
    noAnchors: "Nenhuma âncora salva ainda. Grave um drill e salve a tomada como referência.",
    referenceTake: "Referência",
    noReference: "Sem referência",
    currentTake: "Tomada atual",
    saveTakeAs: "Salvar tomada como",
    saveAnchor: "Salvar âncora",
    anchorSaved: "Âncora salva neste navegador.",
    anchorSaveFailed: "Não foi possível salvar a âncora:",
    deleteAnchor: "Excluir âncora",
    deleteAnchorConfirm: "Excluir esta âncora de voz deste navegador?",
    anchorBaseline: "Voz de base",
    anchorTarget: "Voz alvo",
    anchorLarger: "Som maior",
    anchorSmaller: "Som menor",
    anchorLighter: "Som mais leve",
    anchorHeavier: "Som mais pesado",
    rateTake: "Avaliar tomada",
    ratingEase: "Facilidade",
    ratingStability: "Estabilidade",
    ratingSatisfaction: "Satisfação",
    saveRating: "Salvar avaliação",
    ratingSaved: "Avaliação salva.",
    noFile: "Sem arquivo? Comece com o exemplo:",
    openExample: "Abrir exemplo (Glissando)",
    builtInProgram: "Abrir fundamentos de tamanho, peso e plenitude",
    practiceHistory: "Histórico de prática",
    historyTitle: "Histórico de prática",
    historyIntro: "Compare inícios sem aquecimento, voz de trabalho e retomadas. Áudios ficam apenas neste navegador.",
    noHistory: "Nenhuma tomada no histórico ainda.",
    retentionSummary: "Retenção mais recente",
    noCheckpoint: "Ainda sem tomada",
    deleteTake: "Excluir tomada",
    deleteTakeConfirm: "Excluir esta tomada e seu áudio deste navegador?",
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
    spectrumGraph: "Espectrograma ao vivo de 80 a 5000 Hz",
    pitchView: "Pitch",
    spectrumView: "Espectro",
    fullnessView: "Mapa de plenitude",
    fullnessMapGraph: "Mapa interativo de tamanho e peso vocal",
    sizeAxisHelp: "↕ Tamanho vocal: menor no topo → maior na base",
    weightAxisHelp: "↔ Peso vocal: leve à esquerda → pesado à direita",
    fullnessMapHelp: "Clique ou toque para posicionar o alvo. No teclado, use as setas.",
    voiceRanges: "Faixas de apresentação vocal",
    rangeFeminine: "feminina",
    rangeAndrogynous: "não binária / andrógina",
    rangeMasculine: "masculina",
    rangeCaveat: "Guias perceptivos amplos, não classificações de gênero. Vozes não binárias podem ocupar qualquer parte do mapa.",
    mapCurrent: "Agora",
    mapTarget: "Alvo",
    mapBalanced: "pleno",
    mapUnderfull: "oco / subpleno",
    mapOverfull: "estridente / sobrepleno",
    hideFeedback: "Ocultar feedback",
    showFeedback: "Mostrar feedback",
    feedbackHidden: "Feedback oculto — escute e reproduza sem olhar.",
    sizeReadout: "Tamanho",
    weightReadout: "Peso",
    larger: "maior",
    smaller: "menor",
    lighter: "leve",
    heavier: "pesado",
    waitingForVoice: "Aguardando voz estável…",
    drillReady: "Pronta? Começar",
    stop: "Parar",
    downloadRecording: "Baixar gravação",
    noMedia: "Sem acesso ao microfone:",
    micConnecting: "Conectando ao microfone…",
    micPermissionDenied: "O microfone está bloqueado para este endereço. Abra as permissões do site, permita Microfone e tente novamente.",
    micNotFound: "Nenhum microfone foi encontrado. Conecte ou habilite uma entrada e tente novamente.",
    micUnavailable: "O microfone está ocupado ou indisponível. Feche outros aplicativos que possam estar usando-o e tente novamente.",
    micUnsupported: "O microfone exige localhost ou HTTPS e um navegador compatível.",
    retryMicrophone: "Tentar microfone novamente",
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
    voiceAnchors: "Voice anchors",
    anchorsTitle: "Voice anchors",
    anchorsIntro: "Personal examples saved only in this browser for comparison and imitation.",
    noAnchors: "No anchors saved yet. Record a drill and save the take as a reference.",
    referenceTake: "Reference",
    noReference: "No reference",
    currentTake: "Current take",
    saveTakeAs: "Save take as",
    saveAnchor: "Save anchor",
    anchorSaved: "Anchor saved in this browser.",
    anchorSaveFailed: "Could not save the anchor:",
    deleteAnchor: "Delete anchor",
    deleteAnchorConfirm: "Delete this voice anchor from this browser?",
    anchorBaseline: "Baseline voice",
    anchorTarget: "Target voice",
    anchorLarger: "Larger sound",
    anchorSmaller: "Smaller sound",
    anchorLighter: "Lighter sound",
    anchorHeavier: "Heavier sound",
    rateTake: "Rate take",
    ratingEase: "Ease",
    ratingStability: "Stability",
    ratingSatisfaction: "Satisfaction",
    saveRating: "Save rating",
    ratingSaved: "Rating saved.",
    noFile: "No file? Start with the example:",
    openExample: "Open example (Glissando)",
    builtInProgram: "Open size, weight, and fullness foundations",
    practiceHistory: "Practice history",
    historyTitle: "Practice history",
    historyIntro: "Compare cold starts, working voice, and recall. Audio stays only in this browser.",
    noHistory: "No takes in practice history yet.",
    retentionSummary: "Latest retention checkpoints",
    noCheckpoint: "No take yet",
    deleteTake: "Delete take",
    deleteTakeConfirm: "Delete this take and its audio from this browser?",
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
    spectrumGraph: "Live spectrogram from 80 to 5000 Hz",
    pitchView: "Pitch",
    spectrumView: "Spectrum",
    fullnessView: "Fullness map",
    fullnessMapGraph: "Interactive vocal size and weight map",
    sizeAxisHelp: "↕ Vocal size: smaller at the top → larger at the bottom",
    weightAxisHelp: "↔ Vocal weight: light on the left → heavy on the right",
    fullnessMapHelp: "Click or tap to place the target. With a keyboard, use the arrow keys.",
    voiceRanges: "Vocal presentation ranges",
    rangeFeminine: "feminine-leaning",
    rangeAndrogynous: "non-binary / androgynous",
    rangeMasculine: "masculine-leaning",
    rangeCaveat: "Broad perceptual guides, not gender classifications. Non-binary voices can occupy any part of the map.",
    mapCurrent: "Current",
    mapTarget: "Target",
    mapBalanced: "full",
    mapUnderfull: "hollow / underfull",
    mapOverfull: "buzzy / overfull",
    hideFeedback: "Hide feedback",
    showFeedback: "Show feedback",
    feedbackHidden: "Feedback hidden — listen and reproduce without looking.",
    sizeReadout: "Size",
    weightReadout: "Weight",
    larger: "larger",
    smaller: "smaller",
    lighter: "light",
    heavier: "heavy",
    waitingForVoice: "Waiting for a stable voice…",
    drillReady: "Ready? Start",
    stop: "Stop",
    downloadRecording: "Download recording",
    noMedia: "No microphone access:",
    micConnecting: "Connecting to the microphone…",
    micPermissionDenied: "The microphone is blocked for this address. Open site permissions, allow Microphone, and try again.",
    micNotFound: "No microphone was found. Connect or enable an input and try again.",
    micUnavailable: "The microphone is busy or unavailable. Close other apps that may be using it and try again.",
    micUnsupported: "Microphone access requires localhost or HTTPS and a compatible browser.",
    retryMicrophone: "Try microphone again",
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

function anchorLabel(kind) {
  return t(`anchor${kind[0].toUpperCase()}${kind.slice(1)}`);
}

function selectOptions(values, labeler, selected) {
  return values
    .map((value) => `<option value="${value}" ${value === selected ? "selected" : ""}>${labeler(value)}</option>`)
    .join("");
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function powerFromDb(db) {
  return Number.isFinite(db) ? 10 ** (db / 10) : 0;
}

function bandMeanPower(spectrum, binHz, fromHz, toHz) {
  const start = Math.max(1, Math.ceil(fromHz / binHz));
  const end = Math.min(spectrum.length - 1, Math.floor(toHz / binHz));
  let power = 0;
  let count = 0;
  for (let bin = start; bin <= end; bin++) {
    power += powerFromDb(spectrum[bin]);
    count += 1;
  }
  return count ? power / count : 0;
}

function strongestSpectralRegion(spectrum, binHz, fromHz, toHz) {
  const radius = Math.max(2, Math.round(90 / binHz));
  const start = Math.max(radius, Math.ceil(fromHz / binHz));
  const end = Math.min(spectrum.length - radius - 1, Math.floor(toHz / binHz));
  let bestBin = start;
  let bestScore = -Infinity;
  for (let bin = start; bin <= end; bin++) {
    let score = 0;
    for (let offset = -radius; offset <= radius; offset++) score += spectrum[bin + offset];
    if (score > bestScore) {
      bestScore = score;
      bestBin = bin;
    }
  }
  return Math.round(bestBin * binHz);
}

function spectralMetrics(spectrum, sampleRate, fftSize) {
  const binHz = sampleRate / fftSize;
  const lowPower = bandMeanPower(spectrum, binHz, 120, 1000);
  const highPower = bandMeanPower(spectrum, binHz, 1000, 4000);
  const weightBalanceDb = 10 * Math.log10((highPower + 1e-12) / (lowPower + 1e-12));

  const start = Math.ceil(250 / binHz);
  const end = Math.min(spectrum.length - 1, Math.floor(3500 / binHz));
  let weightedFrequency = 0;
  let totalPower = 0;
  for (let bin = start; bin <= end; bin++) {
    const power = powerFromDb(spectrum[bin]);
    weightedFrequency += bin * binHz * power;
    totalPower += power;
  }
  const resonanceCenter = totalPower ? weightedFrequency / totalPower : 0;
  return {
    r1: strongestSpectralRegion(spectrum, binHz, 250, 1200),
    r2: strongestSpectralRegion(spectrum, binHz, 900, 3200),
    sizeRaw: resonanceCenter,
    weightRaw: weightBalanceDb,
    sizePosition: clamp((resonanceCenter - 700) / 1600),
    weightPosition: clamp((weightBalanceDb + 30) / 24),
  };
}

function normalizeBetween(value, from, to, fallback) {
  if (!Number.isFinite(from) || !Number.isFinite(to) || Math.abs(to - from) < 0.01) return fallback;
  return clamp((value - from) / (to - from));
}

function summarizeMetricFrames(frames) {
  if (!frames.length) return null;
  const average = (key) => frames.reduce((sum, frame) => sum + frame[key], 0) / frames.length;
  return {
    pitch: Math.round(average("pitch")),
    r1: Math.round(average("r1")),
    r2: Math.round(average("r2")),
    sizeRaw: Math.round(average("sizeRaw")),
    weightRaw: Number(average("weightRaw").toFixed(2)),
    sizePosition: Number(average("sizePosition").toFixed(3)),
    weightPosition: Number(average("weightPosition").toFixed(3)),
    frames: frames.length,
  };
}

function spectrogramColor(db) {
  const level = clamp((db + 100) / 75);
  const hue = 275 + level * 55;
  const lightness = 8 + level * 62;
  return `hsl(${hue} 85% ${lightness}%)`;
}

function openVoiceDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(VOICE_DB_NAME, VOICE_DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains("anchors")) {
        const anchors = database.createObjectStore("anchors", { keyPath: "id" });
        anchors.createIndex("createdAt", "createdAt");
      }
      if (!database.objectStoreNames.contains("takes")) {
        const takes = database.createObjectStore("takes", { keyPath: "id" });
        takes.createIndex("createdAt", "createdAt");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function voiceStoreRequest(storeName, mode, operation) {
  const database = await openVoiceDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
  });
}

function voiceStoreAll(storeName) {
  return voiceStoreRequest(storeName, "readonly", (store) => store.getAll());
}

function voiceStorePut(storeName, value) {
  return voiceStoreRequest(storeName, "readwrite", (store) => store.put(value));
}

function voiceStoreDelete(storeName, id) {
  return voiceStoreRequest(storeName, "readwrite", (store) => store.delete(id));
}

function ratingOptions(selected = 3) {
  return [1, 2, 3, 4, 5]
    .map((value) => `<option value="${value}" ${value === selected ? "selected" : ""}>${value}</option>`)
    .join("");
}

function metricBadges(metrics) {
  if (!metrics) return "";
  return `<span class="badge">${metrics.pitch} Hz</span>
    <span class="badge">R1 ~ ${metrics.r1}</span>
    <span class="badge">R2 ~ ${metrics.r2}</span>
    <span class="badge">${t("sizeReadout")}: ${Math.round(metrics.sizePosition * 100)}%</span>
    <span class="badge">${t("weightReadout")}: ${Math.round(metrics.weightPosition * 100)}%</span>`;
}

function microphoneErrorMessage(error) {
  if (!globalThis.isSecureContext || !navigator.mediaDevices?.getUserMedia || error?.name === "UnsupportedError") {
    return t("micUnsupported");
  }
  if (["NotAllowedError", "PermissionDeniedError", "SecurityError"].includes(error?.name)) {
    return `${t("micPermissionDenied")} (${location.origin})`;
  }
  if (["NotFoundError", "DevicesNotFoundError"].includes(error?.name)) return t("micNotFound");
  if (["NotReadableError", "TrackStartError", "AbortError"].includes(error?.name)) return t("micUnavailable");
  return `${t("noMedia")} ${error?.message ?? error?.name ?? ""}`.trim();
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
    this.metricFrames = [];
    this.latestMetrics = null;
    this.fullnessTarget = this.loadFullnessTarget();
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
        <div class="mic-access">
          <span class="mic-access-message" role="status" aria-live="polite">${t("micConnecting")}</span>
          <button class="mic-retry ghost" hidden>${t("retryMicrophone")}</button>
        </div>
        <div class="analysis-tabs" role="tablist" aria-label="${t("trainingMode")}">
          <button class="analysis-tab" role="tab" data-view="pitch">${t("pitchView")}</button>
          <button class="analysis-tab" role="tab" data-view="spectrum">${t("spectrumView")}</button>
          <button class="analysis-tab" role="tab" data-view="fullness">${t("fullnessView")}</button>
        </div>
        <div class="analysis-panels">
          <section class="analysis-panel" role="tabpanel" data-panel="pitch">
            <canvas class="drill-pitch" width="960" height="380" role="img" aria-label="${t("pitchGraph")}"></canvas>
          </section>
          <section class="analysis-panel" role="tabpanel" data-panel="spectrum">
            <div class="spectrum-wrap">
              <canvas class="drill-spectrum" width="960" height="380" role="img" aria-label="${t("spectrumGraph")}"></canvas>
            </div>
            <div class="spectrum-readouts">
              <span class="spectrum-metric drill-size">${t("sizeReadout")}: —</span>
              <span class="spectrum-metric drill-weight">${t("weightReadout")}: —</span>
              <span class="spectrum-metric drill-resonances">R1 ~ — · R2 ~ —</span>
            </div>
          </section>
          <section class="analysis-panel" role="tabpanel" data-panel="fullness">
            <div class="fullness-axis-key">
              <span>${t("sizeAxisHelp")}</span>
              <span>${t("weightAxisHelp")}</span>
            </div>
            <canvas class="fullness-map" width="760" height="500" tabindex="0" role="img" aria-label="${t("fullnessMapGraph")}"></canvas>
            <div class="fullness-range-legend" aria-label="${t("voiceRanges")}">
              <span><i class="range-feminine" aria-hidden="true"></i>${t("rangeFeminine")}</span>
              <span><i class="range-androgynous" aria-hidden="true"></i>${t("rangeAndrogynous")}</span>
              <span><i class="range-masculine" aria-hidden="true"></i>${t("rangeMasculine")}</span>
            </div>
            <p class="fullness-range-caveat">${t("rangeCaveat")}</p>
            <p class="fullness-map-help">${t("fullnessMapHelp")}</p>
            <p class="fullness-map-status" role="status">${t("waitingForVoice")}</p>
          </section>
        </div>
        <p class="feedback-hidden-message" hidden>${t("feedbackHidden")}</p>
        <div class="drill-readout">
          <span class="drill-hz">—</span>
          <span class="drill-note">—</span>
          <span class="drill-timer">${durationText}</span>
        </div>
        <div class="drill-controls">
          <button class="drill-go" disabled>${t("drillReady")}</button>
          <button class="drill-stop" hidden>${t("stop")}</button>
          <button class="drill-feedback ghost">${t("hideFeedback")}</button>
          <a class="drill-download" hidden>${t("downloadRecording")}</a>
          <span class="drill-status" role="status" aria-live="polite"></span>
        </div>
        <section class="take-comparison" aria-label="${t("voiceAnchors")}">
          <div class="reference-take">
            <label>${t("referenceTake")}
              <select class="anchor-reference"><option value="">${t("noReference")}</option></select>
            </label>
            <audio class="anchor-reference-audio" controls hidden></audio>
          </div>
          <div class="current-take" hidden>
            <span>${t("currentTake")}</span>
            <audio class="current-take-audio" controls></audio>
          </div>
          <div class="anchor-save" hidden>
            <label>${t("saveTakeAs")}
              <select class="anchor-kind">${selectOptions(ANCHOR_KINDS, anchorLabel, "target")}</select>
            </label>
            <button class="anchor-save-button ghost">${t("saveAnchor")}</button>
          </div>
          <div class="take-rating" hidden>
            <span>${t("rateTake")}</span>
            <div class="rating-fields">
              <label>${t("ratingEase")}<select class="rating-ease">${ratingOptions()}</select></label>
              <label>${t("ratingStability")}<select class="rating-stability">${ratingOptions()}</select></label>
              <label>${t("ratingSatisfaction")}<select class="rating-satisfaction">${ratingOptions()}</select></label>
            </div>
            <button class="save-rating ghost">${t("saveRating")}</button>
          </div>
        </section>
      </div>`;
    this.overlay.hidden = false;

    this.closeBtn = this.overlay.querySelector(".drill-close");
    this.canvas = this.overlay.querySelector(".drill-pitch");
    this.ctx = this.canvas.getContext("2d");
    this.spectrumCanvas = this.overlay.querySelector(".drill-spectrum");
    this.spectrumCtx = this.spectrumCanvas.getContext("2d");
    this.spectrumDataCanvas = document.createElement("canvas");
    this.spectrumDataCanvas.width = this.spectrumCanvas.width;
    this.spectrumDataCanvas.height = this.spectrumCanvas.height;
    this.spectrumDataCtx = this.spectrumDataCanvas.getContext("2d");
    this.sizeEl = this.overlay.querySelector(".drill-size");
    this.weightEl = this.overlay.querySelector(".drill-weight");
    this.resonancesEl = this.overlay.querySelector(".drill-resonances");
    this.fullnessCanvas = this.overlay.querySelector(".fullness-map");
    this.fullnessCtx = this.fullnessCanvas.getContext("2d");
    this.fullnessStatus = this.overlay.querySelector(".fullness-map-status");
    this.hzEl = this.overlay.querySelector(".drill-hz");
    this.noteEl = this.overlay.querySelector(".drill-note");
    this.timerEl = this.overlay.querySelector(".drill-timer");
    this.micAccess = this.overlay.querySelector(".mic-access");
    this.micMessage = this.overlay.querySelector(".mic-access-message");
    this.micRetryBtn = this.overlay.querySelector(".mic-retry");
    this.goBtn = this.overlay.querySelector(".drill-go");
    this.stopBtn = this.overlay.querySelector(".drill-stop");
    this.feedbackBtn = this.overlay.querySelector(".drill-feedback");
    this.downloadEl = this.overlay.querySelector(".drill-download");
    this.statusEl = this.overlay.querySelector(".drill-status");
    this.referenceSelect = this.overlay.querySelector(".anchor-reference");
    this.referenceAudio = this.overlay.querySelector(".anchor-reference-audio");
    this.currentTake = this.overlay.querySelector(".current-take");
    this.currentAudio = this.overlay.querySelector(".current-take-audio");
    this.anchorSave = this.overlay.querySelector(".anchor-save");
    this.anchorKind = this.overlay.querySelector(".anchor-kind");
    this.anchorSaveBtn = this.overlay.querySelector(".anchor-save-button");
    this.takeRating = this.overlay.querySelector(".take-rating");
    this.ratingEase = this.overlay.querySelector(".rating-ease");
    this.ratingStability = this.overlay.querySelector(".rating-stability");
    this.ratingSatisfaction = this.overlay.querySelector(".rating-satisfaction");
    this.saveRatingBtn = this.overlay.querySelector(".save-rating");

    this.closeBtn.addEventListener("click", () => this.close());
    this.micRetryBtn.addEventListener("click", () => this.openMedia());
    this.goBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.stop());
    this.feedbackBtn.addEventListener("click", () => this.toggleFeedback());
    this.referenceSelect.addEventListener("change", () => this.selectReference(this.referenceSelect.value));
    this.anchorSaveBtn.addEventListener("click", () => this.saveAnchor());
    this.saveRatingBtn.addEventListener("click", () => this.saveRating());
    this.fullnessCanvas.addEventListener("pointerdown", (event) => this.placeFullnessTarget(event));
    this.fullnessCanvas.addEventListener("keydown", (event) => this.moveFullnessTarget(event));
    this.overlay.querySelectorAll(".analysis-tab").forEach((button) => {
      button.addEventListener("click", () => this.setAnalysisView(button.dataset.view));
    });

    this.drawGraph();
    this.drawSpectrogram();
    this.drawFullnessMap();
    this.setAnalysisView(this.step.mode === "pitch" ? "pitch" : this.step.mode === "fullness" ? "fullness" : "spectrum");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", this.handleKeydown);
    this.closeBtn.focus();
    this.loadAnchors();
    this.openMedia();
  }

  onKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      this.close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...this.overlay.querySelectorAll(
      "button:not([disabled]):not([hidden]), a[href]:not([hidden]), select:not([disabled]):not([hidden]), audio[controls]:not([hidden]), [tabindex]:not([tabindex='-1'])",
    )]
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
    if (this.closed || this.stream || this.openingMedia) return;
    this.openingMedia = true;
    this.goBtn.disabled = true;
    this.micAccess.hidden = false;
    this.micAccess.classList.remove("has-error");
    this.micMessage.textContent = t("micConnecting");
    this.micRetryBtn.hidden = true;
    this.micRetryBtn.disabled = true;
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        const error = new Error(t("micUnsupported"));
        error.name = "UnsupportedError";
        throw error;
      }
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
      if (this.closed) return;
      this.micMessage.textContent = microphoneErrorMessage(err);
      this.micAccess.classList.add("has-error");
      this.micRetryBtn.hidden = false;
      this.goBtn.disabled = true;
      this.micRetryBtn.focus({ preventScroll: true });
      return;
    } finally {
      this.openingMedia = false;
      this.micRetryBtn.disabled = false;
    }
    this.micAccess.hidden = true;
    this.audioCtx = new AudioContext();
    const source = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 4096;
    this.analyser.smoothingTimeConstant = 0.65;
    source.connect(this.analyser);
    this.buffer = new Float32Array(this.analyser.fftSize);
    this.frequencyBuffer = new Float32Array(this.analyser.frequencyBinCount);
    this.goBtn.disabled = false;
    this.goBtn.focus({ preventScroll: true });
  }

  async loadAnchors(selectedId = "") {
    try {
      this.anchors = (await voiceStoreAll("anchors")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      this.updateCalibration();
      this.referenceSelect.innerHTML = `<option value="">${t("noReference")}</option>${this.anchors
        .map((anchor) => `<option value="${escapeHtml(anchor.id)}">${anchorLabel(anchor.kind)} · ${new Date(anchor.createdAt).toLocaleDateString()}</option>`)
        .join("")}`;
      if (selectedId) {
        this.referenceSelect.value = selectedId;
        this.selectReference(selectedId);
      }
    } catch (error) {
      this.statusEl.textContent = `${t("anchorSaveFailed")} ${error.message}`;
    }
  }

  updateCalibration() {
    const latest = (kind) => this.anchors?.find((anchor) => anchor.kind === kind && anchor.metrics)?.metrics;
    this.calibration = {
      larger: latest("larger")?.sizeRaw,
      smaller: latest("smaller")?.sizeRaw,
      lighter: latest("lighter")?.weightRaw,
      heavier: latest("heavier")?.weightRaw,
    };
    if (this.latestMetrics) {
      this.latestMetrics = this.calibrateMetrics(this.latestMetrics);
      this.drawFullnessMap();
    }
  }

  calibrateMetrics(metrics) {
    const calibration = this.calibration ?? {};
    return {
      ...metrics,
      sizePosition: normalizeBetween(
        metrics.sizeRaw,
        calibration.larger,
        calibration.smaller,
        metrics.sizePosition,
      ),
      weightPosition: normalizeBetween(
        metrics.weightRaw,
        calibration.lighter,
        calibration.heavier,
        metrics.weightPosition,
      ),
    };
  }

  loadFullnessTarget() {
    try {
      const target = JSON.parse(localStorage.getItem("ressoar:fullness-target") ?? "null");
      if (Number.isFinite(target?.weight) && Number.isFinite(target?.size)) {
        return { weight: clamp(target.weight), size: clamp(target.size) };
      }
    } catch {
      // Ignore a damaged local target and return the default balanced point.
    }
    return { weight: 0.28, size: 0.72 };
  }

  saveFullnessTarget() {
    localStorage.setItem("ressoar:fullness-target", JSON.stringify(this.fullnessTarget));
    this.drawFullnessMap();
  }

  fullnessBounds() {
    return { left: 90, top: 55, right: 720, bottom: 430 };
  }

  placeFullnessTarget(event) {
    const rect = this.fullnessCanvas.getBoundingClientRect();
    const scaleX = this.fullnessCanvas.width / rect.width;
    const scaleY = this.fullnessCanvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    const bounds = this.fullnessBounds();
    this.fullnessTarget = {
      weight: clamp((x - bounds.left) / (bounds.right - bounds.left)),
      size: 1 - clamp((y - bounds.top) / (bounds.bottom - bounds.top)),
    };
    this.saveFullnessTarget();
  }

  moveFullnessTarget(event) {
    const amount = event.shiftKey ? 0.1 : 0.025;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowLeft") this.fullnessTarget.weight = clamp(this.fullnessTarget.weight - amount);
    if (event.key === "ArrowRight") this.fullnessTarget.weight = clamp(this.fullnessTarget.weight + amount);
    if (event.key === "ArrowUp") this.fullnessTarget.size = clamp(this.fullnessTarget.size + amount);
    if (event.key === "ArrowDown") this.fullnessTarget.size = clamp(this.fullnessTarget.size - amount);
    this.saveFullnessTarget();
  }

  selectReference(id) {
    if (this.referenceObjectUrl) URL.revokeObjectURL(this.referenceObjectUrl);
    this.referenceObjectUrl = null;
    const anchor = this.anchors?.find((item) => item.id === id);
    if (!anchor) {
      this.referenceAudio.pause();
      this.referenceAudio.removeAttribute("src");
      this.referenceAudio.hidden = true;
      return;
    }
    this.referenceObjectUrl = URL.createObjectURL(anchor.blob);
    this.referenceAudio.src = this.referenceObjectUrl;
    this.referenceAudio.hidden = false;
  }

  async saveAnchor() {
    if (!this.recordingBlob) return;
    this.anchorSaveBtn.disabled = true;
    try {
      const anchor = {
        id: newSessionId(),
        kind: this.anchorKind.value,
        createdAt: new Date().toISOString(),
        label: this.step.label,
        mode: this.step.mode,
        metrics: this.summary,
        mimeType: this.recordingBlob.type,
        blob: this.recordingBlob,
      };
      await voiceStorePut("anchors", anchor);
      this.statusEl.textContent = t("anchorSaved");
      await this.loadAnchors(anchor.id);
    } catch (error) {
      this.statusEl.textContent = `${t("anchorSaveFailed")} ${error.message}`;
    } finally {
      this.anchorSaveBtn.disabled = false;
    }
  }

  async saveRating() {
    if (!this.takeRecord) return;
    this.saveRatingBtn.disabled = true;
    try {
      await this.takeSavePromise;
      this.takeRecord.ratings = {
        ease: Number(this.ratingEase.value),
        stability: Number(this.ratingStability.value),
        satisfaction: Number(this.ratingSatisfaction.value),
      };
      await voiceStorePut("takes", this.takeRecord);
      this.statusEl.textContent = t("ratingSaved");
    } catch (error) {
      this.statusEl.textContent = error.message;
    } finally {
      this.saveRatingBtn.disabled = false;
    }
  }

  setAnalysisView(viewName) {
    this.overlay.querySelectorAll(".analysis-tab").forEach((button) => {
      const selected = button.dataset.view === viewName;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    this.overlay.querySelectorAll(".analysis-panel").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== viewName;
    });
  }

  toggleFeedback() {
    const panels = this.overlay.querySelector(".analysis-panels");
    const message = this.overlay.querySelector(".feedback-hidden-message");
    panels.hidden = !panels.hidden;
    message.hidden = !panels.hidden;
    this.feedbackBtn.textContent = panels.hidden ? t("showFeedback") : t("hideFeedback");
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
    this.currentTake.hidden = true;
    this.anchorSave.hidden = true;
    this.takeRating.hidden = true;
    this.ratingEase.value = "3";
    this.ratingStability.value = "3";
    this.ratingSatisfaction.value = "3";
    this.statusEl.textContent = t("recording");
    this.stopBtn.focus();
    this.audioCtx.resume();

    this.pitches = new Array(HISTORY).fill(null);
    this.metricFrames = [];
    this.latestMetrics = null;
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
      this.analyser.getFloatFrequencyData(this.frequencyBuffer);
      const hz = autoCorrelate(this.buffer, this.audioCtx.sampleRate);
      this.pitches.push(hz > 0 ? hz : null);
      if (this.pitches.length > HISTORY) this.pitches.shift();
      this.hzEl.textContent = hz > 0 ? `${Math.round(hz)} Hz` : "—";
      const note = noteFromHz(hz);
      this.noteEl.textContent = note ? `${note.en} · ${note.pt}` : "—";
      if (hz > 0) {
        const metrics = this.calibrateMetrics(spectralMetrics(
          this.frequencyBuffer,
          this.audioCtx.sampleRate,
          this.analyser.fftSize,
        ));
        this.latestMetrics = { ...metrics, pitch: hz };
        this.metricFrames.push(this.latestMetrics);
        this.updateSpectrumReadouts();
        this.drawFullnessMap();
      }
      this.drawGraph();
      this.drawSpectrogram(this.frequencyBuffer);
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

  updateSpectrumReadouts() {
    const metrics = this.latestMetrics;
    if (!metrics) {
      this.sizeEl.textContent = `${t("sizeReadout")}: —`;
      this.weightEl.textContent = `${t("weightReadout")}: —`;
      this.resonancesEl.textContent = "R1 ~ — · R2 ~ —";
      return;
    }
    this.sizeEl.textContent = `${t("sizeReadout")}: ${t("larger")} ◀ ${Math.round(metrics.sizePosition * 100)}% ▶ ${t("smaller")}`;
    this.weightEl.textContent = `${t("weightReadout")}: ${t("lighter")} ◀ ${Math.round(metrics.weightPosition * 100)}% ▶ ${t("heavier")}`;
    this.resonancesEl.textContent = `R1 ~ ${metrics.r1} Hz · R2 ~ ${metrics.r2} Hz`;
  }

  drawSpectrogram(spectrum) {
    const dataCtx = this.spectrumDataCtx;
    const width = this.spectrumDataCanvas.width;
    const height = this.spectrumDataCanvas.height;
    dataCtx.drawImage(this.spectrumDataCanvas, -SPECTRUM_SHIFT_PX, 0);
    dataCtx.fillStyle = "#100b19";
    dataCtx.fillRect(width - SPECTRUM_SHIFT_PX, 0, SPECTRUM_SHIFT_PX, height);

    if (spectrum && this.audioCtx) {
      const binHz = this.audioCtx.sampleRate / this.analyser.fftSize;
      for (let y = 0; y < height; y += 2) {
        const ratio = 1 - y / height;
        const frequency = SPECTRUM_MIN_HZ + ratio * (SPECTRUM_MAX_HZ - SPECTRUM_MIN_HZ);
        const bin = Math.min(spectrum.length - 1, Math.round(frequency / binHz));
        dataCtx.fillStyle = spectrogramColor(spectrum[bin]);
        dataCtx.fillRect(width - SPECTRUM_SHIFT_PX, y, SPECTRUM_SHIFT_PX, 2);
      }
    }

    const ctx = this.spectrumCtx;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(this.spectrumDataCanvas, 0, 0);
    ctx.font = "13px 'Monaspace Radon', monospace";
    ctx.lineWidth = 1;
    for (const frequency of [500, 1000, 2000, 3000, 4000]) {
      const y = height - ((frequency - SPECTRUM_MIN_HZ) / (SPECTRUM_MAX_HZ - SPECTRUM_MIN_HZ)) * height;
      ctx.strokeStyle = "rgba(236, 230, 247, 0.16)";
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(236, 230, 247, 0.7)";
      ctx.fillText(`${frequency} Hz`, 5, y - 4);
    }
    if (this.latestMetrics) {
      for (const [label, frequency, color] of [
        ["R1", this.latestMetrics.r1, "#ff79c6"],
        ["R2", this.latestMetrics.r2, "#bd93f9"],
      ]) {
        const y = height - ((frequency - SPECTRUM_MIN_HZ) / (SPECTRUM_MAX_HZ - SPECTRUM_MIN_HZ)) * height;
        ctx.strokeStyle = color;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(width - 150, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.fillText(`${label} ~`, width - 145, y - 4);
      }
    }
  }

  drawFullnessMap() {
    const ctx = this.fullnessCtx;
    const canvas = this.fullnessCanvas;
    const { left, top, right, bottom } = this.fullnessBounds();
    const width = right - left;
    const height = bottom - top;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#100b19";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const horizontal = ctx.createLinearGradient(left, 0, right, 0);
    horizontal.addColorStop(0, "rgba(189, 147, 249, 0.12)");
    horizontal.addColorStop(1, "rgba(255, 121, 198, 0.18)");
    ctx.fillStyle = horizontal;
    ctx.fillRect(left, top, width, height);

    ctx.strokeStyle = "rgba(236, 230, 247, 0.12)";
    ctx.lineWidth = 64;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(right, bottom);
    ctx.stroke();

    ctx.lineCap = "butt";
    for (const range of [
      { start: 0.04, end: 0.38, color: "rgba(255, 121, 198, 0.52)" },
      { start: 0.34, end: 0.68, color: "rgba(139, 233, 253, 0.42)" },
      { start: 0.64, end: 0.96, color: "rgba(189, 147, 249, 0.5)" },
    ]) {
      ctx.strokeStyle = range.color;
      ctx.lineWidth = 52;
      ctx.beginPath();
      ctx.moveTo(left + width * range.start, top + height * range.start);
      ctx.lineTo(left + width * range.end, top + height * range.end);
      ctx.stroke();
    }

    ctx.strokeStyle = "#5b4777";
    ctx.lineWidth = 2;
    ctx.strokeRect(left, top, width, height);
    ctx.beginPath();
    ctx.moveTo(left, top + height / 2);
    ctx.lineTo(right, top + height / 2);
    ctx.moveTo(left + width / 2, top);
    ctx.lineTo(left + width / 2, bottom);
    ctx.stroke();

    ctx.font = "700 26px 'Monaspace Radon', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ece6f7";
    ctx.fillText(t("smaller"), left + width / 2, 28);
    ctx.fillText(t("larger"), left + width / 2, 475);
    ctx.textAlign = "left";
    ctx.fillText(t("lighter"), left, 455);
    ctx.textAlign = "right";
    ctx.fillText(t("heavier"), right, 455);

    ctx.font = "700 22px 'Monaspace Radon', monospace";
    ctx.fillStyle = "rgba(255, 159, 188, 0.9)";
    ctx.textAlign = "right";
    ctx.fillText(t("mapOverfull"), right - 16, top + 28);
    ctx.textAlign = "left";
    ctx.fillText(t("mapUnderfull"), left + 16, bottom - 18);
    ctx.save();
    ctx.translate(left + width / 2, top + height / 2);
    ctx.rotate(Math.atan2(height, width));
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(216, 194, 255, 0.9)";
    ctx.fillText(t("mapBalanced"), 0, -12);
    ctx.restore();

    const targetX = left + this.fullnessTarget.weight * width;
    const targetY = top + (1 - this.fullnessTarget.size) * height;
    ctx.strokeStyle = "#f8f8f2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(targetX - 18, targetY);
    ctx.lineTo(targetX + 18, targetY);
    ctx.moveTo(targetX, targetY - 18);
    ctx.lineTo(targetX, targetY + 18);
    ctx.stroke();

    if (this.latestMetrics) {
      const currentX = left + this.latestMetrics.weightPosition * width;
      const currentY = top + (1 - this.latestMetrics.sizePosition) * height;
      ctx.shadowColor = "#ff79c6";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#ff79c6";
      ctx.beginPath();
      ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      this.fullnessStatus.textContent = `${t("mapCurrent")}: ${Math.round(this.latestMetrics.sizePosition * 100)}% ${t("smaller")} · ${Math.round(this.latestMetrics.weightPosition * 100)}% ${t("heavier")} | ${t("mapTarget")}: ${Math.round(this.fullnessTarget.size * 100)}% ${t("smaller")} · ${Math.round(this.fullnessTarget.weight * 100)}% ${t("heavier")}`;
    } else {
      this.fullnessStatus.textContent = `${t("waitingForVoice")} ${t("mapTarget")}: ${Math.round(this.fullnessTarget.size * 100)}% ${t("smaller")} · ${Math.round(this.fullnessTarget.weight * 100)}% ${t("heavier")}`;
    }
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
    this.recordingBlob = blob;
    this.summary = summarizeMetricFrames(this.metricFrames);
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = extensionFromMimeType(recordingType);
    const name = `${this.step.fileBase}-${stamp}.${extension}`;

    this.downloadEl.href = this.objectUrl;
    this.downloadEl.download = name;
    this.downloadEl.hidden = false;
    this.downloadEl.click();

    this.currentAudio.src = this.objectUrl;
    this.currentTake.hidden = false;
    this.anchorSave.hidden = false;
    this.takeRating.hidden = false;

    this.takeRecord = {
      id: newSessionId(),
      createdAt: new Date().toISOString(),
      sessionId: this.step.sessionId,
      sessionTitle: this.step.sessionTitle,
      label: this.step.label,
      mode: this.step.mode,
      phase: this.step.phase,
      metrics: this.summary,
      mimeType: recordingType,
      blob,
    };
    this.takeSavePromise = voiceStorePut("takes", this.takeRecord).catch((error) => {
      this.statusEl.textContent = error.message;
      return false;
    });

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
    if (this.referenceObjectUrl) URL.revokeObjectURL(this.referenceObjectUrl);
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
let viewObjectUrls = [];

function clearViewObjectUrls() {
  viewObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  viewObjectUrls = [];
}

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
  clearViewObjectUrls();
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
      <button id="btn-program" class="program-button primary">${t("builtInProgram")}</button>
      <div class="home-tools">
        <button id="btn-anchors" class="ghost">${t("voiceAnchors")}</button>
        <button id="btn-history" class="ghost">${t("practiceHistory")}</button>
      </div>
    </section>`;

  document.getElementById("btn-load").addEventListener("click", () => fileInput.click());
  document.getElementById("btn-create").addEventListener("click", () => renderCreate());
  document.getElementById("btn-anchors").addEventListener("click", () => renderAnchors());
  document.getElementById("btn-history").addEventListener("click", () => renderHistory());
  document.getElementById("btn-program").addEventListener("click", async () => {
    const res = await fetch(`/sessions/fundamentos-${lang}.ressoar.json`);
    openSession(validateSession(await res.json()));
  });
  document.getElementById("btn-example").addEventListener("click", async () => {
    const res = await fetch("/sessions/exemplo-glissando.ressoar.json");
    openSession(validateSession(await res.json()));
  });
}

async function renderHistory() {
  clearViewObjectUrls();
  view = "history";
  currentSession = null;
  app.innerHTML = `
    <section class="history-view">
      <button class="back ghost">${t("back")}</button>
      <h2>${t("historyTitle")}</h2>
      <p class="description">${t("historyIntro")}</p>
      <section class="retention-overview">
        <h3>${t("retentionSummary")}</h3>
        <div class="retention-grid"></div>
      </section>
      <div class="history-list"><p class="description">${t("waitingForVoice")}</p></div>
    </section>`;
  app.querySelector(".back").addEventListener("click", renderHome);

  let takes;
  try {
    takes = (await voiceStoreAll("takes")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    app.querySelector(".history-list").innerHTML = `<p class="create-error">${escapeHtml(error.message)}</p>`;
    return;
  }
  if (view !== "history") return;

  app.querySelector(".retention-grid").innerHTML = ["cold", "working", "recall"].map((phase) => {
    const take = takes.find((item) => item.phase === phase);
    return `<article class="retention-card">
      <h4>${phaseLabel(phase)}</h4>
      ${take ? `<div class="history-badges">${metricBadges(take.metrics)}</div>` : `<p>${t("noCheckpoint")}</p>`}
    </article>`;
  }).join("");

  if (!takes.length) {
    app.querySelector(".history-list").innerHTML = `<p class="description">${t("noHistory")}</p>`;
    return;
  }
  app.querySelector(".history-list").innerHTML = takes.map((take) => {
    const url = URL.createObjectURL(take.blob);
    viewObjectUrls.push(url);
    const ratings = take.ratings
      ? `<span class="badge">${t("ratingEase")}: ${take.ratings.ease}/5</span><span class="badge">${t("ratingStability")}: ${take.ratings.stability}/5</span><span class="badge">${t("ratingSatisfaction")}: ${take.ratings.satisfaction}/5</span>`
      : "";
    return `<article class="history-card" data-id="${escapeHtml(take.id)}">
      <div>
        <h3>${escapeHtml(take.sessionTitle ?? t("untitledSession"))}</h3>
        <p>${escapeHtml(take.label)}</p>
        <time datetime="${escapeHtml(take.createdAt)}">${new Date(take.createdAt).toLocaleString(lang === "pt" ? "pt-BR" : "en-US")}</time>
        <div class="history-badges">
          <span class="badge">${modeLabel(take.mode ?? "integration")}</span>
          <span class="badge">${phaseLabel(take.phase ?? "practice")}</span>
          ${metricBadges(take.metrics)}
          ${ratings}
        </div>
      </div>
      <audio controls src="${url}"></audio>
      <button class="delete-take ghost">${t("deleteTake")}</button>
    </article>`;
  }).join("");
  app.querySelectorAll(".delete-take").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm(t("deleteTakeConfirm"))) return;
      await voiceStoreDelete("takes", button.closest(".history-card").dataset.id);
      renderHistory();
    });
  });
}

async function renderAnchors() {
  clearViewObjectUrls();
  view = "anchors";
  currentSession = null;
  app.innerHTML = `
    <section class="anchors-view">
      <button class="back ghost">${t("back")}</button>
      <h2>${t("anchorsTitle")}</h2>
      <p class="description">${t("anchorsIntro")}</p>
      <div class="anchors-list"><p class="description">${t("waitingForVoice")}</p></div>
    </section>`;
  app.querySelector(".back").addEventListener("click", renderHome);

  let anchors;
  try {
    anchors = (await voiceStoreAll("anchors")).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    app.querySelector(".anchors-list").innerHTML = `<p class="create-error">${escapeHtml(error.message)}</p>`;
    return;
  }
  if (view !== "anchors") return;
  if (!anchors.length) {
    app.querySelector(".anchors-list").innerHTML = `<p class="description">${t("noAnchors")}</p>`;
    return;
  }
  app.querySelector(".anchors-list").innerHTML = anchors.map((anchor) => {
    const url = URL.createObjectURL(anchor.blob);
    viewObjectUrls.push(url);
    const metrics = anchor.metrics;
    return `<article class="anchor-card" data-id="${escapeHtml(anchor.id)}">
      <div>
        <h3>${anchorLabel(anchor.kind)}</h3>
        <p>${escapeHtml(anchor.label)}</p>
        <div class="anchor-badges">
          <span class="badge">${modeLabel(anchor.mode ?? "integration")}</span>
          ${metrics ? `<span class="badge">${metrics.pitch} Hz</span><span class="badge">R1 ~ ${metrics.r1} · R2 ~ ${metrics.r2}</span>` : ""}
        </div>
      </div>
      <audio controls src="${url}"></audio>
      <button class="delete-anchor ghost">${t("deleteAnchor")}</button>
    </article>`;
  }).join("");
  app.querySelectorAll(".delete-anchor").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm(t("deleteAnchorConfirm"))) return;
      await voiceStoreDelete("anchors", button.closest(".anchor-card").dataset.id);
      renderAnchors();
    });
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
        sessionId: session.id,
        sessionTitle: session.title,
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
  else if (view === "anchors") renderAnchors();
  else if (view === "history") renderHistory();
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
