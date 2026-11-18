import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { Category, Product } from '@/types';

type ProductRow = {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  price: number;
  currency: string;
  category: string;
  subcategory: string | null;
  images: string;
  stock: number;
  sizes: string | null;
  colors: string | null;
  featured: boolean;
  active: boolean;
};

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    nameFr: row.nameFr,
    nameEn: row.nameEn,
    descriptionFr: row.descriptionFr,
    descriptionEn: row.descriptionEn,
    price: row.price,
    currency: row.currency,
    category: row.category as Category,
    subcategory: row.subcategory ?? undefined,
    images: parseJsonArray(row.images),
    stock: row.stock,
    sizes: parseJsonArray(row.sizes),
    colors: parseJsonArray(row.colors),
    featured: row.featured,
    active: row.active,
  };
}

/**
 * GET /api/produits/[slug]
 * Returns a single active product by its slug, or 404 if not found.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const row = (await prisma.product.findUnique({
      where: { slug },
    })) as ProductRow | null;

    if (!row || !row.active) {
      return NextResponse.json(
        { error: 'Produit introuvable' },
        { status: 404 }
      );
    }

    return NextResponse.json(mapProduct(row));
  } catch (error) {
    console.error('[api/produits/[slug]] GET error', error);
    return NextResponse.json(
      { error: 'Impossible de charger le produit' },
      { status: 500 }
    );
  }
}
