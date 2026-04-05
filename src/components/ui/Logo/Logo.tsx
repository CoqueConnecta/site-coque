import type { ImgHTMLAttributes } from 'react';
import { cn } from '../../../lib/cn';

export type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  variant?: 'default' | 'monochrome' | 'footerLight' | 'icon';
};

export function Logo({
  variant = 'default',
  className,
  alt = 'Coque Connecta',
  ...props
}: LogoProps) {
  const src = variant === 'icon'
    ? '/coque-logo.svg'
    : variant === 'footerLight'
      ? '/coque-logotipo-light.svg'
      : '/coque-logotipo.svg';

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'h-auto w-[220px] max-w-full object-contain',
        variant === 'monochrome' ? 'grayscale contrast-125 brightness-110' : '',
        className,
      )}
      {...props}
    />
  );
}
