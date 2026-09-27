export type ProjectCategory =
  | 'Aplikasi Operasional'
  | 'Cloud & Integrasi'
  | 'Data & Dashboard'
  | 'Analitik Data'
  | 'AI & Otomasi'
  | 'Dokumen & Pengetahuan';

export interface Screenshot {
  /** Path relative to /public, e.g. `assets/screenshots/sistem-beasiswa/01-dashboard.webp`. */
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: ProjectCategory;
  featured?: boolean;
  year?: string;
  summary: string;
  problem: string;
  approach: string[];
  output: string;
  stack: string[];
  /** Privacy / publication note shown in the case study. */
  note?: string;
  links?: ProjectLink[];
  screenshots?: Screenshot[];
}

export interface Lab {
  title: string;
  detail: string;
  stack: string;
}

export interface Expertise {
  icon: IconName;
  title: string;
  description: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  highlight?: boolean;
  credentialUrl?: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

export type Lang = 'id' | 'en';

export type IconName =
  | 'arrow'
  | 'arrow-up'
  | 'close'
  | 'menu'
  | 'mail'
  | 'whatsapp'
  | 'telegram'
  | 'linkedin'
  | 'github'
  | 'upwork'
  | 'file'
  | 'print'
  | 'external'
  | 'image'
  | 'chevron-left'
  | 'chevron-right'
  | 'microsoft'
  | 'google'
  | 'chart'
  | 'network'
  | 'sitemap'
  | 'code'
  | 'award'
  | 'search';
