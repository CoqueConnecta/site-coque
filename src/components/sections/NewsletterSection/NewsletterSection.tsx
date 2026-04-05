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
        backgroundColor: '#fff',
        padding: '60px 0',
        display: 'flex',
        justifyContent: 'center',
      }}
      className={className}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div
          style={{
            width: '100%',
            borderRadius: '30px',
            backgroundColor: '#f58634',
            backgroundImage: "url('/background-coque-laranja.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
            padding: '70px 0 72px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1031px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
              textAlign: 'center',
              padding: '0 20px',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  letterSpacing: '-0.6px',
                  lineHeight: '90%',
                  color: '#fff',
                  margin: 0,
                }}
              >
                {data.headline}
              </h3>
              {data.headlineAccent && (
                <h3
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 500,
                    fontSize: 'clamp(28px, 4vw, 42px)',
                    letterSpacing: '-0.6px',
                    lineHeight: '90%',
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  {data.headlineAccent}
                </h3>
              )}
            </div>

            <p
              style={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 400,
                fontSize: 'clamp(16px, 2vw, 22px)',
                letterSpacing: '-0.3px',
                lineHeight: '150%',
                color: '#fff',
                maxWidth: '980px',
                margin: 0,
              }}
            >
              {data.description}
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: '1031px' }}>
            <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.16)', marginBottom: '28px' }} />
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '0 20px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <input
                  type="email"
                  placeholder={data.placeholderEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email para newsletter"
                  style={{
                    height: '54px',
                    width: '100%',
                    maxWidth: '548px',
                    borderRadius: '32px',
                    border: '1px solid #dbdad9',
                    backgroundColor: '#fafafa',
                    color: '#101014',
                    fontSize: 'clamp(16px, 1.8vw, 22px)',
                    lineHeight: '100%',
                    letterSpacing: '-0.5px',
                    padding: '0 24px',
                    outline: 'none',
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 400,
                  }}
                />

                <button
                  type="submit"
                  style={{
                    height: '54px',
                    minWidth: '166px',
                    padding: '0 28px',
                    borderRadius: '32px',
                    border: 'none',
                    backgroundColor: '#f9b778',
                    color: '#792b15',
                    fontSize: 'clamp(16px, 1.8vw, 22px)',
                    lineHeight: '100%',
                    letterSpacing: '-0.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: '"Manrope", sans-serif',
                  }}
                >
                  {data.buttonText}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', color: '#fff', padding: '0 20px' }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '20px', fontWeight: 600, margin: 0 }}>✓ Inscrição confirmada!</p>
                <p style={{ fontFamily: '"Manrope", sans-serif', fontSize: '16px', marginTop: '8px', opacity: 0.85 }}>Obrigado por se inscrever.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

NewsletterSection.displayName = 'NewsletterSection';
