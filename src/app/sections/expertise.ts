import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EXPERTISE, PRINCIPLES } from '../data/profile';
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
        <h2 id="expertise-title">Perangkat yang saya<br />gunakan setiap hari.</h2>
      </div>
      <div class="expertise-grid">
        @for (item of expertise; track item.title; let i = $index) {
          <article class="expertise-card" appReveal>
            <span class="expertise-icon"><app-icon [name]="item.icon" [size]="24" /></span>
            <span class="card-index">{{ (i + 1).toString().padStart(2, '0') }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </article>
        }
      </div>

      <div class="principles" appReveal>
        <p class="eyebrow">CARA SAYA BEKERJA</p>
        <div class="principles-grid">
          @for (p of principles; track p.title; let i = $index) {
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
  protected readonly expertise = EXPERTISE;
  protected readonly principles = PRINCIPLES;
}
