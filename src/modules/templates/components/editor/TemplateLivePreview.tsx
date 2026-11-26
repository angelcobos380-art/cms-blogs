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
        <span className="text-[var(--fg-muted)]">
          Cuerpo de artículo de ejemplo · {tokens.layout.maxWidth}px
        </span>
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
            className="pb-5 border-b space-y-2.5"
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

          <p style={{ color: 'var(--cms-text-muted)' }}>
            Los design tokens controlan tipografía, colores,{' '}
            <a href="#preview-link" style={{ color: 'var(--cms-link)', textDecoration: 'underline' }}>
              enlaces
            </a>{' '}
            y espaciado sin mezclar CSS libre. Así se verá cualquier post publicado.
          </p>

          <h2
            className="text-xl font-bold pt-2"
            style={{ fontFamily: 'var(--cms-heading-font)' }}
          >
            1. Separación de contenido y diseño
          </h2>

          <ul className="list-disc pl-6 space-y-1 text-sm" style={{ color: 'var(--cms-text-muted)' }}>
            <li>Fuente de verdad estructurada en JSON.</li>
            <li>Renderizado consistente en editor y sitio público.</li>
          </ul>

          {/* Bloque de aviso / Callout */}
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

          {/* Bloque de código con badge de lenguaje */}
          <div
            className="overflow-hidden border"
            style={{
              backgroundColor: 'var(--cms-code-bg)',
              borderColor: 'var(--cms-border)',
              borderRadius: 'var(--cms-code-radius)',
            }}
          >
            {tokens.blocks.code.showLanguageBadge && (
              <div className="px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10">
                typescript
              </div>
            )}
            <pre
              className="p-4 text-xs overflow-x-auto text-slate-100 m-0"
              style={{ fontFamily: 'var(--cms-code-font)' }}
            >
              <code>{`export const theme = {\n  maxWidth: ${tokens.layout.maxWidth},\n  accent: '${tokens.colors.accent}',\n};`}</code>
            </pre>
          </div>

          {/* Imagen de ejemplo con radio configurado */}
          <figure className="space-y-1.5">
            <div
              className="h-28 w-full border flex items-center justify-center text-xs"
              style={{
                backgroundColor: 'var(--cms-surface)',
                borderColor: 'var(--cms-border)',
                borderRadius: 'var(--cms-image-radius)',
                color: 'var(--cms-text-muted)',
              }}
            >
              Imagen de ejemplo (radio: {tokens.layout.imageRadius}px)
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
