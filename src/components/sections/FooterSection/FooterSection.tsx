import { cn } from '../../../lib/cn';
import { Block } from '../../ui/Block';
import { Logo } from '../../ui/Logo';
import { SocialIcon } from '../../icons';
import type { FooterData } from '../../../data/mockData';

export interface FooterSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: FooterData;
}

export const FooterSection = ({ data, className, ...props }: FooterSectionProps) => {
  const splitIndex = Math.ceil(data.quickLinks.length / 2);
  const leftLinks = data.quickLinks.slice(0, splitIndex);
  const rightLinks = data.quickLinks.slice(splitIndex);

  return (
    <footer className={cn('w-full bg-white pt-2 pb-0', className)} {...props}>
      <Block>
        <div className="w-full rounded-t-[10px] bg-[#f58634] px-4 py-10 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-12">
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

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-10 lg:justify-self-end lg:self-center">
              <nav className="space-y-2 text-[20px] leading-[1.05] text-[#fef7ee]">
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

              <nav className="space-y-2 text-[20px] leading-[1.05] text-[#fef7ee]">
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
          </div>

          <div className="mt-6 border-t border-[#fef7ee]/70 pt-6 text-[20px] leading-[1.1] text-[#fef7ee]">
            {data.copyright}
          </div>
        </div>
      </Block>
    </footer>
  );
};

FooterSection.displayName = 'FooterSection';
