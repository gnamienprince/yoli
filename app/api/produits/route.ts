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

/** Safely parse a JSON string column back into a string array. */
function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Map a raw Prisma row into the shared Product shape used by the storefront. */
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
 * GET /api/produits
 * Query params:
 *   - category : filter by product universe (femme | parfums | bijoux | homme)
 *   - featured : "true" to return only featured products
 *   - limit    : cap the number of returned products
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limitParam = searchParams.get('limit');

    const where: Record<string, unknown> = { active: true };
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

    const rows = (await prisma.product.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      ...(limit && Number.isFinite(limit) && limit > 0 ? { take: limit } : {}),
    })) as ProductRow[];

    const products = rows.map(mapProduct);

    return NextResponse.json(products);
  } catch (error) {
    console.error('[api/produits] GET error', error);
    return NextResponse.json(
      { error: 'Impossible de charger les produits' },
      { status: 500 }
    );
  }
}
