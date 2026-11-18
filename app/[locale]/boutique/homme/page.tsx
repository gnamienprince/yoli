import type { Metadata } from 'next';
import CollectionPage from '@/components/boutique/CollectionPage';

export const metadata: Metadata = {
  title: 'YoLi Homme — Selection Importee',
  description:
    'Costumes, vestes, chemises, chaussures et accessoires. Une selection importee avec exigence par YoLi.',
};

const IMAGE =
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=80';

export default async function HommePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <CollectionPage
      category="homme"
      title="YoLi Homme"
      subtitle="Selection Importee"
      image={IMAGE}
    />
  );
}
