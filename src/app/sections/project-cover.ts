import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Project } from '../models';

const TINTS: Record<string, string> = {
  'Aplikasi Operasional': '#c4f36b',
  'Cloud & Integrasi': '#7dd3fc',
  'Data & Dashboard': '#fbbf24',
  'Analitik Data': '#f0abfc',
  'AI & Otomasi': '#5eead4',
  'Dokumen & Pengetahuan': '#fda4af',
};

@Component({
  selector: 'app-project-cover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (shot(); as s) {
      <img [src]="s.src" [alt]="s.alt" loading="lazy" decoding="async" width="1280" height="800" />
      @if (count() > 1) {
        <span class="cover-count">{{ count() }} screenshot</span>
      }
    } @else {
      <div class="cover-generated" [style.--tint]="tint()">
        <span class="cover-mono">{{ initials() }}</span>
        <div class="cover-grid" aria-hidden="true"></div>
        <ul class="cover-stack">
          @for (s of project().stack.slice(0, 4); track s) {
            <li>{{ s }}</li>
          }
        </ul>
        <span class="cover-note">Screenshot segera ditambahkan</span>
      </div>
    }
  `,
  host: { class: 'project-cover' },
})
export class ProjectCover {
  readonly project = input.required<Project>();
  protected readonly shot = computed(() => this.project().screenshots?.[0] ?? null);
  protected readonly count = computed(() => this.project().screenshots?.length ?? 0);
  protected readonly tint = computed(() => TINTS[this.project().category] ?? '#c4f36b');
  protected readonly initials = computed(() =>
    this.project()
      .title.split(/[\s—-]+/)
      .filter((w) => /^[A-Za-z]/.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join(''),
  );
}
