import { join, extname, normalize } from "node:path";

const PUBLIC_DIR = join(import.meta.dir, "..", "public");

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
};

async function serveFile(pathname: string): Promise<Response | null> {
  const relative = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const file = Bun.file(join(PUBLIC_DIR, relative));
  if (!(await file.exists())) return null;
  const type = CONTENT_TYPES[extname(relative)] ?? file.type;
  return new Response(file, { headers: { "content-type": type } });
}

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const file = await serveFile(pathname);
    if (file) return file;
    return new Response("Not found", { status: 404 });
  },
});

console.log(`voice-feminizer running on http://localhost:${server.port}`);
