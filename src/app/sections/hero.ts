import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CERTIFICATIONS } from '../data/cv';
import { EXPERTISE, PROFILE } from '../data/profile';
import { PROJECTS } from '../data/projects';
import { Icon } from '../shared/icon';
import { NavService } from '../shared/nav.service';
import { Reveal } from '../shared/reveal.directive';

@Component({
  selector: 'app-hero',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero wrap" id="profil" aria-labelledby="hero-title">
      <div class="hero-grid">
        <div class="hero-copy" appReveal>
          <p class="eyebrow"><span class="status-dot"></span> {{ profile.name.toUpperCase() }} · {{ profile.role.toUpperCase() }}</p>
          <h1 id="hero-title">Dari pekerjaan berulang, menjadi <em>sistem yang bekerja.</em></h1>
          <p class="lead">
            Lebih dari 10 tahun menjembatani <strong>infrastruktur enterprise</strong> (Google &amp; Microsoft)
            dengan <strong>data intelligence</strong> — membangun pipeline data otomatis, dashboard BI interaktif, aplikasi
            operasional, dan Knowledge Management System.
          </p>
          <div class="hero-actions">
            <a class="button lime" href="#karya">Jelajahi karya <app-icon name="arrow" /></a>
            <button type="button" class="button" (click)="nav.openCv()"><app-icon name="file" /> Lihat CV</button>
            <a class="button ghost" [href]="profile.contact.linkedin" target="_blank" rel="noopener noreferrer">
              <app-icon name="linkedin" /> LinkedIn
            </a>
          </div>
        </div>
        <figure class="hero-photo" appReveal>
          <img [src]="profile.photo" [alt]="'Foto ' + profile.name" width="480" height="480" fetchpriority="high" />
          <figcaption>
            <span>{{ profile.location }}</span>
            <span>{{ profile.tagline }}</span>
          </figcaption>
        </figure>
      </div>
      <dl class="hero-stats" appReveal>
        <div><dt>Tahun pengalaman</dt><dd>{{ profile.yearsExperience }}</dd></div>
        <div><dt>Studi kasus</dt><dd>{{ projectCount }}</dd></div>
        <div><dt>Sertifikasi</dt><dd>{{ certCount }}</dd></div>
        <div><dt>Bidang keahlian</dt><dd>{{ expertiseCount }}</dd></div>
      </dl>
    </section>
  `,
})
export class Hero {
  protected readonly nav = inject(NavService);
  protected readonly profile = PROFILE;
  protected readonly projectCount = PROJECTS.length;
  protected readonly certCount = CERTIFICATIONS.length;
  protected readonly expertiseCount = EXPERTISE.length;
}
