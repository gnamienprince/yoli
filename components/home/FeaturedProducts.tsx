'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ProductCard } from '@/components/ui/ProductCard';
import { getFeaturedProducts } from '@/lib/mock-data';
import type { Locale } from '@/types';

export default function FeaturedProducts() {
  const t = useTranslations('home.featured');
  const locale = useLocale() as Locale;
  const products = getFeaturedProducts();

  return (
    <section className="bg-ivoire py-20 md:py-28">
      <div className="container-yoli">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <p className="section-eyebrow">{t('subtitle')}</p>
            <h2 className="section-title mt-4">{t('title')}</h2>
          </div>
          <Link
            href="/boutique/femme"
            className="link-underline font-sans text-[0.72rem] uppercase tracking-ultra text-noir"
          >
            {t('viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              priority={i < 4}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center md:hidden">
          <Link href="/boutique/femme" className="btn-secondary">
            {t('viewAll')}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
