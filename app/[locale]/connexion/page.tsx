'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';
import { Link, useRouter } from '@/i18n/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LoginValues {
  email: string;
  password: string;
}

export default function ConnexionPage() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<LoginValues>();

  const onSubmit = async (values: LoginValues) => {
    setLoading(true);
    setError(false);
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(true);
      return;
    }
    router.push('/');
    router.refresh();
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
            autoComplete="current-password"
            {...register('password', { required: true })}
          />

          {error && (
            <p className="flex items-center gap-2 font-sans text-xs text-red-700">
              <AlertCircle size={14} />
              {t('error')}
            </p>
          )}

          <div className="text-right">
            <a
              href="#"
              className="link-underline font-sans text-xs text-noir/60"
            >
              {t('forgot')}
            </a>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('signingIn') : t('submit')}
          </Button>
        </form>

        <p className="mt-8 text-center font-sans text-sm text-noir/60">
          {t('noAccount')}{' '}
          <Link
            href="/inscription"
            className="link-underline text-noir"
          >
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
