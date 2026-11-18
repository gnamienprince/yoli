import { Fragment } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className={cn(
        'flex flex-wrap items-center gap-2 font-sans text-[0.7rem] tracking-[0.14em] uppercase',
        className
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-noir/60 transition-colors hover:text-noir"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(isLast ? 'text-marron-dark' : 'text-noir/60')}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-marron/50">/</span>}
          </Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
