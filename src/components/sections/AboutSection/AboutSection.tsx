import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { SectionContainer } from '../../ui/SectionContainer';
import { InfiniteImageTicker } from '../../composites/InfiniteImageTicker';
import type { AboutData } from '../../../data/mockData';

export interface AboutSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: AboutData;
}

const aboutTickerImages = [
  'https://framerusercontent.com/images/nICdkmexvoBG2bA2goiNyF1mcY.jpg?width=1280&height=1600',
  'https://framerusercontent.com/images/sBRdczu8bFBR8Rg0cEoUriOt8WU.jpg?width=1440&height=973',
  'https://framerusercontent.com/images/5rHHzdIIT6bfHvdO1Eat1SsY4Zo.jpg?width=960&height=1280',
  'https://framerusercontent.com/images/dJVDsHYR0sR8qpyxmYUJD8os.jpg?width=4032&height=3024',
  'https://framerusercontent.com/images/EGwC09xR8iUr4R6I6YxLoCqUcQ.jpg?width=3024&height=4032',
  'https://framerusercontent.com/images/AnnnTX5gDlgnIZzRJ0bNzA9CkpU.jpg?width=4032&height=3024',
];

export const AboutSection = ({ data, className, ...props }: AboutSectionProps) => {
  return (
    <section id="about" className={cn('w-full bg-white', className)} {...props}>
      {/* Bloco introdutório logo após o hero, em fundo branco como no protótipo */}
      <SectionContainer spacing="lg" width="full" gutter={false}>
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="space-y-12 md:space-y-16">
            <div className="mx-auto max-w-5xl">
              <Typography
                variant="body"
                tone="muted"
                className="text-[18px] leading-relaxed sm:text-[20px] lg:text-[22px]"
              >
                {data.description}
              </Typography>
            </div>

            <InfiniteImageTicker
              images={aboutTickerImages}
              imageAlt="Atividades da Coque Connecta"
            />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

AboutSection.displayName = 'AboutSection';
