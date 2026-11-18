import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumb?: Breadcrumb[];
}

export default function PageHeader({
  title,
  subtitle,
  image,
  breadcrumb,
}: PageHeaderProps) {
  const hasImage = Boolean(image);

  return (
    <section
      className={cn(
        'relative w-full flex flex-col items-center justify-center text-center overflow-hidden',
        hasImage ? 'min-h-[45vh] pt-28 pb-16' : 'bg-ivoire pt-36 pb-16'
      )}
    >
      {hasImage && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-noir/45" />
        </>
      )}

      <div
        className={cn(
          'relative z-10 container-yoli flex flex-col items-center',
          hasImage ? 'text-white' : 'text-noir'
        )}
      >
        {breadcrumb && breadcrumb.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className={cn(
              'mb-6 flex items-center flex-wrap justify-center gap-1.5 font-sans text-[0.7rem] tracking-[0.15em] uppercase',
              hasImage ? 'text-white/70' : 'text-marron'
            )}
          >
            {breadcrumb.map((crumb, i) => (
              <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" strokeWidth={1.5} />}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition-opacity hover:opacity-60">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="opacity-80">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {subtitle && (
          <p
            className={cn(
              'section-eyebrow mb-4',
              hasImage && 'text-white/80'
            )}
          >
            {subtitle}
          </p>
        )}

        <h1
          className={cn(
            'section-title',
            hasImage && 'text-white'
          )}
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
