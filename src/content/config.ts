import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(160), // Added for SEO metadata
    date: z.coerce.date(), // Using coerce to handle string-to-date conversion from frontmatter
    tags: z.array(z.string()),
    readTime: z.string(),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Games', 'SaaS', 'Open Source', 'Tools']),
    tech: z.array(z.string()),
    pubDate: z.coerce.date(),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    heroImage: z.string(), // Path expected in /public/projects/
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog, projects };
