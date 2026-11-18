'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from '@/i18n/navigation';
// The cart store is created in a later (Features) phase. Importing it now is
// intentional — the module will exist by build time.
import { useCartStore } from '@/stores/cart';
import { cn, formatPrice } from '@/lib/utils';
import type { Locale, Product } from '@/types';

interface ProductCardProps {
  product: Product;
  locale?: Locale;
  priority?: boolean;
}

export function ProductCard({
  product,
  locale = 'fr',
  priority = false,
}: ProductCardProps) {
  const [favorite, setFavorite] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const name = locale === 'en' ? product.nameEn : product.nameFr;
  const primaryImage = product.images[0];
  const secondaryImage = product.images[1];
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite((v) => !v);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product, 1);
  };

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-marron/5">
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              'object-cover transition-transform duration-700 ease-out group-hover:scale-105',
              secondaryImage &&
                'transition-opacity group-hover:opacity-0'
            )}
          />
        )}

        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-100"
          />
        )}

        {/* Favorite */}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={favorite}
          className={cn(
            'absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-noir backdrop-blur-sm transition-all duration-300',
            'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-white',
            favorite && 'opacity-100'
          )}
        >
          <Heart
            size={16}
            className={cn('transition-colors', favorite && 'fill-noir')}
          />
        </button>

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-ivoire/70 backdrop-blur-[1px]">
            <span className="font-sans text-[0.7rem] tracking-ultra uppercase text-noir">
              Épuisé
            </span>
          </div>
        )}

        {/* Low stock tag */}
        {lowStock && (
          <span className="absolute left-3 top-3 z-10 bg-noir px-2.5 py-1 font-sans text-[0.55rem] tracking-widest uppercase text-white">
            Dernières pièces
          </span>
        )}

        {/* Add to cart bar — slides up on hover (pointer/hover devices) */}
        {!outOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full items-center justify-center gap-2 bg-noir/90 py-3.5 font-sans text-[0.65rem] tracking-ultra uppercase text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 md:flex"
          >
            <ShoppingBag size={14} />
            Ajouter au panier
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="font-display text-base font-normal leading-snug text-noir transition-colors group-hover:text-marron-dark">
          {name}
        </h3>
        <p className="font-sans text-sm text-marron-dark">
          {formatPrice(product.price, product.currency)}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
