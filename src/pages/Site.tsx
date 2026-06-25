import { useOutletContext } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { VideosSection } from '../components/sections/VideosSection';
import { CarouselSection } from '../components/sections/CarouselSection';
import { GallerySection } from '../components/sections/GallerySection';
import { StatsSection } from '../components/sections/StatsSection';
import { useCmsLandingData } from '../hooks/useCmsLandingData';
import type { PublicLayoutContextValue } from './PublicLayout';

function Site() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data } = useCmsLandingData(language);

  return (
    <>
      <HeroSection data={data.hero} />

      <main>
        <AboutSection data={data.about} id="about" />
        <VideosSection videos={data.youtubeVideos} />
        <CarouselSection images={data.carousel.images} />
        <StatsSection data={data.stats} />
        <GallerySection data={data.gallery} id="our-work" />
      </main>
    </>
  );
}

export default Site;

