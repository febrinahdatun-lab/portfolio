import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Lang } from '../models';
import { I18nService } from '../shared/i18n.service';
import { Icon } from '../shared/icon';
import { NavService } from '../shared/nav.service';

@Component({
  selector: 'app-header',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header" [class.is-scrolled]="scrolled()">
      <div class="wrap header-inner">
        <a class="wordmark" href="#top" [attr.aria-label]="'Febri Nahdatun — ' + t().backTop">Febri Nahdatun<span>.</span></a>
        <nav id="main-nav" class="main-nav" [class.is-open]="open()" [attr.aria-label]="t().navLabel">
          @for (link of links(); track link.href) {
            <a [href]="link.href" (click)="open.set(false)">{{ link.label }}</a>
          }
          <div class="lang-switch" role="group" [attr.aria-label]="t().langLabel">
            @for (l of langs; track l.code) {
              <button type="button" [class.is-active]="i18n.lang() === l.code" [attr.aria-pressed]="i18n.lang() === l.code" [attr.lang]="l.code" [attr.title]="l.name" (click)="setLang(l.code)">{{ l.label }}</button>
            }
          </div>
          <button type="button" class="button small lime nav-cv" (click)="openCv()">
            <app-icon name="file" [size]="16" /> {{ t().viewCv }}
          </button>
        </nav>
        <button
          type="button"
          class="menu-toggle"
          [attr.aria-expanded]="open()"
          aria-controls="main-nav"
          [attr.aria-label]="open() ? t().closeMenu : t().openMenu"
          (click)="open.set(!open())"
        >
          <app-icon [name]="open() ? 'close' : 'menu'" [size]="22" />
        </button>
      </div>
    </header>
  `,
})
export class Header {
  private readonly nav = inject(NavService);
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly open = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly langs: { code: Lang; label: string; name: string }[] = [
    { code: 'id', label: 'ID', name: 'Bahasa Indonesia' },
    { code: 'en', label: 'EN', name: 'English' },
  ];
  protected readonly links = computed(() => {
    const n = this.t().nav;
    return [
      { href: '#keahlian', label: n.keahlian },
      { href: '#karya', label: n.karya },
      { href: '#pengalaman', label: n.pengalaman },
      { href: '#sertifikasi', label: n.sertifikasi },
      { href: '#kontak', label: n.kontak },
    ];
  });

  protected setLang(lang: Lang): void {
    this.i18n.set(lang);
    this.open.set(false);
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.open.set(false);
  }

  protected openCv(): void {
    this.open.set(false);
    this.nav.openCv();
  }
}
