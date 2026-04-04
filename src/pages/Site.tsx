import { useState } from 'react';
import { HeaderBar } from '../components/composites/HeaderBar';
import { MobileMenuOverlay } from '../components/composites/MobileMenuOverlay';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { GallerySection } from '../components/sections/GallerySection';
import { StatsSection } from '../components/sections/StatsSection';
import { HelpSection } from '../components/sections/HelpSection';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { FooterSection } from '../components/sections/FooterSection';
import { mockDataPT } from '../data/mockData';

const navLinks = [
  { label: 'Sobre nós', href: '#about', id: 'about' },
  { label: 'Nossos Projetos', href: '#projects', id: 'projects' },
  { label: 'Contato', href: '#contact', id: 'contact' },
];

function Site() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | undefined>(undefined);
  const data = mockDataPT;

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <HeaderBar
        navLinks={navLinks}
        activeLink={activeLink}
        ctaText="Quero ajudar"
        ctaHref="#help"
        onNavClick={handleNavClick}
        onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        showMobileMenu={mobileMenuOpen}
      />

      <MobileMenuOverlay
        isOpen={mobileMenuOpen}
        navLinks={navLinks}
        activeLink={activeLink}
        onNavClick={handleNavClick}
        onClose={() => setMobileMenuOpen(false)}
        showNewsletter
        ctaText="Quero ajudar"
        ctaHref="#help"
      />

      <main>
        <HeroSection data={data.hero} />
        <StatsSection data={data.stats} />
        <AboutSection data={data.about} id="about" />
        <GallerySection data={data.gallery} id="projects" />
        <HelpSection data={data.help} id="help" />
        <NewsletterSection data={data.newsletter} />
      </main>

      <FooterSection data={data.footer} id="contact" />
    </>
  )
}

export default Site
