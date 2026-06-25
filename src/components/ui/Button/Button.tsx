import { cva, type VariantProps } from 'class-variance-authority';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

import { cn } from '../../../lib/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-text-primary)] disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-[color:var(--color-tag-bg)] text-[color:var(--color-text-on-dark)] hover:brightness-110',
        secondary:
          'bg-[color:var(--color-surface-card)] text-[color:var(--color-text-primary)] hover:brightness-95',
        ghost:
          'bg-transparent text-[color:var(--color-text-primary)] hover:bg-black/5',
        // Sem bg/text/hover: para CTAs com skin bespoke que só precisam da base estrutural (pill, foco, transição).
        unstyled: '',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-7 text-lg',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

type ButtonOwnProps = VariantProps<typeof buttonVariants> & {
  isLoading?: boolean;
  /** Quando presente, o Button renderiza <a href=...> em vez de <button>. */
  href?: string;
};

export type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps>;

export function Button({
  className,
  variant,
  size,
  fullWidth,
  isLoading = false,
  disabled,
  children,
  href,
  ...props
}: ButtonProps) {
  const sharedClassName = cn(buttonVariants({ variant, size, fullWidth }), className);
  const spinner = isLoading ? (
    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
  ) : null;

  if (href) {
    return (
      <a href={href} className={sharedClassName} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {spinner}
        {children}
      </a>
    );
  }

  return (
    <button
      className={sharedClassName}
      disabled={disabled || isLoading}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {spinner}
      {children}
    </button>
  );
}
