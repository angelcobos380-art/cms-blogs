import { describe, expect, it } from 'vitest';
import { DEFAULT_TEMPLATE_TOKENS } from '../schemas/template.schema';
import { tokensToCssVars } from './tokensToCssVars';

describe('tokensToCssVars', () => {
  it('convierte design tokens a variables CSS --cms-*', () => {
    const vars = tokensToCssVars(DEFAULT_TEMPLATE_TOKENS) as Record<string, string>;
    expect(vars['--cms-accent']).toBe('#2563eb');
    expect(vars['--cms-max-width']).toBe('740px');
    expect(vars['--cms-base-size']).toBe('17px');
  });

  it('retorna objeto vacío si no hay tokens', () => {
    expect(tokensToCssVars(null)).toEqual({});
  });
});
