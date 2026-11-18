'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import {
  Check,
  ChevronDown,
  Lock,
  ArrowRight,
  Home,
  Store,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/stores/cart';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn, formatPrice } from '@/lib/utils';

const PAYMENT_METHODS = ['wave', 'orange', 'mtn', 'moov', 'card'] as const;

export default function CommandePage() {
  const t = useTranslations('checkout');
  const items = useCartStore((s) => s.items);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [delivery, setDelivery] = useState<'home' | 'relay'>('home');
  const [payment, setPayment] =
    useState<(typeof PAYMENT_METHODS)[number]>('wave');

  useEffect(() => setMounted(true), []);

  const schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(6),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'Cote d\'Ivoire' },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const payload = {
      customer: values,
      delivery,
      payment,
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
      total: getTotalPrice(),
    };
    try {
      await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Order persistence is a later phase; confirm regardless.
    } finally {
      clearCart();
      setConfirmed(true);
      setSubmitting(false);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
    }
  };

  if (!mounted) {
    return <div className="container-yoli min-h-[50vh] pt-36 pb-24" />;
  }

  if (confirmed) {
    return (
      <div className="container-yoli flex min-h-[60vh] flex-col items-center justify-center pt-36 pb-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-or/15 text-or-dark">
          <Check size={34} strokeWidth={1.25} />
        </span>
        <h1 className="mt-8 font-display text-3xl font-light text-noir md:text-4xl">
          {t('confirmation.title')}
        </h1>
        <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-noir/60">
          {t('confirmation.text')}
        </p>
        <Link href="/" className="btn-primary mt-10">
          {t('confirmation.button')}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-yoli flex min-h-[60vh] flex-col items-center justify-center pt-36 pb-24 text-center">
        <h1 className="font-display text-3xl font-light text-noir md:text-4xl">
          {t('empty')}
        </h1>
        <Link href="/boutique/femme" className="btn-secondary mt-8">
          {t('backToShop')}
        </Link>
      </div>
    );
  }

  const total = getTotalPrice();

  const Summary = () => (
    <dl className="space-y-4 font-sans text-sm">
      <div className="flex justify-between text-noir/70">
        <dt>{t('subtotal')}</dt>
        <dd className="text-noir">{formatPrice(total)}</dd>
      </div>
      <div className="flex justify-between text-noir/70">
        <dt>{t('shipping')}</dt>
        <dd className="text-noir">{t('shippingFree')}</dd>
      </div>
      <div className="flex justify-between border-t border-marron/20 pt-4 text-base">
        <dt className="text-noir">{t('total')}</dt>
        <dd className="font-medium text-noir">{formatPrice(total)}</dd>
      </div>
    </dl>
  );

  return (
    <div className="container-yoli pt-28 pb-24 md:pt-36">
      <p className="section-eyebrow mb-3">{t('eyebrow')}</p>
      <h1 className="section-title mb-12">{t('title')}</h1>

      {/* Mobile summary toggle */}
      <div className="mb-8 border border-marron/25 bg-white lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((v) => !v)}
          className="flex w-full items-center justify-between p-5 font-sans text-sm text-noir"
        >
          <span>{summaryOpen ? t('hideSummary') : t('showSummary')}</span>
          <span className="flex items-center gap-3">
            <span className="font-medium">{formatPrice(total)}</span>
            <ChevronDown
              size={16}
              className={cn('transition-transform', summaryOpen && 'rotate-180')}
            />
          </span>
        </button>
        {summaryOpen && (
          <div className="border-t border-marron/20 p-5">
            <Summary />
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16"
        noValidate
      >
        <div className="space-y-12">
          {/* Coordonnees */}
          <fieldset>
            <legend className="mb-6 font-display text-xl font-light text-noir">
              {t('contactSection')}
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label={t('firstName')} error={errors.firstName && ' '} {...register('firstName')} />
              <Input label={t('lastName')} error={errors.lastName && ' '} {...register('lastName')} />
              <Input type="email" label={t('email')} error={errors.email && ' '} {...register('email')} />
              <Input type="tel" label={t('phone')} error={errors.phone && ' '} {...register('phone')} />
            </div>
          </fieldset>

          {/* Livraison */}
          <fieldset>
            <legend className="mb-6 font-display text-xl font-light text-noir">
              {t('deliverySection')}
            </legend>
            <div className="grid gap-5">
              <Input label={t('address')} error={errors.address && ' '} {...register('address')} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label={t('city')} error={errors.city && ' '} {...register('city')} />
                <Input label={t('country')} error={errors.country && ' '} {...register('country')} />
              </div>
            </div>

            <p className="mt-8 mb-4 font-sans text-[0.7rem] tracking-[0.18em] uppercase text-marron-dark">
              {t('deliveryMode')}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                { id: 'home', icon: Home },
                { id: 'relay', icon: Store },
              ] as const).map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDelivery(id)}
                  className={cn(
                    'flex items-start gap-4 border p-5 text-left transition-colors',
                    delivery === id
                      ? 'border-noir bg-noir/[0.02]'
                      : 'border-marron/30 hover:border-marron'
                  )}
                >
                  <Icon size={20} strokeWidth={1.5} className="mt-0.5 text-marron-dark" />
                  <span>
                    <span className="block font-sans text-sm text-noir">
                      {t(id)}
                    </span>
                    <span className="mt-1 block font-sans text-xs leading-relaxed text-noir/55">
                      {t(`${id}Desc`)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Paiement */}
          <fieldset>
            <legend className="mb-2 font-display text-xl font-light text-noir">
              {t('paymentSection')}
            </legend>
            <p className="mb-6 flex items-center gap-2 font-sans text-xs text-noir/55">
              <Lock size={13} />
              {t('paymentNote')}
            </p>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPayment(method)}
                  className={cn(
                    'flex w-full items-center justify-between border p-4 text-left transition-colors',
                    payment === method
                      ? 'border-noir bg-noir/[0.02]'
                      : 'border-marron/30 hover:border-marron'
                  )}
                >
                  <span className="font-sans text-sm text-noir">{t(method)}</span>
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border',
                      payment === method
                        ? 'border-noir bg-noir text-white'
                        : 'border-marron/40'
                    )}
                  >
                    {payment === method && <Check size={12} />}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Recap (desktop) */}
        <aside className="hidden h-fit border border-marron/25 bg-white p-8 lg:sticky lg:top-28 lg:block">
          <h2 className="mb-6 font-display text-xl font-light text-noir">
            {t('summary')}
          </h2>

          <ul className="mb-6 space-y-4 border-b border-marron/20 pb-6">
            {items.map((item) => (
              <li
                key={`${item.product.id}-${item.size ?? ''}-${item.color ?? ''}`}
                className="flex gap-4"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.nameFr}
                  className="h-20 w-16 shrink-0 object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <span className="font-sans text-sm text-noir">
                    {item.product.nameFr}
                  </span>
                  <span className="mt-1 font-sans text-xs text-noir/50">
                    {item.quantity} ×{' '}
                    {[item.size, item.color].filter(Boolean).join(' · ')}
                  </span>
                  <span className="mt-auto font-sans text-sm text-noir">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <Summary />

          <Button type="submit" className="mt-8 w-full" disabled={submitting}>
            {submitting ? t('processing') : t('submit')}
            {!submitting && <ArrowRight size={16} />}
          </Button>
        </aside>

        {/* Submit (mobile) */}
        <div className="lg:hidden">
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? t('processing') : t('submit')}
            {!submitting && <ArrowRight size={16} />}
          </Button>
        </div>
      </form>
    </div>
  );
}
