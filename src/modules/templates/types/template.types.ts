export type TemplateStatus = 'ACTIVA' | 'ARCHIVADA';

export interface TemplateTokens {
  version: number;
  colors: {
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    link: string;
    codeBg: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    codeFont: string;
    baseSize: number;
    lineHeight: number;
  };
  layout: {
    maxWidth: number;
    density: 'compact' | 'comfortable' | 'spacious';
    headerStyle: 'banner' | 'editorial-centered' | 'split-cover' | 'minimal';
    imageRadius: number;
    shadow: 'none' | 'soft' | 'elevated';
  };
  blocks: {
    callout: {
      info: { bg: string; border: string };
      tip: { bg: string; border: string };
      warning: { bg: string; border: string };
      danger: { bg: string; border: string };
    };
    quote: { borderColor: string; style: 'normal' | 'italic' };
    code: { radius: number; showLanguageBadge: boolean };
  };
}

export interface Template {
  template_id: string;
  name: string;
  description: string;
  status: TemplateStatus;
  is_default: boolean;
  tokens: TemplateTokens;
  created_at: string;
  updated_at: string;
}
