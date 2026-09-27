import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CERTIFICATIONS, CV } from '../data/cv';
import { PROFILE } from '../data/profile';
import { Icon } from '../shared/icon';
import { NavService } from '../shared/nav.service';
import { Reveal } from '../shared/reveal.directive';

@Component({
  selector: 'app-experience',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section wrap" id="pengalaman" aria-labelledby="exp-title">
      <div class="section-heading" appReveal>
        <p class="eyebrow">THE PERSON BEHIND THE SYSTEMS</p>
        <h2 id="exp-title">Febri <em>Nahdatun.</em></h2>
      </div>
      <div class="about-grid">
        <div class="about-copy" appReveal>
          <p class="about-lead">Saya tertarik pada titik ketika pekerjaan sehari-hari bertemu dengan kemungkinan teknologi.</p>
          <p>{{ cv.summary }}</p>
          <button type="button" class="button" (click)="nav.openCv()"><app-icon name="file" /> Baca CV lengkap</button>
        </div>
        <ol class="timeline">
          @for (job of cv.experience; track job.period) {
            <li appReveal>
              <span class="timeline-period">{{ job.period }}</span>
              <h3>{{ job.role }}</h3>
              <p class="timeline-org">{{ job.company }} · {{ job.location }}</p>
              <ul>
                @for (pt of job.points.slice(0, 4); track pt) {
                  <li>{{ pt }}</li>
                }
              </ul>
            </li>
          }
          <li appReveal>
            <span class="timeline-period">{{ cv.education.graduated }}</span>
            <h3>{{ cv.education.degree }}</h3>
            <p class="timeline-org">{{ cv.education.school }}</p>
          </li>
        </ol>
      </div>
    </section>
  `,
})
export class ExperienceSection {
  protected readonly nav = inject(NavService);
  protected readonly cv = CV.id;
}

@Component({
  selector: 'app-certifications',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section wrap" id="sertifikasi" aria-labelledby="cert-title">
      <div class="section-heading" appReveal>
        <div>
          <p class="eyebrow">VALIDATIONS</p>
          <p class="index-caption">{{ certs.length }} sertifikasi & pelatihan</p>
        </div>
        <h2 id="cert-title">Belajar tidak<br />pernah selesai.</h2>
      </div>
      <div class="cert-highlight">
        @for (c of highlights; track c.title) {
          <article class="cert-card" appReveal>
            <app-icon name="award" [size]="26" />
            <h3>{{ c.title }}</h3>
            <p>{{ c.issuer }}</p>
            <span>{{ c.date }}</span>
          </article>
        }
      </div>
      <div class="cert-list" appReveal>
        @for (c of visible(); track c.title) {
          <div class="cert-row">
            <strong>{{ c.title }}</strong>
            <span>{{ c.issuer }}</span>
            <span class="cert-date">{{ c.date }}</span>
          </div>
        }
      </div>
      @if (certs.length > 6) {
        <button type="button" class="button small" (click)="expanded.set(!expanded())" [attr.aria-expanded]="expanded()">
          {{ expanded() ? 'Tampilkan lebih sedikit' : 'Tampilkan semua (' + certs.length + ')' }}
        </button>
      }
    </section>
  `,
})
export class CertificationsSection {
  protected readonly certs = CERTIFICATIONS;
  protected readonly highlights = CERTIFICATIONS.filter((c) => c.highlight);
  protected readonly expanded = signal(false);
  protected readonly visible = computed(() => (this.expanded() ? this.certs : this.certs.slice(0, 6)));
}

@Component({
  selector: 'app-contact',
  imports: [Icon, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section wrap contact" id="kontak" aria-labelledby="contact-title">
      <div class="contact-grid">
        <div appReveal>
          <p class="eyebrow">GET IN TOUCH</p>
          <h2 id="contact-title">Punya proses yang<br /><em>ingin dirapikan?</em></h2>
          <p class="section-intro">Ceritakan kebutuhan Anda — dashboard, otomasi, integrasi cloud, atau aplikasi operasional.</p>
          <ul class="channels">
            @for (ch of channels; track ch.label) {
              <li>
                <a [href]="ch.url" target="_blank" rel="noopener noreferrer">
                  <app-icon [name]="ch.icon" /> <span>{{ ch.label }}</span> <app-icon name="arrow" [size]="14" />
                </a>
              </li>
            }
          </ul>
        </div>
        <form class="contact-form" appReveal (submit)="send($event)" novalidate>
          <label>Nama<input name="name" autocomplete="name" required maxlength="80" (input)="name.set($any($event.target).value)" /></label>
          <label>Subjek<input name="subject" required maxlength="120" (input)="subject.set($any($event.target).value)" /></label>
          <label>Pesan<textarea name="message" rows="5" required maxlength="2000" (input)="message.set($any($event.target).value)"></textarea></label>
          @if (error()) {
            <p class="form-error" role="alert">{{ error() }}</p>
          }
          <button type="submit" class="button lime"><app-icon name="mail" /> Kirim via email</button>
          <p class="form-note">Form ini membuka aplikasi email Anda. Tidak ada data yang disimpan oleh situs ini.</p>
        </form>
      </div>
    </section>
  `,
})
export class ContactSection {
  protected readonly name = signal('');
  protected readonly subject = signal('');
  protected readonly message = signal('');
  protected readonly error = signal('');
  protected readonly channels = [
    { label: PROFILE.contact.email, url: 'mailto:' + PROFILE.contact.email, icon: 'mail' as const },
    { label: 'WhatsApp', url: PROFILE.contact.whatsapp, icon: 'whatsapp' as const },
    { label: 'Telegram', url: PROFILE.contact.telegram, icon: 'telegram' as const },
    { label: 'LinkedIn', url: PROFILE.contact.linkedin, icon: 'linkedin' as const },
    { label: 'GitHub', url: PROFILE.contact.github, icon: 'github' as const },
    { label: 'Upwork', url: PROFILE.contact.upwork, icon: 'upwork' as const },
  ];

  protected send(event: Event): void {
    event.preventDefault();
    const name = this.name().trim();
    const subject = this.subject().trim();
    const message = this.message().trim();
    if (!name || !subject || !message) {
      this.error.set('Mohon lengkapi nama, subjek, dan pesan.');
      return;
    }
    this.error.set('');
    const body = `${message}\n\n— ${name}`;
    window.location.href =
      `mailto:${PROFILE.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}
