import { Link } from 'react-router-dom';
import { Archive, ArrowRight, Copy, Lightbulb, RotateCcw, Star, Trash2 } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { StatusBadge } from '@shared/components/StatusBadge';
import { Button } from '@shared/components/ui/button';
import type { Template } from '../types/template.types';

interface TemplateCardProps {
  template: Template;
  onDuplicate: (id: string) => void;
  onSetDefault: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (template: Template) => void;
}

export function TemplateCard({
  template,
  onDuplicate,
  onSetDefault,
  onArchive,
  onRestore,
  onDelete,
}: TemplateCardProps) {
  const { colors, layout, blocks } = template.tokens;
  const isCentered = layout.headerStyle === 'editorial-centered';

  return (
    <article className="rounded-2xl border bg-[var(--card)] p-4 flex flex-col justify-between gap-4 shadow-xs hover:border-[var(--accent)]/50 transition">
      <div className="space-y-3">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: colors.accent }}
            />
            <h3 className="text-sm font-semibold truncate">{template.name}</h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {template.is_default && <StatusBadge label="Default" tone="info" />}
            <StatusBadge
              label={template.status === 'ACTIVA' ? 'Activa' : 'Archivada'}
              tone={template.status === 'ACTIVA' ? 'success' : 'neutral'}
            />
          </div>
        </div>

        {/* Mini Article Wireframe Preview (estilo cms-view) */}
        <div
          className="rounded-xl border p-3 space-y-2.5 overflow-hidden"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          <div className={isCentered ? 'text-center space-y-1' : 'space-y-1'}>
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold"
              style={{ backgroundColor: `${colors.accent}22`, color: colors.accent }}
            >
              {layout.headerStyle}
            </span>
            <p
              className="text-xs font-bold truncate"
              style={{ fontFamily: template.tokens.typography.headingFont }}
            >
              {template.name}
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-semibold">Arquitectura de bloques</div>
            <div className="h-1 w-full rounded-full" style={{ backgroundColor: colors.accent, opacity: 0.6 }} />
            <div className="h-1.5 w-4/5 rounded-full" style={{ backgroundColor: colors.border }} />
          </div>

          {/* Mini Callout */}
          <div
            className="rounded-md border-l-2 px-2 py-1.5 flex items-center gap-1.5"
            style={{
              backgroundColor: blocks.callout.tip.bg,
              borderLeftColor: blocks.callout.tip.border,
            }}
          >
            <Lightbulb className="h-2.5 w-2.5 shrink-0" style={{ color: blocks.callout.tip.border }} />
            <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: blocks.callout.tip.border, opacity: 0.45 }} />
          </div>

          {/* Mini Code Window */}
          <div
            className="p-2 space-y-1.5"
            style={{
              backgroundColor: colors.codeBg,
              borderRadius: Math.min(8, blocks.code.radius),
            }}
          >
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <div className="h-1 w-3/4 rounded-full bg-slate-500/70" />
            <div className="h-1 w-1/2 rounded-full" style={{ backgroundColor: colors.accent, opacity: 0.85 }} />
          </div>
        </div>

        <p className="text-xs text-[var(--fg-muted)] line-clamp-2 min-h-[2rem]">
          {template.description || 'Plantilla personalizada con design tokens JSON.'}
        </p>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-2 pt-2 border-t">
        <Link to={ROUTES.templateEditor(template.template_id)} className="flex-1">
          <Button className="w-full" size="sm">
            <span>Editar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>

        <Button
          variant="outline"
          size="sm"
          title="Duplicar"
          aria-label="Duplicar plantilla"
          onClick={() => onDuplicate(template.template_id)}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>

        {template.status === 'ACTIVA' && !template.is_default && (
          <Button
            variant="outline"
            size="sm"
            title="Hacer predeterminada"
            aria-label="Hacer predeterminada"
            onClick={() => onSetDefault(template.template_id)}
          >
            <Star className="h-3.5 w-3.5" />
          </Button>
        )}

        {template.status === 'ACTIVA' ? (
          <Button
            variant="outline"
            size="sm"
            title="Archivar"
            aria-label="Archivar plantilla"
            onClick={() => onArchive(template.template_id)}
          >
            <Archive className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            title="Restaurar"
            aria-label="Restaurar plantilla"
            onClick={() => onRestore(template.template_id)}
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          title="Eliminar"
          aria-label="Eliminar plantilla"
          onClick={() => onDelete(template)}
        >
          <Trash2 className="h-3.5 w-3.5 text-[var(--danger)]" />
        </Button>
      </div>
    </article>
  );
}
