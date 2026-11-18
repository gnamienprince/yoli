import { Link } from '@/i18n/navigation';
import { requireAdmin } from '@/lib/admin';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <header className="border-b border-marron/20 pb-6">
        <Link
          href="/admin/produits"
          className="font-sans text-[0.7rem] tracking-[0.15em] uppercase text-marron-dark hover:text-noir"
        >
          ← Retour aux produits
        </Link>
        <h1 className="mt-4 font-display text-4xl text-noir">Nouveau produit</h1>
        <p className="mt-2 font-sans text-sm text-marron">
          Renseignez les informations du produit et ajoutez ses photos.
        </p>
      </header>

      <ProductForm action="create" />
    </div>
  );
}
