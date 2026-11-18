'use client';

import { useEffect } from 'react';
import { X, Instagram, Music2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { key: 'femme', href: '/boutique/femme' },
  { key: 'parfums', href: '/boutique/parfums' },
  { key: 'bijoux', href: '/boutique/bijoux' },
  { key: 'homme', href: '/boutique/homme' },
  { key: 'maison', href: '/maison' },
] as const;

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const switchLocale = (locale: 'fr' | 'en') => {
    router.replace(pathname, { locale });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-[60] lg:hidden"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-noir/40"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-ivoire text-noir flex flex-col"
            variants={{
              open: { x: 0 },
              closed: { x: '-100%' },
            }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-marron/20">
              <span className="font-display text-2xl font-medium tracking-wide">
                YoLi
              </span>
              <button
                type="button"
                aria-label={t('close')}
                onClick={onClose}
                className="p-1 transition-opacity hover:opacity-60"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-10">
              <ul className="flex flex-col gap-6">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="font-display text-3xl font-light tracking-wide hover:text-marron transition-colors"
                    >
                      {t(item.key)}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="px-6 py-8 border-t border-marron/20 space-y-6">
              <div className="flex items-center gap-2 text-sm tracking-[0.15em]">
                <button
                  type="button"
                  onClick={() => switchLocale('fr')}
                  className="uppercase transition-colors hover:text-marron"
                >
                  FR
                </button>
                <span className="opacity-40">/</span>
                <button
                  type="button"
                  onClick={() => switchLocale('en')}
                  className="uppercase transition-colors hover:text-marron"
                >
                  EN
                </button>
              </div>

              <div className="flex items-center gap-5 text-noir/70">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-colors hover:text-marron"
                >
                  <Instagram className="h-5 w-5" strokeWidth={1.5} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="transition-colors hover:text-marron"
                >
                  <Music2 className="h-5 w-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
