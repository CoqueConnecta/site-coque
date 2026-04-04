import { useState } from 'react';
import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { Input } from '../../ui/Input';
import { Surface } from '../../ui/Surface';
import type { NewsletterData } from '../../../data/mockData';

export interface NewsletterSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: NewsletterData;
  onEmailSubmit?: (email: string) => void;
}

export const NewsletterSection = ({ data, onEmailSubmit, className, ...props }: NewsletterSectionProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onEmailSubmit?.(email);
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className={cn('w-full bg-gray-50', className)} {...props}>
      <div className="mx-auto max-w-4xl px-4 py-20 sm:py-32 lg:py-40">
        {/* Main surface with gradient */}
        <Surface variant="newsletter" padding="lg" className="space-y-8 text-center">
          {/* Headline */}
          <Typography variant="h2" tone="default" className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            {data.headline}
          </Typography>

          {/* Description */}
          <Typography variant="body" tone="muted" className="max-w-2xl mx-auto text-lg">
            {data.description}
          </Typography>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3">
              <div className="flex gap-2 sm:flex-row">
                <Input
                  type="email"
                  placeholder={data.placeholderEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email para newsletter"
                  className="flex-grow"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-[var(--radius-pill)] font-semibold tracking-tight transition-all bg-orange-600 text-white hover:bg-orange-700 px-6 py-2 text-base h-10 min-w-fit whitespace-nowrap"
                >
                  {data.buttonText}
                </button>
              </div>
              <Typography variant="bodySm" tone="muted" className="text-xs">
                Garantimos que você não será spammado.
              </Typography>
            </form>
          ) : (
            <div className="py-4 space-y-2">
              <Typography variant="h3" className="text-xl text-orange-600 font-semibold">
                ✓ Inscrição confirmada!
              </Typography>
              <Typography variant="bodySm" tone="muted">
                Obrigado por se inscrever. Você receberá em breve as nossas atualizações.
              </Typography>
            </div>
          )}
        </Surface>
      </div>
    </section>
  );
};

NewsletterSection.displayName = 'NewsletterSection';
