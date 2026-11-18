import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const registerSchema = z
  .object({
    name: z.string().min(1).optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .refine((data) => data.name || data.firstName || data.lastName, {
    message: 'A name is required',
    path: ['name'],
  });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, firstName, lastName, email, password } = parsed.data;

  const composedName =
    name ?? ([firstName, lastName].filter(Boolean).join(' ').trim() || null);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: 'Un compte existe deja avec cet email' },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: composedName,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ ok: true, id: user.id }, { status: 201 });
}
