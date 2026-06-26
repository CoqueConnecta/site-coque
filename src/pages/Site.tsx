import { useOutletContext } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { VideosSection } from '../components/sections/VideosSection';
import { CarouselSection } from '../components/sections/CarouselSection';
import { WaysToHelpSection } from '../components/sections/WaysToHelpSection';
import { StatsSection } from '../components/sections/StatsSection';
import { TrustSection } from '../components/sections/TrustSection';
import { useCmsLandingData } from '../hooks/useCmsLandingData';
import type { PublicLayoutContextValue } from './PublicLayout';

function Site() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data } = useCmsLandingData(language);

  return (
    <>
      <HeroSection data={data.hero} />

      <main>
        <StatsSection data={data.stats} />
        <AboutSection data={data.about} />
        <VideosSection videos={data.youtubeVideos} />
        <CarouselSection images={data.carousel.images} />
        <WaysToHelpSection data={data.waysToHelp} />
        <TrustSection data={data.trust} language={language} />
      </main>
    </>
  );
}

export default Site;

