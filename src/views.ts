import type { Session } from "./exercises";

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function page(body: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Voice Feminizer</title>
  <link rel="stylesheet" href="/style.css" />
  <script src="https://unpkg.com/htmx.org@2.0.4"></script>
</head>
<body>
  <header><a hx-get="/" hx-target="#app" hx-push-url="true"><h1>Voice Feminizer</h1></a></header>
  <main id="app">${body}</main>
  <div id="drill-overlay" hidden></div>
  <script type="module" src="/app.js"></script>
</body>
</html>`;
}

export function renderHome(sessions: Session[]): string {
  const items = sessions
    .map(
      (session) => `<li>
        <a hx-get="/session/${session.id}" hx-target="#app" hx-push-url="true">
          ${escape(session.name)}
          <span class="meta">${session.exercises.length} exercícios</span>
        </a>
      </li>`,
    )
    .join("");
  return `<section class="sessions">
    <h2>Sessões</h2>
    <ul class="card-list">${items}</ul>
  </section>`;
}

export function renderSession(session: Session): string {
  const exercises = session.exercises
    .map((exercise, exerciseIndex) => {
      const steps = exercise.steps
        .map((step, stepIndex) => {
          const duration =
            step.durationSeconds === null
              ? "livre"
              : `${step.durationSeconds}s`;
          return `<li class="step"
            data-session="${session.id}"
            data-exercise="${exercise.id}"
            data-step="${step.id}"
            data-label="${escape(step.label)}"
            data-duration="${step.durationSeconds ?? ""}">
            <div class="step-label">${escape(step.label).replace(/\n/g, "<br>")}</div>
            <div class="step-meta">
              <span class="badge">${exerciseIndex + 1}.${stepIndex + 1}</span>
              <span class="badge">${duration}</span>
              <button class="drill-start">Começar drill</button>
            </div>
          </li>`;
        })
        .join("");
      return `<article class="exercise">
        <h3>${exerciseIndex + 1}. ${escape(exercise.title)}</h3>
        <p class="description">${escape(exercise.description)}</p>
        <ul class="steps">${steps}</ul>
      </article>`;
    })
    .join("");

  return `<section class="session">
    <a class="back" hx-get="/" hx-target="#app" hx-push-url="true">← Sessões</a>
    <h2>${escape(session.name)}</h2>
    ${exercises}
  </section>`;
}
