import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

interface ProjectGeneratorProps {
  existingTags?: string[];
  existingEvents?: string[];
}

export default function ProjectGenerator({ existingTags = [], existingEvents = [] }: ProjectGeneratorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author_name: '',
    author_github: '',
    github_repo: '',
    demo_url: '',
    video_url: '',
    project_start_date: '',
    project_end_date: '',
    category: 'Hackathons & Sprints',
    body: ''
  });

  const [selectedTags, setSelectedTags] = useState<{label: string, value: string}[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<{label: string, value: string} | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isGenerated, setIsGenerated] = useState(false);
  const [projectDirName, setProjectDirName] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [copiedMd, setCopiedMd] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${projectDirName}/index.md`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tagOptions = existingTags.map(t => ({ label: t, value: t }));
  const eventOptions = existingEvents.map(e => ({ label: e, value: e }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format Tags
    const tagsArray = selectedTags.map(t => `"${t.value}"`);
    
    // Generate Markdown
    let md = `---\n`;
    md += `title: "${formData.title.replace(/"/g, '\\"')}"\n`;
    md += `description: "${formData.description.replace(/"/g, '\\"')}"\n`;
    md += `author_name: "${formData.author_name.replace(/"/g, '\\"')}"\n`;
    
    if (formData.author_github) md += `author_github: "${formData.author_github}"\n`;
    if (formData.github_repo) md += `github_repo: "${formData.github_repo}"\n`;
    if (formData.demo_url) md += `demo_url: "${formData.demo_url}"\n`;
    if (formData.video_url) md += `video_url: "${formData.video_url}"\n`;
    if (formData.project_start_date) md += `project_start_date: "${formData.project_start_date}"\n`;
    if (formData.project_end_date) md += `project_end_date: "${formData.project_end_date}"\n`;
    
    md += `category: "${formData.category}"\n`;
    md += `tags: [${tagsArray.join(', ')}]\n`;
    
    if (selectedEvent) {
      md += `event: "${selectedEvent.value.replace(/"/g, '\\"')}"\n`;
    }
    
    if (imageFile) {
      md += `image: "./${imageFile.name}"\n`;
    }
    
    md += `---\n\n`;
    md += formData.body;

    setGeneratedMarkdown(md);

    // Create Blob
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Generate directory name
    const dirName = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setProjectDirName(dirName);
    
    // Download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGenerated(true);
  };

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      borderColor: state.isFocused ? '#a3e635' : '#334155',
      color: 'white',
      borderRadius: '0.5rem',
      padding: '2px',
      boxShadow: state.isFocused ? '0 0 0 1px #a3e635' : 'none',
      '&:hover': { borderColor: '#a3e635' }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      zIndex: 50
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#334155' : 'transparent',
      color: 'white',
      '&:active': { backgroundColor: '#475569' }
    }),
    singleValue: (base: any) => ({ ...base, color: 'white' }),
    multiValue: (base: any) => ({ ...base, backgroundColor: '#334155', borderRadius: '4px' }),
    multiValueLabel: (base: any) => ({ ...base, color: '#e2e8f0' }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#94a3b8',
      ':hover': { backgroundColor: '#ef4444', color: 'white' },
    }),
    input: (base: any) => ({ ...base, color: 'white' }),
  };

  const getAccentClass = (category: string) => {
    switch(category) {
      case 'Hackathons & Sprints': return 'text-brand-primary border-brand-primary';
      case 'Creative & Physical Modalities': return 'text-accent-creative border-accent-creative';
      case 'Open Data & Community Archives': return 'text-accent-ethical border-accent-ethical';
      case 'Ecosystem Tooling & Infra': return 'text-accent-tooling border-accent-tooling';
      default: return 'text-slate-400 border-slate-700';
    }
  };

  if (isGenerated) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-xl border border-brand-primary bg-brand-primary/5 text-center">
        <div className="w-16 h-16 bg-brand-primary text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-bold font-display text-white mb-4">File Generated!</h2>
        <p className="text-slate-300 mb-6">
          Your project file <strong className="text-white">index.md</strong> has been downloaded to your computer.
        </p>
        
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-white mb-3">Next Steps:</h3>
          <ol className="list-decimal list-inside text-slate-400 space-y-3">
            <li>Go to the <a href="https://github.com/bc-ai-ecosystem/awesome-bc-ai/tree/main/src/content/projects" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Projects Folder on GitHub</a>.</li>
            <li>Click <strong>Add file</strong> &gt; <strong>Create new file</strong>.</li>
            <li className="flex items-center flex-wrap gap-2">
              In the filename box, type 
              <code className="bg-slate-800 px-2 py-1 rounded border border-slate-700 select-all font-mono text-sm">{projectDirName}/index.md</code>
              <button 
                onClick={handleCopy}
                className="inline-flex items-center justify-center p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 shadow-sm group relative"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                )}
                {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow">Copied!</span>}
              </button>
            </li>
            <li>
              <div className="flex items-center flex-wrap gap-3 mt-1 mb-2">
                <span>Paste the contents of your downloaded <code>index.md</code> file into the editor.</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedMarkdown);
                    setCopiedMd(true);
                    setTimeout(() => setCopiedMd(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 shadow-sm text-sm"
                >
                  {copiedMd ? (
                    <><svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Copied Markdown!</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> Copy Markdown File Contents</>
                  )}
                </button>
              </div>
            </li>
            {imageFile && (
              <li>Click <strong>Commit changes</strong>, then upload your image file <code>{imageFile.name}</code> into the newly created <code>{projectDirName}</code> folder.</li>
            )}
            {!imageFile && (
              <li>Click <strong>Commit changes</strong> to submit your pull request!</li>
            )}
          </ol>
        </div>
        
        <button 
          onClick={() => setIsGenerated(false)}
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          &larr; Submit another project
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 inline-flex">
          <button
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'edit' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setMode('edit')}
          >
            Edit Form
          </button>
          <button
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'preview' ? 'bg-brand-primary text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setMode('preview')}
          >
            Live Preview
          </button>
        </div>
      </div>

      <div className={mode === 'preview' ? 'block' : 'hidden'}>
        <div className="max-w-md mx-auto">
          <div className="text-center text-sm text-slate-400 mb-4">This is how your project card will appear in the directory:</div>
          <div className={`h-full border border-slate-800 bg-slate-800/40 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 shadow-lg flex flex-col pointer-events-none`}>
            
            {imagePreviewUrl && (
              <img src={imagePreviewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-4 border border-slate-700" />
            )}
            
            {formData.video_url && (
               <div className="w-full aspect-video bg-slate-900 rounded-lg border border-slate-700 mb-4 flex flex-col items-center justify-center text-slate-500">
                 <svg className="w-8 h-8 opacity-50 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                 <span className="text-xs">Video Embed Preview</span>
               </div>
            )}
            
            <div className="flex items-center gap-3 mb-4 mt-2">
              {formData.author_github ? (
                <img 
                  src={`https://github.com/${formData.author_github.replace('@', '')}.png`} 
                  alt={formData.author_github} 
                  className="w-10 h-10 rounded-full border border-slate-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAw MDAwLTQtNEg4YTQgNCAwIDAwLTQgNHYyIj48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ij48L2NpcmNsZT48L3N2Zz4=' }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                  {formData.author_name ? formData.author_name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div className="text-sm">
                <p className="text-slate-300 font-medium">{formData.author_name || 'Your Name'}</p>
                {formData.author_github && (
                  <p className="text-slate-500 text-xs">@{formData.author_github.replace('@', '')}</p>
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{formData.title || 'Project Title'}</h3>
            <span className={`inline-block text-xs font-semibold mb-3 ${getAccentClass(formData.category).split(' ')[0]}`}>{formData.category}</span>
            
            {(formData.project_start_date || formData.project_end_date) && (
              <div className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                {formData.project_start_date || '...'} {formData.project_end_date ? `to ${formData.project_end_date}` : ''}
              </div>
            )}
            
            <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow">{formData.description || 'Your project description will appear here...'}</p>
            
            <div className="mt-auto flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <span key={tag.value} className="px-2 py-1 text-xs rounded bg-slate-700/50 text-slate-300">#{tag.label}</span>
              ))}
              {selectedTags.length === 0 && (
                <span className="px-2 py-1 text-xs rounded bg-slate-700/50 text-slate-500 italic">#tags</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`space-y-6 ${mode === 'edit' ? 'block' : 'hidden'}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Project Title <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                id="title" name="title" required maxLength={60}
                value={formData.title} onChange={handleChange}
                placeholder="Awesome AI App"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
            <div>
              <label htmlFor="author_name" className="block text-sm font-medium text-slate-300 mb-1">Your Name <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                id="author_name" name="author_name" required
                value={formData.author_name} onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Short Description <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              id="description" name="description" required maxLength={160}
              value={formData.description} onChange={handleChange}
              placeholder="A brief 1-2 sentence description of what the project does."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author_github" className="block text-sm font-medium text-slate-300 mb-1">GitHub Handle</label>
              <input 
                type="text" 
                id="author_github" name="author_github"
                value={formData.author_github} onChange={handleChange}
                placeholder="username"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
            <div>
              <label htmlFor="github_repo" className="block text-sm font-medium text-slate-300 mb-1">GitHub Repo URL</label>
              <input 
                type="url" 
                id="github_repo" name="github_repo"
                value={formData.github_repo} onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category <span className="text-red-400">*</span></label>
              <select 
                id="category" name="category" required
                value={formData.category} onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none"
              >
                <option value="Hackathons & Sprints">Hackathons & Sprints</option>
                <option value="Open Data & Community Archives">Open Data & Community Archives</option>
                <option value="Ecosystem Tooling & Infra">Ecosystem Tooling & Infra</option>
                <option value="Creative & Physical Modalities">Creative & Physical Modalities</option>
              </select>
            </div>
            <div>
              <label htmlFor="demo_url" className="block text-sm font-medium text-slate-300 mb-1">Live Demo URL</label>
              <input 
                type="url" 
                id="demo_url" name="demo_url"
                value={formData.demo_url} onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="project_start_date" className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
              <input 
                type="date" 
                id="project_start_date" name="project_start_date"
                value={formData.project_start_date} onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all [color-scheme:dark]"
              />
            </div>
            <div>
              <label htmlFor="project_end_date" className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
              <input 
                type="date" 
                id="project_end_date" name="project_end_date"
                value={formData.project_end_date} onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="video_url" className="block text-sm font-medium text-slate-300 mb-1">Video URL (YouTube, Vimeo, MP4)</label>
            <input 
              type="url" 
              id="video_url" name="video_url"
              value={formData.video_url} onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-slate-300 mb-1">Tags (Max 5)</label>
              <CreatableSelect 
                isMulti
                name="tags"
                options={tagOptions}
                value={selectedTags}
                onChange={(newValue: any) => {
                  if (newValue.length <= 5) setSelectedTags(newValue);
                }}
                styles={customSelectStyles}
                classNamePrefix="select"
                placeholder="Type or select tags..."
              />
            </div>
            <div>
              <label htmlFor="event" className="block text-sm font-medium text-slate-300 mb-1">Event Name</label>
              <CreatableSelect 
                isClearable
                name="event"
                options={eventOptions}
                value={selectedEvent}
                onChange={(newValue: any) => setSelectedEvent(newValue)}
                styles={customSelectStyles}
                classNamePrefix="select"
                placeholder="Type or select an event..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-slate-300 mb-1">Project Image (Optional)</label>
            <input 
              type="file" 
              id="image" name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-slate-900 hover:file:bg-lime-300 cursor-pointer"
            />
            <p className="text-xs text-slate-500 mt-2">The image will be displayed on your project card. You'll need to upload it to GitHub alongside your Markdown file.</p>
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-slate-300 mb-1">Detailed Description (Markdown Supported)</label>
            <textarea 
              id="body" name="body" rows={6}
              value={formData.body} onChange={handleChange}
              placeholder="Write a longer description, features, how to run, etc. Markdown is supported."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-mono text-sm"
            ></textarea>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 rounded-xl bg-brand-primary text-slate-900 font-bold text-lg hover:bg-lime-300 transition-colors shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)]"
        >
          Generate Project Files
        </button>
      </form>
    </div>
  );
}
