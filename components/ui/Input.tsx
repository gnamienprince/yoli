import { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-marron-dark"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          'input-field',
          error && 'border-red-700/60 focus:border-red-700',
          className
        )}
        {...props}
      />
      {error && (
        <span
          id={`${inputId}-error`}
          className="font-sans text-xs text-red-700"
        >
          {error}
        </span>
      )}
    </div>
  );
});
