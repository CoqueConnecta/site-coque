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
}

export const NavMenu = forwardRef<HTMLElement, NavMenuProps>(
  ({ links, activeLink, onLinkClick, className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn('flex items-center gap-8', className)}
        {...props}
      >
        {links.map((link) => (
          <a
            key={link.id || link.href}
            href={link.href}
            onClick={() => onLinkClick?.(link.href)}
            className={cn(
              'text-sm font-semibold transition-colors',
              activeLink === link.href
                ? 'text-orange-600'
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
