import { useState } from 'react';
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
    <section
      style={{
        width: '100%',
        backgroundColor: '#f58634',
        padding: '60px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '48px',
      }}
      className={className}
      {...props}
    >
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center', padding: '0 24px' }}>
        <div>
          <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.6px', lineHeight: '90%', color: '#fff', margin: 0 }}>
            {data.headline}
          </h3>
          {data.headlineAccent && (
            <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.6px', lineHeight: '90%', color: '#fff', margin: '8px 0 0' }}>
              {data.headlineAccent}
            </h3>
          )}
        </div>
        <p style={{ fontFamily: '"Manrope", sans-serif', fontWeight: 400, fontSize: 'clamp(16px, 2vw, 22px)', letterSpacing: '-0.3px', lineHeight: '150%', color: '#fff', maxWidth: '600px', margin: 0 }}>
          {data.description}
        </p>
      </div>

      {/* Form */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '0 24px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            type="email"
            placeholder={data.placeholderEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email para newsletter"
            style={{
              height: '48px',
              minWidth: '320px',
              borderRadius: '32px',
              border: '1px solid #dbdad9',
              backgroundColor: '#fafafa',
              color: '#101014',
              fontSize: '16px',
              padding: '0 20px',
              outline: 'none',
              fontFamily: '"Manrope", sans-serif',
            }}
          />
          <button
            type="submit"
            style={{
              height: '48px',
              padding: '0 28px',
              borderRadius: '32px',
              border: 'none',
              backgroundColor: '#f9b778',
              color: '#792b15',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              fontFamily: '"Manrope", sans-serif',
            }}
          >
            {data.buttonText}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '20px', fontWeight: 600, margin: 0 }}>✓ Inscrição confirmada!</p>
          <p style={{ fontFamily: '"Manrope", sans-serif', fontSize: '16px', marginTop: '8px', opacity: 0.85 }}>Obrigado por se inscrever.</p>
        </div>
      )}
    </section>
  );
};

NewsletterSection.displayName = 'NewsletterSection';
