import { z } from 'zod';
import type { TemplateTokens } from '../types/template.types';

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Usa formato hexadecimal #rrggbb');

export const templateTokensSchema = z.object({
  version: z.number().int().min(1).default(1),
  colors: z.object({
    accent: hexColor,
    background: hexColor,
    surface: hexColor,
    text: hexColor,
    textMuted: hexColor,
    border: hexColor,
    link: hexColor,
    codeBg: hexColor,
  }),
  typography: z.object({
    headingFont: z.string().min(1).max(200),
    bodyFont: z.string().min(1).max(200),
    codeFont: z.string().min(1).max(200),
    baseSize: z.number().min(14).max(22),
    lineHeight: z.number().min(1.2).max(2.2),
  }),
  layout: z.object({
    maxWidth: z.number().min(480).max(1100),
    density: z.enum(['compact', 'comfortable', 'spacious']),
    headerStyle: z.enum(['banner', 'editorial-centered', 'split-cover', 'minimal']),
    imageRadius: z.number().min(0).max(32),
    shadow: z.enum(['none', 'soft', 'elevated']),
  }),
  blocks: z.object({
    callout: z.object({
      info: z.object({ bg: hexColor, border: hexColor }),
      tip: z.object({ bg: hexColor, border: hexColor }),
      warning: z.object({ bg: hexColor, border: hexColor }),
      danger: z.object({ bg: hexColor, border: hexColor }),
    }),
    quote: z.object({
      borderColor: hexColor,
      style: z.enum(['normal', 'italic']),
    }),
    code: z.object({
      radius: z.number().min(0).max(32),
      showLanguageBadge: z.boolean(),
    }),
  }),
});

export const templateFormSchema = z.object({
  name: z.string().trim().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().trim().max(300, 'Máximo 300 caracteres').default(''),
  tokens: templateTokensSchema,
});

export const DEFAULT_TEMPLATE_TOKENS: TemplateTokens = {
  version: 1,
  colors: {
    accent: '#2563eb',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textMuted: '#475569',
    border: '#e2e8f0',
    link: '#1d4ed8',
    codeBg: '#0f172a',
  },
  typography: {
    headingFont: 'Inter, ui-sans-serif, system-ui, sans-serif',
    bodyFont: 'Inter, ui-sans-serif, system-ui, sans-serif',
    codeFont: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    baseSize: 17,
    lineHeight: 1.75,
  },
  layout: {
    maxWidth: 740,
    density: 'comfortable',
    headerStyle: 'minimal',
    imageRadius: 10,
    shadow: 'soft',
  },
  blocks: {
    callout: {
      info: { bg: '#e0f2fe', border: '#0284c7' },
      tip: { bg: '#dcfce7', border: '#16a34a' },
      warning: { bg: '#fef9c3', border: '#ca8a04' },
      danger: { bg: '#fee2e2', border: '#dc2626' },
    },
    quote: { borderColor: '#2563eb', style: 'italic' },
    code: { radius: 10, showLanguageBadge: true },
  },
};

export const TEMPLATE_PRESETS: Array<{
  id: string;
  label: string;
  description: string;
  tokens: TemplateTokens;
}> = [
  {
    id: 'editorial-minimal',
    label: 'Editorial Minimal',
    description: 'Tipografía serif en títulos, fondo claro y lectura aireada.',
    tokens: {
      ...DEFAULT_TEMPLATE_TOKENS,
      colors: {
        ...DEFAULT_TEMPLATE_TOKENS.colors,
        accent: '#0ea5e9',
        link: '#0369a1',
      },
      typography: {
        ...DEFAULT_TEMPLATE_TOKENS.typography,
        headingFont: "Georgia, 'Times New Roman', serif",
      },
      layout: {
        ...DEFAULT_TEMPLATE_TOKENS.layout,
        maxWidth: 700,
        density: 'spacious',
        headerStyle: 'editorial-centered',
      },
    },
  },
  {
    id: 'dark-dev-glass',
    label: 'Oscuro Dev Glass',
    description: 'Estética oscura de alto contraste para artículos técnicos.',
    tokens: {
      version: 1,
      colors: {
        accent: '#e34b4e',
        background: '#0b0a0b',
        surface: '#1c191b',
        text: '#f7f3f1',
        textMuted: '#b6adab',
        border: '#2e292b',
        link: '#e34b4e',
        codeBg: '#070607',
      },
      typography: {
        headingFont: 'Inter, ui-sans-serif, system-ui, sans-serif',
        bodyFont: 'Inter, ui-sans-serif, system-ui, sans-serif',
        codeFont: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        baseSize: 17,
        lineHeight: 1.8,
      },
      layout: {
        maxWidth: 780,
        density: 'comfortable',
        headerStyle: 'minimal',
        imageRadius: 12,
        shadow: 'soft',
      },
      blocks: {
        callout: {
          info: { bg: '#172536', border: '#38bdf8' },
          tip: { bg: '#14291f', border: '#22c55e' },
          warning: { bg: '#2e2412', border: '#eab308' },
          danger: { bg: '#311619', border: '#e34b4e' },
        },
        quote: { borderColor: '#e34b4e', style: 'italic' },
        code: { radius: 12, showLanguageBadge: true },
      },
    },
  },
  {
    id: 'cuaderno-calido',
    label: 'Cuaderno Cálido',
    description: 'Fondo crema y acento terracota para ensayos y bitácoras.',
    tokens: {
      version: 1,
      colors: {
        accent: '#c2410c',
        background: '#faf7f2',
        surface: '#f3ede2',
        text: '#292524',
        textMuted: '#57534e',
        border: '#e7e0d3',
        link: '#c2410c',
        codeBg: '#1c1917',
      },
      typography: {
        headingFont: 'Georgia, serif',
        bodyFont: 'Georgia, serif',
        codeFont: 'ui-monospace, Menlo, monospace',
        baseSize: 17,
        lineHeight: 1.8,
      },
      layout: {
        maxWidth: 680,
        density: 'comfortable',
        headerStyle: 'banner',
        imageRadius: 16,
        shadow: 'soft',
      },
      blocks: {
        callout: {
          info: { bg: '#e0f2fe', border: '#0284c7' },
          tip: { bg: '#ecfccb', border: '#65a30d' },
          warning: { bg: '#ffedd5', border: '#ea580c' },
          danger: { bg: '#fee2e2', border: '#dc2626' },
        },
        quote: { borderColor: '#c2410c', style: 'italic' },
        code: { radius: 12, showLanguageBadge: true },
      },
    },
  },
];
