const MIN_HZ = 80;
const MAX_HZ = 400;
const HISTORY = 240;

const NOTES_EN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

const I18N = {
  pt: {
    flag: "🇧🇷",
    switchTo: "Switch to English",
    tagline: "Treinos de feminização vocal com pitch ao vivo, câmera e checklist.",
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
    secondsPh: "segundos",
    freeTime: "Tempo livre",
    untitledSession: "Sessão sem título",
    defaultExercise: "Exercício",
    drillReady: "Pronta? Começar",
    stop: "Parar",
    downloadRecording: "Baixar gravação",
    noMedia: "Sem acesso à câmera/microfone:",
    recording: "Gravando…",
    preparing: "Preparando download…",
    downloaded: "Gravação baixada. Use o botão para baixar de novo.",
    repeat: "Repetir",
    invalidFormat: "Formato inválido: faltam 'title' ou 'exercises'.",
    invalidExercise: "Cada exercício precisa de 'title' e 'steps'.",
    loadFailed: "Não foi possível carregar a sessão:",
  },
  en: {
    flag: "🇺🇸",
    switchTo: "Mudar para português",
    tagline: "Voice feminization practice with live pitch tracking, camera, and a checklist.",
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
    secondsPh: "seconds",
    freeTime: "Free time",
    untitledSession: "Untitled session",
    defaultExercise: "Exercise",
    drillReady: "Ready? Start",
    stop: "Stop",
    downloadRecording: "Download recording",
    noMedia: "No camera/microphone access:",
    recording: "Recording…",
    preparing: "Preparing download…",
    downloaded: "Recording downloaded. Use the button to download it again.",
    repeat: "Repeat",
    invalidFormat: "Invalid format: missing 'title' or 'exercises'.",
    invalidExercise: "Each exercise needs 'title' and 'steps'.",
    loadFailed: "Could not load the session:",
  },
};

let lang = localStorage.getItem("ressoar:lang") === "en" ? "en" : "pt";

function t(key) {
  return I18N[lang][key] ?? I18N.pt[key] ?? key;
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

  const correlation = new Array(size).fill(0);
  for (let lag = 0; lag < size; lag++) {
    for (let i = 0; i < size - lag; i++) {
      correlation[lag] += trimmed[i] * trimmed[i + lag];
    }
  }

  let lag = 0;
  while (lag < size - 1 && correlation[lag] > correlation[lag + 1]) lag++;

  let peak = -1;
  let peakLag = -1;
  for (let i = lag; i < size; i++) {
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
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
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

class Drill {
  constructor(overlay, step) {
    this.overlay = overlay;
    this.step = step;
    this.pitches = new Array(HISTORY).fill(null);
    this.running = false;
    this.render();
  }

  render() {
    const durationText = this.step.duration === null ? t("freeTime") : `${this.step.duration}s`;
    this.overlay.innerHTML = `
      <div class="drill">
        <button class="drill-close" aria-label="Fechar">×</button>
        <p class="drill-instruction">${escapeHtml(this.step.label).replace(/\n/g, "<br>")}</p>
        <div class="drill-stage">
          <video class="drill-video" autoplay muted playsinline></video>
          <canvas class="drill-pitch" width="960" height="380"></canvas>
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
          <span class="drill-status"></span>
        </div>
      </div>`;
    this.overlay.hidden = false;

    this.video = this.overlay.querySelector(".drill-video");
    this.canvas = this.overlay.querySelector(".drill-pitch");
    this.ctx = this.canvas.getContext("2d");
    this.hzEl = this.overlay.querySelector(".drill-hz");
    this.noteEl = this.overlay.querySelector(".drill-note");
    this.timerEl = this.overlay.querySelector(".drill-timer");
    this.goBtn = this.overlay.querySelector(".drill-go");
    this.stopBtn = this.overlay.querySelector(".drill-stop");
    this.downloadEl = this.overlay.querySelector(".drill-download");
    this.statusEl = this.overlay.querySelector(".drill-status");

    this.overlay.querySelector(".drill-close").addEventListener("click", () => this.close());
    this.goBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.stop());

    this.drawGraph();
    this.openMedia();
  }

  async openMedia() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });
    } catch (err) {
      this.statusEl.textContent = `${t("noMedia")} ${err.message}`;
      this.goBtn.disabled = true;
      return;
    }
    this.video.srcObject = this.stream;

    this.audioCtx = new AudioContext();
    const source = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    source.connect(this.analyser);
    this.buffer = new Float32Array(this.analyser.fftSize);
  }

  start() {
    if (!this.stream) return;
    this.running = true;
    this.goBtn.hidden = true;
    this.stopBtn.hidden = false;
    this.downloadEl.hidden = true;
    this.statusEl.textContent = t("recording");
    this.audioCtx.resume();

    this.chunks = [];
    const mimeType = pickMimeType();
    this.recorder = new MediaRecorder(this.stream, mimeType ? { mimeType } : undefined);
    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.chunks.push(event.data);
    };
    this.recorder.onstop = () => this.finalize();
    this.recorder.start();

    this.pitches = new Array(HISTORY).fill(null);
    this.analyse();

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

  analyse() {
    if (!this.running) return;
    this.analyser.getFloatTimeDomainData(this.buffer);
    const hz = autoCorrelate(this.buffer, this.audioCtx.sampleRate);
    this.pitches.push(hz > 0 ? hz : null);
    if (this.pitches.length > HISTORY) this.pitches.shift();
    this.hzEl.textContent = hz > 0 ? `${Math.round(hz)} Hz` : "—";
    const note = noteFromHz(hz);
    this.noteEl.textContent = note ? `${note.en} · ${note.pt}` : "—";
    this.drawGraph();
    this.raf = requestAnimationFrame(() => this.analyse());
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
    const blob = new Blob(this.chunks, { type: this.recorder.mimeType || "video/webm" });
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const name = `${this.step.fileBase}-${stamp}.webm`;

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
    if (this.step.onDone) this.step.onDone();
  }

  close() {
    this.running = false;
    clearInterval(this.countdown);
    cancelAnimationFrame(this.raf);
    if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
    if (this.audioCtx) this.audioCtx.close();
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.overlay.hidden = true;
    this.overlay.innerHTML = "";
  }
}

