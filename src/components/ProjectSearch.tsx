import React, { useState, useMemo } from 'react';

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = ['All', 'Hackathons & Sprints', 'Open Data & Community Archives', 'Ecosystem Tooling & Infra', 'Creative & Physical Modalities'];
  
  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(p => p.data.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [projects]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.data.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            project.data.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || project.data.category === selectedCategory;
      const matchesTags = selectedTags.length === 0 || selectedTags.every(t => project.data.tags.includes(t));
      
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [projects, searchTerm, selectedCategory, selectedTags]);

  const getAccentClass = (category: string) => {
    switch(category) {
      case 'Hackathons & Sprints': return 'text-brand-primary border-brand-primary';
      case 'Creative & Physical Modalities': return 'text-accent-creative border-accent-creative';
      case 'Open Data & Community Archives': return 'text-accent-ethical border-accent-ethical';
      case 'Ecosystem Tooling & Infra': return 'text-accent-tooling border-accent-tooling';
      default: return 'text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 space-y-6 bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-slate-400 mb-2">Search Projects</label>
            <input 
              type="text" 
              id="search"
              placeholder="Search by title or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-400 mb-2">Category</label>
            <select 
              id="category"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {allTags.length > 0 && (
          <div>
            <span className="block text-sm font-medium text-slate-400 mb-2">Filter by Tags</span>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors border ${
                    selectedTags.includes(tag) 
                      ? 'bg-brand-primary text-slate-900 border-brand-primary font-bold' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  #{tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button 
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 rounded-full text-xs transition-colors border border-transparent text-slate-400 hover:text-white underline decoration-dotted underline-offset-4"
                >
                  Clear Tags
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 text-sm text-slate-400">
        Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => {
          const accent = getAccentClass(project.data.category);
          
          return (
            <a key={project.id} href={`${import.meta.env.BASE_URL}projects/${project.id}`} className="group block h-full">
              <div className={`h-full border border-slate-800 bg-slate-800/40 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 hover:shadow-lg flex flex-col`}>
                {project.data.image && (
                  <div className="h-32 w-full shrink-0 border-b border-slate-800/50 overflow-hidden">
                    <img src={project.data.image.src} alt={project.data.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4">
                    {project.data.author_github ? (
                      <img 
                        src={`https://github.com/${project.data.author_github.replace('@', '')}.png`} 
                        alt={project.data.author_github} 
                        className="w-10 h-10 rounded-full border border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                        {project.data.author_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="text-slate-300 font-medium">{project.data.author_name}</p>
                      {project.data.author_github && (
                        <p className="text-slate-500 text-xs">@{project.data.author_github.replace('@', '')}</p>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{project.data.title}</h3>
                  <span className={`inline-block text-xs font-semibold mb-3 ${accent.split(' ')[0]}`}>{project.data.category}</span>
                  
                  <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">{project.data.description}</p>
                  
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.data.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs rounded bg-slate-700/50 text-slate-300">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl">
          <p className="text-slate-400 text-lg">No projects match your current filters.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedTags([]);
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
