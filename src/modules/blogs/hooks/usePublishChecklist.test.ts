import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePublishChecklist } from './usePublishChecklist';

describe('usePublishChecklist', () => {
  it('bloquea la publicación si faltan título o contenido mínimo', () => {
    const { result } = renderHook(() =>
      usePublishChecklist({
        title: 'Hi',
        slug: 'hi',
        contentHtml: '<p>Corto</p>',
      }),
    );
    expect(result.current.canPublish).toBe(false);
    expect(result.current.checks.find((c) => c.key === 'title')?.ok).toBe(false);
    expect(result.current.checks.find((c) => c.key === 'content')?.ok).toBe(false);
  });

  it('habilita la publicación cuando se cumplen todas las reglas', () => {
    const { result } = renderHook(() =>
      usePublishChecklist({
        title: 'Arquitectura CMS Headless',
        slug: 'arquitectura-cms-headless',
        contentHtml: '<p>Contenido suficientemente largo para publicar.</p>',
      }),
    );
    expect(result.current.canPublish).toBe(true);
  });
});
