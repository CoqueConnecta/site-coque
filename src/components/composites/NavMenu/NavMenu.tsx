import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/cn';

export interface NavLink {
  label: string;
  href: string;
  id?: string;
}

export interface NavMenuProps extends HTMLAttributes<HTMLElement> {
  links: NavLink[];
  activeLink?: string;
  onLinkClick?: (href: string) => void;
  /** 'onDark' para header transparente sobre fundo colorido */
  tone?: 'default' | 'onDark' | 'brand';
}

export const NavMenu = forwardRef<HTMLElement, NavMenuProps>(
  ({ links, activeLink, onLinkClick, tone = 'default', className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn('flex items-center gap-8 lg:gap-10', className)}
        {...props}
      >
        {links.map((link) => (
          <a
            key={link.id || link.href}
            href={link.href}
            onClick={() => onLinkClick?.(link.href)}
            className={cn(
              '[font-family:var(--font-body)] text-[18px] font-medium leading-none tracking-[-0.3px] transition-colors',
              tone === 'onDark'
                ? activeLink === link.href
                  ? 'text-white'
                  : 'text-white/90 hover:text-white'
                : tone === 'brand'
                  ? activeLink === link.href
                    ? 'text-[#f58634]'
                    : 'text-[#f58634] hover:text-[#d86f2f]'
                : activeLink === link.href
                  ? 'text-[#f58634]'
                  : 'text-gray-900 hover:text-orange-600'
            )}
          >
            {link.label}
          </a>
        ))}
      </nav>
    );
  }
);

NavMenu.displayName = 'NavMenu';
