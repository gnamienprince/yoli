import type { Metadata } from 'next';
import CollectionPage from '@/components/boutique/CollectionPage';

export const metadata: Metadata = {
  title: 'Bijoux & Accessoires — L\'Art du Detail',
  description:
    'Bijoux, sacs, montres, lunettes, ceintures et foulards. L\'art du detail signe YoLi.',
};

const IMAGE =
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80';

export default async function BijouxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <CollectionPage
      category="bijoux"
      title="Bijoux & Accessoires"
      subtitle="L'Art du Detail"
      image={IMAGE}
    />
  );
}
