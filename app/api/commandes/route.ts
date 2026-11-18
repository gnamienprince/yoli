import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const itemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().nonnegative(),
});

const customerSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    notes: z.string().optional(),
  })
  .partial()
  .optional();

const orderSchema = z.object({
  email: z.string().email(),
  items: z.array(itemSchema).min(1),
  total: z.number().nonnegative(),
  currency: z.string().optional(),
  userId: z.string().optional(),
  customer: customerSchema,
});

/**
 * POST /api/commandes
 * Validates the payload, then persists an Order with its nested OrderItems.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Corps de requete invalide' },
      { status: 400 }
    );
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, items, total, currency, userId } = parsed.data;

  try {
    const order = await prisma.order.create({
      data: {
        email,
        total,
        currency: currency ?? 'XOF',
        status: 'pending',
        ...(userId ? { userId } : {}),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size ?? null,
            color: item.color ?? null,
          })),
        },
      },
    });

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    console.error('[api/commandes] POST error', error);
    return NextResponse.json(
      { ok: false, error: 'Impossible de creer la commande' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/commandes
 * Returns the most recent orders (lightweight listing for admin use).
 */
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { items: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('[api/commandes] GET error', error);
    return NextResponse.json(
      { error: 'Impossible de charger les commandes' },
      { status: 500 }
    );
  }
}
