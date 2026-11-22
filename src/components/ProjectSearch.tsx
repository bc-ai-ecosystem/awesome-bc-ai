import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import ProjectCard, { CATEGORY_STYLES } from './ProjectCard';

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

type Project = {
  id: string;
  body: string;
  collection: string;
  data: {
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
  }
};

interface ProjectSearchProps {
  projects: Project[];
}

const CATEGORIES = ['All', 'Hackathons & Sprints', 'Open Data & Community Archives', 'Ecosystem Tooling & Infra', 'Creative & Physical Modalities', 'Learning & Research'];

export default function ProjectSearch({ projects }: ProjectSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  // Honour ?category= and ?tag= links from the home page and project pages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const tag = params.get('tag');
    if (cat && CATEGORIES.includes(cat)) setSelectedCategory(cat);
    if (tag) setSelectedTag(tag);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.data.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const processedProjects = useMemo(() => {
    const result = projects.filter(project => {
      const matchesSearch = project.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.data.author_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || project.data.category === selectedCategory;
      const matchesTags = selectedTag === '' || project.data.tags.includes(selectedTag);
      return matchesSearch && matchesCategory && matchesTags;
    });

    result.sort((a, b) => {
      if (sortBy === 'alphabetical') return a.data.title.localeCompare(b.data.title);
      const dateA = a.data.project_start_date ? dayjs(a.data.project_start_date).valueOf() : 0;
      const dateB = b.data.project_start_date ? dayjs(b.data.project_start_date).valueOf() : 0;
      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') {
        if (dateA === 0 && dateB !== 0) return 1;
        if (dateB === 0 && dateA !== 0) return -1;
        return dateA - dateB;
      }
      return 0;
    });

    return result;
  }, [projects, searchTerm, selectedCategory, selectedTag, sortBy]);

  const inputCls = "bg-card border-2 border-ink/70 rounded-lg px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink focus:ring-2 focus:ring-chartreuse/60 transition-all";
  const labelCls = "block text-[10px] font-bold text-ink-soft uppercase tracking-[0.14em] mb-1.5";

  return (
    <div className="w-full">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map(cat => {
          const active = selectedCategory === cat;
          const style = CATEGORY_STYLES[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold border-2 transition-all ${
                active
                  ? 'bg-ink text-paper border-ink shadow-print-sm'
                  : 'bg-card text-ink-soft border-ink/25 hover:border-ink hover:text-ink'
              }`}
            >
              {cat !== 'All' && <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${style?.bg ?? 'bg-ink'}`}></span>}
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mb-8 p-4 rounded-xl border-2 border-ink bg-card shadow-print-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className={labelCls}>Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ink-soft">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input
                type="text"
                placeholder="Search projects, descriptions, people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 ${inputCls}`}
              />
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4 shrink-0 w-full lg:w-auto">
            <div className="w-full sm:w-auto flex-grow sm:flex-grow-0">
              <label className={labelCls}>Tag</label>
              <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className={`w-full sm:w-36 appearance-none ${inputCls}`}>
                <option value="">All tags</option>
                {allTags.map(tag => <option key={tag} value={tag}>#{tag}</option>)}
              </select>
            </div>

            <div className="w-full sm:w-auto flex-grow sm:flex-grow-0">
              <label className={labelCls}>Sort</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className={`w-full sm:w-32 appearance-none ${inputCls}`}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">A–Z</option>
              </select>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <label className={labelCls}>View</label>
              <div className="flex items-center bg-paper border-2 border-ink/70 rounded-lg p-1 h-[42px]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 px-2.5 rounded-md text-xs font-semibold transition-colors ${viewMode === 'grid' ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'}`}
                  title="Grid View"
                >Grid</button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`p-1.5 px-2.5 rounded-md text-xs font-semibold transition-colors ${viewMode === 'timeline' ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'}`}
                  title="Timeline View"
                >Timeline</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-ink-soft font-medium">
        Showing <span className="text-ink font-bold">{processedProjects.length}</span> project{processedProjects.length !== 1 ? 's' : ''}
        {selectedCategory !== 'All' && <> in <span className="text-ink font-semibold">{selectedCategory}</span></>}
        {selectedTag && <> tagged <span className="text-ink font-semibold">#{selectedTag}</span></>}
      </p>

      {processedProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedProjects.map(project => <ProjectCard key={project.id} project={project} compact={false} />)}
          </div>
        ) : (
          <div className="mt-4 relative">
            <div className="space-y-10 pb-4">
              {processedProjects.map((project, idx) => {
                const hasDate = !!project.data.project_start_date;
                const dateDisplay = hasDate ? dayjs(project.data.project_start_date).format('MMM D, YYYY') : 'Unknown Date';
                return (
                  <div key={project.id} className="flex">
                    <div className="relative w-28 md:w-36 shrink-0 flex flex-col items-end pr-4 md:pr-8">
                      <div className={`absolute right-0 top-0 ${idx === processedProjects.length - 1 ? 'h-8' : 'bottom-0'} w-0.5 bg-ink/20`}></div>
                      <div className="absolute -right-[5px] top-7 w-3 h-3 rounded-full bg-chartreuse border-2 border-ink z-10"></div>
                      <div className="mt-6 text-right">
                        <div className="text-ink font-bold text-sm">{dateDisplay}</div>
                        <div className="text-ink-soft text-xs mt-1">Published</div>
                      </div>
                    </div>
                    <div className="flex-grow pb-2 pl-4 md:pl-8">
                      <ProjectCard project={project} compact={true} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-ink/30 rounded-xl bg-card/60">
          <p className="text-ink-soft text-lg font-display">No projects match your current filters.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedTag(''); }}
            className="mt-5 px-5 py-2 bg-ink text-paper font-semibold rounded-lg hover:bg-navy transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
