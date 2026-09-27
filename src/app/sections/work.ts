import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LABS, PROJECTS } from '../data/projects';
import { ProjectCategory } from '../models';
import { Icon } from '../shared/icon';
import { NavService } from '../shared/nav.service';
import { Reveal } from '../shared/reveal.directive';
import { ProjectCover } from './project-cover';

@Component({
  selector: 'app-work',
  imports: [Icon, Reveal, ProjectCover],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section wrap" id="karya" aria-labelledby="work-title">
      <div class="section-heading" appReveal>
        <p class="eyebrow">SELECTED WORK</p>
        <h2 id="work-title">Berangkat dari<br />kebutuhan nyata.</h2>
      </div>
      <p class="section-intro" appReveal>
        Studi kasus pilihan tentang data, proses, dan aplikasi. Visual yang ditampilkan adalah screenshot asli
        (dengan data demo atau disamarkan) — bukan mockup. Sistem internal tidak dibuka untuk publik.
      </p>

      <div class="featured-grid">
        @for (p of featured; track p.id; let i = $index) {
          <article class="project-card" appReveal>
            <button type="button" class="project-visual" (click)="nav.openProject(p.id)" [attr.aria-label]="'Buka studi kasus ' + p.title">
              <app-project-cover [project]="p" />
            </button>
            <div class="project-meta">
              <span>{{ (i + 1).toString().padStart(2, '0') }} / {{ p.category }}</span>
              @if (p.year) {
                <span>{{ p.year }}</span>
              }
            </div>
            <h3>
              <button type="button" class="link-button" (click)="nav.openProject(p.id)">
                {{ p.title }} <app-icon name="arrow" />
              </button>
            </h3>
            <p>{{ p.summary }}</p>
            <ul class="tech-tags">
              @for (s of p.stack; track s) {
                <li>{{ s }}</li>
              }
            </ul>
          </article>
        }
      </div>
    </section>

    <section class="section wrap catalog" id="katalog" aria-labelledby="catalog-title">
      <div class="section-heading" appReveal>
        <div>
          <p class="eyebrow">PROJECT INDEX</p>
          <p class="index-caption">{{ total }} studi kasus · {{ labs.length }} eksplorasi</p>
        </div>
        <h2 id="catalog-title">Lebih banyak cara<br />menyelesaikan masalah.</h2>
      </div>

      <div class="catalog-tools" appReveal>
        <div class="chips" role="group" aria-label="Filter kategori">
          <button type="button" class="chip" [class.is-active]="category() === 'Semua'" [attr.aria-pressed]="category() === 'Semua'" (click)="category.set('Semua')">
            Semua <span>{{ rest.length }}</span>
          </button>
          @for (c of categories; track c) {
            <button type="button" class="chip" [class.is-active]="category() === c" [attr.aria-pressed]="category() === c" (click)="category.set(c)">
              {{ c }} <span>{{ countFor(c) }}</span>
            </button>
          }
        </div>
        <label class="search">
          <app-icon name="search" [size]="16" />
          <span class="visually-hidden">Cari proyek</span>
          <input type="search" placeholder="Cari proyek atau teknologi…" [value]="query()" (input)="query.set($any($event.target).value)" maxlength="60" />
        </label>
      </div>

      <div class="catalog-list" aria-live="polite">
        @for (p of filtered(); track p.id) {
          <button type="button" class="catalog-row" (click)="nav.openProject(p.id)">
            <span class="catalog-cat">{{ p.category }}</span>
            <span class="catalog-main">
              <strong>{{ p.title }}</strong>
              <span>{{ p.summary }}</span>
            </span>
            <span class="catalog-tech">{{ p.stack.slice(0, 2).join(' / ') }}</span>
            <app-icon name="arrow" />
          </button>
        } @empty {
          <p class="empty">Tidak ada proyek yang cocok dengan pencarian.</p>
        }
      </div>
    </section>

    <section class="section wrap labs" aria-labelledby="labs-title">
      <div class="labs-heading" appReveal>
        <p class="eyebrow">EXPLORATION NOTES</p>
        <h2 id="labs-title">Masih di meja kerja.</h2>
        <p>Prototipe dan eksplorasi dipisahkan dari studi kasus implementasi.</p>
      </div>
      <div class="labs-list">
        @for (lab of labs; track lab.title; let i = $index) {
          <details appReveal>
            <summary><span class="lab-index">E{{ i + 1 }}</span><span>{{ lab.title }}</span><span class="lab-toggle" aria-hidden="true">+</span></summary>
            <div class="lab-body"><p>{{ lab.detail }}</p><span>{{ lab.stack }}</span></div>
          </details>
        }
      </div>
    </section>
  `,
})
export class WorkSection {
  protected readonly nav = inject(NavService);
  protected readonly featured = PROJECTS.filter((p) => p.featured).sort(
    (a, b) => Number(!!b.screenshots?.length) - Number(!!a.screenshots?.length),
  );
  protected readonly rest = PROJECTS.filter((p) => !p.featured);
  protected readonly total = PROJECTS.length;
  protected readonly labs = LABS;
  protected readonly categories = [...new Set(this.rest.map((p) => p.category))];
  protected readonly category = signal<ProjectCategory | 'Semua'>('Semua');
  protected readonly query = signal('');

  protected readonly filtered = computed(() => {
    const cat = this.category();
    const q = this.query().trim().toLowerCase();
    return this.rest.filter(
      (p) =>
        (cat === 'Semua' || p.category === cat) &&
        (!q || [p.title, p.summary, ...p.stack].some((t) => t.toLowerCase().includes(q))),
    );
  });

  protected countFor(c: ProjectCategory): number {
    return this.rest.filter((p) => p.category === c).length;
  }
}
