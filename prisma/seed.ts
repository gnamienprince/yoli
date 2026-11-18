import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { products } from '../lib/mock-data';

// tsx does not auto-load .env; fall back to the dev SQLite file so the seed
// works whether invoked via `prisma db seed` or directly via `tsx`.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding YoLi database...');

  // ---------------------------------------------------------------------------
  // Products — upsert the full catalogue by slug.
  // Array fields (images / sizes / colors) are stored as JSON strings because
  // SQLite has no native array type.
  // ---------------------------------------------------------------------------
  let productCount = 0;

  for (const p of products) {
    const data = {
      nameFr: p.nameFr,
      nameEn: p.nameEn,
      descriptionFr: p.descriptionFr,
      descriptionEn: p.descriptionEn,
      price: p.price,
      currency: p.currency ?? 'XOF',
      category: p.category,
      subcategory: p.subcategory ?? null,
      images: JSON.stringify(p.images ?? []),
      stock: p.stock ?? 0,
      sizes: p.sizes ? JSON.stringify(p.sizes) : null,
      colors: p.colors ? JSON.stringify(p.colors) : null,
      featured: p.featured ?? false,
      active: p.active ?? true,
    };

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });

    productCount += 1;
  }

  // ---------------------------------------------------------------------------
  // Admin user
  // ---------------------------------------------------------------------------
  const adminEmail = 'admin@yoli.ci';
  const adminPassword = await bcrypt.hash('yoli2026', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'YoLi Admin',
      role: 'admin',
      password: adminPassword,
    },
    create: {
      email: adminEmail,
      name: 'YoLi Admin',
      role: 'admin',
      password: adminPassword,
    },
  });

  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();

  console.log(`Seeded ${productCount} products (upsert).`);
  console.log(`Admin user ready: ${adminEmail} / yoli2026`);
  console.log(`Database totals -> products: ${totalProducts}, users: ${totalUsers}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
