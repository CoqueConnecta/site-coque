import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderBar } from '../components/composites/HeaderBar';
import { MobileMenuOverlay } from '../components/composites/MobileMenuOverlay';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { FooterSection } from '../components/sections/FooterSection';
import { useCmsSharedData } from '../hooks/useCmsSharedData';
import { LanguageBar } from '../components/composites/LanguageBar';
import type { CmsLanguage } from '../types/cms';

const LANGUAGE_STORAGE_KEY = 'site-coque-language';

export interface PublicLayoutContextValue {
  language: CmsLanguage;
  setLanguage: (language: CmsLanguage) => void;
}

export default function PublicLayout() {
  const location = useLocation();
  const [language, setLanguage] = useState<CmsLanguage>(() => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'pt';
  });

  const { data: shared } = useCmsSharedData(language);

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
    if (location.pathname !== '/' || !location.hash) return;
    const targetId = location.hash.slice(1);
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

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
