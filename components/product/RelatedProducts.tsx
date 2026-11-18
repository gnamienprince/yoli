import { getLocale, getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/ui/ProductCard';
import type { Locale, Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

export async function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  const t = await getTranslations('product');
  const locale = (await getLocale()) as Locale;

  return (
    <section className="mt-20 md:mt-28">
      <h2 className="mb-8 font-display text-2xl font-light tracking-wide text-noir md:mb-10 md:text-3xl">
        {t('relatedTitle')}
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
