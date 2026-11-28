# Guía de Despliegue — CMS Admin (`cms-blogs`)

Esta guía describe paso a paso cómo llevar a producción el ecosistema completo del **CMS Headless**:

1. **Backend API (FastAPI)** en **Render** (usando `render.yaml` del repositorio del blog).
2. **Panel de Administración (`cms-blogs`)** en **Vercel** o **Netlify**.
3. **Conexión final** (CORS, almacenamiento de imágenes con Cloudinary y webhook de rebuild para el sitio público).

---

## 1. Arquitectura en producción

```text
[ Navegador ]
     │
     ├──► Panel CMS (Vercel / Netlify)  ──► VITE_API_URL ──► [ FastAPI Backend (Render) ]
     │                                                                 │
     └──► Sitio Público (Astro)  ◄── REBUILD_WEBHOOK_URL ──────────────┤
                                                                       ├──► PostgreSQL
                                                                       └──► Cloudinary (media)
```

---

## 2. Preparar las ramas en GitHub (`cms-blogs`)

Antes de conectar el repositorio a Vercel o Netlify:

1. Haz merge del **PR #4** (`feat/cms-ux-polish` → `develop`) en GitHub.
2. Abre y aprueba el PR de `develop` → `main` para tener la versión lista en producción.
3. *(Opcional)* Crea el tag final de lanzamiento sobre `main`:
   ```bash
   git checkout main
   git pull origin main
   git tag -a v1.0.0 -m "Release v1.0.0: CMS Headless"
   git push origin v1.0.0
   ```

---

## 3. Desplegar el Backend FastAPI (Render)

El repositorio del blog ya incluye el archivo `render.yaml` apuntando a `backend/` con Docker y healthcheck en `/health`.

1. Crea una base de datos **PostgreSQL** (en Render, Neon o Supabase) y copia su `DATABASE_URL`.
2. Crea una cuenta gratuita en **Cloudinary** y obtén:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. En **Render**, selecciona **New + → Blueprint** (o **Web Service**) conectado al repositorio del backend.
4. Configura las variables de entorno en Render:

| Variable | Valor | Notas |
|---|---|---|
| `SECRET_KEY` | *(Generada automáticamente o aleatoria)* | Ej.: `python -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `ADMIN_EMAIL` | `tu-correo@ejemplo.com` | Usuario administrador inicial |
| `ADMIN_PASSWORD` | `TuPasswordSegura!` | Contraseña del administrador |
| `DATABASE_URL` | `postgresql://...` | URL de conexión a PostgreSQL |
| `CORS_ORIGINS` | `https://tu-cms.vercel.app` | Se actualiza en el **Paso 5** con las URLs reales |
| `REBUILD_WEBHOOK_URL` | `https://api.vercel.com/v1/integrations/deploy/...` | Deploy Hook de tu sitio Astro (opcional al inicio) |
| `STORAGE_BACKEND` | `cloudinary` | Recomendado en producción (Render no persiste disco local) |
| `CLOUDINARY_CLOUD_NAME` | `<tu-cloud-name>` | Requerido si `STORAGE_BACKEND=cloudinary` |
| `CLOUDINARY_API_KEY` | `<tu-api-key>` | Requerido si `STORAGE_BACKEND=cloudinary` |
| `CLOUDINARY_API_SECRET` | `<tu-api-secret>` | Requerido si `STORAGE_BACKEND=cloudinary` |

5. Espera a que termine el build y verifica que `https://<tu-backend>.onrender.com/health` responda `200 OK`.

---

## 4. Desplegar el Panel CMS (`cms-blogs`)

El repositorio ya incluye configuración lista para enrutamiento SPA en ambas plataformas:
- **Vercel:** [`vercel.json`](./vercel.json) (`rewrites` hacia `/index.html`).
- **Netlify:** [`public/_redirects`](./public/_redirects) (`/* /index.html 200`).

### Opción A: Vercel (recomendada)

1. Entra a [vercel.com](https://vercel.com) → **Add New Project** e importa `angelcobos380-art/cms-blogs`.
2. Verifica la configuración del build:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Production Branch:** `main` (o `develop` si deseas desplegar desde ahí)
3. En **Environment Variables**, agrega:

| Variable | Valor | Obligatoria |
|---|---|---|
| `VITE_API_URL` | `https://<tu-backend>.onrender.com/api/v1` | Sí |
| `VITE_ENABLE_MOCKS` | `false` | Sí |
| `VITE_APP_NAME` | `CMS Admin` | Opcional |
| `VITE_AUTOSAVE_DELAY_MS` | `2000` | Opcional |

4. Haz clic en **Deploy**.

> [!IMPORTANT]
> Vite inyecta las variables `VITE_*` **en tiempo de compilación**. Si cambias `VITE_API_URL` más adelante en Vercel o Netlify, debes lanzar un **Redeploy** para que tome efecto.

### Opción B: Netlify

1. Entra a [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project** y elige `angelcobos380-art/cms-blogs`.
2. Configura:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Agrega las mismas variables de entorno (`VITE_API_URL` y `VITE_ENABLE_MOCKS=false`) en **Site configuration → Environment variables**.
4. Haz clic en **Deploy site**.

---

## 5. Conectar CORS y Webhook de Rebuild

Una vez que tengas la URL pública del CMS (por ejemplo `https://cms-blogs.vercel.app`):

1. Regresa al panel de **Render** (tu servicio `cms-api`) → **Environment**.
2. Actualiza `CORS_ORIGINS` con la URL exacta de tu CMS y la de tu sitio público Astro, separadas por coma y **sin `/` al final**:
   ```text
   https://cms-blogs.vercel.app,https://tu-blog.vercel.app
   ```
3. *(Opcional)* Si deseas que al publicar, actualizar o archivar un artículo el sitio público se reconstruya solo:
   - Crea un **Deploy Hook** en Vercel/Netlify dentro del proyecto de tu sitio Astro.
   - Pega esa URL en `REBUILD_WEBHOOK_URL` en Render.
4. Guarda los cambios en Render para que el backend reinicie con la nueva configuración.

---

## 6. Verificación post-despliegue

Antes de dar por terminado el despliegue, valida este checklist en producción:

- [ ] **Healthcheck:** `https://<tu-backend>.onrender.com/health` responde correctamente.
- [ ] **Login:** Puedes iniciar sesión en `https://<tu-cms>/login` con `ADMIN_EMAIL` y `ADMIN_PASSWORD` sin errores de CORS en la consola del navegador.
- [ ] **Dashboard:** Las métricas y gráficas cargan datos reales del backend.
- [ ] **Borradores y autoguardado:** Al editar un artículo en `BORRADOR`, los cambios se guardan automáticamente tras la pausa configurada.
- [ ] **Subida de imágenes:** Al subir una portada o imagen en el editor, se almacena en **Cloudinary** y se renderiza correctamente.
- [ ] **Plantillas:** Puedes editar y guardar *design tokens* en `/templates`.
- [ ] **Publicación y webhook:** Al publicar un post, cambia a `PUBLICADO` y dispara el `REBUILD_WEBHOOK_URL` (si fue configurado).

---

## Comandos útiles de verificación local previa al deploy

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```
