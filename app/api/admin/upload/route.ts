import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const runtime = 'nodejs';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = Math.round(4.5 * 1024 * 1024); // 4.5 MB

/**
 * Admin-only image uploader. Receives a single multipart `file`, validates the
 * MIME type and size, then stores it in the public Vercel Blob store under the
 * `produits/` prefix. Returns the public URL of the stored image.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Blob storage non configuré en local.' },
      { status: 500 }
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const value = form.get('file');
    if (value instanceof File) {
      file = value;
    }
  } catch {
    return NextResponse.json(
      { error: 'Requête invalide.' },
      { status: 400 }
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: 'Aucun fichier fourni.' },
      { status: 400 }
    );
  }

  if (!ACCEPTED.includes(file.type)) {
    return NextResponse.json(
      { error: 'Format non supporté. Utilisez JPEG, PNG ou WebP.' },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "L'image dépasse la taille maximale de 4,5 Mo." },
      { status: 400 }
    );
  }

  try {
    const safeName = slugify(file.name) || 'image';
    const blob = await put(`produits/${Date.now()}-${safeName}`, file, {
      access: 'public',
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('[admin/upload] blob put failed:', error);
    return NextResponse.json(
      { error: "Échec du téléversement de l'image." },
      { status: 500 }
    );
  }
}
