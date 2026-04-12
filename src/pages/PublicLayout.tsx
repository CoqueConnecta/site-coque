import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderBar } from '../components/composites/HeaderBar';
import { MobileMenuOverlay } from '../components/composites/MobileMenuOverlay';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { FooterSection } from '../components/sections/FooterSection';
import { mockDataPT } from '../data/mockData';

const navLinks = [
  { label: 'Início', href: '/#hero', id: 'inicio' },
  { label: 'Quem Somos', href: '/#about', id: 'about' },
  { label: 'Nossos Projetos', href: '/#our-work', id: 'our-work' },
  { label: 'Faça Parte', href: '/#contact', id: 'contact' },
];

export default function PublicLayout() {
  const location = useLocation();
  const data = mockDataPT;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | undefined>(undefined);

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
        ctaText="Faça Parte"
        ctaHref="/#contact"
      />

      <HeaderBar
        navLinks={navLinks}
        activeLink={activeLink}
        ctaText="DOE AGORA"
        ctaHref="https://benfeitoria.com/projeto/coqueconnecta"
        onNavClick={handleNavClick}
        onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        showMobileMenu={mobileMenuOpen}
      />

      <Outlet />

      <NewsletterSection data={data.newsletter} id="contact" />
      <FooterSection data={data.footer} />
    </>
  );
}
