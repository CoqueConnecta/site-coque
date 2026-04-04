import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/cn';
import { Logo } from '../../ui/Logo';
import { IconButton } from '../../ui/IconButton';
import { NavMenu, type NavLink } from '../NavMenu';

export interface HeaderBarProps extends HTMLAttributes<HTMLElement> {
  navLinks: NavLink[];
  activeLink?: string;
  ctaText?: string;
  ctaHref?: string;
  onNavClick?: (href: string) => void;
  onMobileMenuClick?: () => void;
  showMobileMenu?: boolean;
  variant?: 'light' | 'dark';
}

export const HeaderBar = forwardRef<HTMLElement, HeaderBarProps>(
  (
    {
      navLinks,
      activeLink,
      ctaText = 'Entre em contato',
      ctaHref = '#contact',
      onNavClick,
      onMobileMenuClick,
      showMobileMenu,
      variant = 'light',
      className,
      ...props
    },
    ref
  ) => {
    const bgClass = variant === 'dark' ? 'bg-gray-900' : 'bg-white';
    const borderClass = variant === 'dark' ? 'border-gray-800' : 'border-gray-100';

    return (
      <header
        ref={ref}
        className={cn(
          'sticky top-0 z-40 w-full border-b transition-colors',
          bgClass,
          borderClass,
          className
        )}
        {...props}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant={variant === 'dark' ? 'monochrome' : 'default'} className="h-10 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-12 md:flex">
            <NavMenu links={navLinks} activeLink={activeLink} onLinkClick={onNavClick} />

            {/* CTA Button */}
            <a 
              href={ctaHref} 
              className="inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold tracking-tight transition-all bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 text-sm h-10"
            >
              {ctaText}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <IconButton
              variant="ghost"
              size="md"
              label={showMobileMenu ? 'Fechar menu' : 'Abrir menu'}
              icon={showMobileMenu ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
              onClick={onMobileMenuClick}
            />
          </div>
        </div>
      </header>
    );
  }
);

HeaderBar.displayName = 'HeaderBar';
