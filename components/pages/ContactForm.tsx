'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');

  const schema = z.object({
    name: z.string().min(1, { message: t('validation.name') }),
    email: z.string().email({ message: t('validation.email') }),
    subject: z.string().min(1, { message: t('validation.subject') }),
    message: z.string().min(10, { message: t('validation.message') }),
  });

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-5 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-or/15 text-or-dark">
          <Check size={26} strokeWidth={1.5} />
        </span>
        <p className="max-w-sm font-sans text-sm leading-relaxed text-noir/70">
          {t('success')}
        </p>
        <Button variant="secondary" size="sm" onClick={() => setStatus('idle')}>
          {t('formTitle')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Input
        label={t('name')}
        placeholder={t('namePlaceholder')}
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        type="email"
        label={t('emailField')}
        placeholder={t('emailPlaceholder')}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={t('subject')}
        placeholder={t('subjectPlaceholder')}
        error={errors.subject?.message}
        {...register('subject')}
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="contact-message"
          className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-marron-dark"
        >
          {t('message')}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder={t('messagePlaceholder')}
          aria-invalid={errors.message ? true : undefined}
          className={cn(
            'input-field resize-none',
            errors.message && 'border-red-700/60 focus:border-red-700'
          )}
          {...register('message')}
        />
        {errors.message && (
          <span className="font-sans text-xs text-red-700">
            {errors.message.message}
          </span>
        )}
      </div>

      {status === 'error' && (
        <p className="flex items-center gap-2 font-sans text-xs text-red-700">
          <AlertCircle size={14} />
          {t('error')}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? t('sending') : t('submit')}
      </Button>
    </form>
  );
}
