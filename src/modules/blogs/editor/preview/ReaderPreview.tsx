import DOMPurify from 'dompurify';
import { cn } from '@shared/lib/cn';
import type { TemplateTokens } from '@templates';
import { TemplateScope } from '../TemplateScope';

interface ReaderPreviewProps {
  title: string;
  excerpt?: string | null;
  tags: string[];
  coverImageUrl?: string | null;
  htmlContent: string;
  tokens?: TemplateTokens | null;
  device: 'desktop' | 'mobile';
}

export function ReaderPreview({
  title,
  excerpt,
  tags,
  coverImageUrl,
  htmlContent,
  tokens,
  device,
}: ReaderPreviewProps) {
  const safeHtml = DOMPurify.sanitize(htmlContent);
  const isCentered = tokens?.layout.headerStyle === 'editorial-centered';

  return (
    <div className="flex justify-center">
      <div className={cn('w-full transition-all', device === 'mobile' ? 'max-w-[390px]' : 'max-w-full')}>
        <TemplateScope tokens={tokens}>
          <header className={isCentered ? 'text-center space-y-3 pb-6 border-b' : 'space-y-3 pb-6 border-b'}>
            {tags.length > 0 && (
              <div className={isCentered ? 'flex flex-wrap gap-1.5 justify-center' : 'flex flex-wrap gap-1.5'}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2.5 py-0.5 text-xs text-[var(--cms-text-muted,var(--fg-muted))]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight [font-family:var(--cms-heading-font,inherit)]">
              {title || 'Sin título'}
            </h1>

            {excerpt && (
              <p className="text-base text-[var(--cms-text-muted,var(--fg-muted))]">{excerpt}</p>
            )}
          </header>

          {coverImageUrl && (
            <figure className="my-6">
              <img
                src={coverImageUrl}
                alt={title}
                className="w-full h-auto border"
                style={{ borderRadius: 'var(--cms-image-radius, 12px)' }}
              />
            </figure>
          )}

          <div
            className="ProseMirror pt-2"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </TemplateScope>
      </div>
    </div>
  );
}
