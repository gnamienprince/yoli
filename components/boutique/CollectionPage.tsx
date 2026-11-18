'use client';

import { useTranslations } from 'next-intl';
import PageHeader from '@/components/layout/PageHeader';
import ProductGrid from '@/components/boutique/ProductGrid';
import type { Category, Product } from '@/types';

interface CollectionPageProps {
  category: Category;
  title: string;
  subtitle: string;
  image: string;
  products: Product[];
}

const CATEGORY_ORDER: Category[] = ['femme', 'parfums', 'bijoux', 'homme'];

export default function CollectionPage({
  category,
  title,
  subtitle,
  image,
  products,
}: CollectionPageProps) {
  const tNav = useTranslations('nav');

  const chips = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: tNav(cat),
    href: `/boutique/${cat}`,
  }));

  return (
    <main className="min-h-screen bg-ivoire">
      <PageHeader
        title={title}
        subtitle={subtitle}
        image={image}
        breadcrumb={[
          { label: 'YoLi', href: '/' },
          { label: tNav(category) },
        ]}
      />

      <ProductGrid products={products} chips={chips} />
    </main>
  );
}
