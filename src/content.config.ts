import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    category: z.string(),
    span: z.enum(['wide', 'tall', 'default']).default('default'),
    order: z.number().default(99),
  }),
});

const story = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/story' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string().optional(),
    excerpt: z.string(),
    cover: z.string(),
    order: z.number().default(99),
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    updated: z.coerce.date(),
  }),
});

export const collections = { gallery, story, legal };
