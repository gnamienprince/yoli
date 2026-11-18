import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ImageGallery } from '@/components/product/ImageGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from '@/lib/mock-data';
import type { Locale } from '@/types';

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'YoLi' };
  }

  const name = locale === 'en' ? product.nameEn : product.nameFr;
  const description =
    locale === 'en' ? product.descriptionEn : product.descriptionFr;

  return {
    title: `${name} — YoLi`,
    description,
    openGraph: {
      title: `${name} — YoLi`,
      description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const locale = (await getLocale()) as Locale;
  const tNav = await getTranslations('nav');
  const tProduct = await getTranslations('product');

  const name = locale === 'en' ? product.nameEn : product.nameFr;
  const related = getRelatedProducts(product);

  return (
    <div className="container-yoli py-6 md:py-10">
      <Breadcrumb
        className="mb-6 md:mb-10"
        items={[
          { label: tProduct('home'), href: '/' },
          {
            label: tNav(product.category),
            href: `/boutique/${product.category}`,
          },
          { label: name },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <ImageGallery images={product.images} name={name} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductInfo product={product} />
        </div>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
