import { describe, expect, it } from 'vitest';
import { computeDateRange } from './useViewsSeries';

describe('computeDateRange', () => {
  it('calcula fechas YYYY-MM-DD válidas para 7d y 30d', () => {
    const r7 = computeDateRange('7d');
    const r30 = computeDateRange('30d');
    expect(r7.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(r7.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(r30.from <= r7.from).toBe(true);
    expect(r7.from <= r7.to).toBe(true);
  });
});
