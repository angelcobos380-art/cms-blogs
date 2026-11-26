import { useMemo } from 'react';
import { publishRulesSchema } from '../schemas/post.schema';

export interface ChecklistItem {
  key: 'title' | 'content' | 'slug';
  label: string;
  ok: boolean;
  detail: string;
}

export function stripHtmlToText(html: string | null | undefined, markdown?: string | null): string {
  if (html) {
    const stripped = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (stripped) return stripped;
  }
  if (markdown) {
    return markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*_`~[\]()!|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return '';
}

export function usePublishChecklist(input: {
  title: string;
  slug: string;
  contentHtml?: string | null;
  contentMarkdown?: string | null;
}) {
  return useMemo(() => {
    const plainText = stripHtmlToText(input.contentHtml, input.contentMarkdown);
    const titleLen = input.title.trim().length;
    const slugVal = input.slug.trim();

    const parsed = publishRulesSchema.safeParse({
      title: input.title,
      plainText,
      slug: slugVal,
    });

    const checks: ChecklistItem[] = [
      {
        key: 'title',
        label: 'Título entre 5 y 120 caracteres',
        ok: titleLen >= 5 && titleLen <= 120,
        detail: `${titleLen} caracteres`,
      },
      {
        key: 'content',
        label: 'Contenido mínimo de 10 caracteres de texto',
        ok: plainText.length >= 10,
        detail: `${plainText.length} caracteres`,
      },
      {
        key: 'slug',
        label: 'Slug válido y único',
        ok: slugVal.length > 0,
        detail: slugVal || 'vacío',
      },
    ];

    return {
      checks,
      canPublish: parsed.success && checks.every((c) => c.ok),
    };
  }, [input.title, input.slug, input.contentHtml, input.contentMarkdown]);
}
