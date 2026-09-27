// Serves the production build at http://localhost:4300/portfolio/ (same base path as GitHub Pages).
// Usage: npm run build && node scripts/preview.mjs
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('dist');
const BASE = '/portfolio/';
const PORT = Number(process.env.PORT ?? 4300);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.xml': 'application/xml',
};

http
  .createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (!url.pathname.startsWith(BASE)) {
      res.writeHead(302, { location: BASE }).end();
      return;
    }
    let rel = normalize(decodeURIComponent(url.pathname.slice(BASE.length))).replace(/^([\\/]|\.\.)+/, '');
    if (!rel || rel === '.' || rel.endsWith('\\') || rel.endsWith('/')) rel = join(rel, 'index.html');
    const file = join(ROOT, rel);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404, { 'content-type': TYPES['.html'] }).end(await readFile(join(ROOT, '404.html')).catch(() => 'Not found'));
    }
  })
  .listen(PORT, () => console.log(`Preview: http://localhost:${PORT}${BASE}`));
