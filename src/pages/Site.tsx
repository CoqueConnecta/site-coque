import { useOutletContext } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { GallerySection } from '../components/sections/GallerySection';
import { StatsSection } from '../components/sections/StatsSection';
import type { PublicLayoutContextValue } from './PublicLayout';

function Site() {
  const { content } = useOutletContext<PublicLayoutContextValue>();

  return (
    <>
      <HeroSection data={content.hero} />

      <main>
        <AboutSection
          data={content.about}
          tickerImages={content.aboutMedia.tickerImages}
          youtubeVideos={content.aboutMedia.youtubeVideos}
          id="about"
        />
        <StatsSection data={content.stats} />
        <GallerySection data={content.gallery} id="our-work" />
      </main>
    </>
  )
}

export default Site
