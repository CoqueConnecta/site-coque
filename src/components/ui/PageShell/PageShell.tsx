import type { ReactNode } from 'react';
import { Block } from '../Block';
import { cn } from '../../../lib/cn';

export interface PageShellProps {
  children: ReactNode;
  /** Aplicado ao <Block> interno. Omitir mantém a largura padrão do Block (max-w-[1440px]). */
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-34">
      <Block className={cn(className)}>{children}</Block>
    </main>
  );
}
