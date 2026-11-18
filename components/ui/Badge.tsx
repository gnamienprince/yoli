import { cn } from '@/lib/utils';
import type { Category } from '@/types';

const categoryStyles: Record<Category, { className: string; label: string }> = {
  femme: { className: 'bg-rose-nude text-noir', label: 'Femme' },
  parfums: { className: 'bg-marron/20 text-marron-dark', label: 'Parfums' },
  bijoux: { className: 'bg-or/20 text-or-dark', label: 'Bijoux' },
  homme: { className: 'bg-noir text-white', label: 'Homme' },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: Category;
  label?: string;
}

export function Badge({ category, label, className, ...props }: BadgeProps) {
  const style = categoryStyles[category];
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 font-sans text-[0.6rem] tracking-widest uppercase',
        style.className,
        className
      )}
      {...props}
    >
      {label ?? style.label}
    </span>
  );
}
