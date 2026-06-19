import { cn } from '../../../lib/cn';
import { Block } from '../../ui/Block';
import { Logo } from '../../ui/Logo';
import { SocialIcon } from '../../icons';
import type { ResolvedFooterData } from '../../../types/cms';

export interface FooterSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedFooterData;
}

export const FooterSection = ({ data, className, ...props }: FooterSectionProps) => {
  return (
    <footer className={cn('w-full bg-white pt-2 pb-0', className)} {...props}>
      <Block>
        <div className="w-full rounded-t-[var(--radius-sm)] bg-[color:var(--color-tag-bg)] px-4 py-10 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-12">
            {/* Logo + social + address */}
            <div className="space-y-6">
              <Logo variant="footerLight" className="h-auto w-[280px] max-w-full" />

              <div className="flex flex-wrap gap-4">
                {data.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    aria-label={link.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                  >
                    <SocialIcon
                      type={link.icon as any}
                      label={link.platform}
                      className="text-[color:var(--color-text-cream)]"
                    />
                  </a>
                ))}
              </div>

              <div className="space-y-1 text-[16px] leading-[1.4] text-[color:var(--color-text-cream)] [font-family:var(--font-body)]">
                <p>{data.address}</p>
                {data.email ? <p>{data.email}</p> : null}
                {data.phone ? <p>{data.phone}</p> : null}
              </div>
            </div>

            {/* Tagline central */}
            <div className="text-center leading-snug text-[color:var(--color-accent-peach)] lg:px-8">
              <p className="text-[18px] font-semibold tracking-[-0.02em] [font-family:var(--font-body)]">Conectando Pessoas,</p>
              <p className="text-[22px] tracking-[-0.01em] [font-family:var(--font-display)]">Multiplicando Horizontes</p>
            </div>

            {/* Nav links */}
            <nav
              aria-label="Links rápidos"
              className="flex flex-col gap-3"
            >
              {data.quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-[16px] leading-[1.05] text-[color:var(--color-text-cream)] [font-family:var(--font-body)] transition hover:text-[color:var(--color-accent-peach)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-6 border-t border-[color:var(--color-text-cream)]/30 pt-6 text-[13px] leading-[1.1] text-[color:var(--color-text-cream)] opacity-70 [font-family:var(--font-body)]">
            {data.copyright}
          </div>
        </div>
      </Block>
    </footer>
  );
};

FooterSection.displayName = 'FooterSection';
