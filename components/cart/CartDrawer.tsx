'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/stores/cart';
import { CartItem } from '@/components/cart/CartItem';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const t = useTranslations('cart');
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = getTotalPrice();

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-noir/40"
            aria-hidden="true"
          />

          <motion.aside
            key="cart-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-ivoire shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={t('title')}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-marron/20 px-6 py-5">
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-xl font-light text-noir">
                  {t('title')}
                </h2>
                <span className="font-sans text-xs text-noir/50">
                  ({count})
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label={t('continue')}
                className="text-noir/50 transition-colors hover:text-noir"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty state */
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-nude/30 text-marron-dark">
                  <ShoppingBag size={24} strokeWidth={1.5} />
                </span>
                <div className="space-y-2">
                  <p className="font-display text-lg font-light text-noir">
                    {t('empty.title')}
                  </p>
                  <p className="font-sans text-xs leading-relaxed text-noir/50">
                    {t('empty.text')}
                  </p>
                </div>
                <Link
                  href="/boutique/femme"
                  onClick={closeCart}
                  className="btn-primary mt-2"
                >
                  {t('empty.button')}
                </Link>
              </div>
            ) : (
              <>
                {/* Scrollable list */}
                <div className="flex-1 divide-y divide-marron/15 overflow-y-auto px-6">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.product.id}-${item.size ?? ''}-${item.color ?? ''}`}
                      item={item}
                    />
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-marron/20 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-sans text-xs uppercase tracking-[0.18em] text-noir/60">
                      {t('subtotal')}
                    </span>
                    <span className="font-sans text-base text-noir">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <Link
                    href="/commande"
                    onClick={closeCart}
                    className="btn-primary w-full text-center"
                  >
                    {t('checkout')}
                  </Link>

                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-3 w-full font-sans text-[0.72rem] uppercase tracking-[0.18em] text-noir/60 transition-colors hover:text-noir"
                  >
                    {t('continue')}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
