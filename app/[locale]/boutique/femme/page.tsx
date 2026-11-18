import type { Metadata } from 'next';
import CollectionPage from '@/components/boutique/CollectionPage';
import { getProductsByCategory } from '@/lib/products';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'YoLi Femme — Creations Originales',
  description:
    'Robes, ensembles, tailleurs et pieces de createur. Des creations feminines originales signees YoLi. The Art of Being You.',
};

const IMAGE =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80';

export default async function FemmePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  const products = await getProductsByCategory('femme');

  return (
    <CollectionPage
      category="femme"
      title="YoLi Femme"
      subtitle="Creations Originales"
      image={IMAGE}
      products={products}
    />
  );
}
