import { useRef, useState } from 'react';
import { ChevronDown, ChevronRight, ImagePlus, Trash2, X } from 'lucide-react';
import { normalizeApiError } from '@core/api/errors';
import { toast } from '@shared/components/Toaster';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { slugify } from '@shared/lib/slug';
import type { Template } from '@templates';
import { mediaApi } from '../../api/mediaApi';
import type { SeoMeta } from '../../types/post.types';
import { useEditorStore } from '../editor.store';

interface InspectorPanelProps {
  slug: string;
  publishedAt: string | null;
  tags: string[];
  excerpt: string;
  coverImageUrl: string;
  templateId: string | null;
  seo: SeoMeta;
  templates: Template[];
  readOnly?: boolean;
  onChange: (patch: {
    slug?: string;
    tags?: string[];
    excerpt?: string | null;
    cover_image_url?: string | null;
    template_id?: string | null;
    seo?: SeoMeta | null;
  }) => void;
}

export function InspectorPanel({
  slug,
  publishedAt,
  tags,
  excerpt,
  coverImageUrl,
  templateId,
  seo,
  templates,
  readOnly = false,
  onChange,
}: InspectorPanelProps) {
  const wordCount = useEditorStore((s) => s.wordCount);
  const outline = useEditorStore((s) => s.outline);
  const [tagInput, setTagInput] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const clean = slugify(tagInput);
    if (!clean) return;
    if (tags.length >= 10) {
      toast.warning('Máximo 10 tags por publicación');
      return;
    }
    if (!tags.includes(clean)) {
      onChange({ tags: [...tags, clean] });
    }
    setTagInput('');
  };

  const handleCoverUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadingCover(true);
    try {
      const uploaded = await mediaApi.upload(file);
      onChange({ cover_image_url: uploaded.url });
      toast.success('Portada actualizada');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setUploadingCover(false);
      if (coverRef.current) coverRef.current.value = '';
    }
  };

  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <aside className="w-full lg:w-80 shrink-0 rounded-2xl border bg-[var(--card)] p-4 space-y-5 text-xs">
      <div className="flex items-center justify-between pb-2 border-b">
        <h2 className="text-sm font-semibold">Detalles del artículo</h2>
        <span className="text-[var(--fg-muted)]">
          {wordCount} pal · {readMinutes} min
        </span>
      </div>

      {/* Plantilla */}
      <div className="space-y-1.5">
        <label htmlFor="inspector-tpl" className="font-medium text-[var(--fg-muted)] block">
          Plantilla visual
        </label>
        <select
          id="inspector-tpl"
          disabled={readOnly}
          value={templateId ?? ''}
          onChange={(e) => onChange({ template_id: e.target.value || null })}
          className="h-9 w-full rounded-lg border bg-[var(--bg)] px-2.5 text-xs text-[var(--fg)]"
        >
          <option value="">Predeterminada del sitio</option>
          {templates.map((t) => (
            <option key={t.template_id} value={t.template_id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <label className="font-medium text-[var(--fg-muted)] block">Tags (máx. 10)</label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border bg-[var(--bg-subtle)] px-2.5 py-0.5"
              >
                #{tag}
                {!readOnly && (
                  <button
                    type="button"
                    aria-label={`Quitar tag ${tag}`}
                    onClick={() => onChange({ tags: tags.filter((t) => t !== tag) })}
                    className="text-[var(--fg-muted)] hover:text-[var(--danger)] cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
        {!readOnly && (
          <div className="flex gap-1.5">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Agregar tag…"
              className="h-8 text-xs"
            />
            <Button variant="outline" size="sm" onClick={addTag}>
              +
            </Button>
          </div>
        )}
      </div>

      {/* Extracto */}
      <div className="space-y-1.5">
        <label htmlFor="inspector-excerpt" className="font-medium text-[var(--fg-muted)] block">
          Extracto
        </label>
        <textarea
          id="inspector-excerpt"
          rows={3}
          maxLength={300}
          disabled={readOnly}
          value={excerpt}
          onChange={(e) => onChange({ excerpt: e.target.value || null })}
          placeholder="Resumen breve para listados y tarjetas…"
          className="w-full rounded-lg border bg-[var(--bg)] p-2.5 text-xs text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        />
      </div>

      {/* Portada */}
      <div className="space-y-1.5">
        <span className="font-medium text-[var(--fg-muted)] block">Imagen de portada</span>
        {coverImageUrl ? (
          <div className="relative rounded-lg overflow-hidden border">
            <img src={coverImageUrl} alt="Portada" className="w-full h-28 object-cover" />
            {!readOnly && (
              <button
                type="button"
                aria-label="Quitar portada"
                onClick={() => onChange({ cover_image_url: null })}
                className="absolute top-1.5 right-1.5 rounded-md bg-black/70 p-1 text-white hover:bg-black cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ) : (
          !readOnly && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={uploadingCover}
              onClick={() => coverRef.current?.click()}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              <span>{uploadingCover ? 'Subiendo…' : 'Subir imagen de portada'}</span>
            </Button>
          )
        )}
        <input
          ref={coverRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleCoverUpload(e.target.files?.[0])}
        />
      </div>

      {/* Esquema */}
      <div className="space-y-1.5 pt-2 border-t">
        <span className="font-medium text-[var(--fg-muted)] block">Esquema de títulos</span>
        {outline.length === 0 ? (
          <p className="text-[var(--fg-muted)] italic">Sin subtítulos H2 o H3 todavía.</p>
        ) : (
          <ul className="space-y-1">
            {outline.map((h, i) => (
              <li key={`${h.text}-${i}`} className="truncate" style={{ paddingLeft: h.level === 3 ? 12 : 0 }}>
                • {h.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Opciones avanzadas / SEO (slug discreto al fondo) */}
      <div className="pt-2 border-t">
        <button
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
          className="w-full flex items-center justify-between font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer"
        >
          <span>Opciones avanzadas / SEO</span>
          {advancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {advancedOpen && (
          <div className="mt-3 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="inspector-slug" className="text-[var(--fg-muted)]">
                  Slug (URL)
                </label>
                {publishedAt && <span className="text-[10px] text-[var(--fg-muted)]">Fijo tras publicar</span>}
              </div>
              <Input
                id="inspector-slug"
                value={slug}
                disabled={readOnly || Boolean(publishedAt)}
                onChange={(e) => onChange({ slug: slugify(e.target.value) })}
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="seo-title" className="text-[var(--fg-muted)] block">
                SEO Title
              </label>
              <Input
                id="seo-title"
                disabled={readOnly}
                value={seo.title ?? ''}
                onChange={(e) => onChange({ seo: { ...seo, title: e.target.value || null } })}
                placeholder="Título personalizado en buscadores"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="seo-desc" className="text-[var(--fg-muted)] block">
                SEO Description
              </label>
              <textarea
                id="seo-desc"
                rows={2}
                disabled={readOnly}
                value={seo.description ?? ''}
                onChange={(e) =>
                  onChange({ seo: { ...seo, description: e.target.value || null } })
                }
                placeholder="Meta descripción…"
                className="w-full rounded-lg border bg-[var(--bg)] p-2 text-xs text-[var(--fg)]"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
