import type { ReactNode } from 'react';
import { cn } from '@shared/lib/cn';
import { tokensToCssVars, type TemplateTokens } from '@templates';

interface TemplateScopeProps {
  tokens?: TemplateTokens | null;
  children: ReactNode;
  className?: string;
}

export function TemplateScope({ tokens, children, className }: TemplateScopeProps) {
  const vars = tokensToCssVars(tokens);

  return (
    <div
      style={vars}
      className={cn(
        'rounded-2xl border transition-colors',
        'bg-[var(--cms-bg,var(--card))] text-[var(--cms-text,var(--fg))]',
        '[font-family:var(--cms-body-font,inherit)]',
        '[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[340px]',
        '[&_.ProseMirror_p]:my-3 [&_.ProseMirror_p]:leading-[var(--cms-line-height,1.75)] [&_.ProseMirror_p]:text-[var(--cms-text-muted,var(--fg-muted))]',
        '[&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-7 [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:[font-family:var(--cms-heading-font,inherit)]',
        '[&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-6 [&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:[font-family:var(--cms-heading-font,inherit)]',
        '[&_.ProseMirror_a]:text-[var(--cms-link,var(--accent))] [&_.ProseMirror_a]:underline',
        '[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-[var(--cms-quote-border,var(--accent))] [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_blockquote]:italic',
        '[&_.ProseMirror_pre]:rounded-[var(--cms-code-radius,10px)] [&_.ProseMirror_pre]:bg-[var(--cms-code-bg,#0f172a)] [&_.ProseMirror_pre]:text-slate-100 [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:my-4 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:text-xs',
        '[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-3',
        '[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-3',
        '[&_.ProseMirror_img]:rounded-[var(--cms-image-radius,10px)] [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:max-w-full',
        '[&_.ProseMirror_figure]:my-6',
        '[&_.ProseMirror_figure_img]:my-0 [&_.ProseMirror_figure_img]:w-full [&_.ProseMirror_figure_img]:h-auto',
        '[&_.ProseMirror_figcaption]:mt-2 [&_.ProseMirror_figcaption]:text-center [&_.ProseMirror_figcaption]:text-xs [&_.ProseMirror_figcaption]:text-[var(--cms-text-muted,var(--fg-muted))]',
        '[&_.ProseMirror_.callout]:my-5 [&_.ProseMirror_.callout]:rounded-xl [&_.ProseMirror_.callout]:border-l-4 [&_.ProseMirror_.callout]:px-4 [&_.ProseMirror_.callout]:py-3',
        '[&_.ProseMirror_.callout-info]:bg-[var(--cms-callout-info-bg,rgba(56,189,248,0.12))] [&_.ProseMirror_.callout-info]:border-l-[var(--cms-callout-info-border,#38bdf8)]',
        '[&_.ProseMirror_.callout-tip]:bg-[var(--cms-callout-tip-bg,rgba(34,197,94,0.12))] [&_.ProseMirror_.callout-tip]:border-l-[var(--cms-callout-tip-border,#22c55e)]',
        '[&_.ProseMirror_.callout-warning]:bg-[var(--cms-callout-warning-bg,rgba(234,179,8,0.12))] [&_.ProseMirror_.callout-warning]:border-l-[var(--cms-callout-warning-border,#eab308)]',
        '[&_.ProseMirror_.callout-danger]:bg-[var(--cms-callout-danger-bg,rgba(227,75,78,0.14))] [&_.ProseMirror_.callout-danger]:border-l-[var(--cms-callout-danger-border,#e34b4e)]',
        '[&_.ProseMirror_hr]:border-[var(--cms-border,var(--border))] [&_.ProseMirror_hr]:my-6',
        className,
      )}
    >
      <div
        className="mx-auto px-6 py-8 md:px-10 md:py-10"
        style={{ maxWidth: 'var(--cms-max-width, 760px)' }}
      >
        {children}
      </div>
    </div>
  );
}
