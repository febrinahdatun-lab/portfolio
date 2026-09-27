import { Injectable, computed, effect, signal } from '@angular/core';
import { UI, UiText } from '../data/i18n';
import { Lang } from '../models';

const STORAGE_KEY = 'fn-lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly lang = signal<Lang>(initialLang());
  readonly t = computed<UiText>(() => UI[this.lang()] as UiText);

  constructor() {
    effect(() => {
      const lang = this.lang();
      const t = this.t();
      document.documentElement.lang = lang;
      document.title = t.metaTitle;
      document.querySelector('meta[name="description"]')?.setAttribute('content', t.metaDescription);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Storage may be blocked (private mode); the choice then lasts for this visit only.
      }
    });
  }

  set(lang: Lang): void {
    this.lang.set(lang);
  }
}

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (fromUrl === 'en' || fromUrl === 'id') return fromUrl;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'id') return saved;
  } catch {
    // ignore
  }
  return 'id';
}
