'use client';

import { cn } from '@/lib/utils';

interface ColorSelectorProps {
  colors: string[];
  value?: string;
  onChange: (color: string) => void;
  className?: string;
}

// Map common YoLi color names to a swatch background. Anything unknown falls
// back to a neutral tone so the swatch still renders cleanly.
const colorMap: Record<string, string> = {
  ivoire: '#F7F1E8',
  noir: '#1A1A1A',
  'rose nude': '#E8C7C3',
  rose: '#E8C7C3',
  marron: '#B99A83',
  or: '#C9A96E',
  gold: '#C9A96E',
  blanc: '#FFFFFF',
  white: '#FFFFFF',
};

function swatchColor(name: string): string {
  return colorMap[name.trim().toLowerCase()] ?? '#D8CFC4';
}

export function ColorSelector({
  colors,
  value,
  onChange,
  className,
}: ColorSelectorProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-3">
        {colors.map((color) => {
          const selected = value === color;
          const bg = swatchColor(color);
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={color}
              aria-pressed={selected}
              title={color}
              className={cn(
                'relative h-8 w-8 rounded-full border border-marron/30 transition-all duration-200',
                'ring-offset-2 ring-offset-ivoire hover:scale-105',
                selected && 'ring-2 ring-noir'
              )}
              style={{ backgroundColor: bg }}
            />
          );
        })}
      </div>
      {value && (
        <span className="font-sans text-xs tracking-[0.12em] text-marron-dark">
          {value}
        </span>
      )}
    </div>
  );
}

export default ColorSelector;
