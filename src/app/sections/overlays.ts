import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CERTIFICATIONS, CV } from '../data/cv';
import { localizeProject } from '../data/content';
import { localizeDate } from '../data/i18n';
import { PROVIDERS } from '../data/media';
import { PROFILE } from '../data/profile';
import { PROJECTS } from '../data/projects';
import { CertProvider, Lang } from '../models';
import { Icon } from '../shared/icon';
import { I18nService } from '../shared/i18n.service';
import { MediaService, drivePreview } from '../shared/media.service';
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
        <button type="button" class="close-dialog" (click)="close()" [attr.aria-label]="t().dialog.close">{{ t().dialog.close }} <app-icon name="close" [size]="16" /></button>
      </div>

      @switch (overlay()?.kind) {
        @case ('project') {
          @if (project(); as p) {
            <div class="case-header">
              <p class="eyebrow">{{ p.subtitle ?? p.categoryLabel }}</p>
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
                    <button type="button" class="gallery-nav prev" (click)="step(-1)" [attr.aria-label]="t().dialog.prev"><app-icon name="chevron-left" [size]="22" /></button>
                    <button type="button" class="gallery-nav next" (click)="step(1)" [attr.aria-label]="t().dialog.next"><app-icon name="chevron-right" [size]="22" /></button>
                  }
                </figure>
                @if (shots().length > 1) {
                  <div class="gallery-thumbs" role="tablist" [attr.aria-label]="t().dialog.pick">
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
              <section><h3>{{ t().dialog.sections[0] }}</h3><p>{{ p.problem }}</p></section>
              <section>
                <h3>{{ t().dialog.sections[1] }}</h3>
                <ul>
                  @for (a of p.approach; track $index) {
                    <li>{{ a }}</li>
                  }
                </ul>
              </section>
              <section><h3>{{ t().dialog.sections[2] }}</h3><p>{{ p.output }}</p></section>
              @if (p.note) {
                <section class="case-note"><h3>{{ t().dialog.privacy }}</h3><p>{{ p.note }}</p></section>
              }
            </div>
          } @else {
            <div class="case-header">
              <h2 id="dialog-title">{{ t().dialog.notFound }}</h2>
              <p>{{ t().dialog.notFoundHint }}</p>
            </div>
          }
        }
        @case ('cert') {
          <div class="case-header cert-header">
            <p class="eyebrow">{{ certGroup()?.full }}</p>
            <h2 id="dialog-title">{{ t().dialog.certTitle(certGroup()?.label ?? '') }}</h2>
            <ul class="cert-titles">
              @for (c of certItems(); track c.title) {
                <li>{{ c.title }} <em>{{ date(c.date) }}</em></li>
              }
            </ul>
          </div>
          @if (certFiles().length > 1) {
            <div class="segmented cert-tabs" role="tablist" [attr.aria-label]="t().dialog.pickDoc">
              @for (f of certFiles(); track f.id; let i = $index) {
                <button type="button" role="tab" [class.is-active]="i === certIndex()" [attr.aria-selected]="i === certIndex()" (click)="certIndex.set(i)">{{ f.name }}</button>
              }
            </div>
          }
          @if (certSrc(); as src) {
            <div class="cert-viewer" (contextmenu)="$event.preventDefault()" (dragstart)="$event.preventDefault()">
              <!-- No allow-popups / allow-downloads: blocks Drive's pop-out and download actions. -->
              <iframe [src]="src" [title]="t().dialog.certFrame" sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer" loading="lazy"></iframe>
              <div class="cert-shield" aria-hidden="true"><span><app-icon name="lock" [size]="12" /> {{ t().dialog.viewOnly }}</span></div>
            </div>
          } @else {
            <p class="gallery-empty cert-empty">{{ t().dialog.certEmpty }}</p>
          }
        }
        @case ('cv') {
          <div class="cv-toolbar">
            <div class="segmented" role="group" [attr.aria-label]="t().dialog.cvLang">
              <button type="button" [class.is-active]="lang() === 'id'" [attr.aria-pressed]="lang() === 'id'" (click)="lang.set('id')">Indonesia</button>
              <button type="button" [class.is-active]="lang() === 'en'" [attr.aria-pressed]="lang() === 'en'" (click)="lang.set('en')">English</button>
            </div>
            <button type="button" class="button small lime" (click)="print()"><app-icon name="print" [size]="16" /> {{ t().dialog.savePdf }}</button>
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
              <h3>{{ cv().projectsTitle }}</h3>
              <ul class="cv-plain">
                @for (p of cv().projects; track p.name) {
                  <li><strong>{{ p.name }}</strong><span class="cv-stack">&nbsp;({{ p.stack }})</span> — {{ p.detail }}</li>
                }
              </ul>
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
                  <li class="cv-line"><span><strong>{{ c.title }}</strong> | {{ c.issuer }}</span><em>{{ date(c.date, lang()) }}</em></li>
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
  private readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private returnFocus: HTMLElement | null = null;

  protected readonly profile = PROFILE;
  protected readonly certs = CERTIFICATIONS;
  protected readonly overlay = this.nav.overlay;
  protected readonly lang = signal<Lang>('id');
  protected readonly cv = computed(() => CV[this.lang()]);
  protected readonly shot = signal(0);
  protected readonly certIndex = signal(0);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly media = inject(MediaService).media;

  protected readonly certKey = computed(() => {
    const o = this.overlay();
    return o?.kind === 'cert' && o.provider in PROVIDERS ? (o.provider as CertProvider) : null;
  });
  protected readonly certGroup = computed(() => {
    const k = this.certKey();
    return k ? PROVIDERS[k] : null;
  });
  protected readonly certItems = computed(() => CERTIFICATIONS.filter((c) => c.provider === this.certKey()));
  protected readonly certFiles = computed(() => this.media().certificates.find((g) => g.key === this.certKey())?.files ?? []);
  protected readonly certSrc = computed<SafeResourceUrl | null>(() => {
    const f = this.certFiles()[this.certIndex()];
    // IDs are validated in MediaService (^[A-Za-z0-9_-]+$) before reaching this point.
    return f ? this.sanitizer.bypassSecurityTrustResourceUrl(drivePreview(f.id)) : null;
  });

  protected readonly project = computed(() => {
    const o = this.overlay();
    const p = o?.kind === 'project' ? PROJECTS.find((x) => x.id === o.id) : undefined;
    return p ? localizeProject(p, this.i18n.lang()) : null;
  });
  protected readonly shots = computed(() => this.project()?.screenshots ?? []);
  protected readonly kicker = computed(() => {
    const o = this.overlay();
    const t = this.t().dialog;
    if (o?.kind === 'cv') return 'CURRICULUM VITAE';
    if (o?.kind === 'cert') return t.certKicker;
    const p = this.project();
    return p ? t.caseStudy + ' / ' + p.categoryLabel.toUpperCase() : t.caseStudy;
  });

  constructor() {
    effect(() => {
      const dialog = this.dlg().nativeElement;
      const kind = this.overlay()?.kind;
      const open = !!kind;
      this.overlay();
      this.shot.set(0);
      this.certIndex.set(0);
      if (kind === 'cv') this.lang.set(untracked(this.i18n.lang));
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
    const kind = this.overlay()?.kind;
    this.nav.close(kind === 'cv' ? 'profil' : kind === 'cert' ? 'sertifikasi' : 'karya');
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

  protected date(d: string, lang: Lang = this.i18n.lang()): string {
    return localizeDate(d, lang);
  }
}
