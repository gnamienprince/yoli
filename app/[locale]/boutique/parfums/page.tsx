import type { Metadata } from 'next';
import CollectionPage from '@/components/boutique/CollectionPage';

export const metadata: Metadata = {
  title: 'YoLi Parfums — Creations Olfactives',
  description:
    'Parfums femme, homme et mixte, coffrets et formats decouverte. Des creations olfactives signees YoLi.',
};

const IMAGE =
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80';

export default async function ParfumsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <CollectionPage
      category="parfums"
      title="YoLi Parfums"
      subtitle="Creations Olfactives"
      image={IMAGE}
    />
  );
}
