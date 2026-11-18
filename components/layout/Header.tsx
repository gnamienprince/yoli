'use client';

import { useEffect, useState } from 'react';
import { Search, Heart, User, ShoppingBag, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/stores/cart';
import { cn } from '@/lib/utils';
import MobileMenu from '@/components/layout/MobileMenu';
import CartDrawer from '@/components/cart/CartDrawer';

const NAV_ITEMS = [
  { key: 'femme', href: '/boutique/femme' },
  { key: 'parfums', href: '/boutique/parfums' },
  { key: 'bijoux', href: '/boutique/bijoux' },
  { key: 'homme', href: '/boutique/homme' },
  { key: 'maison', href: '/maison' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  const isHome = pathname === '/';

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Solid chrome everywhere except transparently over the homepage hero.
  const solid = !isHome || scrolled;
  const cartCount = mounted ? totalItems : 0;

  const switchLocale = (locale: 'fr' | 'en') => {
    router.replace(pathname, { locale });
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 z-50 w-full transition-all duration-500',
          solid
            ? 'bg-ivoire/95 backdrop-blur-sm border-b border-marron/20 text-noir'
            : 'bg-transparent text-white'
        )}
      >
        <div className="container-yoli">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left — mobile hamburger / desktop primary nav */}
            <div className="flex items-center gap-8 flex-1">
              <button
                type="button"
                aria-label={t('menu')}
                onClick={() => setMobileOpen(true)}
                className="lg:hidden -ml-1 p-1"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <nav className="hidden lg:flex items-center gap-7">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      'nav-link link-underline',
                      !solid && 'text-white/90 hover:text-white'
                    )}
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center — wordmark */}
            <Link
              href="/"
              className="flex flex-col items-center leading-none select-none"
              aria-label="YoLi"
            >
              <span className="font-display text-2xl lg:text-3xl font-medium tracking-wide">
                YoLi
              </span>
              <span className="hidden sm:block mt-0.5 font-sans text-[0.5rem] tracking-ultra uppercase opacity-70">
                {t('eyebrow')}
              </span>
            </Link>

            {/* Right — actions */}
            <div className="flex items-center justify-end gap-4 lg:gap-5 flex-1">
              <button
                type="button"
                aria-label={t('search')}
                className="hidden sm:inline-flex p-1 transition-opacity hover:opacity-60"
              >
                <Search className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.5} />
              </button>

              <div className="hidden lg:flex items-center gap-1 text-[0.68rem] tracking-[0.15em]">
                <button
                  type="button"
                  onClick={() => switchLocale('fr')}
                  className="uppercase transition-opacity hover:opacity-60 disabled:opacity-100 disabled:font-medium"
                >
                  FR
                </button>
                <span className="opacity-40">/</span>
                <button
                  type="button"
                  onClick={() => switchLocale('en')}
                  className="uppercase transition-opacity hover:opacity-60"
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                aria-label={t('favorites')}
                className="hidden sm:inline-flex p-1 transition-opacity hover:opacity-60"
              >
                <Heart className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.5} />
              </button>

              <Link
                href="/connexion"
                aria-label={t('account')}
                className="hidden sm:inline-flex p-1 transition-opacity hover:opacity-60"
              >
                <User className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.5} />
              </Link>

              <button
                type="button"
                aria-label={t('cart')}
                onClick={toggleCart}
                className="relative p-1 transition-opacity hover:opacity-60"
              >
                <ShoppingBag className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span
                    className={cn(
                      'absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.6rem] font-medium leading-none',
                      solid ? 'bg-noir text-white' : 'bg-white text-noir'
                    )}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartDrawer />
    </>
  );
}
