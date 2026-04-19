import { useOutletContext } from 'react-router-dom';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { GallerySection } from '../components/sections/GallerySection';
import { StatsSection } from '../components/sections/StatsSection';
import type { PublicLayoutContextValue } from './PublicLayout';

function Site() {
  const { content, language } = useOutletContext<PublicLayoutContextValue>();

  const localizedYoutubeVideos = content.aboutMedia.youtubeVideos.map((video) => ({
    ...video,
    title: video.titles?.[language] || video.titles?.pt || video.title || '',
  }));

  return (
    <>
      <HeroSection data={content.hero} />

      <main>
        <AboutSection
          data={content.about}
          tickerImages={content.aboutMedia.tickerImages}
          youtubeVideos={localizedYoutubeVideos}
          id="about"
        />
        <StatsSection data={content.stats} />
        <GallerySection data={content.gallery} id="our-work" />
      </main>
    </>
  )
}

export default Site
