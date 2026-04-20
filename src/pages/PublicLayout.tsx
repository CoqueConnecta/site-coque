import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderBar } from '../components/composites/HeaderBar';
import { MobileMenuOverlay } from '../components/composites/MobileMenuOverlay';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { FooterSection } from '../components/sections/FooterSection';
import { Globe } from 'lucide-react';
import { cn } from '../lib/cn';
import { useCmsLandingData } from '../hooks/useCmsLandingData';
import type { CmsLandingData, CmsLanguage } from '../types/cms';

const LANGUAGE_STORAGE_KEY = 'site-coque-language';

export interface PublicLayoutContextValue {
  content: CmsLandingData;
  language: CmsLanguage;
  setLanguage: (language: CmsLanguage) => void;
  isLoadingContent: boolean;
}

/**
 * Converte CmsNavLink (global com labels PT/EN) para NavLink (específico de idioma com label único)
 */
function convertNavLinksToLanguage(navLinks: CmsLandingData['nav']['links'], language: CmsLanguage) {
  if (!Array.isArray(navLinks)) {
    return [];
  }

  return navLinks.map((link) => {
    const labels = (link as { labels?: Partial<Record<CmsLanguage, string>> }).labels;
    const legacyLabel = (link as { label?: string }).label;

    return {
      ...link,
      label: labels?.[language] || labels?.pt || legacyLabel || '',
    };
  });
}

function getCtaLabel(cta: CmsLandingData['nav']['cta'], language: CmsLanguage) {
  const labels = (cta as { labels?: Partial<Record<CmsLanguage, string>> }).labels;
  const legacyLabel = (cta as { label?: string }).label;

  return labels?.[language] || labels?.pt || legacyLabel || 'Faça Parte';
}

export default function PublicLayout() {
  const location = useLocation();
  const [language, setLanguage] = useState<CmsLanguage>(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'pt';
  });
  const { data: content, isLoading } = useCmsLandingData(language);
  const navLinks = convertNavLinksToLanguage(content.nav.links, language);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | undefined>(undefined);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setActiveLink(`/${location.hash}`);
      return;
    }

    if (location.pathname === '/') {
      setActiveLink('/#hero');
      return;
    }

    setActiveLink(undefined);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) {
      return;
    }

    const targetId = location.hash.slice(1);
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <MobileMenuOverlay
        isOpen={mobileMenuOpen}
        navLinks={navLinks}
        activeLink={activeLink}
        onNavClick={handleNavClick}
        onClose={() => setMobileMenuOpen(false)}
        showNewsletter
        ctaText={navLinks.find((link) => link.id === 'contact')?.label || 'Faça Parte'}
        ctaHref="/#contact"
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* Utility top bar — scrolls with page, desktop only */}
      <div className="hidden h-8 w-full items-center justify-center gap-3 bg-[#2e3350] px-6 md:flex">
        <Globe className="h-3.5 w-3.5 text-white/40" />
        <span className="text-[11px] text-white/50">
          {language === 'pt' ? 'Select the site language:' : 'Selecione o idioma do site:'}
        </span>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={() => setLanguage('pt')}
            className={cn(
              'transition hover:text-white',
              language === 'pt' ? 'font-semibold text-white' : 'text-white/60'
            )}
          >
            🇧🇷 PT
          </button>
          <span className="text-white/30">|</span>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={cn(
              'transition hover:text-white',
              language === 'en' ? 'font-semibold text-white' : 'text-white/60'
            )}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      <HeaderBar
        navLinks={navLinks}
        activeLink={activeLink}
        ctaText={getCtaLabel(content.nav.cta, language)}
        ctaHref={content.nav.cta.href}
        onNavClick={handleNavClick}
        onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        showMobileMenu={mobileMenuOpen}
      />

      <Outlet context={{
        content,
        language,
        setLanguage,
        isLoadingContent: isLoading,
      }} />

      <NewsletterSection data={content.newsletter} id="contact" />
      <FooterSection data={content.footer} />
    </>
  );
}
