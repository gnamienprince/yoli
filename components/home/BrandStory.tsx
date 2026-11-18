'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1100&q=80';

export default function BrandStory() {
  const t = useTranslations('home.story');

  return (
    <section className="bg-rose-nude/20">
      <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
        {/* Image — on top for mobile, left on desktop */}
        <div className="relative aspect-[4/5] w-full lg:aspect-auto lg:min-h-[640px]">
          <Image
            src={STORY_IMAGE}
            alt={t('title')}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex items-center px-6 py-16 md:px-16 lg:px-20 lg:py-24">
          <div className="max-w-xl">
            <p className="section-eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-5 font-display text-4xl font-light leading-tight tracking-wide text-noir md:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-6 font-sans text-base font-light leading-relaxed text-noir/70">
              {t('body')}
            </p>
            <div className="mt-10">
              <Link href="/maison" className="btn-secondary">
                {t('cta')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
