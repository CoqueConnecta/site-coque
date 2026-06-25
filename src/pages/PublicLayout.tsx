import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderBar } from '../components/composites/HeaderBar';
import { MobileMenuOverlay } from '../components/composites/MobileMenuOverlay';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { FooterSection } from '../components/sections/FooterSection';
import { useCmsSharedData } from '../hooks/useCmsSharedData';
import { useScrollAnchor } from '../hooks/useScrollAnchor';
import { LanguageBar } from '../components/composites/LanguageBar';
import { STORAGE_KEYS } from '../lib/constants';
import type { CmsLanguage } from '../types/cms';

export interface PublicLayoutContextValue {
  language: CmsLanguage;
  setLanguage: (language: CmsLanguage) => void;
}

export default function PublicLayout() {
  const [language, setLanguage] = useState<CmsLanguage>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEYS.language);
    return saved === 'en' ? 'en' : 'pt';
  });

  const { data: shared } = useCmsSharedData(language);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeLink, setActiveLink } = useScrollAnchor();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.language, language);
  }, [language]);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setMobileMenuOpen(false);
  };

  const navLinks = shared.nav.links;
  const ctaLabel = shared.nav.cta.label;
  const ctaHref  = shared.nav.cta.href;

  return (
    <>
      <MobileMenuOverlay
        isOpen={mobileMenuOpen}
        navLinks={navLinks}
        activeLink={activeLink}
        onNavClick={handleNavClick}
        onClose={() => setMobileMenuOpen(false)}
        showNewsletter
        ctaText={navLinks.find((l) => l.id === 'contact')?.label || 'Faça Parte'}
        ctaHref="/#contact"
        language={language}
        onLanguageChange={setLanguage}
      />

      <LanguageBar language={language} onLanguageChange={setLanguage} isFixed />

      <HeaderBar
        navLinks={navLinks}
        activeLink={activeLink}
        ctaText={ctaLabel}
        ctaHref={ctaHref}
        onNavClick={handleNavClick}
        onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        showMobileMenu={mobileMenuOpen}
      />

      <Outlet context={{ language, setLanguage } satisfies PublicLayoutContextValue} />

      <NewsletterSection data={shared.newsletter} id="contact" />
      <FooterSection data={shared.footer} />
    </>
  );
}
