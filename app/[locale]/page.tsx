import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import UniverseGrid from '@/components/home/UniverseGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStory from '@/components/home/BrandStory';
import InstagramBanner from '@/components/home/InstagramBanner';
import NewsletterBanner from '@/components/home/NewsletterBanner';
import { getFeaturedProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'YoLi - The Art of Being You',
  description:
    "Maison de mode et de lifestyle nee a Abidjan. Femme, Parfums, Bijoux & Accessoires et Homme : l'art d'etre soi.",
};

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  // Locale is resolved by next-intl middleware; awaiting keeps Next 15 happy
  // and makes this an explicit per-locale server entry point.
  await params;

  const featured = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <UniverseGrid />
      <FeaturedProducts products={featured} />
      <BrandStory />
      <InstagramBanner />
      <NewsletterBanner />
    </>
  );
}
