# CMS Admin

Panel de administración headless en **React 19 + TypeScript + Vite**, desacoplado del backend FastAPI. Pensado como un CMS reutilizable para cualquier sitio o blog consumidor (Astro, Next.js, etc.).

## Módulos

- **Dashboard (`/dashboard`):** métricas de estado, visitas en el tiempo (Recharts), actividad mensual, top artículos y top tags.
- **Blogs (`/blogs` y `/blogs/:postId`):** listado paginado con filtros, flujo de 3 estados (`BORRADOR` ↔ `PUBLICADO` ↔ `ARCHIVADO`), editor WYSIWYG (Tiptap) sobre `TemplateScope`, autoguardado en borradores y guardado explícito en publicados.
- **Plantillas (`/templates`):** galería, creación desde cero y editor de design tokens JSON con vista previa en vivo.

## Desarrollo local

```bash
cp .env.example .env
npm install
npm run dev
```

Para probar la interfaz sin levantar el backend FastAPI, activa los mocks MSW en `.env`:

```bash
VITE_ENABLE_MOCKS=true
```

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

El proyecto incluye `vercel.json` y `public/_redirects` para enrutamiento SPA. Configura `VITE_API_URL` apuntando a tu instancia FastAPI y agrega el dominio de este panel en `CORS_ORIGINS` del backend.
