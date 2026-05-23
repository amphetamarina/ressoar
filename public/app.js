const MIN_HZ = 80;
const MAX_HZ = 400;
const HISTORY = 240;

const NOTES_EN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

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
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
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
    const durationText =
      this.step.duration === null ? "Tempo livre" : `${this.step.duration}s`;
    this.overlay.innerHTML = `
      <div class="drill">
        <button class="drill-close" aria-label="Fechar">×</button>
        <p class="drill-instruction">${this.step.label.replace(/\n/g, "<br>")}</p>
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
          <button class="drill-go">Pronta? Começar</button>
          <button class="drill-stop" hidden>Parar</button>
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
      this.statusEl.textContent = `Sem acesso à câmera/microfone: ${err.message}`;
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
    this.statusEl.textContent = "Gravando…";
    this.audioCtx.resume();

    this.chunks = [];
    const mimeType = pickMimeType();
    this.recorder = new MediaRecorder(this.stream, mimeType ? { mimeType } : undefined);
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.onstop = () => this.upload();
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
    ctx.font = "11px system-ui, sans-serif";
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
    this.statusEl.textContent = "Salvando…";
    if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
  }

  async upload() {
    const blob = new Blob(this.chunks, { type: this.recorder.mimeType || "video/webm" });
    const form = new FormData();
    form.append("sessionId", this.step.session);
    form.append("exerciseId", this.step.exercise);
    form.append("stepId", this.step.step);
    form.append("video", blob, "recording.webm");
    try {
      const res = await fetch("/upload", { method: "POST", body: form });
      const data = await res.json();
      this.statusEl.textContent = `Salvo: ${data.saved.join(", ")}`;
    } catch (err) {
      this.statusEl.textContent = `Falha ao salvar: ${err.message}`;
    }
    this.stopBtn.hidden = true;
    this.goBtn.hidden = false;
    this.goBtn.textContent = "Repetir";
    this.goBtn.disabled = false;
    this.stopBtn.disabled = false;
  }

  close() {
    this.running = false;
    clearInterval(this.countdown);
    cancelAnimationFrame(this.raf);
    if (this.recorder && this.recorder.state !== "inactive") this.recorder.stop();
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    if (this.audioCtx) this.audioCtx.close();
    this.overlay.hidden = true;
    this.overlay.innerHTML = "";
  }
}

let activeDrill = null;

document.addEventListener("click", (event) => {
  const btn = event.target.closest(".drill-start");
  if (!btn) return;
  const li = btn.closest(".step");
  const overlay = document.getElementById("drill-overlay");
  if (activeDrill) activeDrill.close();
  const durationAttr = li.dataset.duration;
  activeDrill = new Drill(overlay, {
    session: li.dataset.session,
    exercise: li.dataset.exercise,
    step: li.dataset.step,
    label: li.dataset.label,
    duration: durationAttr === "" ? null : Number(durationAttr),
  });
});
