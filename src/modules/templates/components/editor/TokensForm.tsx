import type { TemplateTokens } from '../../types/template.types';

export type TokenSection = 'colors' | 'typography' | 'layout' | 'blocks';

interface TokensFormProps {
  tokens: TemplateTokens;
  activeSection: TokenSection;
  onChange: (next: TemplateTokens) => void;
}

const COLOR_FIELDS: Array<{ key: keyof TemplateTokens['colors']; label: string }> = [
  { key: 'background', label: 'Fondo principal' },
  { key: 'surface', label: 'Superficie / tarjetas' },
  { key: 'text', label: 'Texto principal' },
  { key: 'textMuted', label: 'Texto secundario' },
  { key: 'accent', label: 'Color de acento' },
  { key: 'link', label: 'Enlaces' },
  { key: 'border', label: 'Bordes' },
  { key: 'codeBg', label: 'Fondo código' },
];

export function TokensForm({ tokens, activeSection, onChange }: TokensFormProps) {
  const updateColor = (key: keyof TemplateTokens['colors'], value: string) => {
    onChange({
      ...tokens,
      colors: { ...tokens.colors, [key]: value },
    });
  };

  if (activeSection === 'colors') {
    return (
      <div className="space-y-3 text-xs">
        <p className="font-semibold text-[var(--fg-muted)] uppercase tracking-wider">
          Paleta de colores
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {COLOR_FIELDS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center justify-between gap-2 rounded-xl border bg-[var(--bg)] px-3 py-2"
            >
              <div>
                <span className="block font-medium">{label}</span>
                <span className="font-mono text-[10px] text-[var(--fg-muted)]">
                  {tokens.colors[key]}
                </span>
              </div>
              <input
                type="color"
                value={tokens.colors[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
              />
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (activeSection === 'typography') {
    return (
      <div className="space-y-4 text-xs">
        <p className="font-semibold text-[var(--fg-muted)] uppercase tracking-wider">
          Tipografía y lectura
        </p>

        <label className="block space-y-1">
          <span className="font-medium text-[var(--fg-muted)]">Fuente de títulos</span>
          <select
            value={tokens.typography.headingFont}
            onChange={(e) =>
              onChange({
                ...tokens,
                typography: { ...tokens.typography, headingFont: e.target.value },
              })
            }
            className="h-9 w-full rounded-lg border bg-[var(--bg)] px-2.5"
          >
            <option value="Inter, ui-sans-serif, system-ui, sans-serif">Inter (Sans moderna)</option>
            <option value="Georgia, 'Times New Roman', serif">Georgia (Editorial Serif)</option>
            <option value="ui-monospace, SFMono-Regular, Menlo, monospace">Monospace (Técnica)</option>
          </select>
        </label>

        <label className="block space-y-1">
          <span className="font-medium text-[var(--fg-muted)]">Fuente de cuerpo</span>
          <select
            value={tokens.typography.bodyFont}
            onChange={(e) =>
              onChange({
                ...tokens,
                typography: { ...tokens.typography, bodyFont: e.target.value },
              })
            }
            className="h-9 w-full rounded-lg border bg-[var(--bg)] px-2.5"
          >
            <option value="Inter, ui-sans-serif, system-ui, sans-serif">Inter (Sans)</option>
            <option value="Georgia, serif">Georgia (Serif)</option>
          </select>
        </label>

        <label className="block space-y-1.5">
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

        <label className="block space-y-1.5">
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
    );
  }

  if (activeSection === 'layout') {
    return (
      <div className="space-y-4 text-xs">
        <p className="font-semibold text-[var(--fg-muted)] uppercase tracking-wider">
          Layout y cabecera
        </p>

        <label className="block space-y-1.5">
          <div className="flex justify-between">
            <span>Ancho máximo del artículo</span>
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

        <div className="grid grid-cols-2 gap-2.5">
          <label className="space-y-1">
            <span className="text-[var(--fg-muted)] block">Estilo de cabecera</span>
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
              className="h-9 w-full rounded-lg border bg-[var(--bg)] px-2.5"
            >
              <option value="minimal">minimal</option>
              <option value="editorial-centered">editorial-centered</option>
              <option value="banner">banner</option>
              <option value="split-cover">split-cover</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-[var(--fg-muted)] block">Radio imágenes (px)</span>
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
              className="h-9 w-full rounded-lg border bg-[var(--bg)] px-2.5"
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      <p className="font-semibold text-[var(--fg-muted)] uppercase tracking-wider">
        Bloques del lienzo (Callout, Cita y Código)
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        <label className="flex items-center justify-between rounded-xl border bg-[var(--bg)] px-3 py-2">
          <span>Fondo Callout Tip</span>
          <input
            type="color"
            value={tokens.blocks.callout.tip.bg}
            onChange={(e) =>
              onChange({
                ...tokens,
                blocks: {
                  ...tokens.blocks,
                  callout: {
                    ...tokens.blocks.callout,
                    tip: { ...tokens.blocks.callout.tip, bg: e.target.value },
                  },
                },
              })
            }
            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border bg-[var(--bg)] px-3 py-2">
          <span>Borde Callout Tip</span>
          <input
            type="color"
            value={tokens.blocks.callout.tip.border}
            onChange={(e) =>
              onChange({
                ...tokens,
                blocks: {
                  ...tokens.blocks,
                  callout: {
                    ...tokens.blocks.callout,
                    tip: { ...tokens.blocks.callout.tip, border: e.target.value },
                  },
                },
              })
            }
            className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border bg-[var(--bg)] px-3 py-2">
          <span>Borde Cita</span>
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

        <label className="flex items-center justify-between rounded-xl border bg-[var(--bg)] px-3 py-2">
          <span>Radio Código (px)</span>
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
            className="h-7 w-14 rounded border bg-transparent px-1.5 text-right"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={tokens.blocks.code.showLanguageBadge}
          onChange={(e) =>
            onChange({
              ...tokens,
              blocks: {
                ...tokens.blocks,
                code: { ...tokens.blocks.code, showLanguageBadge: e.target.checked },
              },
            })
          }
        />
        <span>Mostrar cabecera y badge de lenguaje en bloques de código</span>
      </label>
    </div>
  );
}
