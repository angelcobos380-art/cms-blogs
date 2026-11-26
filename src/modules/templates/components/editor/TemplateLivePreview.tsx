import { cn } from '@shared/lib/cn';
import { tokensToCssVars } from '../../lib/tokensToCssVars';
import type { TemplateTokens } from '../../types/template.types';
import type { TokenSection } from './TokensForm';

interface TemplateLivePreviewProps {
  name: string;
  tokens: TemplateTokens;
  activeSection: TokenSection;
  onSelectSection: (section: TokenSection) => void;
}

export function TemplateLivePreview({
  name,
  tokens,
  activeSection,
  onSelectSection,
}: TemplateLivePreviewProps) {
  const isCentered = tokens.layout.headerStyle === 'editorial-centered';

  const interactiveWrap = (section: TokenSection) =>
    cn(
      'relative rounded-xl p-4 transition cursor-pointer',
      activeSection === section
        ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--cms-bg)]'
        : 'hover:ring-1 hover:ring-[var(--accent)]/40',
    );

  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="px-4 py-2.5 border-b bg-[var(--card)] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              { id: 'colors', label: '1. Colores' },
              { id: 'typography', label: '2. Tipografía' },
              { id: 'layout', label: '3. Layout' },
              { id: 'blocks', label: '4. Bloques' },
            ] as Array<{ id: TokenSection; label: string }>
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSection(s.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[11px] font-medium transition cursor-pointer',
                activeSection === s.id
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/40'
                  : 'text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)]',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <span className="text-[var(--fg-muted)]">Haz clic en cualquier bloque para editarlo</span>
      </div>

      <div
        style={{
          ...tokensToCssVars(tokens),
          backgroundColor: 'var(--cms-bg)',
          color: 'var(--cms-text)',
          fontFamily: 'var(--cms-body-font)',
          fontSize: 'var(--cms-base-size)',
          lineHeight: 'var(--cms-line-height)',
        }}
        className="p-6 md:p-10 transition-colors"
      >
        <div className="mx-auto space-y-6" style={{ maxWidth: 'var(--cms-max-width)' }}>
          <header
            onClick={() => onSelectSection('typography')}
            className={cn(interactiveWrap('typography'), 'pb-5 border-b space-y-2.5')}
            style={{
              borderColor: 'var(--cms-border)',
              textAlign: isCentered ? 'center' : 'left',
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--cms-accent)' }}
            >
              #arquitectura · #{name.toLowerCase().replace(/\s+/g, '-') || 'plantilla'}
            </span>
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--cms-heading-font)' }}
            >
              Cómo diseñar un CMS Headless escalable
            </h1>
            <p className="text-xs" style={{ color: 'var(--cms-text-muted)' }}>
              Plantilla: {name || 'Nueva plantilla'} · 4 min de lectura
            </p>
          </header>

          <p
            onClick={() => onSelectSection('colors')}
            className={interactiveWrap('colors')}
            style={{ color: 'var(--cms-text-muted)' }}
          >
            Los design tokens controlan tipografía, colores,{' '}
            <a href="#preview-link" style={{ color: 'var(--cms-link)', textDecoration: 'underline' }}>
              enlaces
            </a>{' '}
            y espaciado sin mezclar CSS libre. Así se verá cualquier post publicado.
          </p>

          <div
            onClick={() => onSelectSection('blocks')}
            className={cn(interactiveWrap('blocks'), 'space-y-5')}
          >
            {/* Callout */}
            <div
              className="rounded-xl border-l-4 px-4 py-3 text-sm"
              style={{
                backgroundColor: 'var(--cms-callout-tip-bg)',
                borderLeftColor: 'var(--cms-callout-tip-border)',
              }}
            >
              <strong className="block text-xs uppercase mb-1">[!TIP] Bloque destacado</strong>
              <span>Los callouts y avisos adaptan su paleta automáticamente a cada plantilla.</span>
            </div>

            {/* Cita */}
            <blockquote
              className="border-l-4 pl-4 py-1"
              style={{
                borderLeftColor: 'var(--cms-quote-border)',
                fontStyle: 'var(--cms-quote-style)',
                color: 'var(--cms-text-muted)',
              }}
            >
              La presentación cambia en un clic; el contenido JSON permanece intacto.
            </blockquote>

            {/* Bloque de código estilo macOS */}
            <div
              className="overflow-hidden border"
              style={{
                backgroundColor: 'var(--cms-code-bg)',
                borderColor: 'var(--cms-border)',
                borderRadius: 'var(--cms-code-radius)',
              }}
            >
              {tokens.blocks.code.showLanguageBadge && (
                <div className="px-3.5 py-2 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    typescript
                  </span>
                </div>
              )}
              <pre
                className="p-4 text-xs overflow-x-auto text-slate-100 m-0"
                style={{ fontFamily: 'var(--cms-code-font)' }}
              >
                <code>{`export const theme = {\n  maxWidth: ${tokens.layout.maxWidth},\n  accent: '${tokens.colors.accent}',\n};`}</code>
              </pre>
            </div>
          </div>

          <figure
            onClick={() => onSelectSection('layout')}
            className={cn(interactiveWrap('layout'), 'space-y-2')}
          >
            <div
              className="h-28 w-full border flex items-center justify-center text-xs"
              style={{
                backgroundColor: 'var(--cms-surface)',
                borderColor: 'var(--cms-border)',
                borderRadius: 'var(--cms-image-radius)',
                color: 'var(--cms-text-muted)',
              }}
            >
              Imagen de ejemplo (ancho: {tokens.layout.maxWidth}px · radio: {tokens.layout.imageRadius}px)
            </div>
            <figcaption className="text-center text-xs" style={{ color: 'var(--cms-text-muted)' }}>
              Pie de foto centrado de ejemplo
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
