import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';
import { Accordion } from '@/components/ui/Accordion';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.faq' });
  return { title: t('title') };
}

interface FaqItem {
  q: string;
  a: string;
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.faq' });
  const items = t.raw('items') as FaqItem[];

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('eyebrow')}
        breadcrumb={[
          { label: 'YoLi', href: '/' },
          { label: t('title') },
        ]}
      />

      <section className="container-yoli py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          {items.map((item, i) => (
            <Accordion key={i} title={item.q} defaultOpen={i === 0}>
              {item.a}
            </Accordion>
          ))}
        </div>
      </section>
    </>
  );
}
