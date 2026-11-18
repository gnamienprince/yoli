'use client';

import { useTranslations } from 'next-intl';
import NewsletterForm from '@/components/ui/NewsletterForm';

export default function NewsletterBanner() {
  const t = useTranslations('home.newsletter');

  return (
    <section className="bg-rose-nude/40 py-20 md:py-28">
      <div className="container-yoli flex flex-col items-center text-center">
        <h2 className="font-display text-4xl font-light tracking-wide text-noir md:text-5xl">
          {t('title')}
        </h2>
        <p className="mt-5 max-w-xl font-sans text-base font-light leading-relaxed text-noir/70">
          {t('subtitle')}
        </p>
        <div className="mt-10 w-full max-w-md">
          <NewsletterForm variant="light" />
        </div>
      </div>
    </section>
  );
}
