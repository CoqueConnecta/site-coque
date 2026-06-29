import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/cn';
import type { CmsLanguage, ResolvedTrustData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';

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
      className={cn('w-full bg-white py-12 sm:py-16', className)}
      {...props}
    >
      <Block>
        <FadeIn className="mb-10 flex flex-col gap-4">
          <h3
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: 'clamp(34px, 4.2vw, 50px)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: '1.1',
              margin: 0,
              letterSpacing: '-0.8px',
              maxWidth: '640px',
              textWrap: 'balance',
            } as React.CSSProperties}
          >
            {data.headline}
          </h3>
          <p
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: 'clamp(17px, 2vw, 20px)',
              lineHeight: '1.5',
              color: 'var(--color-text-secondary)',
              maxWidth: '60ch',
              margin: 0,
            }}
          >
            {data.subtitle}
          </p>
        </FadeIn>

        {data.pressItems.length > 0 && (
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.pressItems.map((item, index) => (
              <FadeIn key={index} delay={Math.min(index * 80, 240)}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col gap-2 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] p-5 transition-colors hover:border-[var(--color-tag-bg)]"
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
                    {item.outlet}
                    <ExternalLink className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{item.title}</span>
                </a>
              </FadeIn>
            ))}
          </div>
        )}

        {data.partnerLogos.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center gap-8">
            {data.partnerLogos.map((logo, index) => (
              <span key={index} className="inline-flex">
                {logo.url ? (
                  <a href={logo.url} target="_blank" rel="noopener noreferrer">
                    <img src={logo.src} alt={logo.alt} className="h-10 w-auto object-contain" loading="lazy" />
                  </a>
                ) : (
                  <img src={logo.src} alt={logo.alt} className="h-10 w-auto object-contain" loading="lazy" />
                )}
              </span>
            ))}
          </div>
        )}

        <Link
          to="/transparencia"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-tag-bg)] hover:underline"
        >
          {TRANSPARENCY_LINK_LABEL[language]}
        </Link>
      </Block>
    </section>
  );
};

TrustSection.displayName = 'TrustSection';
