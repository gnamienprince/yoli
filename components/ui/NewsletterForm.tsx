'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function NewsletterForm({
  variant = 'light',
  className,
}: NewsletterFormProps) {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const dark = variant === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Front-end only for now; a backend agent can wire the endpoint later.
    setStatus('success');
    setEmail('');
  };

  if (status === 'success') {
    return (
      <p
        className={cn(
          'flex items-center gap-2 font-sans text-sm',
          dark ? 'text-ivoire/80' : 'text-noir/70',
          className
        )}
      >
        <Check className="h-4 w-4 text-or" strokeWidth={1.5} />
        {t('success')}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex items-center gap-0', className)}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('placeholder')}
        className={cn(
          'flex-1 bg-transparent border-b py-2.5 font-sans text-sm focus:outline-none transition-colors',
          dark
            ? 'border-ivoire/30 text-ivoire placeholder:text-ivoire/40 focus:border-or'
            : 'border-marron/40 text-noir placeholder:text-marron/50 focus:border-noir'
        )}
      />
      <button
        type="submit"
        aria-label={t('submit')}
        className={cn(
          'border-b py-2.5 pl-4 pr-1 transition-colors',
          dark
            ? 'border-ivoire/30 text-ivoire hover:text-or'
            : 'border-marron/40 text-noir hover:text-marron'
        )}
      >
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </form>
  );
}
