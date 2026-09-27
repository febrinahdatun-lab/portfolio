import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CERTIFICATIONS } from '../data/cv';
import { EXPERTISE, PROFILE } from '../data/profile';
import { PROJECTS } from '../data/projects';
import { Icon } from '../shared/icon';
import { MediaService, driveImage } from '../shared/media.service';
import { NavService } from '../shared/nav.service';
import { Reveal } from '../shared/reveal.directive';

const SLIDE_MS = 5500;

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
          <div class="photo-stage" (contextmenu)="$event.preventDefault()">
            <img class="photo-slide is-base" [src]="profile.photo" [alt]="'Foto ' + profile.name" width="480" height="480" draggable="false" />
            @for (p of slides(); track p.id; let i = $index) {
              <img
                class="photo-slide"
                [class.is-active]="i === current() && loaded().has(p.id)"
                [src]="p.src"
                alt=""
                width="480"
                height="480"
                draggable="false"
                referrerpolicy="no-referrer"
                (load)="markLoaded(p.id)"
                (error)="markFailed(p.id)"
              />
            }
          </div>
          @if (slides().length > 1) {
            <div class="photo-dots" aria-hidden="true">
              @for (p of slides(); track p.id; let i = $index) {
                <span [class.is-active]="i === current()"></span>
              }
            </div>
          }
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
  private readonly mediaService = inject(MediaService);
  protected readonly profile = PROFILE;
  protected readonly projectCount = PROJECTS.length;
  protected readonly certCount = CERTIFICATIONS.length;
  protected readonly expertiseCount = EXPERTISE.length;

  private readonly failed = signal(new Set<string>());
  protected readonly loaded = signal(new Set<string>());
  protected readonly current = signal(0);
  protected readonly slides = computed(() =>
    this.mediaService
      .media()
      .photos.filter((p) => !this.failed().has(p.id))
      .map((p) => ({ id: p.id, src: driveImage(p.id, 720) })),
  );

  constructor() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setInterval(() => {
      const list = this.slides();
      if (reduced || list.length < 2 || document.hidden) return;
      // Advance only to a loaded image so the crossfade never reveals a blank frame.
      for (let step = 1; step <= list.length; step++) {
        const next = (this.current() + step) % list.length;
        if (this.loaded().has(list[next].id)) {
          this.current.set(next);
          return;
        }
      }
    }, SLIDE_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  protected markLoaded(id: string): void {
    this.loaded.update((s) => new Set(s).add(id));
  }

  protected markFailed(id: string): void {
    this.failed.update((s) => new Set(s).add(id));
    this.current.set(0);
  }
}
