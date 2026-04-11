import { cn } from '../../../lib/cn';
import { Block } from '../../ui/Block';
import { Logo } from '../../ui/Logo';
import { SocialIcon } from '../../ui/SocialIcon';
import type { FooterData } from '../../../data/mockData';

export interface FooterSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: FooterData;
}

export const FooterSection = ({ data, className, ...props }: FooterSectionProps) => {
  const leftLinks = data.quickLinks.slice(0, 3);
  const rightLinks = data.quickLinks.slice(3, 6);

  return (
    <footer className={cn('w-full bg-white pt-2 pb-0', className)} {...props}>
      <Block>
        <div className="w-full rounded-t-[10px] bg-[#f58634] px-4 py-10 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
            <div className="space-y-6">
              <Logo variant="footerLight" className="h-auto w-[280px] max-w-full" />

              <div className="flex flex-wrap gap-4">
                {data.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/15 transition hover:bg-black/25"
                  >
                    <SocialIcon 
                      type={link.icon as any} 
                      label={link.platform}
                      className="text-[#fef7ee]"
                    />
                  </a>
                ))}
              </div>

              <div className="space-y-1 text-[16px] leading-[1.4] text-[#fef7ee]">
                <p>{data.address}</p>
                {data.email ? <p>{data.email}</p> : null}
                {data.phone ? <p>{data.phone}</p> : null}
              </div>
            </div>

            <nav className="space-y-2 pt-1 text-[22px] leading-[1.05] text-[#fef7ee] sm:text-[28px] lg:text-[40px]">
              {leftLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block transition hover:opacity-80"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <nav className="space-y-2 pt-1 text-[22px] leading-[1.05] text-[#fef7ee] sm:text-[28px] lg:text-[40px]">
              {rightLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block transition hover:opacity-80"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-6 border-t border-[#fef7ee]/70 pt-6 text-[20px] leading-[1.1] text-[#fef7ee] sm:text-[28px] lg:text-[36px]">
            {data.copyright}
          </div>
        </div>
      </Block>
    </footer>
  );
};

FooterSection.displayName = 'FooterSection';
