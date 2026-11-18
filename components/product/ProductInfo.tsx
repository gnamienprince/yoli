'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Accordion } from '@/components/ui/Accordion';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { SizeSelector } from '@/components/product/SizeSelector';
import { ColorSelector } from '@/components/product/ColorSelector';
// The cart store is created in the Features phase; the module exists at build time.
import { useCartStore } from '@/stores/cart';
import { cn, formatPrice } from '@/lib/utils';
import type { Locale, Product } from '@/types';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations('product');
  const locale = useLocale() as Locale;

  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [size, setSize] = useState<string | undefined>(undefined);
  const [color, setColor] = useState<string | undefined>(
    product.colors?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [favorite, setFavorite] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const name = locale === 'en' ? product.nameEn : product.nameFr;
  const description =
    locale === 'en' ? product.descriptionEn : product.descriptionFr;

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const needsSize = Boolean(product.sizes && product.sizes.length > 0);

  const handleAddToCart = () => {
    if (outOfStock) return;
    if (needsSize && !size) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    addItem(product, quantity, size, color);
    toggleCart();
  };

  return (
    <div className="flex flex-col">
      <Badge category={product.category} className="self-start" />

      <h1 className="mt-5 font-display text-3xl font-light leading-tight text-noir md:text-4xl">
        {name}
      </h1>

      <p className="mt-3 font-sans text-lg text-marron-dark">
        {formatPrice(product.price, product.currency)}
      </p>

      {description && (
        <p className="mt-6 max-w-prose font-sans text-sm leading-relaxed text-noir/70">
          {description}
        </p>
      )}

      {/* Selectors */}
      <div className="mt-8 flex flex-col gap-7">
        {needsSize && (
          <div className="flex flex-col gap-2">
            <SizeSelector
              sizes={product.sizes as string[]}
              value={size}
              onChange={(s) => {
                setSize(s);
                setSizeError(false);
              }}
            />
            {sizeError && (
              <span className="font-sans text-xs text-or-dark">
                {t('selectSize')}
              </span>
            )}
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-noir">
              {t('color')}
            </span>
            <ColorSelector
              colors={product.colors}
              value={color}
              onChange={setColor}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <span className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-noir">
            {t('quantity')}
          </span>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={outOfStock ? 1 : Math.max(1, product.stock)}
          />
        </div>
      </div>

      {/* Stock hint */}
      {outOfStock ? (
        <p className="mt-6 font-sans text-xs tracking-[0.12em] uppercase text-marron-dark">
          {t('outOfStock')}
        </p>
      ) : lowStock ? (
        <p className="mt-6 font-sans text-xs tracking-[0.12em] uppercase text-or-dark">
          {t('lastPieces')}
        </p>
      ) : null}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className={cn(
            'btn-primary w-full',
            outOfStock && 'cursor-not-allowed opacity-40 hover:bg-noir'
          )}
        >
          {outOfStock ? t('outOfStock') : t('addToCart')}
        </button>

        <button
          type="button"
          onClick={() => setFavorite((v) => !v)}
          aria-pressed={favorite}
          className="btn-ghost justify-center py-3"
        >
          <Heart size={15} className={cn(favorite && 'fill-noir')} />
          {favorite ? t('removeFromFavorites') : t('addToFavorites')}
        </button>
      </div>

      {/* Details */}
      <div className="mt-10">
        <Accordion title={t('shippingTitle')} defaultOpen>
          <p>{t('shippingContent')}</p>
        </Accordion>
        <Accordion title={t('compositionTitle')}>
          <p>{t('compositionContent')}</p>
        </Accordion>
      </div>
    </div>
  );
}

export default ProductInfo;
