import type { CSSProperties } from 'react';
import type { TemplateTokens } from '../types/template.types';

export function tokensToCssVars(tokens?: TemplateTokens | null): CSSProperties {
  if (!tokens) return {};
  const { colors, typography, layout, blocks } = tokens;
  return {
    '--cms-accent': colors.accent,
    '--cms-bg': colors.background,
    '--cms-surface': colors.surface,
    '--cms-text': colors.text,
    '--cms-text-muted': colors.textMuted,
    '--cms-border': colors.border,
    '--cms-link': colors.link,
    '--cms-code-bg': colors.codeBg,
    '--cms-heading-font': typography.headingFont,
    '--cms-body-font': typography.bodyFont,
    '--cms-code-font': typography.codeFont,
    '--cms-base-size': `${typography.baseSize}px`,
    '--cms-line-height': String(typography.lineHeight),
    '--cms-max-width': `${layout.maxWidth}px`,
    '--cms-image-radius': `${layout.imageRadius}px`,
    '--cms-quote-border': blocks.quote.borderColor,
    '--cms-quote-style': blocks.quote.style,
    '--cms-code-radius': `${blocks.code.radius}px`,
    '--cms-callout-info-bg': blocks.callout.info.bg,
    '--cms-callout-info-border': blocks.callout.info.border,
    '--cms-callout-tip-bg': blocks.callout.tip.bg,
    '--cms-callout-tip-border': blocks.callout.tip.border,
    '--cms-callout-warning-bg': blocks.callout.warning.bg,
    '--cms-callout-warning-border': blocks.callout.warning.border,
    '--cms-callout-danger-bg': blocks.callout.danger.bg,
    '--cms-callout-danger-border': blocks.callout.danger.border,
  } as CSSProperties;
}
