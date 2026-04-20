import { forwardRef, type HTMLAttributes } from 'react';
import { CloseIcon, CoqueConnectaWordmark, MenuIcon } from '../../icons';
import { cn } from '../../../lib/cn';
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
  /** Opcional: fixa o header no topo da janela */
  isFixed?: boolean;
  /** Transparente quando hero está visível; transiciona para branco no scroll */
  isTransparent?: boolean;
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
      isFixed = true,
      isTransparent = false,
      className,
      ...props
    },
    ref
  ) => {
    const navTone = 'brand';

    const ctaBg =
      variant === 'dark'
        ? 'bg-white text-gray-900 hover:bg-gray-100'
        : 'bg-[#f58634] text-[#fef7ee] hover:bg-[#e6782a]';

    const iconColor = 'text-[#f58634]';

    const positionClass = isFixed ? 'fixed left-1/2 top-8 -translate-x-1/2' : 'relative';

    return (
      <header
        ref={ref}
        className={cn(
          'z-40 w-[min(1180px,calc(100%-2rem))] transition-all duration-300',
          positionClass,
          className
        )}
        {...props}
      >
        <div className="mx-auto flex h-[84px] w-full items-center justify-between gap-4 overflow-visible rounded-[999px] border border-white/15 bg-[rgba(244,212,194,0.94)] px-5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-[16px] sm:px-6 lg:gap-8 lg:px-8">
          {/* Logo */}
          <a href="/" className="flex shrink-0 items-center" aria-label="Coque Connecta">
            <CoqueConnectaWordmark className="h-8 w-auto lg:h-9" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            <NavMenu
              links={navLinks}
              activeLink={activeLink}
              onLinkClick={onNavClick}
              tone={navTone}
              className="items-center"
            />

            {/* CTA Button */}
            <a
              href={ctaHref}
              target='_blank'
              rel="noopener noreferrer"
              className={cn(
                'inline-flex h-[58px] items-center justify-center rounded-[50px] px-8 text-base font-semibold leading-none tracking-tight transition-all',
                ctaBg
              )}
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
              className={iconColor}
              icon={showMobileMenu ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
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
