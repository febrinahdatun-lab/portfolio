import { Lab, Lang, Project } from '../models';
import { CATEGORY_EN, EXPERTISE_EN, LABS_EN, PRINCIPLES_EN, PROJECTS_EN, TAGLINE_EN } from './content.en';
import { EXPERTISE, PRINCIPLES, PROFILE } from './profile';
import { LABS, PROJECTS } from './projects';

/** Project with display strings resolved for the active language (category stays the canonical key). */
export interface LocalizedProject extends Project {
  categoryLabel: string;
}

export function localizeProject(p: Project, lang: Lang): LocalizedProject {
  if (lang === 'id') return { ...p, categoryLabel: p.category };
  const en = PROJECTS_EN[p.id];
  if (!en) return { ...p, categoryLabel: CATEGORY_EN[p.category] };
  return {
    ...p,
    categoryLabel: CATEGORY_EN[p.category],
    title: en.title ?? p.title,
    subtitle: en.subtitle ?? p.subtitle,
    summary: en.summary,
    problem: en.problem,
    approach: en.approach,
    output: en.output,
    note: en.note ?? p.note,
    links: p.links?.map((l, i) => ({ ...l, label: en.links?.[i] ?? l.label })),
    screenshots: p.screenshots?.map((s, i) => ({ ...s, caption: en.captions?.[i] ?? s.caption })),
  };
}

export const projectsFor = (lang: Lang) => PROJECTS.map((p) => localizeProject(p, lang));
export const labsFor = (lang: Lang): Lab[] => (lang === 'en' ? LABS_EN : LABS);
export const expertiseFor = (lang: Lang) => (lang === 'en' ? EXPERTISE_EN : EXPERTISE);
export const principlesFor = (lang: Lang) => (lang === 'en' ? PRINCIPLES_EN : PRINCIPLES);
export const taglineFor = (lang: Lang) => (lang === 'en' ? TAGLINE_EN : PROFILE.tagline);
