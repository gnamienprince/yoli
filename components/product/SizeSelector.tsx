'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  value?: string;
  onChange: (size: string) => void;
  soldOut?: string[];
  className?: string;
}

export function SizeSelector({
  sizes,
  value,
  onChange,
  soldOut = [],
  className,
}: SizeSelectorProps) {
  const t = useTranslations('product');

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-noir">
          {t('size')}
        </span>
        <button
          type="button"
          className="font-sans text-[0.7rem] tracking-[0.12em] text-marron-dark underline-offset-4 transition-colors hover:text-noir hover:underline"
        >
          {t('sizeGuide')}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSoldOut = soldOut.includes(size);
          const selected = value === size;
          return (
            <button
              key={size}
              type="button"
              disabled={isSoldOut}
              onClick={() => onChange(size)}
              aria-pressed={selected}
              className={cn(
                'min-w-[3rem] px-4 py-3 font-sans text-xs tracking-[0.1em] uppercase transition-all duration-200',
                'border border-marron/35 text-noir hover:border-noir',
                selected && 'border-noir bg-noir text-white hover:border-noir',
                isSoldOut &&
                  'cursor-not-allowed border-marron/20 text-marron/40 line-through hover:border-marron/20'
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SizeSelector;
