'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80';

export default function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden">
      {/* Background campaign image */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-noir/70 via-noir/20 to-noir/30" />
      </div>

      {/* Content */}
      <div className="container-yoli relative z-10 w-full pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[0.7rem] uppercase tracking-ultra text-white/80"
          >
            {t('newCollection')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-display text-6xl font-light leading-[0.95] tracking-wide text-white md:text-7xl lg:text-8xl"
          >
            YoLi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-xl font-light italic tracking-wide text-white/90 md:text-2xl"
          >
            {t('tagline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <Link href="/boutique/femme" className="btn-light">
              {t('cta')}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
