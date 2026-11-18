'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

const productSchema = z.object({
  nameFr: z.string().trim().min(1, 'Le nom (FR) est requis.'),
  nameEn: z.string().trim().min(1, 'Le nom (EN) est requis.'),
  descriptionFr: z.string().trim().min(1, 'La description (FR) est requise.'),
  descriptionEn: z.string().trim().min(1, 'La description (EN) est requise.'),
  price: z.coerce.number().positive('Le prix doit être supérieur à 0.'),
  category: z.enum(['femme', 'parfums', 'bijoux', 'homme'], {
    errorMap: () => ({ message: 'Catégorie invalide.' }),
  }),
  subcategory: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined)),
  stock: z.coerce
    .number()
    .int('Le stock doit être un entier.')
    .min(0, 'Le stock ne peut pas être négatif.'),
  images: z.array(z.string().url()).default([]),
  sizes: z.array(z.string().trim().min(1)).default([]),
  colors: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type ProductInput = z.input<typeof productSchema>;

/** Returns a slug derived from `nameFr` that is unique in the products table. */
async function uniqueSlug(nameFr: string, excludeId?: string): Promise<string> {
  const base = slugify(nameFr) || 'produit';
  let candidate = base;
  let suffix = 1;
  // Loop until we find a slug no other product uses.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

async function ensureAdmin(): Promise<string | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return 'Non autorisé.';
  }
  return null;
}

function firstError(error: z.ZodError): string {
  return error.errors[0]?.message ?? 'Données invalides.';
}

function revalidateAll() {
  // Refresh both the storefront (all locales/layout) and the admin listing.
  revalidatePath('/', 'layout');
  revalidatePath('/[locale]/admin/produits', 'page');
}

export async function createProduct(data: ProductInput): Promise<ActionResult> {
  const authError = await ensureAdmin();
  if (authError) return { ok: false, error: authError };

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const d = parsed.data;

  try {
    const slug = await uniqueSlug(d.nameFr);
    const product = await prisma.product.create({
      data: {
        slug,
        nameFr: d.nameFr,
        nameEn: d.nameEn,
        descriptionFr: d.descriptionFr,
        descriptionEn: d.descriptionEn,
        price: d.price,
        currency: 'XOF',
        category: d.category,
        subcategory: d.subcategory ?? null,
        stock: d.stock,
        images: JSON.stringify(d.images),
        sizes: JSON.stringify(d.sizes),
        colors: JSON.stringify(d.colors),
        featured: d.featured,
        active: d.active,
      },
      select: { id: true },
    });
    revalidateAll();
    return { ok: true, id: product.id };
  } catch (error) {
    console.error('[actions] createProduct failed:', error);
    return { ok: false, error: 'Échec de la création du produit.' };
  }
}

export async function updateProduct(
  id: string,
  data: ProductInput
): Promise<ActionResult> {
  const authError = await ensureAdmin();
  if (authError) return { ok: false, error: authError };

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
  const d = parsed.data;

  try {
    const slug = await uniqueSlug(d.nameFr, id);
    await prisma.product.update({
      where: { id },
      data: {
        slug,
        nameFr: d.nameFr,
        nameEn: d.nameEn,
        descriptionFr: d.descriptionFr,
        descriptionEn: d.descriptionEn,
        price: d.price,
        category: d.category,
        subcategory: d.subcategory ?? null,
        stock: d.stock,
        images: JSON.stringify(d.images),
        sizes: JSON.stringify(d.sizes),
        colors: JSON.stringify(d.colors),
        featured: d.featured,
        active: d.active,
      },
    });
    revalidateAll();
    return { ok: true, id };
  } catch (error) {
    console.error('[actions] updateProduct failed:', error);
    return { ok: false, error: 'Échec de la mise à jour du produit.' };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const authError = await ensureAdmin();
  if (authError) return { ok: false, error: authError };

  try {
    await prisma.product.delete({ where: { id } });
    revalidateAll();
    return { ok: true, id };
  } catch (error) {
    // A product referenced by order items cannot be hard-deleted (FK
    // constraint). In that case we soft-delete by deactivating it instead.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      try {
        await prisma.product.update({
          where: { id },
          data: { active: false, featured: false },
        });
        revalidateAll();
        return { ok: true, id };
      } catch (inner) {
        console.error('[actions] deleteProduct soft-delete failed:', inner);
        return { ok: false, error: 'Échec de la suppression du produit.' };
      }
    }
    console.error('[actions] deleteProduct failed:', error);
    return { ok: false, error: 'Échec de la suppression du produit.' };
  }
}

export async function toggleFeatured(id: string): Promise<ActionResult> {
  const authError = await ensureAdmin();
  if (authError) return { ok: false, error: authError };

  try {
    const current = await prisma.product.findUnique({
      where: { id },
      select: { featured: true },
    });
    if (!current) return { ok: false, error: 'Produit introuvable.' };
    await prisma.product.update({
      where: { id },
      data: { featured: !current.featured },
    });
    revalidateAll();
    return { ok: true, id };
  } catch (error) {
    console.error('[actions] toggleFeatured failed:', error);
    return { ok: false, error: 'Échec de la mise à jour.' };
  }
}

export async function toggleActive(id: string): Promise<ActionResult> {
  const authError = await ensureAdmin();
  if (authError) return { ok: false, error: authError };

  try {
    const current = await prisma.product.findUnique({
      where: { id },
      select: { active: true },
    });
    if (!current) return { ok: false, error: 'Produit introuvable.' };
    await prisma.product.update({
      where: { id },
      data: { active: !current.active },
    });
    revalidateAll();
    return { ok: true, id };
  } catch (error) {
    console.error('[actions] toggleActive failed:', error);
    return { ok: false, error: 'Échec de la mise à jour.' };
  }
}
