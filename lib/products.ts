import { prisma } from '@/lib/db';
import type { Category, Product } from '@/types';

/**
 * DB data-access layer for the YoLi storefront.
 *
 * Products live in Postgres (via Prisma). List fields (images, sizes, colors)
 * are stored as JSON strings, so we parse them on read. Every function is
 * wrapped in try/catch so the storefront degrades gracefully (empty/null)
 * rather than crashing when the DB is unreachable.
 */

/** Minimal shape of a Prisma Product row (list fields are JSON strings). */
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

/** Safely parse a JSON-string list field, guarding against already-parsed/empty values. */
function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  if (typeof value !== 'string') return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((v): v is string => typeof v === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

/** Maps a Prisma Product row to the typed Product used by the storefront. */
export function rowToProduct(row: ProductRow): Product {
  const sizes = parseList(row.sizes);
  const colors = parseList(row.colors);
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
    images: parseList(row.images),
    stock: row.stock,
    sizes: sizes.length ? sizes : undefined,
    colors: colors.length ? colors : undefined,
    featured: row.featured,
    active: row.active,
  };
}

export async function getAllProducts(opts?: {
  category?: Category;
  featured?: boolean;
  activeOnly?: boolean;
}): Promise<Product[]> {
  const { category, featured, activeOnly = true } = opts ?? {};
  try {
    const rows = await prisma.product.findMany({
      where: {
        ...(activeOnly ? { active: true } : {}),
        ...(category ? { category } : {}),
        ...(featured !== undefined ? { featured } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(rowToProduct);
  } catch (error) {
    console.error('[products] getAllProducts failed:', error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { featured: true, active: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map(rowToProduct);
  } catch (error) {
    console.error('[products] getFeaturedProducts failed:', error);
    return [];
  }
}

export async function getProductsByCategory(
  category: Category
): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { category, active: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(rowToProduct);
  } catch (error) {
    console.error('[products] getProductsByCategory failed:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({ where: { slug } });
    if (!row || !row.active) return null;
    return rowToProduct(row);
  } catch (error) {
    console.error('[products] getProductBySlug failed:', error);
    return null;
  }
}

export async function getRelatedProducts(
  product: Product,
  n = 4
): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: {
        category: product.category,
        active: true,
        id: { not: product.id },
      },
      orderBy: { createdAt: 'desc' },
      take: n,
    });
    return rows.map(rowToProduct);
  } catch (error) {
    console.error('[products] getRelatedProducts failed:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({ where: { id } });
    if (!row) return null;
    return rowToProduct(row);
  } catch (error) {
    console.error('[products] getProductById failed:', error);
    return null;
  }
}
