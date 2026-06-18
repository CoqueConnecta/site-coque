import { useState, useEffect } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { database } from '../../../../firebase';
import type { ResolvedNewsletterData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { Typography } from '../../ui/Typography';
import { cn } from '../../../lib/cn';

export interface NewsletterSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedNewsletterData;
}

const fieldBase =
  'h-[54px] w-full rounded-full border border-[#dbdad9] bg-[#fafafa] px-6 text-[16px] text-[#101014] placeholder:text-gray-500 [font-family:var(--font-body)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#792b15] focus-visible:ring-offset-1';

export const NewsletterSection = ({ data, className, ...props }: NewsletterSectionProps) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    type: 'volunteer',
    consent: false,
  });

  useEffect(() => {
    if (!isSubmitted) return;
    const id = setTimeout(() => setIsSubmitted(false), 5000);
    return () => clearTimeout(id);
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast.error('Você precisa aceitar os termos para continuar.');
      return;
    }

    setLoading(true);

    try {
      const newsletterRef = ref(database, 'newsletter');
      await push(newsletterRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        type: formData.type,
        lgpdConsent: true,
        subscribedAt: serverTimestamp(),
      });

      setIsSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', type: 'volunteer', consent: false });
    } catch {
      toast.error('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={cn('w-full bg-white pt-9 pb-5', className)}
      {...props}
    >
      <Block>
        <div className="w-full rounded-[var(--radius-xl)] bg-[#f58634] bg-[url('/background-coque-laranja.png')] bg-cover bg-center flex flex-col items-center gap-8 py-[48px] overflow-hidden">

          {/* Headline + description */}
          <div className="w-full max-w-[1031px] flex flex-col items-center gap-6 text-center px-5">
            <div>
              <h2 className="m-0 [font-family:var(--font-body)] font-medium text-[clamp(30px,4.5vw,48px)] leading-[0.9] tracking-[-0.6px] text-white">
                {data.headline}
              </h2>
              {data.headlineAccent && (
                <h2 className="m-0 [font-family:var(--font-body)] font-medium text-[clamp(30px,4.5vw,48px)] leading-[0.9] tracking-[-0.6px] text-white">
                  {data.headlineAccent}
                </h2>
              )}
            </div>
            <Typography
              tone="onDark"
              className="text-[clamp(16px,2vw,22px)] max-w-[980px] leading-[150%] tracking-[-0.3px]"
            >
              {data.description}
            </Typography>
          </div>

          {/* Form */}
          <div className="w-full max-w-[800px] px-5">
            <div className="w-full h-px bg-white/[0.16] mb-7" />

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Nome + Sobrenome */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <label htmlFor="nl-firstName" className="visually-hidden">Nome</label>
                  <input
                    id="nl-firstName"
                    type="text"
                    placeholder="Nome"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={fieldBase}
                  />
                  <label htmlFor="nl-lastName" className="visually-hidden">Sobrenome</label>
                  <input
                    id="nl-lastName"
                    type="text"
                    placeholder="Sobrenome"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={fieldBase}
                  />
                </div>

                {/* E-mail + Tipo */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <label htmlFor="nl-email" className="visually-hidden">E-mail</label>
                  <input
                    id="nl-email"
                    type="email"
                    placeholder={data.placeholderEmail || 'Seu melhor e-mail'}
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={cn(fieldBase, 'sm:w-2/3')}
                  />
                  <label htmlFor="nl-type" className="visually-hidden">Tipo de participante</label>
                  <select
                    id="nl-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={cn(fieldBase, 'sm:w-1/3 cursor-pointer')}
                  >
                    <option value="volunteer">Sou Voluntário</option>
                    <option value="donor">Sou Doador</option>
                    <option value="company">Sou Empresa</option>
                    <option value="community">Sou Comunidade</option>
                  </select>
                </div>

                {/* LGPD */}
                <label className="mt-2 flex cursor-pointer items-start gap-3 text-white/90">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-gray-300 accent-[#792b15]"
                  />
                  <span className="text-sm leading-snug [font-family:var(--font-body)] sm:text-base">
                    Concordo em receber comunicações da Coque Connecta e afirmo que li e aceito a{' '}
                    <a href="/privacidade" target="_blank" rel="noreferrer" className="underline hover:text-white font-semibold">
                      Política de Privacidade
                    </a>.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !formData.consent}
                  className="mt-4 h-[54px] w-full sm:w-auto self-center rounded-full bg-[#f9b778] px-10 text-[18px] font-semibold tracking-tight text-[#792b15] [font-family:var(--font-body)] transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#792b15] focus-visible:ring-offset-2"
                >
                  {loading ? 'ENVIANDO...' : data.buttonText || 'RECEBER'}
                </button>
              </form>
            ) : (
              <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 px-5 text-center text-white">
                <CheckCircle className="h-8 w-8" aria-hidden="true" />
                <p className="m-0 text-[24px] font-semibold [font-family:var(--font-body)]">Inscrição confirmada!</p>
                <p className="m-0 mt-3 text-[18px] opacity-90 [font-family:var(--font-body)]">Obrigado por se juntar à nossa comunidade.</p>
              </div>
            )}
          </div>
        </div>
      </Block>
    </section>
  );
};

NewsletterSection.displayName = 'NewsletterSection';
