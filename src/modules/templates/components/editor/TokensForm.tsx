import type { TemplateTokens } from '../../types/template.types';

interface TokensFormProps {
  tokens: TemplateTokens;
  onChange: (next: TemplateTokens) => void;
}

const COLOR_FIELDS: Array<{ key: keyof TemplateTokens['colors']; label: string }> = [
  { key: 'background', label: 'Fondo' },
  { key: 'surface', label: 'Superficie' },
  { key: 'text', label: 'Texto' },
  { key: 'textMuted', label: 'Texto secundario' },
  { key: 'accent', label: 'Acento' },
  { key: 'link', label: 'Enlaces' },
  { key: 'border', label: 'Bordes' },
  { key: 'codeBg', label: 'Fondo código' },
];

export function TokensForm({ tokens, onChange }: TokensFormProps) {
  const updateColor = (key: keyof TemplateTokens['colors'], value: string) => {
    onChange({
      ...tokens,
      colors: { ...tokens.colors, [key]: value },
    });
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Colores */}
      <div className="space-y-2.5">
        <p className="font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Colores</p>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_FIELDS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center justify-between gap-2 rounded-lg border bg-[var(--bg)] px-2.5 py-2"
            >
              <span>{label}</span>
              <input
                type="color"
                value={tokens.colors[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Tipografía */}
      <div className="space-y-3 pt-3 border-t">
        <p className="font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Tipografía</p>
        <label className="block space-y-1">
          <div className="flex justify-between">
            <span>Tamaño base</span>
            <span className="font-mono">{tokens.typography.baseSize}px</span>
          </div>
          <input
            type="range"
            min={14}
            max={22}
            value={tokens.typography.baseSize}
            onChange={(e) =>
              onChange({
                ...tokens,
                typography: { ...tokens.typography, baseSize: Number(e.target.value) },
              })
            }
            className="w-full"
          />
        </label>

        <label className="block space-y-1">
          <div className="flex justify-between">
            <span>Interlineado</span>
            <span className="font-mono">{tokens.typography.lineHeight}</span>
          </div>
          <input
            type="range"
            min={1.2}
            max={2.2}
            step={0.05}
            value={tokens.typography.lineHeight}
            onChange={(e) =>
              onChange({
                ...tokens,
                typography: { ...tokens.typography, lineHeight: Number(e.target.value) },
              })
            }
            className="w-full"
          />
        </label>
      </div>

      {/* Layout */}
      <div className="space-y-3 pt-3 border-t">
        <p className="font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Layout</p>
        <label className="block space-y-1">
          <div className="flex justify-between">
            <span>Ancho máximo</span>
            <span className="font-mono">{tokens.layout.maxWidth}px</span>
          </div>
          <input
            type="range"
            min={480}
            max={1100}
            step={20}
            value={tokens.layout.maxWidth}
            onChange={(e) =>
              onChange({
                ...tokens,
                layout: { ...tokens.layout, maxWidth: Number(e.target.value) },
              })
            }
            className="w-full"
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="space-y-1">
            <span className="text-[var(--fg-muted)] block">Cabecera</span>
            <select
              value={tokens.layout.headerStyle}
              onChange={(e) =>
                onChange({
                  ...tokens,
                  layout: {
                    ...tokens.layout,
                    headerStyle: e.target.value as TemplateTokens['layout']['headerStyle'],
                  },
                })
              }
              className="h-8 w-full rounded-lg border bg-[var(--bg)] px-2"
            >
              <option value="minimal">minimal</option>
              <option value="editorial-centered">editorial-centered</option>
              <option value="banner">banner</option>
              <option value="split-cover">split-cover</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-[var(--fg-muted)] block">Radio imágenes</span>
            <input
              type="number"
              min={0}
              max={32}
              value={tokens.layout.imageRadius}
              onChange={(e) =>
                onChange({
                  ...tokens,
                  layout: { ...tokens.layout, imageRadius: Number(e.target.value) },
                })
              }
              className="h-8 w-full rounded-lg border bg-[var(--bg)] px-2"
            />
          </label>
        </div>
      </div>

      {/* Bloques */}
      <div className="space-y-3 pt-3 border-t">
        <p className="font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Bloques</p>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center justify-between rounded-lg border bg-[var(--bg)] px-2.5 py-2">
            <span>Borde cita</span>
            <input
              type="color"
              value={tokens.blocks.quote.borderColor}
              onChange={(e) =>
                onChange({
                  ...tokens,
                  blocks: {
                    ...tokens.blocks,
                    quote: { ...tokens.blocks.quote, borderColor: e.target.value },
                  },
                })
              }
              className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border bg-[var(--bg)] px-2.5 py-2">
            <span>Radio código</span>
            <input
              type="number"
              min={0}
              max={32}
              value={tokens.blocks.code.radius}
              onChange={(e) =>
                onChange({
                  ...tokens,
                  blocks: {
                    ...tokens.blocks,
                    code: { ...tokens.blocks.code, radius: Number(e.target.value) },
                  },
                })
              }
              className="h-6 w-14 rounded border bg-transparent px-1.5 text-right"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
