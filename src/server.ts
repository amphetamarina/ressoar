import { mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { findSession, sessions } from "./exercises";
import { page, renderHome, renderSession } from "./views";

const PUBLIC_DIR = join(import.meta.dir, "..", "public");
const RECORDINGS_DIR = join(import.meta.dir, "..", "recordings");

await mkdir(RECORDINGS_DIR, { recursive: true });

const CONTENT_TYPES: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".html": "text/html; charset=utf-8",
};

async function serveStatic(pathname: string): Promise<Response | null> {
  const file = Bun.file(join(PUBLIC_DIR, pathname));
  if (!(await file.exists())) return null;
  const type = CONTENT_TYPES[extname(pathname)] ?? file.type;
  return new Response(file, { headers: { "content-type": type } });
}

function safeName(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

async function handleUpload(req: Request): Promise<Response> {
  const form = await req.formData();
  const audio = form.get("audio");
  const video = form.get("video");
  const sessionId = safeName(String(form.get("sessionId") ?? "session"));
  const exerciseId = safeName(String(form.get("exerciseId") ?? "exercise"));
  const stepId = safeName(String(form.get("stepId") ?? "step"));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const base = `${sessionId}__${exerciseId}__${stepId}__${stamp}`;

  const saved: string[] = [];
  if (video instanceof File && video.size > 0) {
    const name = `${base}.webm`;
    await Bun.write(join(RECORDINGS_DIR, name), video);
    saved.push(name);
  }
  if (audio instanceof File && audio.size > 0) {
    const name = `${base}.audio.webm`;
    await Bun.write(join(RECORDINGS_DIR, name), audio);
    saved.push(name);
  }

  return Response.json({ ok: true, saved });
}

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/upload") {
      return handleUpload(req);
    }

    const partial = req.headers.get("HX-Request") === "true";
    const html = (body: string) =>
      new Response(partial ? body : page(body), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });

    if (url.pathname === "/") {
      return html(renderHome(sessions));
    }

    const sessionMatch = url.pathname.match(/^\/session\/([^/]+)$/);
    if (sessionMatch) {
      const session = findSession(sessionMatch[1]);
      if (!session) return new Response("Not found", { status: 404 });
      return html(renderSession(session));
    }

    const asset = await serveStatic(url.pathname);
    if (asset) return asset;

    return new Response("Not found", { status: 404 });
  },
});

console.log(`voice-feminizer running on http://localhost:${server.port}`);
