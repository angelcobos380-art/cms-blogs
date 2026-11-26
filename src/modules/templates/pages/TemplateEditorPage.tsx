import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { normalizeApiError } from '@core/api/errors';
import { ErrorState } from '@shared/components/ErrorState';
import { PageHeader } from '@shared/components/PageHeader';
import { toast } from '@shared/components/Toaster';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { TemplateLivePreview } from '../components/editor/TemplateLivePreview';
import { TokensForm } from '../components/editor/TokensForm';
import { useTemplate } from '../hooks/useTemplate';
import { useTemplateMutations } from '../hooks/useTemplateMutations';
import { DEFAULT_TEMPLATE_TOKENS, TEMPLATE_PRESETS, templateFormSchema } from '../schemas/template.schema';
import type { TemplateTokens } from '../types/template.types';

export function TemplateEditorPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const isNew = !templateId || templateId === 'new';

  const { data: existing, isLoading, isError, error, refetch } = useTemplate(templateId);
  const { create, update } = useTemplateMutations();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tokens, setTokens] = useState<TemplateTokens>(DEFAULT_TEMPLATE_TOKENS);
  const [formError, setFormError] = useState<string | null>(null);
  const [hydratedId, setHydratedId] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) {
      setName('');
      setDescription('');
      setTokens(DEFAULT_TEMPLATE_TOKENS);
      setHydratedId('new');
      return;
    }
    if (existing && hydratedId !== existing.template_id) {
      setName(existing.name);
      setDescription(existing.description);
      setTokens(existing.tokens);
      setHydratedId(existing.template_id);
    }
  }, [existing, hydratedId, isNew]);

  if (!isNew && isLoading) {
    return (
      <div className="p-8 text-center text-sm text-[var(--fg-muted)]">Cargando plantilla…</div>
    );
  }

  if (!isNew && isError) {
    return <ErrorState message={normalizeApiError(error).message} onRetry={() => refetch()} />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsed = templateFormSchema.safeParse({ name, description, tokens });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Revisa los campos de la plantilla.');
      return;
    }

    try {
      if (isNew) {
        const created = await create.mutateAsync(parsed.data);
        toast.success('Plantilla creada');
        navigate(ROUTES.templateEditor(created.template_id), { replace: true });
      } else {
        await update.mutateAsync({ id: templateId!, payload: parsed.data });
        toast.success('Plantilla guardada');
      }
    } catch (err) {
      setFormError(normalizeApiError(err).message);
    }
  };

  const isSaving = create.isPending || update.isPending;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <PageHeader
        title={isNew ? 'Nueva plantilla' : `Editar: ${existing?.name ?? ''}`}
        description="Define los tokens visuales JSON y previsualiza el resultado al instante."
        actions={
          <Link to={ROUTES.TEMPLATES}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a plantillas</span>
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 rounded-2xl border bg-[var(--card)] p-5 space-y-4">
          {isNew && (
            <div className="space-y-1.5 pb-3 border-b">
              <span className="text-xs font-medium text-[var(--fg-muted)] block">
                Comenzar desde un estilo base (opcional)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      if (!name.trim()) setName(preset.label);
                      if (!description.trim()) setDescription(preset.description);
                      setTokens(preset.tokens);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs hover:border-[var(--accent)] transition cursor-pointer"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border"
                      style={{ backgroundColor: preset.tokens.colors.accent }}
                    />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="tpl-name" className="text-xs font-medium text-[var(--fg-muted)]">
              Nombre de la plantilla
            </label>
            <Input
              id="tpl-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Editorial Claro"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tpl-desc" className="text-xs font-medium text-[var(--fg-muted)]">
              Descripción
            </label>
            <Input
              id="tpl-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tipografía serif, mucho aire…"
            />
          </div>

          <TokensForm tokens={tokens} onChange={setTokens} />

          {formError && (
            <p className="text-xs text-[var(--danger)]" role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isSaving}>
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Guardando…' : isNew ? 'Crear plantilla' : 'Guardar cambios'}</span>
          </Button>
        </div>

        <div className="lg:col-span-7">
          <TemplateLivePreview name={name} tokens={tokens} />
        </div>
      </form>
    </div>
  );
}
