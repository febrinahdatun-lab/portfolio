import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CERTIFICATIONS, CV } from '../data/cv';
import { PROFILE } from '../data/profile';
import { PROJECTS } from '../data/projects';
import { Lang } from '../models';
import { Icon } from '../shared/icon';
import { NavService } from '../shared/nav.service';
import { ProjectCover } from './project-cover';

@Component({
  selector: 'app-overlays',
  imports: [Icon, ProjectCover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dlg [class.is-cv]="overlay()?.kind === 'cv'" aria-labelledby="dialog-title" (cancel)="onCancel($event)" (click)="onBackdrop($event)">
      <div class="dialog-top">
        <span>{{ kicker() }}</span>
        <button type="button" class="close-dialog" (click)="close()" aria-label="Tutup">Tutup <app-icon name="close" [size]="16" /></button>
      </div>

      @switch (overlay()?.kind) {
        @case ('project') {
          @if (project(); as p) {
            <div class="case-header">
              <p class="eyebrow">{{ p.subtitle ?? p.category }}</p>
              <h2 id="dialog-title">{{ p.title }}</h2>
              <p>{{ p.summary }}</p>
              <ul class="tech-tags">
                @for (s of p.stack; track s) {
                  <li>{{ s }}</li>
                }
              </ul>
              @if (p.links?.length) {
                <div class="case-links">
                  @for (l of p.links; track l.url) {
                    <a class="button small lime" [href]="l.url" target="_blank" rel="noopener noreferrer">{{ l.label }} <app-icon name="external" [size]="14" /></a>
                  }
                </div>
              }
            </div>

            <div class="gallery">
              @if (shots().length) {
                <figure class="gallery-stage">
                  <img [src]="shots()[shot()].src" [alt]="shots()[shot()].alt" decoding="async" />
                  @if (shots()[shot()].caption) {
                    <figcaption>{{ shots()[shot()].caption }}</figcaption>
                  }
                  @if (shots().length > 1) {
                    <button type="button" class="gallery-nav prev" (click)="step(-1)" aria-label="Screenshot sebelumnya"><app-icon name="chevron-left" [size]="22" /></button>
                    <button type="button" class="gallery-nav next" (click)="step(1)" aria-label="Screenshot berikutnya"><app-icon name="chevron-right" [size]="22" /></button>
                  }
                </figure>
                @if (shots().length > 1) {
                  <div class="gallery-thumbs" role="tablist" aria-label="Pilih screenshot">
                    @for (s of shots(); track s.src; let i = $index) {
                      <button type="button" role="tab" [attr.aria-selected]="i === shot()" [class.is-active]="i === shot()" (click)="shot.set(i)">
                        <img [src]="s.src" alt="" loading="lazy" />
                      </button>
                    }
                  </div>
                }
              } @else {
                <div class="gallery-empty"><app-project-cover [project]="p" /></div>
              }
            </div>

            <div class="case-content">
              <section><h3>01 / Tantangan</h3><p>{{ p.problem }}</p></section>
              <section>
                <h3>02 / Pendekatan</h3>
                <ul>
                  @for (a of p.approach; track a) {
                    <li>{{ a }}</li>
                  }
                </ul>
              </section>
              <section><h3>03 / Hasil</h3><p>{{ p.output }}</p></section>
              @if (p.note) {
                <section class="case-note"><h3>Catatan privasi</h3><p>{{ p.note }}</p></section>
              }
            </div>
          } @else {
            <div class="case-header">
              <h2 id="dialog-title">Studi kasus tidak ditemukan.</h2>
              <p>Tutup panel ini dan pilih proyek dari katalog.</p>
            </div>
          }
        }
        @case ('cv') {
          <div class="cv-toolbar">
            <div class="segmented" role="group" aria-label="Bahasa CV">
              <button type="button" [class.is-active]="lang() === 'id'" [attr.aria-pressed]="lang() === 'id'" (click)="lang.set('id')">Indonesia</button>
              <button type="button" [class.is-active]="lang() === 'en'" [attr.aria-pressed]="lang() === 'en'" (click)="lang.set('en')">English</button>
            </div>
            <button type="button" class="button small lime" (click)="print()"><app-icon name="print" [size]="16" /> Simpan sebagai PDF</button>
          </div>
          <article class="cv-paper" [attr.lang]="lang()">
            <header>
              <h2 id="dialog-title">{{ profile.name }}</h2>
              <p>{{ profile.location }} · {{ profile.contact.email }}</p>
              <p>linkedin.com/in/febri-nahdatun · febrinahdatun-lab.github.io/portfolio</p>
            </header>
            <section><h3>{{ cv().summaryTitle }}</h3><p>{{ cv().summary }}</p></section>
            <section>
              <h3>{{ cv().experienceTitle }}</h3>
              @for (job of cv().experience; track job.period) {
                <div class="cv-job">
                  <div class="cv-line"><strong>{{ job.role }}</strong><span>{{ job.period }}</span></div>
                  <div class="cv-line cv-sub"><span>{{ job.company }}</span><span>{{ job.location }}</span></div>
                  <ul>
                    @for (pt of job.points; track pt) {
                      <li>{{ pt }}</li>
                    }
                  </ul>
                </div>
              }
            </section>
            <section>
              <h3>{{ cv().skillsTitle }}</h3>
              <ul class="cv-plain">
                @for (s of cv().skills; track s.label) {
                  <li><strong>{{ s.label }}:</strong> {{ s.value }}</li>
                }
              </ul>
            </section>
            <section>
              <h3>{{ cv().certTitle }}</h3>
              <ul class="cv-plain">
                @for (c of certs; track c.title) {
                  <li class="cv-line"><span><strong>{{ c.title }}</strong> | {{ c.issuer }}</span><em>{{ c.date }}</em></li>
                }
              </ul>
            </section>
            <section>
              <h3>{{ cv().educationTitle }}</h3>
              <div class="cv-line"><strong>{{ cv().education.school }}</strong><span>{{ cv().education.location }}</span></div>
              <div class="cv-line cv-sub"><span>{{ cv().education.degree }}</span><span>{{ cv().education.graduated }}</span></div>
              <p>{{ cv().education.detail }}</p>
            </section>
          </article>
        }
      }
    </dialog>
  `,
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Overlays {
  private readonly nav = inject(NavService);
  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private returnFocus: HTMLElement | null = null;

  protected readonly profile = PROFILE;
  protected readonly certs = CERTIFICATIONS;
  protected readonly overlay = this.nav.overlay;
  protected readonly lang = signal<Lang>('id');
  protected readonly cv = computed(() => CV[this.lang()]);
  protected readonly shot = signal(0);

  protected readonly project = computed(() => {
    const o = this.overlay();
    return o?.kind === 'project' ? (PROJECTS.find((p) => p.id === o.id) ?? null) : null;
  });
  protected readonly shots = computed(() => this.project()?.screenshots ?? []);
  protected readonly kicker = computed(() => {
    const o = this.overlay();
    if (o?.kind === 'cv') return 'CURRICULUM VITAE';
    const p = this.project();
    return p ? 'STUDI KASUS / ' + p.category.toUpperCase() : 'STUDI KASUS';
  });

  constructor() {
    effect(() => {
      const dialog = this.dlg().nativeElement;
      const open = this.overlay() !== null;
      this.project();
      this.shot.set(0);
      if (open && !dialog.open) {
        this.returnFocus = document.activeElement as HTMLElement | null;
        dialog.showModal();
        document.body.classList.add('modal-open');
      } else if (!open && dialog.open) {
        dialog.close();
        document.body.classList.remove('modal-open');
        this.returnFocus?.focus({ preventScroll: true });
      }
      if (open) dialog.scrollTop = 0;
    });
  }

  protected close(): void {
    this.nav.close(this.overlay()?.kind === 'cv' ? 'profil' : 'karya');
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target !== this.dlg().nativeElement) return;
    const r = this.dlg().nativeElement.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) {
      this.close();
    }
  }

  protected onKey(event: KeyboardEvent): void {
    if (!this.dlg().nativeElement.open || this.shots().length < 2) return;
    if (event.key === 'ArrowRight') this.step(1);
    if (event.key === 'ArrowLeft') this.step(-1);
  }

  protected step(delta: number): void {
    const n = this.shots().length;
    this.shot.update((i) => (i + delta + n) % n);
  }

  protected print(): void {
    window.print();
  }
}
