# CMS Admin (`v1.0.0`)

Panel de administración headless en **React 19 + TypeScript + Vite**, desacoplado del backend FastAPI. Pensado como un CMS reutilizable para cualquier sitio o blog consumidor (Astro, Next.js, etc.).

## Módulos principales

- **Dashboard (`/dashboard`):**
  - KPIs consolidados (*Vistas del periodo con tendencia*, *Tasa de publicación*, *Borradores pendientes* y *Promedio por artículo*).
  - Gráfica de visitas en el tiempo (Recharts) filtrable por rango (`7d`, `30d`, `12m`), granularidad (`Día`, `Semana`) y **por artículo específico**.
  - Salud del contenido (donut por estado), cadencia editorial (*Creados vs. Publicados*), tags principales, recientes y tabla de ranking.
- **Blogs (`/blogs` y `/blogs/:postId`):**
  - Listado paginado con filtros por estado (`BORRADOR`, `PUBLICADO`, `ARCHIVADO`), tag y búsqueda.
  - Flujo de 3 estados (`BORRADOR` ↔ `PUBLICADO` ↔ `ARCHIVADO` reversible) con checklist previa a publicar.
  - Editor WYSIWYG (Tiptap) sobre `TemplateScope` con énfasis en sección activa (`ActiveBlock`), bloques avanzados (Callouts `info/tip/warning/danger`, código, citas, imágenes con pie de foto) y `ReaderPreview` (escritorio y móvil).
  - Autoguardado debounced en `BORRADOR` y respaldo local + guardado explícito (**Actualizar publicación**) en `PUBLICADO`.
  - Inspector lateral con 4 pestañas: **Estilo** (color, alineación, callout, plantilla), **Detalles** (tags, extracto, portada), **SEO** (slug + vista previa en Google) e **Índice** (métricas de lectura y salto a encabezados).
- **Plantillas (`/templates`, `/templates/new` y `/templates/:templateId`):**
  - Galería con mini vista previa de bloques, búsqueda, filtro por estado y acciones (duplicar, archivar, restaurar, predeterminada y eliminar).
  - Editor interactivo por secciones (**Colores**, **Tipografía**, **Layout**, **Bloques**) con vista previa clicable en vivo y 3 estilos base predefinidos.

## Desarrollo local

### 1. Modo conectado al backend FastAPI
```bash
cp .env.example .env
# Verifica VITE_API_URL=http://localhost:8000/api/v1 y VITE_ENABLE_MOCKS=false
npm install
npm run dev
```

### 2. Modo aislado (con mocks MSW)
```bash
cp .env.example .env
# Cambia VITE_ENABLE_MOCKS=true en .env
npx msw init public/ --save
npm run dev
```
Credenciales mock: `admin@example.com` / `Admin123!`.

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base del backend (`/api/v1`) | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | Nombre visible en el panel | `CMS Admin` |
| `VITE_AUTOSAVE_DELAY_MS` | Debounce de autoguardado (ms) | `2000` |
| `VITE_ENABLE_MOCKS` | Habilita MSW en desarrollo (`true`/`false`) | `false` |

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — `tsc -b && vite build`
- `npm run typecheck` — verificación de tipos
- `npm run lint` — ESLint (incluye reglas de fronteras entre módulos)
- `npm run test` — Vitest + Testing Library + MSW

## Despliegue (Vercel / Netlify)

1. Importa este repositorio en **Vercel** o **Netlify** (incluye `vercel.json` y `public/_redirects` para enrutamiento SPA).
2. Configura las variables de entorno de producción:
   - `VITE_API_URL=https://<tu-backend>.onrender.com/api/v1`
   - `VITE_ENABLE_MOCKS=false`
3. En el backend FastAPI, agrega el dominio desplegado de este panel en `CORS_ORIGINS` (ej. `https://cms-blogs.vercel.app,https://tu-portafolio.vercel.app`).
