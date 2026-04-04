import { cva, type VariantProps } from 'class-variance-authority';
import type { InputHTMLAttributes } from 'react';

import { cn } from '../../../lib/cn';

const inputVariants = cva(
  'w-full rounded-[var(--radius-pill)] border bg-white px-5 py-3 font-[var(--font-body)] text-base text-[color:var(--color-text-primary)] placeholder:text-black/35 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-tag-bg)] disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      state: {
        default: 'border-black/10',
        error: 'border-red-500 focus-visible:ring-red-500',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
);

export type InputProps = InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    error?: string;
  };

export function Input({ className, label, error, state, id, ...props }: InputProps) {
  const currentState = error ? 'error' : state;
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-2 block font-[var(--font-body)] text-sm font-semibold text-[color:var(--color-text-primary)]">
          {label}
        </label>
      ) : null}
      <input id={inputId} className={cn(inputVariants({ state: currentState }), className)} {...props} />
      {error ? (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
