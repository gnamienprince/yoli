'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

interface Universe {
  key: 'femme' | 'parfums' | 'bijoux' | 'homme';
  href: string;
  image: string;
}

const UNIVERSES: Universe[] = [
  {
    key: 'femme',
    href: '/boutique/femme',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'parfums',
    href: '/boutique/parfums',
    image:
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'bijoux',
    href: '/boutique/bijoux',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
  },
  {
    key: 'homme',
    href: '/boutique/homme',
    image:
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=900&q=80',
  },
];

export default function UniverseGrid() {
  const t = useTranslations('home.universes');

  return (
    <section className="py-20 md:py-28">
      <div className="container-yoli mb-12 text-center md:mb-16">
        <p className="section-eyebrow">{t('subtitle')}</p>
        <h2 className="section-title mt-4">{t('title')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {UNIVERSES.map((u) => (
          <Link
            key={u.key}
            href={u.href}
            className="group relative block aspect-[3/4] overflow-hidden"
          >
            <Image
              src={u.image}
              alt={t(u.key)}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-noir/25 transition-colors duration-500 group-hover:bg-noir/45" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
              <h3 className="font-display text-2xl font-light tracking-wide text-white md:text-3xl">
                {t(u.key)}
              </h3>
              <span className="font-sans text-[0.65rem] uppercase tracking-ultra text-white/0 transition-all duration-500 group-hover:text-white/90">
                {t('discover')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
