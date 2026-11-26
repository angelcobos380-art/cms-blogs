import { StatusBadge, type BadgeTone } from '@shared/components/StatusBadge';
import type { PostStatus } from '../types/post.types';

const STATUS_META: Record<PostStatus, { label: string; tone: BadgeTone }> = {
  BORRADOR: { label: 'Borrador', tone: 'warning' },
  PUBLICADO: { label: 'Publicado', tone: 'success' },
  ARCHIVADO: { label: 'Archivado', tone: 'neutral' },
};

export function StatusPill({ status }: { status: PostStatus }) {
  const meta = STATUS_META[status];
  return <StatusBadge label={meta.label} tone={meta.tone} />;
}
