import { useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  AlertCircle,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { normalizeApiError } from '@core/api/errors';
import { toast } from '@shared/components/Toaster';
import { cn } from '@shared/lib/cn';
import { mediaApi } from '../../api/mediaApi';

interface EditorToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

const COLOR_SWATCHES = ['#0f172a', '#e34b4e', '#2563eb', '#16a34a', '#d97706'];

export function EditorToolbar({ editor, disabled = false }: EditorToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (!editor || disabled) return null;

  const toggleLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL del enlace (https://…)', previous ?? 'https://');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await mediaApi.upload(file);
      const caption = window.prompt('Pie de foto (opcional)', '') ?? '';
      editor
        .chain()
        .focus()
        .setImageWithCaption({
          src: uploaded.url,
          alt: uploaded.alt ?? file.name,
          caption: caption.trim(),
        })
        .run();
      toast.success('Imagen insertada');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const btn = (
    label: string,
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
  ) => (
    <button
      key={label}
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-xs transition cursor-pointer',
        active
          ? 'bg-[var(--primary)] text-[var(--primary-fg)]'
          : 'text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)]',
      )}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-xl border bg-[var(--card)] p-1.5 shadow-sm">
      {btn('Negrita', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold className="h-4 w-4" />)}
      {btn('Cursiva', editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-4 w-4" />)}
      {btn('Subrayado', editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="h-4 w-4" />)}
      <div className="mx-1 h-5 w-px bg-[var(--border)]" />
      {btn('Título H2', editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-4 w-4" />)}
      {btn('Título H3', editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="h-4 w-4" />)}
      <div className="mx-1 h-5 w-px bg-[var(--border)]" />
      {btn('Alinear izquierda', editor.isActive({ textAlign: 'left' }), () => editor.chain().focus().setTextAlign('left').run(), <AlignLeft className="h-4 w-4" />)}
      {btn('Centrar', editor.isActive({ textAlign: 'center' }), () => editor.chain().focus().setTextAlign('center').run(), <AlignCenter className="h-4 w-4" />)}
      {btn('Alinear derecha', editor.isActive({ textAlign: 'right' }), () => editor.chain().focus().setTextAlign('right').run(), <AlignRight className="h-4 w-4" />)}
      <div className="mx-1 h-5 w-px bg-[var(--border)]" />
      {btn('Lista con viñetas', editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List className="h-4 w-4" />)}
      {btn('Lista numerada', editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-4 w-4" />)}
      {btn('Cita', editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="h-4 w-4" />)}
      {btn('Callout', editor.isActive('callout'), () => editor.chain().focus().setCallout('info').run(), <AlertCircle className="h-4 w-4" />)}
      {btn('Bloque de código', editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), <Code2 className="h-4 w-4" />)}
      {btn('Divisor', false, () => editor.chain().focus().setHorizontalRule().run(), <Minus className="h-4 w-4" />)}
      <div className="mx-1 h-5 w-px bg-[var(--border)]" />
      {btn('Enlace', editor.isActive('link'), toggleLink, <Link2 className="h-4 w-4" />)}
      <div className="flex items-center gap-1 px-1" aria-label="Color de texto">
        {COLOR_SWATCHES.map((hex) => (
          <button
            key={hex}
            type="button"
            title={`Color ${hex}`}
            onClick={() => editor.chain().focus().setColor(hex).run()}
            className="h-4 w-4 rounded-full border cursor-pointer"
            style={{ backgroundColor: hex }}
          />
        ))}
        <button
          type="button"
          title="Restablecer color"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="text-[10px] px-1 text-[var(--fg-muted)] hover:text-[var(--fg)] cursor-pointer"
        >
          Auto
        </button>
      </div>
      <div className="mx-1 h-5 w-px bg-[var(--border)]" />
      <button
        type="button"
        title="Insertar imagen con pie de foto"
        aria-label="Insertar imagen con pie de foto"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] disabled:opacity-50 cursor-pointer"
      >
        <ImagePlus className="h-4 w-4" />
        <span>{uploading ? 'Subiendo…' : 'Imagen'}</span>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleImageUpload(e.target.files?.[0])}
      />
    </div>
  );
}
