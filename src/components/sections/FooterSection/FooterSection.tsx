import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import type { FooterData } from '../../../data/mockData';

export interface FooterSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: FooterData;
}

export const FooterSection = ({ data, className, ...props }: FooterSectionProps) => {
  return (
    <footer className={cn('w-full bg-gray-900 text-white', className)} {...props}>
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <Typography variant="h3" tone="onDark" className="font-bold text-lg">
                Coque Connecta
              </Typography>
              <Typography variant="bodySm" tone="onDark" className="opacity-70">
                Conectando, multiplicando, transformando.
              </Typography>
            </div>
            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              {data.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-orange-600 transition-colors"
                  aria-label={`Visite nosso ${link.platform}`}
                  title={link.platform}
                >
                  <span className="text-xs font-bold">{link.platform[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <Typography variant="h3" tone="onDark" className="font-semibold text-sm mb-4">
              Links Rápidos
            </Typography>
            <nav className="space-y-2">
              {data.quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors block"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <Typography variant="h3" tone="onDark" className="font-semibold text-sm mb-4">
              Contato
            </Typography>
            <div className="space-y-2 text-sm text-gray-300">
              {data.email && (
                <a href={`mailto:${data.email}`} className="hover:text-white transition-colors block">
                  📧 {data.email}
                </a>
              )}
              {data.phone && (
                <a href={`tel:${data.phone}`} className="hover:text-white transition-colors block">
                  ☎️ {data.phone}
                </a>
              )}
              {data.address && <div className="text-gray-400">📍 {data.address}</div>}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="space-y-3">
            <Typography variant="h3" tone="onDark" className="font-semibold text-sm mb-4">
              Newsletter
            </Typography>
            <Typography variant="bodySm" tone="onDark" className="opacity-70 text-xs">
              Receba nossas atualizações e histórias de impacto.
            </Typography>
            <a
              href="#newsletter"
              className="inline-block mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-md transition-colors"
            >
              Inscrever
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Typography variant="bodySm" tone="onDark" className="opacity-70">
            {data.copyright}
          </Typography>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

FooterSection.displayName = 'FooterSection';
