'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronDown } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';

export type SortOption = 'newest' | 'priceAsc' | 'priceDesc';

export const SORT_OPTIONS: SortOption[] = ['newest', 'priceAsc', 'priceDesc'];

interface CategoryChip {
  category: Category;
  label: string;
  href: string;
}

interface FilterBarProps {
  total: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  chips?: CategoryChip[];
}

export default function FilterBar({
  total,
  sort,
  onSortChange,
  chips,
}: FilterBarProps) {
  const t = useTranslations('boutique.filters');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="sticky top-[var(--header-h,4.5rem)] z-20 border-b border-marron/20 bg-ivoire/90 backdrop-blur-md">
      <div className="container-yoli flex items-center justify-between gap-4 py-4">
        {/* Result count */}
        <p className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-marron-dark">
          {t('results', { count: total })}
        </p>

        {/* Optional category chips */}
        {chips && chips.length > 0 && (
          <nav
            aria-label="Collections"
            className="hidden flex-1 items-center justify-center gap-6 md:flex"
          >
            {chips.map((chip) => {
              const active = pathname === chip.href;
              return (
                <Link
                  key={chip.category}
                  href={chip.href}
                  className={cn(
                    'font-sans text-[0.7rem] tracking-[0.18em] uppercase transition-colors duration-200',
                    active
                      ? 'text-noir'
                      : 'text-marron-dark hover:text-noir'
                  )}
                >
                  {chip.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Sort dropdown */}
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex items-center gap-2 font-sans text-[0.7rem] tracking-[0.18em] uppercase text-noir transition-colors hover:text-marron-dark"
          >
            <span className="text-marron-dark">{t('sort')}</span>
            <span>{t(sort)}</span>
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className={cn(
                'transition-transform duration-300',
                open && 'rotate-180'
              )}
            />
          </button>

          {open && (
            <ul
              role="listbox"
              className="absolute right-0 top-full z-30 mt-3 min-w-[12rem] animate-scaleIn origin-top-right border border-marron/20 bg-white py-2 shadow-[0_12px_40px_-12px_rgba(26,26,26,0.25)]"
            >
              {SORT_OPTIONS.map((option) => {
                const selected = option === sort;
                return (
                  <li key={option} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        onSortChange(option);
                        setOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left font-sans text-xs tracking-wide transition-colors',
                        selected
                          ? 'text-noir'
                          : 'text-marron-dark hover:bg-ivoire hover:text-noir'
                      )}
                    >
                      {t(option)}
                      {selected && <Check size={14} strokeWidth={1.5} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
