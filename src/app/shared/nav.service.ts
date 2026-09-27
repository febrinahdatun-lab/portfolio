import { Injectable, signal } from '@angular/core';

export type Overlay = { kind: 'project'; id: string } | { kind: 'cv' } | null;

/** Hash-based deep links (#project=<id>, #cv) — works on GitHub Pages without SPA fallback. */
@Injectable({ providedIn: 'root' })
export class NavService {
  readonly overlay = signal<Overlay>(null);

  constructor() {
    window.addEventListener('hashchange', () => this.sync());
    this.sync();
  }

  openProject(id: string): void {
    location.hash = 'project=' + encodeURIComponent(id);
  }

  openCv(): void {
    location.hash = 'cv';
  }

  close(returnTo = 'karya'): void {
    if (this.overlay()) {
      history.replaceState(null, '', location.pathname + location.search + '#' + returnTo);
      this.overlay.set(null);
    }
  }

  private sync(): void {
    const hash = location.hash.slice(1);
    if (hash.startsWith('project=')) {
      this.overlay.set({ kind: 'project', id: decodeURIComponent(hash.slice(8)) });
    } else if (hash === 'cv') {
      this.overlay.set({ kind: 'cv' });
    } else {
      this.overlay.set(null);
    }
  }
}
