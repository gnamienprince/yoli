import { getTranslations } from 'next-intl/server';
import PageHeader from '@/components/layout/PageHeader';

interface Section {
  heading: string;
  body: string;
}

export default async function LegalContent({
  locale,
  section,
}: {
  locale: string;
  section: string;
}) {
  const t = await getTranslations({ locale, namespace: `legal.${section}` });
  const sections = t.raw('sections') as Section[];

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
        <div className="mx-auto max-w-3xl space-y-12">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="mb-4 font-display text-2xl font-light text-noir">
                {s.heading}
              </h2>
              <p className="font-sans text-sm leading-relaxed text-noir/70 md:text-base">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
