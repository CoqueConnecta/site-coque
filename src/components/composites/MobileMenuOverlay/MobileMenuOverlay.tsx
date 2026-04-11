import { forwardRef } from 'react';
import { cn } from '../../../lib/cn';
import type { NavLink } from '../NavMenu';
import { Typography } from '../../ui/Typography';

export interface MobileMenuOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  navLinks: NavLink[];
  activeLink?: string;
  onNavClick?: (href: string) => void;
  onClose?: () => void;
  showNewsletter?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export const MobileMenuOverlay = forwardRef<HTMLDivElement, MobileMenuOverlayProps>(
  (
    {
      isOpen,
      navLinks,
      activeLink,
      onNavClick,
      onClose,
      showNewsletter = true,
      ctaText = 'Entre em contato',
      ctaHref = '#contact',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-30 bg-black/50 transition-opacity duration-300',
            isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          )}
          onClick={onClose}
        />

        {/* Menu Panel */}
        <div
          ref={ref}
          className={cn(
            'fixed right-0 top-0 z-50 h-full w-full max-w-xs overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out',
            isOpen ? 'translate-x-0' : 'translate-x-full',
            className
          )}
          {...props}
        >
          {/* Header com Close Button */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <Typography variant="h3" className="text-lg">
              Menu
            </Typography>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Fechar menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 px-4 py-6">
            {navLinks.map((link) => (
              <a
                key={link.id || link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  onNavClick?.(link.href);
                  onClose?.();
                }}
                className={cn(
                  'block rounded-md px-3 py-2 text-base font-semibold transition-colors',
                  activeLink === link.href
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-900 hover:bg-gray-50'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="border-t border-gray-100 px-4 py-4">
            <a
              href={ctaHref}
              onClick={(e) => {
                e.preventDefault();
                onNavClick?.(ctaHref);
                onClose?.();
              }}
              className="block w-full rounded-lg bg-orange-600 px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-orange-700"
            >
              {ctaText}
            </a>
          </div>

          {/* Newsletter Section (Optional) */}
          {showNewsletter && (
            <div className="border-t border-gray-100 px-4 py-6">
              <Typography variant="bodySm" tone="muted" className="mb-3">
                📬 Receba nossas novidades
              </Typography>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  aria-label="Email para newsletter"
                />
                <button
                  type="submit"
                  className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                >
                  Inscrever
                </button>
              </form>
            </div>
          )}
        </div>
      </>
    );
  }
);

MobileMenuOverlay.displayName = 'MobileMenuOverlay';
