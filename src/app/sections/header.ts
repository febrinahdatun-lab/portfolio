import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Icon } from '../shared/icon';
import { NavService } from '../shared/nav.service';

@Component({
  selector: 'app-header',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header" [class.is-scrolled]="scrolled()">
      <div class="wrap header-inner">
        <a class="wordmark" href="#top" aria-label="Febri Nahdatun — kembali ke atas">fn<span>/</span></a>
        <nav id="main-nav" class="main-nav" [class.is-open]="open()" aria-label="Navigasi utama">
          @for (link of links; track link.href) {
            <a [href]="link.href" (click)="open.set(false)">{{ link.label }}</a>
          }
          <button type="button" class="button small lime nav-cv" (click)="openCv()">
            <app-icon name="file" [size]="16" /> Lihat CV
          </button>
        </nav>
        <button
          type="button"
          class="menu-toggle"
          [attr.aria-expanded]="open()"
          aria-controls="main-nav"
          [attr.aria-label]="open() ? 'Tutup menu' : 'Buka menu'"
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
  protected readonly open = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly links = [
    { href: '#keahlian', label: 'Keahlian' },
    { href: '#karya', label: 'Karya' },
    { href: '#pengalaman', label: 'Pengalaman' },
    { href: '#sertifikasi', label: 'Sertifikasi' },
    { href: '#kontak', label: 'Kontak' },
  ];

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
