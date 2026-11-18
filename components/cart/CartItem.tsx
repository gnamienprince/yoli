'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/stores/cart';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const t = useTranslations('cart');
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const { product, quantity, size, color } = item;
  const image = product.images[0];

  return (
    <div className="flex gap-4 py-6">
      <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-white">
        {image && (
          <Image
            src={image}
            alt={product.nameFr}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-base font-light text-noir">
              {product.nameFr}
            </p>
            {(size || color) && (
              <div className="mt-1 space-y-0.5 font-sans text-[0.7rem] tracking-wide text-noir/50">
                {size && (
                  <p>
                    {t('size')}: {size}
                  </p>
                )}
                {color && (
                  <p>
                    {t('color')}: {color}
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeItem(product.id, size, color)}
            aria-label={t('remove')}
            className="shrink-0 text-noir/40 transition-colors hover:text-noir"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <QuantitySelector
            value={quantity}
            onChange={(q) => updateQuantity(product.id, q, size, color)}
            max={product.stock || undefined}
          />
          <p className="font-sans text-sm text-noir">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
