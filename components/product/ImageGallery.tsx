'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : [''];

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:gap-5">
      {/* Main image — desktop + mobile first frame */}
      <div className="relative hidden flex-1 overflow-hidden bg-marron/5 lg:block">
        <div className="relative aspect-[3/4] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              {gallery[active] && (
                <Image
                  src={gallery[active]}
                  alt={`${name} — vue ${active + 1}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Thumbnail column — desktop only */}
      {gallery.length > 1 && (
        <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
          {gallery.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Afficher la vue ${i + 1}`}
              aria-current={active === i}
              className={cn(
                'relative aspect-[3/4] w-full overflow-hidden bg-marron/5 transition-opacity duration-200',
                active === i
                  ? 'opacity-100 ring-1 ring-noir'
                  : 'opacity-60 hover:opacity-100'
              )}
            >
              {img && (
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile — horizontal scroll-snap carousel with dots */}
      <div className="lg:hidden">
        <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {gallery.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[3/4] w-[82%] shrink-0 snap-center overflow-hidden bg-marron/5"
            >
              {img && (
                <Image
                  src={img}
                  alt={`${name} — vue ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="82vw"
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>
        {gallery.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {gallery.map((_, i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full bg-marron/40"
                aria-hidden
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageGallery;
