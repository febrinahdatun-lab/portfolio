import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { expertiseFor, principlesFor } from '../data/content';
import { I18nService } from '../shared/i18n.service';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal.directive';

@Component({
  selector: 'app-expertise',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section wrap" id="keahlian" aria-labelledby="expertise-title">
      <div class="section-heading" appReveal>
        <p class="eyebrow">CORE COMPETENCIES</p>
        <h2 id="expertise-title">{{ t().expertise.title[0] }}<br />{{ t().expertise.title[1] }}</h2>
      </div>
      <div class="expertise-grid">
        @for (item of expertise(); track $index; let i = $index) {
          <article class="expertise-card" appReveal>
            <span class="expertise-icon"><app-icon [name]="item.icon" [size]="24" /></span>
            <span class="card-index">{{ (i + 1).toString().padStart(2, '0') }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        }
      </div>

      <div class="principles" appReveal>
        <p class="eyebrow">{{ t().expertise.how }}</p>
        <div class="principles-grid">
          @for (p of principles(); track $index; let i = $index) {
            <article>
              <span>{{ (i + 1).toString().padStart(2, '0') }}</span>
              <h3>{{ p.title }}</h3>
              <p>{{ p.text }}</p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class ExpertiseSection {
  private readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  protected readonly expertise = computed(() => expertiseFor(this.i18n.lang()));
  protected readonly principles = computed(() => principlesFor(this.i18n.lang()));
}
