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

export default function ProjectCard({ project, compact = false }: ProjectCardProps) {
  const getAccentClass = (category: string) => {
    switch(category) {
      case 'Hackathons & Sprints': return 'text-brand-primary border-brand-primary';
      case 'Creative & Physical Modalities': return 'text-accent-creative border-accent-creative';
      case 'Open Data & Community Archives': return 'text-accent-ethical border-accent-ethical';
      case 'Ecosystem Tooling & Infra': return 'text-accent-tooling border-accent-tooling';
      default: return 'text-slate-400 border-slate-700';
    }
  };

  const renderDateText = (start?: string, end?: string) => {
    if (start && end) {
      return `${start} (ended ${dayjs(end).fromNow()})`;
    } else if (start) {
      return `${start} (started ${dayjs(start).fromNow()})`;
    } else if (end) {
      return `${end} (ended ${dayjs(end).fromNow()})`;
    }
    return null;
  };

  const accent = getAccentClass(project.data.category);
  const dateText = renderDateText(project.data.project_start_date, project.data.project_end_date);
  
  if (compact) {
    return (
      <a href={`${import.meta.env.BASE_URL}projects/${project.id}`} className="group block w-full max-w-4xl">
        <div className="border border-slate-700/50 bg-slate-800/30 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/50 hover:border-slate-600 hover:shadow-lg flex flex-col md:flex-row p-1.5 gap-4">
          {project.data.image && (
            <div className="md:w-1/2 shrink-0 h-48 md:h-auto rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900 relative">
              <img src={project.data.image.src} alt={project.data.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
          <div className="p-4 md:p-5 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">{project.data.title}</h3>
            <span className={`inline-block text-xs font-semibold mb-4 ${accent.split(' ')[0]}`}>{project.data.category}</span>
            <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">{project.data.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.data.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 text-xs rounded bg-slate-700/50 text-slate-300">#{tag}</span>
              ))}
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              {project.data.author_github ? (
                <img src={`https://github.com/${project.data.author_github.replace('@', '')}.png`} alt={project.data.author_github} className="w-6 h-6 rounded-full border border-slate-700" />
              ) : (
                <div className="w-6 h-6 rounded-full border border-slate-700 bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-[10px]">
                  {project.data.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-slate-400">{project.data.author_name}</span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-700/50 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Published {project.data.project_start_date ? dayjs(project.data.project_start_date).format('MMM D, YYYY') : 'Unknown'}
              </div>
              {!project.data.project_end_date && (
                <div className="flex items-center gap-1.5 text-brand-primary">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Active
                </div>
              )}
              {project.data.project_end_date && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Ended {dayjs(project.data.project_end_date).format('MMM D, YYYY')}
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={`${import.meta.env.BASE_URL}projects/${project.id}`} className="group block h-full">
      <div className={`h-full border border-slate-800 bg-slate-800/40 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-lg flex flex-col`}>
        {project.data.image && (
          <div className="h-40 w-full shrink-0 border-b border-slate-800/50 overflow-hidden bg-slate-900">
            <img src={project.data.image.src} alt={project.data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{project.data.title}</h3>
          
          {dateText && (
            <div 
              className="text-xs text-slate-400 font-mono mb-2 cursor-help underline decoration-dotted underline-offset-4 w-max" 
              title={project.data.project_start_date ? dayjs(project.data.project_start_date).format('dddd, MMMM Do, YYYY') : ''}
            >
              {dateText}
            </div>
          )}

          <span className={`inline-block text-xs font-semibold mb-4 w-max ${accent.split(' ')[0]}`}>{project.data.category}</span>
          
          <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">{project.data.description}</p>
          
          <div className="mt-auto flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {project.data.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 text-xs rounded bg-slate-700/50 text-slate-300">#{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
              {project.data.author_github ? (
                <img src={`https://github.com/${project.data.author_github.replace('@', '')}.png`} alt={project.data.author_github} className="w-8 h-8 rounded-full border border-slate-700" />
              ) : (
                <div className="w-8 h-8 rounded-full border border-slate-700 bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                  {project.data.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-sm">
                <p className="text-slate-300 font-medium">{project.data.author_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
