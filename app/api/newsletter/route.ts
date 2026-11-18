import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const newsletterSchema = z.object({
  email: z.string().email(),
  locale: z.string().optional(),
});

/**
 * POST /api/newsletter
 * Upserts a newsletter subscription by email. Duplicate sign-ups are handled
 * gracefully (the existing record is simply refreshed).
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

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, locale } = parsed.data;

  try {
    await prisma.newsletter.upsert({
      where: { email },
      update: { locale: locale ?? 'fr' },
      create: { email, locale: locale ?? 'fr' },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api/newsletter] POST error', error);
    return NextResponse.json(
      { ok: false, error: 'Inscription impossible' },
      { status: 500 }
    );
  }
}
