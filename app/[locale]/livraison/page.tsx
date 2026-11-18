import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LegalContent from '@/components/pages/LegalContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.livraison' });
  return { title: t('title') };
}

export default async function LivraisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalContent locale={locale} section="livraison" />;
}
