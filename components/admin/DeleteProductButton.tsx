'use client';

import { useState, useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { deleteProduct } from '@/app/[locale]/admin/produits/actions';

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(
      `Supprimer « ${name} » ? Cette action est irréversible.`
    );
    if (!confirmed) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="font-sans text-[0.7rem] tracking-[0.12em] uppercase text-red-700 hover:text-red-900 disabled:opacity-50"
      >
        {pending ? 'Suppression…' : 'Supprimer'}
      </button>
      {error && (
        <span className="mt-1 font-sans text-[0.65rem] text-red-700">
          {error}
        </span>
      )}
    </span>
  );
}
