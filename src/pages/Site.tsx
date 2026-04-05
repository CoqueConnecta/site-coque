import { useState, useEffect, useRef } from 'react';
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

// Nav links matching the Framer prototype
const navLinks = [
  { label: 'Início', href: '#hero', id: 'inicio' },
  { label: 'Quem Somos', href: '#about', id: 'about' },
  { label: 'Nossos Projetos', href: '#projects', id: 'projects' },
  { label: 'Faça Parte', href: '#help', id: 'help' },
];

function Site() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | undefined>(undefined);
  const [headerTransparent, setHeaderTransparent] = useState(true);
  const heroRef = useRef<HTMLElement | null>(null);
  const data = mockDataPT;

  // IntersectionObserver: header is transparent while hero is visible
  useEffect(() => {
    heroRef.current = document.getElementById('hero');
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderTransparent(entry.isIntersecting);
      },
      {
        // Trigger when less than 10% of hero is still visible
        threshold: 0.1,
      }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <HeaderBar
        navLinks={navLinks}
        activeLink={activeLink}
        ctaText="DOE AGORA"
        ctaHref="#help"
        isTransparent={headerTransparent}
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
        ctaText="Faça Parte"
        ctaHref="#help"
      />

      <main>
        <HeroSection data={data.hero} />
        <AboutSection data={data.about} id="about" />
        <StatsSection data={data.stats} />
        <GallerySection data={data.gallery} id="projects" />
        <HelpSection data={data.help} id="help" />
        <NewsletterSection data={data.newsletter} />
      </main>

      <FooterSection data={data.footer} id="contact" />
    </>
  )
}

export default Site
