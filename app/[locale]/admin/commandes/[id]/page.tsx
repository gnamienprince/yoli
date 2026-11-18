import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/db';
import { formatPrice, cn } from '@/lib/utils';
import {
  STATUS_LABELS,
  STATUS_BADGE,
  STATUS_ORDER,
} from '../status';

export const dynamic = 'force-dynamic';

async function updateStatusAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  if (!id || !STATUS_ORDER.includes(status as (typeof STATUS_ORDER)[number])) {
    return;
  }
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath(`/fr/admin/commandes/${id}`);
  revalidatePath('/fr/admin/commandes');
  revalidatePath('/fr/admin');
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/admin/commandes"
          className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.12em] uppercase text-marron hover:text-noir transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux commandes
        </Link>
        <h1 className="mt-4 font-display text-3xl font-light text-noir tracking-wide">
          Commande
        </h1>
        <p className="mt-1 font-sans text-xs text-marron">
          #{order.id}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Items */}
        <section className="md:col-span-2 rounded border border-marron/15 bg-white shadow-sm">
          <div className="border-b border-marron/15 px-6 py-4">
            <h2 className="font-display text-xl font-light text-noir">
              Articles
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-marron/10 text-[0.68rem] uppercase tracking-[0.12em] text-marron">
                  <th className="px-6 py-3 font-medium">Produit</th>
                  <th className="px-6 py-3 font-medium">Qte</th>
                  <th className="px-6 py-3 font-medium">Prix</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-noir">
                {order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-marron/5 last:border-0 align-top"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {item.product?.nameFr ?? 'Produit supprime'}
                      </p>
                      {(item.size || item.color) && (
                        <p className="mt-1 text-xs text-marron">
                          {[item.size, item.color]
                            .filter(Boolean)
                            .join(' / ')}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">
                      {formatPrice(item.price * item.quantity, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-sans text-sm text-noir">
                  <td className="px-6 py-4 font-medium" colSpan={2}>
                    Total
                  </td>
                  <td className="px-6 py-4 font-display text-lg">
                    {formatPrice(order.total, order.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Summary + status */}
        <aside className="space-y-6">
          <section className="rounded border border-marron/15 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-light text-noir">
              Client
            </h2>
            <p className="mt-2 font-sans text-sm text-noir break-words">
              {order.email}
            </p>
            <p className="mt-4 font-sans text-[0.7rem] tracking-[0.15em] uppercase text-marron">
              Passee le
            </p>
            <p className="font-sans text-sm text-noir">
              {new Intl.DateTimeFormat('fr-FR', {
                dateStyle: 'long',
                timeStyle: 'short',
              }).format(order.createdAt)}
            </p>
          </section>

          <section className="rounded border border-marron/15 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-light text-noir">
              Statut
            </h2>
            <div className="mt-3">
              <span
                className={cn(
                  'inline-block rounded-full px-3 py-1 text-[0.65rem] font-medium tracking-wide',
                  STATUS_BADGE[order.status] ?? STATUS_BADGE.pending
                )}
              >
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>

            <form action={updateStatusAction} className="mt-5 space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="w-full border border-marron/30 bg-white px-3 py-2.5 font-sans text-sm text-noir focus:outline-none focus:border-noir transition-colors"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full rounded bg-noir px-4 py-3 font-sans text-xs tracking-[0.15em] uppercase text-white transition-colors hover:bg-noir-light"
              >
                Mettre a jour
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
