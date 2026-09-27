import { ChangeDetectionStrategy, Component, HostListener, signal } from '@angular/core';
import { PROFILE } from './data/profile';
import { CertificationsSection, ContactSection, ExperienceSection } from './sections/about';
import { ExpertiseSection } from './sections/expertise';
import { Header } from './sections/header';
import { Hero } from './sections/hero';
import { Overlays } from './sections/overlays';
import { WorkSection } from './sections/work';
import { Icon } from './shared/icon';

@Component({
  selector: 'app-root',
  imports: [Header, Hero, ExpertiseSection, WorkSection, ExperienceSection, CertificationsSection, ContactSection, Overlays, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="site-shell">
      <a class="skip-link" href="#main">Langsung ke konten</a>
      <app-header />
      <main id="main">
        <app-hero />
        <app-expertise />
        <app-work />
        <app-experience />
        <app-certifications />
        <app-contact />
      </main>
      <footer class="site-footer wrap">
        <span>© {{ year }} {{ name }}</span>
        <span>Dibangun dengan Angular · Dihosting di GitHub Pages</span>
        <a href="#top">Kembali ke atas ↑</a>
      </footer>
      <button type="button" class="to-top" [class.is-visible]="showTop()" (click)="toTop()" aria-label="Kembali ke atas">
        <app-icon name="arrow-up" [size]="20" />
      </button>
    </div>
    <app-overlays />
  `,
})
export class App {
  protected readonly year = new Date().getFullYear();
  protected readonly name = PROFILE.name;
  protected readonly showTop = signal(false);

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.showTop.set(window.scrollY > 900);
  }

  protected toTop(): void {
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}
