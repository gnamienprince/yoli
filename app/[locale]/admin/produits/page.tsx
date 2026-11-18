import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/db';
import { rowToProduct } from '@/lib/products';
import { cn, formatPrice } from '@/lib/utils';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';
import type { Category } from '@/types';

const CATEGORY_LABELS: Record<Category, string> = {
  femme: 'Femme',
  parfums: 'Parfums',
  bijoux: 'Bijoux',
  homme: 'Homme',
};

export default async function AdminProductsPage() {
  await requireAdmin();

  const rows = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  const products = rows.map(rowToProduct);

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-marron/20 pb-6">
        <div>
          <h1 className="font-display text-4xl text-noir">Produits</h1>
          <p className="mt-2 font-sans text-sm text-marron">
            {products.length} produit{products.length > 1 ? 's' : ''} au
            catalogue
          </p>
        </div>
        <Link href="/admin/produits/nouveau" className="btn-primary px-8 py-3.5 text-xs">
          + Nouveau produit
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-5 border border-dashed border-marron/40 bg-ivoire/40 px-6 py-20 text-center">
          <h2 className="font-display text-2xl text-noir">
            Aucun produit pour le moment
          </h2>
          <p className="max-w-md font-sans text-sm text-marron">
            Commencez à bâtir votre catalogue en ajoutant votre premier produit
            avec ses photos.
          </p>
          <Link
            href="/admin/produits/nouveau"
            className="btn-primary px-8 py-3.5 text-xs"
          >
            + Créer un produit
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-marron/20 bg-white">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-marron/20 bg-ivoire/50 text-left">
                <Th className="w-20">Image</Th>
                <Th>Nom</Th>
                <Th>Catégorie</Th>
                <Th>Prix</Th>
                <Th>Stock</Th>
                <Th>Statut</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const thumb = product.images[0];
                return (
                  <tr
                    key={product.id}
                    className="border-b border-marron/10 last:border-0 hover:bg-ivoire/30"
                  >
                    <Td>
                      <div className="relative h-14 w-14 overflow-hidden border border-marron/20 bg-ivoire">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt={product.nameFr}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center font-sans text-[0.6rem] uppercase text-marron/50">
                            —
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <Link
                        href={`/admin/produits/${product.id}`}
                        className="font-display text-lg text-noir hover:text-marron-dark"
                      >
                        {product.nameFr}
                      </Link>
                      {product.subcategory && (
                        <div className="font-sans text-xs text-marron">
                          {product.subcategory}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <span className="inline-block border border-marron/30 px-3 py-1 font-sans text-[0.65rem] tracking-[0.12em] uppercase text-marron-dark">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-sans text-sm text-noir">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </Td>
                    <Td>
                      <span
                        className={cn(
                          'font-sans text-sm',
                          product.stock === 0
                            ? 'font-medium text-red-700'
                            : 'text-noir'
                        )}
                      >
                        {product.stock}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 font-sans text-[0.6rem] tracking-[0.12em] uppercase',
                            product.active
                              ? 'bg-noir text-ivoire'
                              : 'bg-marron/20 text-marron-dark'
                          )}
                        >
                          {product.active ? 'Actif' : 'Inactif'}
                        </span>
                        {product.featured && (
                          <span
                            className="text-or"
                            title="En vedette"
                            aria-label="En vedette"
                          >
                            ★
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/produits/${product.id}`}
                          className="font-sans text-[0.7rem] tracking-[0.12em] uppercase text-marron-dark hover:text-noir"
                        >
                          Modifier
                        </Link>
                        <DeleteProductButton
                          id={product.id}
                          name={product.nameFr}
                        />
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        'px-4 py-3 font-sans text-[0.65rem] font-normal tracking-[0.15em] uppercase text-marron-dark',
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn('px-4 py-4 align-middle', className)}>{children}</td>;
}
