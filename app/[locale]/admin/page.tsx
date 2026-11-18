import {
  Package,
  CheckCircle2,
  ShoppingBag,
  Clock,
  Mail,
  Banknote,
  Plus,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { prisma } from '@/lib/db';
import { formatPrice, cn } from '@/lib/utils';
import { STATUS_LABELS, STATUS_BADGE } from './commandes/status';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    activeProducts,
    totalOrders,
    pendingOrders,
    subscribers,
    revenueAgg,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.newsletter.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
  ]);

  const revenue = revenueAgg._sum.total ?? 0;

  const stats = [
    {
      label: 'Produits',
      value: totalProducts,
      hint: `${activeProducts} actifs`,
      icon: Package,
    },
    {
      label: 'Produits actifs',
      value: activeProducts,
      hint: 'en vente',
      icon: CheckCircle2,
    },
    {
      label: 'Commandes',
      value: totalOrders,
      hint: 'au total',
      icon: ShoppingBag,
    },
    {
      label: 'En attente',
      value: pendingOrders,
      hint: 'a traiter',
      icon: Clock,
    },
    {
      label: 'Abonnes newsletter',
      value: subscribers,
      hint: 'inscrits',
      icon: Mail,
    },
    {
      label: 'Chiffre d affaires',
      value: formatPrice(revenue, 'XOF'),
      hint: 'cumule',
      icon: Banknote,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-light text-noir tracking-wide">
          Tableau de bord
        </h1>
        <p className="mt-1 font-sans text-sm text-marron">
          Vue d ensemble de votre boutique YoLi
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div
            key={label}
            className="rounded border border-marron/15 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-marron">
                  {label}
                </p>
                <p className="mt-3 font-display text-3xl font-light text-noir">
                  {value}
                </p>
                <p className="mt-1 font-sans text-xs text-marron/70">{hint}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivoire text-marron">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <section className="rounded border border-marron/15 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-marron/15 px-6 py-4">
          <h2 className="font-display text-xl font-light text-noir">
            Commandes recentes
          </h2>
          <Link
            href="/admin/commandes"
            className="font-sans text-[0.7rem] tracking-[0.15em] uppercase text-marron hover:text-noir transition-colors"
          >
            Tout voir
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="px-6 py-10 text-center font-sans text-sm text-marron">
            Aucune commande pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-marron/10 text-[0.68rem] uppercase tracking-[0.12em] text-marron">
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-noir">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-marron/5 last:border-0 hover:bg-ivoire/50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="hover:text-marron transition-colors"
                      >
                        {order.email}
                      </Link>
                    </td>
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
                    <td className="px-6 py-4 text-marron">
                      {new Intl.DateTimeFormat('fr-FR', {
                        dateStyle: 'medium',
                      }).format(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Shortcuts */}
      <section>
        <h2 className="mb-4 font-display text-xl font-light text-noir">
          Raccourcis
        </h2>
        {totalProducts === 0 && (
          <p className="mb-4 rounded border border-or/30 bg-or/10 px-4 py-3 font-sans text-sm text-noir">
            Vous n avez pas encore de produit. Commencez par en ajouter un.
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/produits/nouveau"
            className="inline-flex items-center gap-2 rounded bg-noir px-6 py-3 font-sans text-xs tracking-[0.15em] uppercase text-white transition-colors hover:bg-noir-light"
          >
            <Plus className="h-4 w-4" />
            Ajouter un produit
          </Link>
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-2 rounded border border-noir px-6 py-3 font-sans text-xs tracking-[0.15em] uppercase text-noir transition-colors hover:bg-noir hover:text-white"
          >
            <Package className="h-4 w-4" />
            Gerer les produits
          </Link>
        </div>
      </section>
    </div>
  );
}
