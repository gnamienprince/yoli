'use client';

import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { useTranslations } from 'next-intl';

const POSTS = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
];

export default function InstagramBanner() {
  const t = useTranslations('home.instagram');

  return (
    <section className="py-20 md:py-28">
      <div className="container-yoli mb-10 text-center md:mb-12">
        <p className="section-eyebrow">{t('title')}</p>
        <a
          href="https://instagram.com/yoli.officiel"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline mt-4 inline-flex items-center gap-2 font-display text-2xl font-light tracking-wide text-noir transition-colors hover:text-marron md:text-3xl"
        >
          <Instagram className="h-5 w-5" strokeWidth={1.5} />
          {t('handle')}
        </a>
      </div>

      <div className="grid grid-cols-3 gap-px md:grid-cols-6">
        {POSTS.map((src, i) => (
          <a
            key={src}
            href="https://instagram.com/yoli.officiel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('follow')}
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 768px) 16vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-noir/0 transition-colors duration-500 group-hover:bg-noir/30">
              <Instagram
                className="h-6 w-6 text-white/0 transition-all duration-500 group-hover:text-white"
                strokeWidth={1.5}
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
