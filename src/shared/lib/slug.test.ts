import { describe, expect, it } from 'vitest';
import { slugify } from './slug';

describe('slugify', () => {
  it('normaliza acentos, espacios y símbolos', () => {
    expect(slugify('¡Novedades en FastAPI 2026!')).toBe('novedades-en-fastapi-2026');
    expect(slugify('  Arquitectura   Headless  ')).toBe('arquitectura-headless');
  });
});
