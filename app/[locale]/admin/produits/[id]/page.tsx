import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { rowToProduct } from '@/lib/products';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const row = await prisma.product.findUnique({ where: { id } });
  if (!row) notFound();

  const product = rowToProduct(row);

  return (
    <div className="space-y-8">
      <header className="border-b border-marron/20 pb-6">
        <Link
          href="/admin/produits"
          className="font-sans text-[0.7rem] tracking-[0.15em] uppercase text-marron-dark hover:text-noir"
        >
          ← Retour aux produits
        </Link>
        <h1 className="mt-4 font-display text-4xl text-noir">
          Modifier le produit
        </h1>
        <p className="mt-2 font-sans text-sm text-marron">{product.nameFr}</p>
      </header>

      <ProductForm action="edit" initial={product} />
    </div>
  );
}
