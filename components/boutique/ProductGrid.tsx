'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ProductCard } from '@/components/ui/ProductCard';
import FilterBar, { type SortOption } from '@/components/boutique/FilterBar';
import type { Locale, Product } from '@/types';

interface CategoryChip {
  category: Product['category'];
  label: string;
  href: string;
}

interface ProductGridProps {
  products: Product[];
  chips?: CategoryChip[];
}

export default function ProductGrid({ products, chips }: ProductGridProps) {
  const t = useTranslations('boutique');
  const locale = useLocale() as Locale;
  const [sort, setSort] = useState<SortOption>('newest');

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case 'priceAsc':
        return list.sort((a, b) => a.price - b.price);
      case 'priceDesc':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
      default:
        return list;
    }
  }, [products, sort]);

  return (
    <>
      <FilterBar
        total={sorted.length}
        sort={sort}
        onSortChange={setSort}
        chips={chips}
      />

      <div className="container-yoli py-12 md:py-16">
        {sorted.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <p className="font-display text-2xl font-light text-noir">
              {t('empty')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4 md:gap-x-6 md:gap-y-14">
            {sorted.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                priority={i < 4}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
