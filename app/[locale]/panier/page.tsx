'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/stores/cart';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function PanierPage() {
  const t = useTranslations('cart');
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);

  // Avoid hydration mismatch with persisted store.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="container-yoli min-h-[50vh] pt-36 pb-24" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-yoli flex min-h-[60vh] flex-col items-center justify-center pt-36 pb-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-nude/30 text-marron-dark">
          <ShoppingBag size={30} strokeWidth={1.25} />
        </span>
        <h1 className="mt-8 font-display text-3xl font-light text-noir md:text-4xl">
          {t('empty.title')}
        </h1>
        <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-noir/60">
          {t('empty.text')}
        </p>
        <Link href="/boutique/femme" className="btn-primary mt-10">
          {t('empty.button')}
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const total = getTotalPrice();

  return (
    <div className="container-yoli pt-28 pb-24 md:pt-36">
      <h1 className="section-title mb-12">{t('title')}</h1>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        {/* Lines */}
        <div>
          <ul className="divide-y divide-marron/20 border-t border-marron/20">
            {items.map((item) => {
              const lineKey = `${item.product.id}-${item.size ?? ''}-${item.color ?? ''}`;
              return (
                <li key={lineKey} className="flex gap-5 py-8 md:gap-8">
                  <Link
                    href={`/produit/${item.product.slug}`}
                    className="shrink-0 overflow-hidden bg-white"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.nameFr}
                      className="h-32 w-24 object-cover md:h-40 md:w-32"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/produit/${item.product.slug}`}
                          className="link-underline font-display text-lg font-light text-noir md:text-xl"
                        >
                          {item.product.nameFr}
                        </Link>
                        <div className="mt-2 space-y-0.5 font-sans text-xs text-noir/50">
                          {item.size && (
                            <p>
                              {t('size')}: {item.size}
                            </p>
                          )}
                          {item.color && (
                            <p>
                              {t('color')}: {item.color}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        aria-label={t('remove')}
                        className="text-noir/40 transition-colors hover:text-noir"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.product.id, q)}
                        max={item.product.stock || undefined}
                      />
                      <p className="font-sans text-sm text-noir md:text-base">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <Link
            href="/boutique/femme"
            className="mt-8 inline-flex items-center gap-2 font-sans text-[0.72rem] tracking-[0.18em] uppercase text-noir transition-colors hover:text-marron-dark"
          >
            <ArrowRight size={14} className="rotate-180" />
            {t('continue')}
          </Link>
        </div>

        {/* Summary */}
        <aside className="h-fit border border-marron/25 bg-white p-8 lg:sticky lg:top-28">
          <h2 className="mb-6 font-display text-xl font-light text-noir">
            {t('summary')}
          </h2>
          <dl className="space-y-4 font-sans text-sm">
            <div className="flex justify-between text-noir/70">
              <dt>{t('subtotal')}</dt>
              <dd className="text-noir">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between text-noir/70">
              <dt>{t('shipping')}</dt>
              <dd className="text-right text-xs text-noir/50">
                {t('shippingValue')}
              </dd>
            </div>
            <div className="flex justify-between border-t border-marron/20 pt-4 font-sans text-base">
              <dt className="text-noir">{t('total')}</dt>
              <dd className="font-medium text-noir">{formatPrice(total)}</dd>
            </div>
          </dl>

          <Link href="/commande" className="btn-primary mt-8 w-full">
            {t('checkout')}
            <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
