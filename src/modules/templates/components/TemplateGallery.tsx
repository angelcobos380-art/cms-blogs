import type { Template } from '../types/template.types';
import { TemplateCard } from './TemplateCard';

interface TemplateGalleryProps {
  items: Template[];
  onDuplicate: (id: string) => void;
  onSetDefault: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onDelete: (template: Template) => void;
}

export function TemplateGallery({
  items,
  onDuplicate,
  onSetDefault,
  onArchive,
  onRestore,
  onDelete,
}: TemplateGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((tpl) => (
        <TemplateCard
          key={tpl.template_id}
          template={tpl}
          onDuplicate={onDuplicate}
          onSetDefault={onSetDefault}
          onArchive={onArchive}
          onRestore={onRestore}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
