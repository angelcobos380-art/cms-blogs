import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { normalizeApiError } from './errors';

describe('normalizeApiError', () => {
  it('normaliza un detail string de FastAPI', () => {
    const err = new AxiosError('Bad Request', '400', undefined, undefined, {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
      data: { detail: 'Slug duplicado' },
    });

    expect(normalizeApiError(err)).toEqual({
      status: 400,
      message: 'Slug duplicado',
      fieldErrors: [],
    });
  });

  it('normaliza una lista 422 de validación de FastAPI', () => {
    const err = new AxiosError('Unprocessable', '422', undefined, undefined, {
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: {},
      config: {} as never,
      data: {
        detail: [
          { loc: ['body', 'title'], msg: 'Título muy corto', type: 'value_error' },
          { loc: ['body', 'content'], msg: 'Contenido requerido', type: 'value_error' },
        ],
      },
    });

    const res = normalizeApiError(err);
    expect(res.status).toBe(422);
    expect(res.fieldErrors).toEqual([
      { field: 'title', message: 'Título muy corto' },
      { field: 'content', message: 'Contenido requerido' },
    ]);
    expect(res.message).toContain('Título muy corto');
  });
});
