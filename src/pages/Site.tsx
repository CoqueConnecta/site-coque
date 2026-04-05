import { useState } from 'react';
import { HeaderBar } from '../components/composites/HeaderBar';
import { MobileMenuOverlay } from '../components/composites/MobileMenuOverlay';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { GallerySection } from '../components/sections/GallerySection';
import { StatsSection } from '../components/sections/StatsSection';
import { NewsletterSection } from '../components/sections/NewsletterSection';
import { FooterSection } from '../components/sections/FooterSection';
import { mockDataPT } from '../data/mockData';

// Nav links matching the Framer prototype
const navLinks = [
  { label: 'Início', href: '#hero', id: 'inicio' },
  { label: 'Quem Somos', href: '#about', id: 'about' },
  { label: 'Nossos Projetos', href: '#our-work', id: 'our-work' },
  { label: 'Faça Parte', href: '#contact', id: 'contact' },
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
      <MobileMenuOverlay
        isOpen={mobileMenuOpen}
        navLinks={navLinks}
        activeLink={activeLink}
        onNavClick={handleNavClick}
        onClose={() => setMobileMenuOpen(false)}
        showNewsletter
        ctaText="Faça Parte"
        ctaHref="#contact"
      />

      {/* Hero wrapper: HeaderBar + HeroSection share the same gradient background */}
      <div
        style={{
          backgroundImage: [
            'radial-gradient(60% 55% at 18% 55%, rgba(255, 70, 20, 0.35) 0%, rgba(255, 70, 20, 0) 70%)',
            'radial-gradient(95% 90% at 98% 2%, rgba(65, 20, 9, 0.78) 0%, rgba(65, 20, 9, 0.2) 55%, rgba(65, 20, 9, 0) 100%)',
            'linear-gradient(130deg, #ff6b1e 0%, #f58634 52%, #d5631f 100%)',
          ].join(',')
        }}
      >
        <HeaderBar
          navLinks={navLinks}
          activeLink={activeLink}
          ctaText="DOE AGORA"
          ctaHref="#contact"
          isTransparent
          onNavClick={handleNavClick}
          onMobileMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          showMobileMenu={mobileMenuOpen}
        />

        <HeroSection data={data.hero} />
      </div>

      <main>
        <AboutSection data={data.about} id="about" />
        <StatsSection data={data.stats} />
        <GallerySection data={data.gallery} id="our-work" />
        <NewsletterSection data={data.newsletter} id="contact" />
      </main>

      <FooterSection data={data.footer} />
    </>
  )
}

export default Site
