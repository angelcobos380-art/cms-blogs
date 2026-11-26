<div align="center">

# CMS Admin — Headless Blog Studio

Panel de administración headless en **React 19 + TypeScript + Vite**, diseñado para gestionar artículos, plantillas con *design tokens* JSON y métricas de audiencia de forma desacoplada.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Tiptap](https://img.shields.io/badge/Editor-Tiptap_v3-111827?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-4f46e5?style=flat-square)

</div>

---

## Características principales

### Dashboard (`/dashboard`)
- **KPIs consolidados:** vistas del periodo con tendencia (`%`), tasa de publicación, borradores pendientes y promedio de vistas por artículo.
- **Analítica por artículo y global:** gráfica de visitas en el tiempo (Recharts) filtrable por rango (`7d`, `30d`, `12m`), granularidad (`Día`, `Semana`) y **por publicación específica**.
- **Salud editorial:** distribución por estado (donut), cadencia mensual (*Creados vs. Publicados*), top tags, recientes y ranking interactivo.

### Blogs y Editor WYSIWYG (`/blogs` y `/blogs/:postId`)
- **Ciclo de 3 estados:** `BORRADOR` ↔ `PUBLICADO` ↔ `ARCHIVADO` (reversible), con checklist previa de validación al publicar.
- **Guardado inteligente:** autoguardado *debounced* en `BORRADOR`, y respaldo local + confirmación explícita (**Actualizar publicación**) en `PUBLICADO` para evitar *rebuilds* innecesarios.
- **Edición sobre la vista previa (`TemplateScope`):** énfasis en la sección activa (`ActiveBlock`), callouts (`info`, `tip`, `warning`, `danger`), código, citas, imágenes con pie de foto y `ReaderPreview` (escritorio y móvil).
- **Inspector de 4 pestañas:** **Estilo** (color de texto, alineación, callout, plantilla), **Detalles** (tags, extracto, portada), **SEO** (slug + vista previa en buscadores) e **Índice** (métricas de lectura y salto a encabezados).

### Estudio de Plantillas (`/templates`)
- **Design Tokens JSON:** nunca CSS libre; los mismos tokens estilizan el editor y cualquier sitio consumidor (Astro, Next.js, etc.).
- **Editor interactivo:** vista previa clicable a la izquierda y controles por capas (**Colores**, **Tipografía**, **Layout**, **Bloques**) a la derecha, además de 3 estilos base predefinidos.

---

## Arquitectura

```text
src/
├── app/        # Providers, React Router, ProtectedRoute, AppShell (Sidebar fijo + Topbar)
├── core/       # env (Zod), httpClient (Axios + 401), normalizeApiError, authStore
├── shared/     # UI primitivos, ErrorBoundary, Toaster, hooks y utilidades
└── modules/
    ├── dashboard/   # Métricas, gráficas Recharts y RankingTableCard
    ├── blogs/       # Listado paginado, filtros, diálogos y editor Tiptap
    └── templates/   # Galería, presets, tokensToCssVars y editor interactivo
```

---

## Desarrollo local

### Opción 1: Conectado al backend FastAPI
```bash
cp .env.example .env
# Verifica VITE_API_URL=http://localhost:8000/api/v1 y VITE_ENABLE_MOCKS=false
npm install
npm run dev
```

### Opción 2: Modo aislado con mocks MSW
```bash
cp .env.example .env
# Cambia VITE_ENABLE_MOCKS=true en .env
npx msw init public/ --save
npm run dev
```
Credenciales mock: `admin@example.com` / `Admin123!`.

---

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base del backend (`/api/v1`) | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | Nombre visible en el panel | `CMS Admin` |
| `VITE_AUTOSAVE_DELAY_MS` | Debounce de autoguardado (ms) | `2000` |
| `VITE_ENABLE_MOCKS` | Habilita MSW en desarrollo (`true`/`false`) | `false` |

---

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Inicia servidor de desarrollo (Vite) |
| `npm run build` | Compila TypeScript y genera bundle de producción |
| `npm run typecheck` | Verificación estricta de tipos (`tsc --noEmit`) |
| `npm run lint` | ESLint (incluye reglas de fronteras entre módulos) |
| `npm run test` | Pruebas unitarias e integración (Vitest + Testing Library + MSW) |

---

## Despliegue (Vercel / Netlify)

1. Importa este repositorio en **Vercel** o **Netlify** (incluye `vercel.json` y `public/_redirects` para enrutamiento SPA).
2. Configura las variables de entorno:
   - `VITE_API_URL=https://<tu-backend>.onrender.com/api/v1`
   - `VITE_ENABLE_MOCKS=false`
3. Agrega el dominio de este panel en `CORS_ORIGINS` dentro del backend FastAPI.

---

## Licencia

Distribuido bajo la licencia **MIT**. Consulta [LICENSE](./LICENSE) para más detalles.

### Stack y licencias de terceros
Construido sobre proyectos open-source con licencias permisivas (**MIT** / **Apache-2.0**): React, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, Tiptap, Recharts, Zod, Axios, DOMPurify y Lucide Icons.
