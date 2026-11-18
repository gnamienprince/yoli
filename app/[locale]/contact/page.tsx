import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import ContactForm from '@/components/pages/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  const coordinates = [
    { icon: Mail, label: t('emailLabel'), value: t('email'), href: `mailto:${t('email')}` },
    { icon: Phone, label: t('phoneLabel'), value: t('phone'), href: `tel:${t('phone').replace(/\s/g, '')}` },
    { icon: MapPin, label: t('addressLabel'), value: t('address') },
    { icon: Clock, label: t('hoursLabel'), value: t('hours') },
  ];

  return (
    <>
      <PageHeader
        title={t('title')}
        subtitle={t('eyebrow')}
        breadcrumb={[
          { label: 'YoLi', href: '/' },
          { label: t('eyebrow') },
        ]}
      />

      <section className="container-yoli py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          {/* Coordonnees */}
          <div>
            <p className="section-eyebrow mb-4">{t('infoTitle')}</p>
            <h2 className="font-display text-3xl font-light text-noir md:text-4xl">
              {t('subtitle')}
            </h2>
            <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-noir/60">
              {t('infoText')}
            </p>

            <ul className="mt-12 space-y-8">
              {coordinates.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-5">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center border border-marron/30 text-marron-dark">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-marron-dark">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="link-underline mt-1 inline-block font-sans text-base text-noir"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 font-sans text-base text-noir">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="bg-white p-8 md:p-12">
            <h2 className="mb-8 font-display text-2xl font-light text-noir">
              {t('formTitle')}
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
