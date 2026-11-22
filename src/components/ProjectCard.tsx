import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

type ProjectData = {
  title: string;
  description: string;
  author_name: string;
  author_github?: string;
  github_repo?: string;
  demo_url?: string;
  video_url?: string;
  project_start_date?: string;
  project_end_date?: string;
  category: string;
  tags: string[];
  event?: string;
  image?: { src: string; width?: number; height?: number; format?: string };
};

type Project = {
  id: string;
  data: ProjectData;
};

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

export const CATEGORY_STYLES: Record<string, { text: string; bg: string; soft: string }> = {
  'Hackathons & Sprints': { text: 'text-cat-hack', bg: 'bg-cat-hack', soft: 'bg-cat-hack/10' },
  'Open Data & Community Archives': { text: 'text-cat-data', bg: 'bg-cat-data', soft: 'bg-cat-data/10' },
  'Ecosystem Tooling & Infra': { text: 'text-cat-tool', bg: 'bg-cat-tool', soft: 'bg-cat-tool/10' },
  'Creative & Physical Modalities': { text: 'text-cat-creative', bg: 'bg-cat-creative', soft: 'bg-cat-creative/10' },
  'Learning & Research': { text: 'text-cat-learn', bg: 'bg-cat-learn', soft: 'bg-cat-learn/10' },
};

const FALLBACK = { text: 'text-ink-soft', bg: 'bg-ink', soft: 'bg-ink/5' };

function monogram(title: string) {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, ' ').split(' ').filter(Boolean);
  return (words.slice(0, 2).map(w => w.charAt(0)).join('') || 'BC').toUpperCase();
}

function Cover({ project, tall = false }: { project: Project; tall?: boolean }) {
  const style = CATEGORY_STYLES[project.data.category] ?? FALLBACK;
  if (project.data.image) {
    return (
      <div className={`w-full shrink-0 overflow-hidden border-b-2 border-ink bg-paper-deep ${tall ? 'h-48 md:h-full' : 'h-40'}`}>
        <img src={project.data.image.src} alt={project.data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
    );
  }
  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden border-b-2 border-ink ${style.bg} ${tall ? 'h-48 md:h-full' : 'h-40'}`}
      style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, rgba(255,253,246,0.35) 1.5px, transparent 0)', backgroundSize: '18px 18px' }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display font-black text-6xl text-card/95 tracking-tight drop-shadow-[2px_2px_0_rgba(13,27,46,0.35)]">{monogram(project.data.title)}</span>
      </div>
      <span className="absolute bottom-2.5 left-3 text-[10px] font-bold uppercase tracking-[0.18em] text-card/90">{project.data.category}</span>
    </div>
  );
}

function AuthorRow({ project, size = 'md' }: { project: Project; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs';
  return (
    <div className="flex items-center gap-2.5">
      {project.data.author_github ? (
        <img src={`https://github.com/${project.data.author_github.replace('@', '')}.png`} alt={project.data.author_github} className={`${dim} rounded-full border border-ink/25`} />
      ) : (
        <div className={`${dim} rounded-full border border-ink/25 bg-paper-deep flex items-center justify-center text-ink font-bold`}>
          {project.data.author_name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} text-ink-soft font-medium`}>{project.data.author_name}</span>
    </div>
  );
}

export default function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const style = CATEGORY_STYLES[project.data.category] ?? FALLBACK;

  if (compact) {
    return (
      <a href={`${import.meta.env.BASE_URL}projects/${project.id}`} className="group block w-full max-w-4xl">
        <div className="border-2 border-ink bg-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-print flex flex-col md:flex-row">
          <div className="md:w-2/5 shrink-0">
            <Cover project={project} tall />
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <span className={`text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5 ${style.text}`}>{project.data.category}</span>
            <h3 className="font-display text-2xl font-semibold text-ink mb-2 leading-snug group-hover:underline decoration-2 underline-offset-4">{project.data.title}</h3>
            <p className="text-ink-soft text-sm line-clamp-3 mb-5 flex-grow">{project.data.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.data.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-ink/20 bg-paper text-ink-soft">#{tag}</span>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-ink/10 flex flex-wrap items-center gap-x-5 gap-y-2">
              <AuthorRow project={project} size="sm" />
              <span className="text-xs text-ink-soft ml-auto">
                {project.data.project_start_date ? dayjs(project.data.project_start_date).format('MMM YYYY') : ''}
                {!project.data.project_end_date && <span className="text-cat-hack font-semibold"> · Active</span>}
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={`${import.meta.env.BASE_URL}projects/${project.id}`} className="group block h-full">
      <div className="h-full border-2 border-ink bg-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-print hover:-translate-y-0.5 flex flex-col">
        <Cover project={project} />
        <div className="p-5 flex flex-col flex-grow">
          <span className={`text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5 ${style.text}`}>{project.data.category}</span>
          <h3 className="font-display text-[1.35rem] font-semibold text-ink mb-2 leading-snug group-hover:underline decoration-2 underline-offset-4">{project.data.title}</h3>
          <p className="text-ink-soft text-sm line-clamp-3 mb-5 flex-grow">{project.data.description}</p>
          <div className="mt-auto flex flex-col gap-4">
            <div className="flex flex-wrap gap-1.5">
              {project.data.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-ink/20 bg-paper text-ink-soft">#{tag}</span>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-ink/10">
              <AuthorRow project={project} />
              {project.data.project_start_date && (
                <span className="text-xs text-ink-soft shrink-0">{dayjs(project.data.project_start_date).format('MMM YYYY')}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
