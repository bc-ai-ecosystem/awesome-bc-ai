import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const projectCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) => z.object({
    title: z.string().max(60, "Title must be 60 characters or less."),
    description: z.string().max(160, "Description must be 160 characters or less."),
    author_name: z.string().min(1, "Author name is required."),
    author_github: z.string().regex(/^@?[a-zA-Z0-9-]+$/, "Must be a valid GitHub handle").optional(),
    github_repo: z.string().url("Must be a valid URL").optional(),
    demo_url: z.string().url().optional(),
    video_url: z.string().url("Must be a valid URL").optional(),
    project_start_date: z.string().optional(),
    project_end_date: z.string().optional(),
    category: z.enum([
      'Hackathons & Sprints',
      'Open Data & Community Archives',
      'Ecosystem Tooling & Infra',
      'Creative & Physical Modalities'
    ]),
    tags: z.array(z.string()).max(5, "Maximum of 5 tags allowed"),
    event: z.string().optional(),
    image: image().optional(),
  }),
});

export const collections = {
  'projects': projectCollection,
};
