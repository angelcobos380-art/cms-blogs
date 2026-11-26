import { http, HttpResponse } from 'msw';

const API = 'http://localhost:8000/api/v1';

export const mockUser = {
  user_id: '019a-user-01',
  email: 'admin@example.com',
  role: 'ADMIN',
};

export const mockTemplates = [
  {
    template_id: '019a-tpl-01',
    name: 'Oscuro Editorial (Predeterminada)',
    description: 'Estilo oscuro minimalista.',
    status: 'ACTIVA',
    is_default: true,
    tokens: {
      version: 1,
      colors: {
        accent: '#e34b4e',
        background: '#0b0a0b',
        surface: '#1c191b',
        text: '#f7f3f1',
        textMuted: '#b6adab',
        border: '#2e292b',
        link: '#e34b4e',
        codeBg: '#070607',
      },
      typography: {
        headingFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif',
        codeFont: 'ui-monospace, monospace',
        baseSize: 17,
        lineHeight: 1.8,
      },
      layout: {
        maxWidth: 780,
        density: 'comfortable',
        headerStyle: 'minimal',
        imageRadius: 12,
        shadow: 'soft',
      },
      blocks: {
        callout: {
          info: { bg: '#172536', border: '#38bdf8' },
          tip: { bg: '#14291f', border: '#22c55e' },
          warning: { bg: '#2e2412', border: '#eab308' },
          danger: { bg: '#311619', border: '#e34b4e' },
        },
        quote: { borderColor: '#e34b4e', style: 'italic' },
        code: { radius: 12, showLanguageBadge: true },
      },
    },
    created_at: '2026-11-25T00:00:00+00:00',
    updated_at: '2026-11-25T00:00:00+00:00',
  },
];

export const mockPosts = [
  {
    post_id: '019a-post-01',
    slug: 'arquitectura-cms-headless',
    title: 'Arquitectura CMS Headless',
    status: 'PUBLICADO',
    tags: ['fastapi', 'react'],
    excerpt: 'Cómo construir un CMS headless reutilizable.',
    cover_image_url: null,
    seo: null,
    template_id: '019a-tpl-01',
    content_json: { type: 'doc', content: [] },
    content_html: '<p>Contenido inicial del artículo.</p>',
    content: 'Contenido inicial del artículo.',
    content_schema_version: 1,
    created_at: '2026-11-24T10:00:00+00:00',
    updated_at: '2026-11-25T10:00:00+00:00',
    published_at: '2026-11-25T10:00:00+00:00',
  },
];

export const handlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (body.email === 'admin@example.com' && body.password === 'Admin123!') {
      return HttpResponse.json({ access_token: 'mock-jwt-token', token_type: 'Bearer' });
    }
    return HttpResponse.json({ detail: 'Credenciales incorrectas' }, { status: 401 });
  }),

  http.get(`${API}/auth/me`, ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth?.startsWith('Bearer ')) {
      return HttpResponse.json({ detail: 'Token inválido' }, { status: 401 });
    }
    return HttpResponse.json(mockUser);
  }),

  http.get(`${API}/posts`, () => {
    return HttpResponse.json({
      items: mockPosts.map(({ content_json: _j, content_html: _h, content: _c, ...rest }) => rest),
      total: mockPosts.length,
      page: 1,
      page_size: 20,
    });
  }),

  http.get(`${API}/templates`, () => {
    return HttpResponse.json({
      items: mockTemplates,
      total: mockTemplates.length,
      page: 1,
      page_size: 20,
    });
  }),

  http.get(`${API}/metrics/summary`, () => {
    return HttpResponse.json({
      totals: {
        posts: mockPosts.length,
        by_status: { BORRADOR: 0, PUBLICADO: 1, ARCHIVADO: 0 },
        views: 42,
      },
      top_tags: [{ tag: 'fastapi', count: 1 }],
      posts_per_month: [{ month: '2026-11', created: 1, published: 1 }],
      top_posts: [{ post_id: '019a-post-01', slug: 'arquitectura-cms-headless', title: 'Arquitectura CMS Headless', views: 42 }],
    });
  }),
];
