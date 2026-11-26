import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio')
    .max(120, 'El título no puede superar los 120 caracteres'),
  template_id: z.string().nullable().optional(),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;

export const publishRulesSchema = z.object({
  title: z.string().trim().min(5, 'Título entre 5 y 120 caracteres').max(120),
  plainText: z.string().trim().min(10, 'Contenido mínimo de 10 caracteres de texto'),
  slug: z.string().trim().min(1, 'Slug válido y único'),
});
