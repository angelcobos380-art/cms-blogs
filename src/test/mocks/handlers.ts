import { http, HttpResponse } from 'msw';
import type { Post } from '@blogs';
import { slugify } from '@shared/lib/slug';

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

export const mockPosts: Post[] = [
  {
    post_id: '019a-post-01',
    slug: 'arquitectura-cms-headless',
    title: 'Arquitectura CMS Headless',
    status: 'PUBLICADO',
    tags: ['fastapi', 'react'],
    excerpt: 'Cómo construir un CMS headless reutilizable.',
    cover_image_url: null as string | null,
    seo: null as Record<string, unknown> | null,
    template_id: '019a-tpl-01',
    content_json: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Contenido inicial del artículo.' }],
        },
      ],
    },
    content_html: '<p>Contenido inicial del artículo.</p>',
    content: 'Contenido inicial del artículo.',
    content_schema_version: 1,
    created_at: '2026-11-24T10:00:00+00:00',
    updated_at: '2026-11-25T10:00:00+00:00',
    published_at: '2026-11-25T10:00:00+00:00',
  },
  {
    post_id: '019a-post-02',
    slug: 'borrador-alembic',
    title: 'Migraciones con Alembic',
    status: 'BORRADOR',
    tags: ['python', 'alembic'],
    excerpt: 'Notas iniciales sobre migraciones.',
    cover_image_url: null,
    seo: null,
    template_id: null,
    content_json: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Borrador de ejemplo listo para editar.' }],
        },
      ],
    },
    content_html: '<p>Borrador de ejemplo listo para editar.</p>',
    content: 'Borrador de ejemplo listo para editar.',
    content_schema_version: 1,
    created_at: '2026-11-25T12:00:00+00:00',
    updated_at: '2026-11-25T12:00:00+00:00',
    published_at: null,
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

  http.get(`${API}/posts`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const q = url.searchParams.get('q')?.toLowerCase() ?? '';
    const tag = url.searchParams.get('tag')?.toLowerCase() ?? '';

    const filtered = mockPosts.filter((p) => {
      if (status && p.status !== status) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false;
      return true;
    });

    return HttpResponse.json({
      items: filtered.map(({ content_json: _j, content_html: _h, content: _c, seo: _s, ...rest }) => rest),
      total: filtered.length,
      page: 1,
      page_size: 20,
    });
  }),

  http.post(`${API}/posts`, async ({ request }) => {
    const body = (await request.json()) as { title: string; template_id?: string | null };
    const created: Post = {
      post_id: `019a-post-${Date.now()}`,
      slug: slugify(body.title) || `borrador-${Date.now()}`,
      title: body.title,
      status: 'BORRADOR',
      tags: [] as string[],
      excerpt: null,
      cover_image_url: null,
      seo: null,
      template_id: body.template_id ?? null,
      content_json: null,
      content_html: null,
      content: null,
      content_schema_version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: null,
    };
    mockPosts.unshift(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.get(`${API}/posts/:postId`, ({ params }) => {
    const found = mockPosts.find((p) => p.post_id === params.postId);
    if (!found) return HttpResponse.json({ detail: 'Post no encontrado.' }, { status: 404 });
    return HttpResponse.json(found);
  }),

  http.patch(`${API}/posts/:postId`, async ({ params, request }) => {
    const found = mockPosts.find((p) => p.post_id === params.postId);
    if (!found) return HttpResponse.json({ detail: 'Post no encontrado.' }, { status: 404 });
    if (found.status === 'ARCHIVADO') {
      return HttpResponse.json({ detail: 'Post archivado es solo lectura.' }, { status: 409 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    Object.assign(found, body, { updated_at: new Date().toISOString() });
    return HttpResponse.json(found);
  }),

  http.post(`${API}/posts/:postId/publish`, ({ params }) => {
    const found = mockPosts.find((p) => p.post_id === params.postId);
    if (!found) return HttpResponse.json({ detail: 'Post no encontrado.' }, { status: 404 });
    found.status = 'PUBLICADO';
    found.published_at = found.published_at ?? new Date().toISOString();
    found.updated_at = new Date().toISOString();
    return HttpResponse.json(found);
  }),

  http.post(`${API}/posts/:postId/unpublish`, ({ params }) => {
    const found = mockPosts.find((p) => p.post_id === params.postId);
    if (!found) return HttpResponse.json({ detail: 'Post no encontrado.' }, { status: 404 });
    found.status = 'BORRADOR';
    found.updated_at = new Date().toISOString();
    return HttpResponse.json(found);
  }),

  http.post(`${API}/posts/:postId/archive`, ({ params }) => {
    const found = mockPosts.find((p) => p.post_id === params.postId);
    if (!found) return HttpResponse.json({ detail: 'Post no encontrado.' }, { status: 404 });
    found.status = 'ARCHIVADO';
    found.updated_at = new Date().toISOString();
    return HttpResponse.json(found);
  }),

  http.post(`${API}/posts/:postId/restore`, ({ params }) => {
    const found = mockPosts.find((p) => p.post_id === params.postId);
    if (!found) return HttpResponse.json({ detail: 'Post no encontrado.' }, { status: 404 });
    found.status = 'BORRADOR';
    found.updated_at = new Date().toISOString();
    return HttpResponse.json(found);
  }),

  http.delete(`${API}/posts/:postId`, ({ params }) => {
    const idx = mockPosts.findIndex((p) => p.post_id === params.postId);
    if (idx === -1) return HttpResponse.json({ detail: 'Post no encontrado.' }, { status: 404 });
    if (mockPosts[idx].status !== 'BORRADOR') {
      return HttpResponse.json({ detail: 'Solo borradores se pueden eliminar.' }, { status: 409 });
    }
    mockPosts.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
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
        by_status: { BORRADOR: 1, PUBLICADO: 1, ARCHIVADO: 0 },
        views: 42,
      },
      top_tags: [{ tag: 'fastapi', count: 1 }],
      posts_per_month: [{ month: '2026-11', created: 2, published: 1 }],
      top_posts: [
        {
          post_id: '019a-post-01',
          slug: 'arquitectura-cms-headless',
          title: 'Arquitectura CMS Headless',
          views: 42,
        },
      ],
    });
  }),
];
