import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { requireAdmin } from '@/lib/admin';
import { signOut } from '@/lib/auth';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
];

async function signOutAction() {
  'use server';
  await signOut({ redirectTo: '/fr/connexion' });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const email = session.user?.email ?? '';

  const navItemClass =
    'flex items-center gap-3 px-4 py-3 text-xs font-sans tracking-[0.12em] uppercase text-ivoire/70 hover:text-ivoire hover:bg-white/5 transition-colors duration-200 rounded';

  return (
    <div className="fixed inset-0 z-[60] flex flex-col md:flex-row bg-ivoire">
      {/* Sidebar */}
      <aside className="flex md:h-full md:w-64 md:flex-col md:shrink-0 flex-col bg-noir text-ivoire">
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="block">
            <span className="font-display text-2xl tracking-wide text-ivoire">
              YoLi
            </span>
            <span className="ml-2 font-sans text-[0.6rem] tracking-[0.25em] uppercase text-or">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex md:flex-col flex-row flex-wrap gap-1 p-3 md:flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={navItemClass}>
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </Link>
          ))}

          <div className="hidden md:block my-3 border-t border-white/10" />

          <Link href="/" className={navItemClass}>
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span>Voir le site</span>
          </Link>

          <form action={signOutAction} className="w-full">
            <button type="submit" className={cn(navItemClass, 'w-full text-left')}>
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Deconnexion</span>
            </button>
          </form>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-marron/20 bg-white px-6 py-4">
          <span className="font-display text-xl text-noir tracking-wide">
            Espace administrateur
          </span>
          <span className="font-sans text-xs text-marron truncate">{email}</span>
        </header>

        <main className="flex-1 overflow-y-auto bg-ivoire px-5 py-8 md:px-10 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
