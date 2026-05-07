import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import ProjectCard from './ProjectCard';

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

export default function ProjectSearch({ projects }: ProjectSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');

  const categories = ['All', 'Hackathons & Sprints', 'Open Data & Community Archives', 'Ecosystem Tooling & Infra', 'Creative & Physical Modalities'];
  
  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.data.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const processedProjects = useMemo(() => {
    const result = projects.filter(project => {
      const matchesSearch = project.data.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.data.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || project.data.category === selectedCategory;
      const matchesTags = selectedTag === '' || project.data.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTags;
    });

    result.sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.data.title.localeCompare(b.data.title);
      }
      
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

  return (
    <div className="w-full">
      <div className="mb-8 p-4 rounded-2xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          
          <div className="flex-grow w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search projects by title, description, or keywords..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4 shrink-0 w-full lg:w-auto">
            
            <div className="w-full sm:w-auto flex-grow sm:flex-grow-0">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">Category</label>
              <div className="relative">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-36 bg-slate-900/50 border border-slate-700 rounded-xl pl-8 pr-8 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex-grow sm:flex-grow-0">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">Tags</label>
              <div className="relative">
                <select 
                  value={selectedTag} 
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full sm:w-32 bg-slate-900/50 border border-slate-700 rounded-xl pl-8 pr-8 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                >
                  <option value="">Select</option>
                  {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <span className="font-bold text-sm pl-0.5">#</span>
                </div>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex-grow sm:flex-grow-0">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">Sort</label>
              <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-32 bg-slate-900/50 border border-slate-700 rounded-xl pl-8 pr-8 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="alphabetical">A-Z</option>
                </select>
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">View</label>
              <div className="flex items-center bg-slate-900/50 rounded-xl p-1 border border-slate-700 h-[42px]">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-700 text-brand-primary shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  title="Grid View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                </button>
                <button 
                  onClick={() => setViewMode('timeline')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'timeline' ? 'bg-slate-700 text-brand-primary shadow-sm' : 'text-slate-400 hover:text-white'}`}
                  title="Timeline View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="mb-6 text-sm text-slate-400 font-medium">
        Showing {processedProjects.length} project{processedProjects.length !== 1 ? 's' : ''}
      </div>

      {processedProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedProjects.map(project => <ProjectCard key={project.id} project={project} compact={false} />)}
          </div>
        ) : (
          <div className="mt-8 relative">
            {/* Timeline Start Cap (Present) */}
            <div className="flex">
               <div className="relative w-28 md:w-36 shrink-0 flex flex-col items-end pr-4 md:pr-8 pb-8">
                  <div className="absolute right-0 top-2 bottom-0 w-px bg-slate-700"></div>
                  <div className="absolute -right-[4.5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-slate-500 bg-[#0f172a] z-10"></div>
                  
                  <div className="mt-1 text-right">
                    <div className="text-brand-primary font-bold text-sm">Present</div>
                    <div className="text-slate-500 text-xs mt-1">Active</div>
                  </div>
               </div>
               <div className="flex-grow pl-4 md:pl-8"></div>
            </div>

            <div className="space-y-12 pb-8">
              {processedProjects.map((project, idx) => {
                const hasDate = !!project.data.project_start_date;
                const dateDisplay = hasDate ? dayjs(project.data.project_start_date).format('MMM D, YYYY') : 'Unknown Date';
                
                return (
                  <div key={project.id} className="flex">
                    <div className="relative w-28 md:w-36 shrink-0 flex flex-col items-end pr-4 md:pr-8">
                      {idx === processedProjects.length - 1 ? (
                        <div className="absolute right-0 top-0 h-8 w-px bg-slate-700"></div>
                      ) : (
                        <div className="absolute right-0 top-0 bottom-0 w-px bg-slate-700"></div>
                      )}
                      <div className="absolute -right-[4.5px] top-7 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-[#0f172a] z-10"></div>
                      
                      <div className="mt-6 text-right">
                        <div className="text-brand-primary font-bold text-sm flex items-center justify-end gap-2" title={hasDate ? dayjs(project.data.project_start_date).format('dddd, MMMM Do, YYYY') : ''}>
                          {dateDisplay} <span className="text-slate-600 font-normal">&gt;</span>
                        </div>
                        <div className="text-slate-500 text-xs mt-1">Published</div>
                      </div>
                    </div>

                    <div className="flex-grow pb-12 pl-4 md:pl-8">
                      <ProjectCard project={project} compact={true} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl">
          <p className="text-slate-400 text-lg">No projects match your current filters.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedTag('');
            }}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
