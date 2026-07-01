import { useOutletContext } from 'react-router-dom';
import { SectionCTA } from '../components/composites/SectionCTA/SectionCTA';
import { HeroSection } from '../components/sections/HeroSection';
import { AboutSection } from '../components/sections/AboutSection';
import { CoqueEmAcaoSection } from '../components/sections/CoqueEmAcaoSection';
import { WaysToHelpTeaser } from '../components/sections/WaysToHelpTeaser';
import { StatsSection } from '../components/sections/StatsSection';
import { TrustSection } from '../components/sections/TrustSection';
import { WhatWeDoSection } from '../components/sections/WhatWeDoSection';
import { ROUTES } from '../lib/constants';
import { useCmsLandingData } from '../hooks/useCmsLandingData';
import type { PublicLayoutContextValue } from './PublicLayout';

const ABOUT_LINK: Record<string, string> = { pt: 'Conheça nossa história', en: 'Learn our story' };

function Site() {
  const { language } = useOutletContext<PublicLayoutContextValue>();
  const { data } = useCmsLandingData(language);

  return (
    <>
      <div className="h-[116px] w-full bg-[color:var(--color-tag-bg)]" aria-hidden="true" />
      <HeroSection data={data.hero} />

      <main>
        <StatsSection data={data.stats} />
        <AboutSection data={data.about} />
        <div className="w-full bg-[color:var(--color-tag-bg)] pb-16 sm:pb-24">
          <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <SectionCTA href={ROUTES.about} label={ABOUT_LINK[language] ?? ABOUT_LINK.pt} tone="on-dark" />
          </div>
        </div>
        <CoqueEmAcaoSection videos={data.youtubeVideos} images={data.carousel.images} language={language} />
        <WhatWeDoSection data={data.whatWeDo} language={language} />

        <WaysToHelpTeaser data={data.waysToHelp} language={language} />
        <TrustSection data={data.trust} language={language} />
      </main>
    </>
  );
}

export default Site;
