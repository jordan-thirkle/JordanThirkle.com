console.log("DEBUG: config.ts is executing");
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "src/data/blog" }),
	schema: z.object({
		title: z.string().max(60),
		description: z.string().max(160),
		date: z.coerce.date(),
		tags: z.array(z.string()),
		readTime: z.string(),
		draft: z.boolean().default(false),
		heroImage: z.string().optional(),
		featured: z.boolean().default(false),
	}),
});

const projects = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "src/data/projects" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(['Games', 'SaaS', 'Open Source', 'Tools']),
		tech: z.array(z.string()),
		pubDate: z.coerce.date(),
		liveUrl: z.string().url().optional(),
		githubUrl: z.string().url().optional(),
		heroImage: z.string(),
		featured: z.boolean().default(false),
	}),
});

export const collections = { blog, projects };
