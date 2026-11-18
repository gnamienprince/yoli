'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
  className,
}: QuantitySelectorProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () =>
    onChange(max !== undefined ? Math.min(max, value + 1) : value + 1);

  const canDecrement = value > min;
  const canIncrement = max === undefined || value < max;

  return (
    <div
      className={cn(
        'inline-flex items-center border border-marron/30',
        className
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={!canDecrement}
        aria-label="Diminuer la quantité"
        className="flex h-11 w-11 items-center justify-center text-noir transition-colors hover:text-marron-dark disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-[2.5rem] text-center font-sans text-sm tabular-nums text-noir">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={!canIncrement}
        aria-label="Augmenter la quantité"
        className="flex h-11 w-11 items-center justify-center text-noir transition-colors hover:text-marron-dark disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;
