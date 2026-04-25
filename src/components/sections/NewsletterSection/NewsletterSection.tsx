import { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import toast from 'react-hot-toast';
import { database } from '../../../../firebase'; // Confirme se o caminho está correto para o seu firebase.ts
import type { ResolvedNewsletterData } from '../../../types/cms';
import { Block } from '../../ui/Block';

export interface NewsletterSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedNewsletterData;
}

export const NewsletterSection = ({ data, className, ...props }: NewsletterSectionProps) => {
  const[loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    type: 'volunteer',
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast.error('Você precisa aceitar os termos para continuar.');
      return;
    }

    setLoading(true);

    try {
      // Cria uma referência para a pasta 'newsletter' no Realtime Database
      const newsletterRef = ref(database, 'newsletter');
      
      // Envia (push) os dados gerando um ID único automaticamente
      await push(newsletterRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        type: formData.type,
        lgpdConsent: true,
        subscribedAt: serverTimestamp(), // Pega o horário seguro do servidor Google
      });

      setIsSubmitted(true);
      // Limpa os dados do form
      setFormData({ firstName: '', lastName: '', email: '', type: 'volunteer', consent: false });
      
      // Volta para o formulário após 5 segundos
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Erro ao salvar no Firebase:', error);
      toast.error('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{ width: '100%', backgroundColor: '#fff', padding: '36px 0 20px', display: 'flex', justifyContent: 'center' }}
      className={className}
      {...props}
    >
      <Block>
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
          {/* Títulos - Mantidos iguais aos seus */}
          <div style={{ width: '100%', maxWidth: '1031px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center', padding: '0 20px' }}>
            <div>
              <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.6px', lineHeight: '90%', color: '#fff', margin: 0 }}>
                {data.headline}
              </h3>
              {data.headlineAccent && (
                <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.6px', lineHeight: '90%', color: '#fff', margin: 0 }}>
                  {data.headlineAccent}
                </h3>
              )}
            </div>
            <p style={{ fontFamily: '"Manrope", sans-serif', fontWeight: 400, fontSize: 'clamp(16px, 2vw, 22px)', letterSpacing: '-0.3px', lineHeight: '150%', color: '#fff', maxWidth: '980px', margin: 0 }}>
              {data.description}
            </p>
          </div>

          <div style={{ width: '100%', maxWidth: '800px', padding: '0 20px' }}>
            <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.16)', marginBottom: '28px' }} />
            
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Linha 1: Nome e Sobrenome */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Nome"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-[54px] w-full rounded-full border border-[#dbdad9] bg-[#fafafa] px-6 text-[16px] text-[#101014] outline-none placeholder:text-gray-500 [font-family:var(--font-body)]"
                  />
                  <input
                    type="text"
                    placeholder="Sobrenome"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-[54px] w-full rounded-full border border-[#dbdad9] bg-[#fafafa] px-6 text-[16px] text-[#101014] outline-none placeholder:text-gray-500 [font-family:var(--font-body)]"
                  />
                </div>

                {/* Linha 2: Email e Tipo de usuário */}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    placeholder={data.placeholderEmail || 'Seu melhor e-mail'}
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-[54px] w-full sm:w-2/3 rounded-full border border-[#dbdad9] bg-[#fafafa] px-6 text-[16px] text-[#101014] outline-none placeholder:text-gray-500 [font-family:var(--font-body)]"
                  />
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="h-[54px] w-full sm:w-1/3 rounded-full border border-[#dbdad9] bg-[#fafafa] px-6 text-[16px] text-[#101014] outline-none [font-family:var(--font-body)] cursor-pointer"
                  >
                    <option value="volunteer">Sou Voluntário</option>
                    <option value="donor">Sou Doador</option>
                    <option value="company">Sou Empresa</option>
                    <option value="community">Sou Comunidade</option>
                  </select>
                </div>

                {/* Checkbox LGPD */}
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

                {/* Botão de Enviar */}
                <button
                  type="submit"
                  disabled={loading || !formData.consent}
                  className="mt-4 h-[54px] w-full sm:w-auto self-center rounded-full bg-[#f9b778] px-10 text-[18px] font-semibold tracking-tight text-[#792b15] [font-family:var(--font-body)] transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed hover:brightness-95"
                >
                  {loading ? 'ENVIANDO...' : data.buttonText || 'RECEBER'}
                </button>
              </form>
            ) : (
              // Estado de Sucesso (Mantido do seu original)
              <div style={{ textAlign: 'center', color: '#fff', padding: '0 20px', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '24px', fontWeight: 600, margin: 0 }}>✓ Inscrição confirmada!</p>
                <p style={{ fontFamily: '"Manrope", sans-serif', fontSize: '18px', marginTop: '12px', opacity: 0.9 }}>Obrigado por se juntar à nossa comunidade.</p>
              </div>
            )}
          </div>
        </div>
      </Block>
    </section>
  );
};

NewsletterSection.displayName = 'NewsletterSection';
