import { Injectable, signal } from '@angular/core';
import { MEDIA_API, MEDIA_FALLBACK } from '../data/media';
import { CertGroup, DriveFile, MediaData } from '../models';

const CACHE_KEY = 'fn-media-v1';
const CACHE_MS = 10 * 60 * 1000;
const ID_RE = /^[A-Za-z0-9_-]{10,100}$/;

// `-rw` asks Google to serve WebP (≈4× smaller than the original PNG).
export const driveImage = (id: string, width: number) => `https://lh3.googleusercontent.com/d/${id}=w${width}-rw`;
export const drivePreview = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

@Injectable({ providedIn: 'root' })
export class MediaService {
  readonly media = signal<MediaData>(MEDIA_FALLBACK);

  constructor() {
    const cached = this.readCache();
    if (cached) this.media.set(cached);
    else void this.load();
  }

  private async load(): Promise<void> {
    try {
      const res = await fetch(`${MEDIA_API}?action=media`, { credentials: 'omit', redirect: 'follow', referrerPolicy: 'no-referrer' });
      if (!res.ok) return;
      const data = sanitize(await res.json());
      if (!data) return;
      this.media.set(data);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
    } catch {
      // Keep the bundled fallback; the site must work even if the API is down.
    }
  }

  private readCache(): MediaData | null {
    try {
      const raw = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null');
      return raw && Date.now() - raw.at < CACHE_MS ? sanitize(raw.data) : null;
    } catch {
      return null;
    }
  }
}

/** Only accept well-formed Drive IDs so nothing unexpected is ever placed into a URL. */
function sanitize(input: unknown): MediaData | null {
  const obj = input as Partial<MediaData> & { status?: string };
  if (!obj || obj.status !== 'ok') return null;
  const file = (f: unknown): DriveFile | null => {
    const x = f as DriveFile;
    return x && typeof x.id === 'string' && ID_RE.test(x.id)
      ? { id: x.id, name: String(x.name ?? '').slice(0, 120), mime: String(x.mime ?? '').slice(0, 60) }
      : null;
  };
  const files = (arr: unknown) => (Array.isArray(arr) ? arr.map(file).filter((f): f is DriveFile => !!f) : []);
  const photos = files(obj.photos);
  const certificates: CertGroup[] = Array.isArray(obj.certificates)
    ? obj.certificates
        .map((g) => ({ key: String(g?.key ?? '').slice(0, 20), label: String(g?.label ?? '').slice(0, 40), files: files(g?.files) }))
        .filter((g) => /^[a-z]+$/.test(g.key) && g.files.length)
    : [];
  return {
    photos: photos.length ? photos : MEDIA_FALLBACK.photos,
    favicon: file(obj.favicon) ?? MEDIA_FALLBACK.favicon,
    certificates: certificates.length ? certificates : MEDIA_FALLBACK.certificates,
  };
}
