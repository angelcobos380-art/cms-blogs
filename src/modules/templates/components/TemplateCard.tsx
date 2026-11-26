import { Link } from 'react-router-dom';
import { Archive, Copy, Edit3, RotateCcw, Star, Trash2 } from 'lucide-react';
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
  const { colors } = template.tokens;

  return (
    <article className="rounded-2xl border bg-[var(--card)] p-4 flex flex-col justify-between gap-4">
      <div className="space-y-3">
        {/* Mini visual preview */}
        <div
          className="rounded-xl border p-3.5 space-y-2"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            color: colors.text,
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="h-2 w-12 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{ backgroundColor: colors.surface, color: colors.textMuted }}
            >
              {template.tokens.layout.maxWidth}px
            </span>
          </div>
          <p className="text-sm font-semibold truncate">{template.name}</p>
          <p className="text-xs truncate" style={{ color: colors.textMuted }}>
            {template.description || 'Plantilla personalizada con design tokens'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {template.is_default && <StatusBadge label="Predeterminada" tone="info" />}
            <StatusBadge
              label={template.status === 'ACTIVA' ? 'Activa' : 'Archivada'}
              tone={template.status === 'ACTIVA' ? 'success' : 'neutral'}
            />
          </div>

          <div className="flex items-center gap-1">
            {[colors.background, colors.accent, colors.text, colors.surface].map((hex, i) => (
              <span
                key={`${hex}-${i}`}
                className="h-4 w-4 rounded-full border"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
        <Link to={ROUTES.templateEditor(template.template_id)}>
          <Button variant="outline" size="sm">
            <Edit3 className="h-3.5 w-3.5" />
            <span>Editar</span>
          </Button>
        </Link>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            title="Duplicar"
            aria-label="Duplicar plantilla"
            onClick={() => onDuplicate(template.template_id)}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>

          {template.status === 'ACTIVA' && !template.is_default && (
            <Button
              variant="ghost"
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
              variant="ghost"
              size="sm"
              title="Archivar"
              aria-label="Archivar plantilla"
              onClick={() => onArchive(template.template_id)}
            >
              <Archive className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
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
      </div>
    </article>
  );
}
