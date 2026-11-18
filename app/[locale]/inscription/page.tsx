'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
}

export default function InscriptionPage() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors },
  } = useForm<RegisterValues>();

  const onSubmit = async (values: RegisterValues) => {
    setError(null);

    if (values.password.length < 8) {
      setFieldError('password', { message: t('tooShort') });
      return;
    }
    if (values.password !== values.confirm) {
      setFieldError('confirm', { message: t('mismatch') });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });

      if (!res.ok) {
        setError(t('error'));
        setLoading(false);
        return;
      }

      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      router.push('/');
      router.refresh();
    } catch {
      setError(t('error'));
      setLoading(false);
    }
  };

  return (
    <div className="container-yoli flex min-h-[80vh] items-center justify-center pt-28 pb-20 md:pt-36">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="font-display text-3xl font-light tracking-[0.2em] text-noir"
          >
            YoLi
          </Link>
          <p className="section-eyebrow mt-4">{t('eyebrow')}</p>
          <h1 className="mt-3 font-display text-3xl font-light text-noir">
            {t('title')}
          </h1>
          <p className="mt-3 font-sans text-sm text-noir/60">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label={t('firstName')}
              autoComplete="given-name"
              {...register('firstName', { required: true })}
            />
            <Input
              label={t('lastName')}
              autoComplete="family-name"
              {...register('lastName', { required: true })}
            />
          </div>
          <Input
            type="email"
            label={t('email')}
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            {...register('email', { required: true })}
          />
          <Input
            type="password"
            label={t('password')}
            placeholder={t('passwordPlaceholder')}
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', { required: true })}
          />
          <Input
            type="password"
            label={t('confirm')}
            placeholder={t('confirmPlaceholder')}
            autoComplete="new-password"
            error={errors.confirm?.message}
            {...register('confirm', { required: true })}
          />

          {error && (
            <p className="flex items-center gap-2 font-sans text-xs text-red-700">
              <AlertCircle size={14} />
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('creating') : t('submit')}
          </Button>
        </form>

        <p className="mt-8 text-center font-sans text-sm text-noir/60">
          {t('haveAccount')}{' '}
          <Link href="/connexion" className="link-underline text-noir">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
