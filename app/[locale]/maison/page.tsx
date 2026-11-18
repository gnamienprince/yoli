import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'maison' });
  return {
    title: t('title'),
    description: t('intro'),
  };
}

const HERO =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80';
const HISTOIRE_IMG =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80';
const VISION_IMG =
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80';

const UNIVERS_IMAGES: Record<string, string> = {
  femme:
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80',
  parfums:
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
  bijoux:
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
  homme:
    'https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=800&q=80',
};

export default async function MaisonPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'maison' });

  const univers = [
    { key: 'femme', href: '/boutique/femme' },
    { key: 'parfums', href: '/boutique/parfums' },
    { key: 'bijoux', href: '/boutique/bijoux' },
    { key: 'homme', href: '/boutique/homme' },
  ] as const;

  const valeurs = ['elegance', 'authenticite', 'qualite'] as const;

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('eyebrow')}
        image={HERO}
        breadcrumb={[
          { label: 'YoLi', href: '/' },
          { label: t('eyebrow') },
        ]}
      />

      {/* Intro */}
      <section className="container-yoli py-20 md:py-28">
        <p className="mx-auto max-w-3xl text-center font-display text-2xl font-light leading-relaxed text-noir md:text-3xl text-balance">
          {t('intro')}
        </p>
      </section>

      {/* Notre Histoire */}
      <section className="container-yoli pb-20 md:pb-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1">
            <p className="section-eyebrow mb-4">{t('histoire.eyebrow')}</p>
            <h2 className="section-title mb-8">{t('histoire.title')}</h2>
            <div className="space-y-5 font-sans text-sm leading-relaxed text-noir/70 md:text-base">
              <p>{t('histoire.p1')}</p>
              <p>{t('histoire.p2')}</p>
            </div>
          </div>
          <div className="order-1 overflow-hidden md:order-2">
            <img
              src={HISTOIRE_IMG}
              alt=""
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Notre Vision */}
      <section className="bg-rose-nude/25 py-20 md:py-28">
        <div className="container-yoli grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="overflow-hidden">
            <img
              src={VISION_IMG}
              alt=""
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div>
            <p className="section-eyebrow mb-4">{t('vision.eyebrow')}</p>
            <h2 className="section-title mb-8">{t('vision.title')}</h2>
            <div className="space-y-5 font-sans text-sm leading-relaxed text-noir/70 md:text-base">
              <p>{t('vision.p1')}</p>
              <p>{t('vision.p2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Univers */}
      <section className="container-yoli py-20 md:py-28">
        <div className="mb-14 text-center">
          <p className="section-eyebrow mb-4">{t('univers.eyebrow')}</p>
          <h2 className="section-title mb-4">{t('univers.title')}</h2>
          <p className="mx-auto max-w-xl font-sans text-sm leading-relaxed text-noir/60">
            {t('univers.subtitle')}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {univers.map(({ key, href }) => (
            <Link key={key} href={href} className="group block">
              <div className="relative overflow-hidden">
                <img
                  src={UNIVERS_IMAGES[key]}
                  alt={t(`univers.${key}.name`)}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-noir/10 transition-colors duration-500 group-hover:bg-noir/20" />
              </div>
              <h3 className="mt-5 font-display text-xl font-light text-noir">
                {t(`univers.${key}.name`)}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-noir/60">
                {t(`univers.${key}.desc`)}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 font-sans text-[0.7rem] tracking-[0.2em] uppercase text-noir transition-colors group-hover:text-marron-dark">
                {t('univers.discover')}
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="bg-noir py-20 text-white md:py-28">
        <div className="container-yoli">
          <div className="mb-14 text-center">
            <p className="section-eyebrow mb-4 text-or">{t('valeurs.eyebrow')}</p>
            <h2 className="section-title text-white">{t('valeurs.title')}</h2>
          </div>
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {valeurs.map((v, i) => (
              <div key={v} className="text-center">
                <span className="font-display text-5xl font-light text-or/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-5 font-display text-2xl font-light text-white">
                  {t(`valeurs.${v}.name`)}
                </h3>
                <p className="mx-auto mt-4 max-w-xs font-sans text-sm leading-relaxed text-white/60">
                  {t(`valeurs.${v}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-yoli py-20 text-center md:py-28">
        <h2 className="section-title mb-5">{t('cta.title')}</h2>
        <p className="mx-auto mb-10 max-w-xl font-sans text-sm leading-relaxed text-noir/60 md:text-base">
          {t('cta.text')}
        </p>
        <Link href="/boutique/femme" className="btn-primary">
          {t('cta.button')}
          <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
