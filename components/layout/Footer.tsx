'use client';

import { Instagram, Music2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NewsletterForm from '@/components/ui/NewsletterForm';

export default function Footer() {
  const t = useTranslations('footer');

  const columns = [
    {
      title: t('colCollections'),
      links: [
        { label: t('femme'), href: '/boutique/femme' },
        { label: t('parfums'), href: '/boutique/parfums' },
        { label: t('bijoux'), href: '/boutique/bijoux' },
        { label: t('homme'), href: '/boutique/homme' },
      ],
    },
    {
      title: t('colMaison'),
      links: [
        { label: t('histoire'), href: '/maison' },
        { label: t('contact'), href: '/contact' },
      ],
    },
    {
      title: t('colAide'),
      links: [
        { label: t('livraison'), href: '/livraison' },
        { label: t('retours'), href: '/retours' },
        { label: t('faq'), href: '/faq' },
      ],
    },
    {
      title: t('colLegal'),
      links: [
        { label: t('cgv'), href: '/cgv' },
        { label: t('confidentialite'), href: '/confidentialite' },
        { label: t('mentions'), href: '/mentions-legales' },
      ],
    },
  ];

  return (
    <footer className="bg-noir text-ivoire">
      <div className="container-yoli py-16 lg:py-20">
        {/* Top — brand + newsletter */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 pb-14 border-b border-marron/30">
          <div>
            <span className="font-display text-4xl font-medium tracking-wide">
              YoLi
            </span>
            <p className="mt-3 font-display italic text-lg text-ivoire/70">
              {t('tagline')}
            </p>
          </div>

          <div className="max-w-md">
            <h3 className="font-display text-2xl font-light">
              {t('newsletterTitle')}
            </h3>
            <p className="mt-2 font-sans text-sm text-ivoire/60 leading-relaxed">
              {t('newsletterDesc')}
            </p>
            <NewsletterForm variant="dark" className="mt-5" />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 py-14">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-sans text-[0.7rem] tracking-ultra uppercase text-or">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-ivoire/70 hover:text-ivoire transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social */}
        <div className="flex items-center gap-5 pb-10 border-b border-marron/30">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-ivoire/70 hover:text-or transition-colors"
          >
            <Instagram className="h-5 w-5" strokeWidth={1.5} />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-ivoire/70 hover:text-or transition-colors"
          >
            <Music2 className="h-5 w-5" strokeWidth={1.5} />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-8 font-sans text-xs text-ivoire/50">
          <p>&copy; {t('rights')}</p>
          <p className="tracking-[0.15em] uppercase">{t('location')}</p>
        </div>
      </div>
    </footer>
  );
}
