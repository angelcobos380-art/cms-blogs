import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:8000/api/v1'),
  VITE_APP_NAME: z.string().min(1).default('CMS Admin'),
  VITE_AUTOSAVE_DELAY_MS: z.coerce.number().int().min(300).max(15000).default(2000),
  VITE_ENABLE_MOCKS: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((v) => v === 'true'),
});

const parsed = envSchema.safeParse({
  VITE_API_URL: import.meta.env.VITE_API_URL || undefined,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || undefined,
  VITE_AUTOSAVE_DELAY_MS: import.meta.env.VITE_AUTOSAVE_DELAY_MS || undefined,
  VITE_ENABLE_MOCKS: import.meta.env.VITE_ENABLE_MOCKS || undefined,
});

if (!parsed.success) {
  console.error('Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  throw new Error('Configuración de entorno inválida. Revisa tu archivo .env.');
}

export const env = parsed.data;
