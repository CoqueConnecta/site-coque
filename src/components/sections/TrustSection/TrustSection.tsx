import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/cn';
import type { CmsLanguage, ResolvedTrustData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
import { SectionHeading } from '../../composites/SectionHeading';

export interface TrustSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedTrustData;
  language: CmsLanguage;
}

// Único texto fixo (não-CMS) de uma seção pública — o link de Transparência aponta
// para uma rota que já existe e não muda, não compensa o custo de um campo i18n a mais.
const TRANSPARENCY_LINK_LABEL: Record<CmsLanguage, string> = {
  pt: 'Ver nossa transparência',
  en: 'See our transparency',
};

export const TrustSection = ({ data, language, className, ...props }: TrustSectionProps) => {
  return (
    <section
      id="trust"
      className={cn('w-full bg-[color:var(--color-tag-bg)] py-16 sm:py-20', className)}
      {...props}
    >
      <Block>
        <FadeIn className="mb-10">
          <SectionHeading headline={data.headline} subtitle={data.subtitle} size="sm" tone="on-dark" />
        </FadeIn>

        {data.pressItems.length > 0 && (
          <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.pressItems.map((item, index) => (
              <FadeIn key={index} delay={Math.min(index * 80, 240)}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col gap-3 rounded-[var(--radius-lg)] bg-white/8 border border-white/10 p-5 transition-colors hover:bg-white/12"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold tracking-wide text-[color:var(--color-accent-peach)]">
                      {item.outlet}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-accent-peach)]/60" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-[color:var(--color-text-cream)]">
                    {item.title}
                  </span>
                </a>
              </FadeIn>
            ))}
          </div>
        )}

        {data.partnerLogos.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center gap-8">
            {data.partnerLogos.map((logo, index) => (
              <span key={index} className="inline-flex opacity-60 transition-opacity hover:opacity-90">
                {logo.url ? (
                  <a href={logo.url} target="_blank" rel="noopener noreferrer">
                    <img src={logo.src} alt={logo.alt} className="h-10 w-auto object-contain brightness-0 invert" loading="lazy" />
                  </a>
                ) : (
                  <img src={logo.src} alt={logo.alt} className="h-10 w-auto object-contain brightness-0 invert" loading="lazy" />
                )}
              </span>
            ))}
          </div>
        )}

        <Link
          to="/transparencia"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-accent-peach)] hover:text-[color:var(--color-text-cream)] hover:underline"
        >
          {TRANSPARENCY_LINK_LABEL[language]}
        </Link>
      </Block>
    </section>
  );
};

TrustSection.displayName = 'TrustSection';
