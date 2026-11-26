import { useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ImagePlus,
  Trash2,
  X,
} from 'lucide-react';
import { normalizeApiError } from '@core/api/errors';
import { toast } from '@shared/components/Toaster';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { cn } from '@shared/lib/cn';
import { slugify } from '@shared/lib/slug';
import type { Template } from '@templates';
import { mediaApi } from '../../api/mediaApi';
import type { SeoMeta } from '../../types/post.types';
import { useEditorStore } from '../editor.store';
import type { CalloutVariant } from '../extensions/Callout';

type InspectorTab = 'style' | 'details' | 'seo';

const COLOR_SWATCHES = ['#111827', '#4f46e5', '#0ea5e9', '#16a34a', '#d97706', '#dc2626'];

interface InspectorPanelProps {
  editor: Editor | null;
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
  editor,
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
  const [tab, setTab] = useState<InspectorTab>('style');
  const [tagInput, setTagInput] = useState('');
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
  const selectedTemplate =
    templates.find((t) => t.template_id === templateId) ??
    templates.find((t) => t.is_default) ??
    null;

  const activeColor = (editor?.getAttributes('textStyle').color as string | undefined) ?? '#111827';
  const inCallout = editor?.isActive('callout') ?? false;
  const calloutVariant = (editor?.getAttributes('callout').variant as CalloutVariant) ?? 'info';

  return (
    <aside className="w-full lg:w-80 shrink-0 rounded-2xl border bg-[var(--card)] p-4 space-y-4 text-xs">
      {/* Header + Stats */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Inspector</span>
        <span className="text-[var(--fg-muted)]">
          {wordCount} pal · {readMinutes} min
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 rounded-xl border bg-[var(--bg-subtle)] p-1 gap-1">
        {(
          [
            { id: 'style', label: 'Estilo' },
            { id: 'details', label: 'Detalles' },
            { id: 'seo', label: 'SEO' },
          ] as Array<{ id: InspectorTab; label: string }>
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'rounded-lg py-1.5 text-xs font-medium transition cursor-pointer',
              tab === item.id
                ? 'bg-[var(--card)] text-[var(--fg)] shadow-xs'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg)]',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TAB 1: ESTILO (color de texto, alineación, bloque y plantilla) */}
      {tab === 'style' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-medium text-[var(--fg-muted)]">Color de texto</p>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_SWATCHES.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  disabled={readOnly || !editor}
                  title={`Color ${hex}`}
                  onClick={() => editor?.chain().focus().setColor(hex).run()}
                  className={cn(
                    'h-6 w-6 rounded-full border cursor-pointer transition hover:scale-110 disabled:opacity-40',
                    activeColor.toLowerCase() === hex ? 'ring-2 ring-[var(--accent)] ring-offset-1' : '',
                  )}
                  style={{ backgroundColor: hex }}
                />
              ))}
              <input
                type="color"
                aria-label="Selector de color personalizado"
                disabled={readOnly || !editor}
                value={activeColor}
                onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                className="h-6 w-7 rounded border bg-transparent cursor-pointer"
              />
              <button
                type="button"
                disabled={readOnly || !editor}
                onClick={() => editor?.chain().focus().unsetColor().run()}
                className="px-2 py-1 rounded-md border bg-[var(--bg-subtle)] hover:opacity-80 cursor-pointer"
              >
                Auto
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t">
            <p className="font-medium text-[var(--fg-muted)]">Alineación de sección</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { align: 'left', label: 'Izquierda', icon: AlignLeft },
                  { align: 'center', label: 'Centro', icon: AlignCenter },
                  { align: 'right', label: 'Derecha', icon: AlignRight },
                ] as const
              ).map(({ align, label, icon: Icon }) => (
                <Button
                  key={align}
                  variant={editor?.isActive({ textAlign: align }) ? 'primary' : 'outline'}
                  size="sm"
                  disabled={readOnly || !editor}
                  onClick={() => editor?.chain().focus().setTextAlign(align).run()}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </Button>
              ))}
            </div>
          </div>

          {inCallout && (
            <div className="space-y-1.5 pt-3 border-t">
              <label htmlFor="inspector-callout" className="font-medium text-[var(--fg-muted)] block">
                Variante del Callout activo
              </label>
              <select
                id="inspector-callout"
                disabled={readOnly}
                value={calloutVariant}
                onChange={(e) =>
                  editor?.chain().focus().setCalloutVariant(e.target.value as CalloutVariant).run()
                }
                className="h-9 w-full rounded-lg border bg-[var(--bg)] px-2.5 text-xs text-[var(--fg)]"
              >
                <option value="info">Info (azul)</option>
                <option value="tip">Tip (verde)</option>
                <option value="warning">Warning (ámbar)</option>
                <option value="danger">Danger (rojo)</option>
              </select>
            </div>
          )}

          <div className="space-y-2 pt-3 border-t">
            <label htmlFor="inspector-tpl" className="font-medium text-[var(--fg-muted)] block">
              Plantilla del artículo
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

            {selectedTemplate && (
              <div className="rounded-lg border bg-[var(--bg-subtle)] p-2.5 flex items-center justify-between">
                <span className="truncate font-medium">{selectedTemplate.name}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {[
                    selectedTemplate.tokens.colors.background,
                    selectedTemplate.tokens.colors.accent,
                    selectedTemplate.tokens.colors.text,
                  ].map((c, idx) => (
                    <span
                      key={`${c}-${idx}`}
                      className="h-3.5 w-3.5 rounded-full border"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DETALLES (Tags, Extracto, Portada, Esquema) */}
      {tab === 'details' && (
        <div className="space-y-4">
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
              placeholder="Resumen breve para tarjetas y listados…"
              className="w-full rounded-lg border bg-[var(--bg)] p-2.5 text-xs text-[var(--fg)]"
            />
          </div>

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
                  <span>{uploadingCover ? 'Subiendo…' : 'Subir portada'}</span>
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
        </div>
      )}

      {/* TAB 3: SEO (Slug discreto + meta tags) */}
      {tab === 'seo' && (
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="inspector-slug" className="font-medium text-[var(--fg-muted)]">
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
            <label htmlFor="seo-title" className="font-medium text-[var(--fg-muted)] block">
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
            <label htmlFor="seo-desc" className="font-medium text-[var(--fg-muted)] block">
              SEO Description
            </label>
            <textarea
              id="seo-desc"
              rows={3}
              disabled={readOnly}
              value={seo.description ?? ''}
              onChange={(e) => onChange({ seo: { ...seo, description: e.target.value || null } })}
              placeholder="Meta descripción…"
              className="w-full rounded-lg border bg-[var(--bg)] p-2 text-xs text-[var(--fg)]"
            />
          </div>
        </div>
      )}
    </aside>
  );
}
