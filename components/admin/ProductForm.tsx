'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { Category, Product } from '@/types';
import {
  createProduct,
  updateProduct,
  type ProductInput,
} from '@/app/[locale]/admin/produits/actions';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'femme', label: 'Femme' },
  { value: 'parfums', label: 'Parfums' },
  { value: 'bijoux', label: 'Bijoux & Accessoires' },
  { value: 'homme', label: 'Homme' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

interface ProductFormProps {
  initial?: Product;
  action: 'create' | 'edit';
}

const labelCls =
  'font-sans text-[0.7rem] tracking-[0.18em] uppercase text-marron-dark';
const fieldCls = 'input-field';

export function ProductForm({ initial, action }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text / scalar fields
  const [nameFr, setNameFr] = useState(initial?.nameFr ?? '');
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? '');
  const [descriptionFr, setDescriptionFr] = useState(
    initial?.descriptionFr ?? ''
  );
  const [descriptionEn, setDescriptionEn] = useState(
    initial?.descriptionEn ?? ''
  );
  const [price, setPrice] = useState<string>(
    initial?.price != null ? String(initial.price) : ''
  );
  const [stock, setStock] = useState<string>(
    initial?.stock != null ? String(initial.stock) : '0'
  );
  const [category, setCategory] = useState<Category>(
    initial?.category ?? 'femme'
  );
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? '');
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? []);
  const [colorsInput, setColorsInput] = useState(
    (initial?.colors ?? []).join(', ')
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [active, setActive] = useState(initial?.active ?? true);

  // Images
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Submit state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const priceNumber = Number(price);
  const showPricePreview = price !== '' && !Number.isNaN(priceNumber);

  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    const selected = Array.from(files);
    try {
      for (const file of selected) {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body,
        });
        const data: { url?: string; error?: string } = await res
          .json()
          .catch(() => ({}));
        if (!res.ok || !data.url) {
          setUploadError(
            data.error ?? "Échec du téléversement de l'image."
          );
          break;
        }
        setImages((prev) => [...prev, data.url as string]);
      }
    } catch {
      setUploadError('Erreur réseau pendant le téléversement.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function makePrimary(index: number) {
    setImages((prev) => {
      if (index <= 0 || index >= prev.length) return prev;
      const next = [...prev];
      const [picked] = next.splice(index, 1);
      next.unshift(picked);
      return next;
    });
  }

  function reorder(from: number, to: number) {
    setImages((prev) => {
      if (from === to || from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!nameFr.trim()) errs.nameFr = 'Le nom (FR) est requis.';
    if (!nameEn.trim()) errs.nameEn = 'Le nom (EN) est requis.';
    if (!descriptionFr.trim())
      errs.descriptionFr = 'La description (FR) est requise.';
    if (!descriptionEn.trim())
      errs.descriptionEn = 'La description (EN) est requise.';
    if (price === '' || Number.isNaN(priceNumber) || priceNumber <= 0)
      errs.price = 'Le prix doit être supérieur à 0.';
    const stockNum = Number(stock);
    if (stock === '' || !Number.isInteger(stockNum) || stockNum < 0)
      errs.stock = 'Le stock doit être un entier positif ou nul.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const colors = colorsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const payload: ProductInput = {
      nameFr: nameFr.trim(),
      nameEn: nameEn.trim(),
      descriptionFr: descriptionFr.trim(),
      descriptionEn: descriptionEn.trim(),
      price: priceNumber,
      stock: Number(stock),
      category,
      subcategory: subcategory.trim() || undefined,
      sizes,
      colors,
      images,
      featured,
      active,
    };

    setSaving(true);
    try {
      const result =
        action === 'edit' && initial
          ? await updateProduct(initial.id, payload)
          : await createProduct(payload);

      if (!result.ok) {
        setSubmitError(result.error);
        setSaving(false);
        return;
      }
      router.push('/admin/produits');
      router.refresh();
    } catch {
      setSubmitError('Une erreur inattendue est survenue.');
      setSaving(false);
    }
  }

  const busy = saving || uploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Names */}
      <section className="grid gap-6 md:grid-cols-2">
        <Field label="Nom (FR)" error={fieldErrors.nameFr}>
          <input
            className={fieldCls}
            value={nameFr}
            onChange={(e) => setNameFr(e.target.value)}
            placeholder="Robe en soie ivoire"
          />
        </Field>
        <Field label="Nom (EN)" error={fieldErrors.nameEn}>
          <input
            className={fieldCls}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="Ivory silk dress"
          />
        </Field>
      </section>

      {/* Descriptions */}
      <section className="grid gap-6 md:grid-cols-2">
        <Field label="Description (FR)" error={fieldErrors.descriptionFr}>
          <textarea
            className={cn(fieldCls, 'min-h-[140px] resize-y')}
            value={descriptionFr}
            onChange={(e) => setDescriptionFr(e.target.value)}
          />
        </Field>
        <Field label="Description (EN)" error={fieldErrors.descriptionEn}>
          <textarea
            className={cn(fieldCls, 'min-h-[140px] resize-y')}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
          />
        </Field>
      </section>

      {/* Price / Stock */}
      <section className="grid gap-6 md:grid-cols-2">
        <Field label="Prix (FCFA)" error={fieldErrors.price}>
          <input
            type="number"
            min={0}
            step="any"
            className={fieldCls}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="45000"
          />
          {showPricePreview && priceNumber > 0 && (
            <span className="mt-1 font-sans text-xs text-marron">
              {formatPrice(priceNumber, 'XOF')}
            </span>
          )}
        </Field>
        <Field label="Stock" error={fieldErrors.stock}>
          <input
            type="number"
            min={0}
            step={1}
            className={fieldCls}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </Field>
      </section>

      {/* Category / Subcategory */}
      <section className="grid gap-6 md:grid-cols-2">
        <Field label="Catégorie">
          <select
            className={fieldCls}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Sous-catégorie (optionnel)">
          <input
            className={fieldCls}
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            placeholder="Robes de soirée"
          />
        </Field>
      </section>

      {/* Sizes */}
      <section>
        <span className={labelCls}>Tailles</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => {
            const selected = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={cn(
                  'min-w-[3rem] border px-4 py-2 font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-200',
                  selected
                    ? 'border-noir bg-noir text-ivoire'
                    : 'border-marron/40 bg-white text-noir hover:border-noir'
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </section>

      {/* Colors */}
      <section>
        <Field label="Couleurs (séparées par des virgules)">
          <input
            className={fieldCls}
            value={colorsInput}
            onChange={(e) => setColorsInput(e.target.value)}
            placeholder="Ivoire, Noir, Rose Nude"
          />
        </Field>
      </section>

      {/* Images uploader — headline feature */}
      <section>
        <div className="flex items-baseline justify-between">
          <span className={labelCls}>Photos du produit</span>
          <span className="font-sans text-xs text-marron">
            {images.length} image{images.length > 1 ? 's' : ''}
          </span>
        </div>

        <div
          className="mt-3 flex flex-col items-center justify-center gap-3 border border-dashed border-marron/40 bg-ivoire/40 px-6 py-10 text-center transition-colors duration-200 hover:border-noir"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="font-display text-xl text-noir">
            Glissez vos images ici
          </p>
          <p className="font-sans text-xs text-marron">
            JPEG, PNG ou WebP · 4,5 Mo maximum par image
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Téléversement…' : 'Choisir des fichiers'}
          </Button>
          {uploading && (
            <span
              className="mt-1 inline-block h-5 w-5 animate-spin rounded-full border-2 border-marron/30 border-t-noir"
              aria-label="Téléversement en cours"
            />
          )}
        </div>

        {uploadError && (
          <p className="mt-2 font-sans text-xs text-red-700">{uploadError}</p>
        )}

        {images.length > 0 && (
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((url, index) => (
              <li
                key={url}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorder(dragIndex, index);
                  setDragIndex(null);
                }}
                className={cn(
                  'group relative aspect-square cursor-move overflow-hidden border bg-white',
                  index === 0 ? 'border-or' : 'border-marron/30'
                )}
              >
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-0 top-0 bg-or px-2 py-1 font-sans text-[0.6rem] tracking-[0.15em] uppercase text-noir">
                    Principale
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-noir/70 px-2 py-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {index !== 0 ? (
                    <button
                      type="button"
                      onClick={() => makePrimary(index)}
                      className="font-sans text-[0.6rem] tracking-[0.1em] uppercase text-ivoire hover:text-or"
                    >
                      Définir principale
                    </button>
                  ) : (
                    <span className="font-sans text-[0.6rem] tracking-[0.1em] uppercase text-ivoire/60">
                      Image principale
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label="Supprimer l'image"
                    className="font-sans text-sm leading-none text-ivoire hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Flags */}
      <section className="flex flex-wrap gap-8">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 accent-or"
          />
          <span className="font-sans text-sm text-noir">En vedette</span>
        </label>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 accent-noir"
          />
          <span className="font-sans text-sm text-noir">Actif (visible en boutique)</span>
        </label>
      </section>

      {submitError && (
        <p className="font-sans text-sm text-red-700">{submitError}</p>
      )}

      <div className="flex items-center gap-4 border-t border-marron/20 pt-8">
        <Button type="submit" variant="primary" disabled={busy}>
          {saving
            ? 'Enregistrement…'
            : action === 'edit'
              ? 'Mettre à jour'
              : 'Créer le produit'}
        </Button>
        <button
          type="button"
          onClick={() => router.push('/admin/produits')}
          disabled={busy}
          className="font-sans text-xs tracking-[0.18em] uppercase text-marron-dark hover:text-noir disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={labelCls}>{label}</span>
      {children}
      {error && <span className="font-sans text-xs text-red-700">{error}</span>}
    </div>
  );
}