const app = document.getElementById("app");
const overlay = document.getElementById("drill-overlay");
const fileInput = document.getElementById("file-input");
const langToggle = document.getElementById("lang-toggle");

let activeDrill = null;
let currentSession = null;
let view = "home";

function validateSession(data) {
  if (!data || typeof data.title !== "string" || !Array.isArray(data.exercises)) {
    throw new Error(t("invalidFormat"));
  }
  for (const exercise of data.exercises) {
    if (typeof exercise.title !== "string" || !Array.isArray(exercise.steps)) {
      throw new Error(t("invalidExercise"));
    }
  }
  return data;
}

function doneKey(title) {
  return `ressoar:done:${title}`;
}

function loadDone(title) {
  try {
    return new Set(JSON.parse(localStorage.getItem(doneKey(title)) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveDone(title, set) {
  localStorage.setItem(doneKey(title), JSON.stringify([...set]));
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
  const done = loadDone(session.title);
  const total = session.exercises.reduce((n, exercise) => n + exercise.steps.length, 0);
  const completed = [...done].filter((key) => key.startsWith("step:")).length;

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
      const set = loadDone(session.title);
      if (event.target.checked) set.add(li.dataset.key);
      else set.delete(li.dataset.key);
      saveDone(session.title, set);
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
        fileBase: `${slug(session.title)}-${ei + 1}.${si + 1}`,
        onDone: () => {
          const set = loadDone(session.title);
          set.add(li.dataset.key);
          saveDone(session.title, set);
        },
      });
    });
  });
}

function stepEditor(step) {
  const node = el(`
    <li class="step-edit">
      <textarea class="step-label-input" rows="2" placeholder="${t("stepLabelPh")}"></textarea>
      <div class="step-edit-meta">
        <input class="step-duration-input" type="number" min="1" placeholder="${t("secondsPh")}" />
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
      <input class="ex-title-input" placeholder="${t("exTitlePh")}" />
      <textarea class="ex-desc-input" rows="2" placeholder="${t("exDescPh")}"></textarea>
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
      };
    }),
  }));
  return { title, createdAt: new Date().toISOString().slice(0, 10), exercises };
}

function renderCreate(draft) {
  view = "create";
  app.innerHTML = `
    <section class="create">
      <button class="back ghost">${t("back")}</button>
      <h2>${t("createTitle")}</h2>
      <input class="session-title-input" placeholder="${t("sessionTitlePh")}" />
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
  document.getElementById("start-draft").addEventListener("click", () => openSession(validateSession(collectDraft())));
  document.getElementById("download-draft").addEventListener("click", () => {
    const session = validateSession(collectDraft());
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

document.getElementById("home-link").addEventListener("click", renderHome);

applyLang();
renderHome();