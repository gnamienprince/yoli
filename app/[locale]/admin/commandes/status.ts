/** French labels + badge styles for order statuses, shared across admin pages. */

export const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payee',
  shipped: 'Expediee',
  delivered: 'Livree',
  cancelled: 'Annulee',
};

export const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-or/20 text-noir',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-marron/20 text-marron-dark',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
};

export const STATUS_ORDER = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
] as const;
