import type { ImgHTMLAttributes } from 'react';

import coqueLogo from '../../../assets/coque-logo-vertical.png';
import { cn } from '../../../lib/cn';

export type LogoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  variant?: 'default' | 'monochrome';
};

export function Logo({
  variant = 'default',
  className,
  alt = 'Coque Connecta',
  ...props
}: LogoProps) {
  return (
    <img
      src={coqueLogo}
      alt={alt}
      className={cn(
        'h-auto w-[190px] max-w-full object-contain',
        variant === 'monochrome' ? 'grayscale contrast-125 brightness-110' : '',
        className,
      )}
      {...props}
    />
  );
}
