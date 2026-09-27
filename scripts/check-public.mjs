// Scans the build output (and src) for things that must never ship on a public site.
// Usage: node scripts/check-public.mjs  (run after `ng build`)
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const TARGETS = ['dist', 'src', 'public'].filter((d) => existsSync(d));
const TEXT_EXT = new Set(['.html', '.js', '.mjs', '.css', '.json', '.ts', '.txt', '.xml', '.webmanifest', '.md', '.svg']);

const RULES = [
  { name: 'Google Apps Script endpoint', re: /script\.google(usercontent)?\.com\/macros/i },
  { name: 'Apps Script deployment id', re: /AKfy[a-zA-Z0-9_-]{20,}/ },
  { name: 'Base64 encoded URL (obfuscated endpoint)', re: /aHR0cHM6Ly9[a-zA-Z0-9+/=]{16,}/ },
  { name: 'Google API key', re: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'GitHub token', re: /gh[pousr]_[A-Za-z0-9]{30,}/ },
  { name: 'OpenAI / Groq style secret key', re: /\b(sk|gsk)_[A-Za-z0-9]{20,}/ },
  { name: 'Private key block', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'Google Sheets published CSV', re: /docs\.google\.com\/spreadsheets\/d\/e\/[^"'\s]+output=csv/i },
  { name: 'Indonesian NIK / No. KK (16 digits)', re: /(?<![\d.])\d{16}(?![\d.])/ },
  { name: 'Password assignment', re: /password\s*[:=]\s*['"][^'"]{4,}['"]/i },
];

const findings = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path);
    else if (TEXT_EXT.has(extname(name).toLowerCase()) && st.size < 5_000_000) {
      const text = readFileSync(path, 'utf8');
      for (const rule of RULES) {
        const m = text.match(rule.re);
        if (m) findings.push(`${path}: ${rule.name} → "${m[0].slice(0, 40)}"`);
      }
    }
  }
}
TARGETS.forEach(walk);

if (findings.length) {
  console.error('✖ Sensitive patterns found:\n  ' + findings.join('\n  '));
  process.exit(1);
}
console.log(`✔ No sensitive patterns found in: ${TARGETS.join(', ')}`);
