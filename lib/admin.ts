import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import type { Session } from 'next-auth';

/**
 * Guards an admin page/layout. Returns the session when the current user has
 * the 'admin' role, otherwise redirects to the sign-in page with a callback
 * back to the admin area. Call this at the top of every admin server component.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await auth();

  if (session?.user?.role === 'admin') {
    return session;
  }

  redirect('/fr/connexion?callbackUrl=/fr/admin');
}

/** Lightweight check: true when the current user is an admin. */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'admin';
}
