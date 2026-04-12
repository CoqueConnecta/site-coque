import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { GallerySection } from '../components/sections/GallerySection';
import { StatsSection } from '../components/sections/StatsSection';
import { mockDataPT } from '../data/mockData';

function Site() {
  const data = mockDataPT;

  return (
    <>
      <HeroSection data={data.hero} />

      <main>
        <AboutSection data={data.about} id="about" />
        <StatsSection data={data.stats} />
        <GallerySection data={data.gallery} id="our-work" />
      </main>
    </>
  )
}

export default Site
