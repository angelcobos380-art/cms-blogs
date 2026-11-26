import { tokensToCssVars } from '../../lib/tokensToCssVars';
import type { TemplateTokens } from '../../types/template.types';

interface TemplateLivePreviewProps {
  name: string;
  tokens: TemplateTokens;
}

export function TemplateLivePreview({ name, tokens }: TemplateLivePreviewProps) {
  const isCentered = tokens.layout.headerStyle === 'editorial-centered';

  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className="px-4 py-2.5 border-b bg-[var(--card)] flex items-center justify-between text-xs">
        <span className="font-semibold">Vista previa en vivo</span>
        <span className="text-[var(--fg-muted)]">Mismos CSS tokens que el editor y Astro</span>
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
        <div className="mx-auto space-y-5" style={{ maxWidth: 'var(--cms-max-width)' }}>
          <header
            className="pb-5 border-b space-y-2"
            style={{
              borderColor: 'var(--cms-border)',
              textAlign: isCentered ? 'center' : 'left',
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: 'var(--cms-accent)' }}
            >
              #ejemplo · #{name.toLowerCase().replace(/\s+/g, '-') || 'plantilla'}
            </span>
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--cms-heading-font)' }}
            >
              Así se verá tu próximo artículo
            </h1>
            <p className="text-sm" style={{ color: 'var(--cms-text-muted)' }}>
              Plantilla aplicada: {name || 'Nueva plantilla'}
            </p>
          </header>

          <p style={{ color: 'var(--cms-text-muted)' }}>
            Los design tokens controlan tipografía, colores,{' '}
            <a href="#preview-link" style={{ color: 'var(--cms-link)', textDecoration: 'underline' }}>
              enlaces
            </a>{' '}
            y bloques sin mezclar CSS libre.
          </p>

          <div
            className="rounded-xl border-l-4 px-4 py-3 text-sm"
            style={{
              backgroundColor: 'var(--cms-callout-tip-bg)',
              borderLeftColor: 'var(--cms-callout-tip-border)',
            }}
          >
            <strong className="block text-xs uppercase mb-1">[!TIP]</strong>
            <span>Los callouts adaptan su paleta automáticamente.</span>
          </div>

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

          <pre
            className="p-4 text-xs overflow-x-auto text-slate-100"
            style={{
              backgroundColor: 'var(--cms-code-bg)',
              borderRadius: 'var(--cms-code-radius)',
              fontFamily: 'var(--cms-code-font)',
            }}
          >
            <code>{`export const maxWidth = ${tokens.layout.maxWidth};`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
