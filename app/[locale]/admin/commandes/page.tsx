import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/db';
import { formatPrice, cn } from '@/lib/utils';
import { STATUS_LABELS, STATUS_BADGE } from './status';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-light text-noir tracking-wide">
          Commandes
        </h1>
        <p className="mt-1 font-sans text-sm text-marron">
          {orders.length} commande{orders.length > 1 ? 's' : ''} au total
        </p>
      </div>

      <section className="rounded border border-marron/15 bg-white shadow-sm">
        {orders.length === 0 ? (
          <p className="px-6 py-14 text-center font-sans text-sm text-marron">
            Aucune commande pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-marron/10 text-[0.68rem] uppercase tracking-[0.12em] text-marron">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Articles</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-noir">
                {orders.map((order) => {
                  const itemCount = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-marron/5 last:border-0 hover:bg-ivoire/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-marron">
                        {new Intl.DateTimeFormat('fr-FR', {
                          dateStyle: 'medium',
                        }).format(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/commandes/${order.id}`}
                          className="hover:text-marron transition-colors"
                        >
                          {order.email}
                        </Link>
                      </td>
                      <td className="px-6 py-4">{itemCount}</td>
                      <td className="px-6 py-4">
                        {formatPrice(order.total, order.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'inline-block rounded-full px-3 py-1 text-[0.65rem] font-medium tracking-wide',
                            STATUS_BADGE[order.status] ?? STATUS_BADGE.pending
                          )}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
