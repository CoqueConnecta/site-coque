import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { SectionContainer } from '../../ui/SectionContainer';
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
      {/* Intro block right after hero, matching the prototype white section */}
      <SectionContainer spacing="lg" gutter>
        <div className="space-y-12 md:space-y-16">
          <div className="mx-auto max-w-5xl">
            <Typography variant="body" tone="muted" className="text-lg leading-relaxed sm:text-xl">
              {data.description}
            </Typography>
          </div>

          {/* Horizontal ticker-like gallery */}
          <div className="w-full overflow-x-auto pb-2">
            <ul className="m-0 flex min-w-max list-none gap-4 p-0 md:gap-6 lg:gap-8">
              {aboutTickerImages.map((imageUrl, index) => (
                <li key={`${imageUrl}-${index}`} className="h-[300px] w-[240px] shrink-0 md:h-[420px] md:w-[320px] lg:h-[500px] lg:w-[400px]">
                  <div className="h-full w-full overflow-hidden rounded-[40px] bg-white md:rounded-[50px] lg:rounded-[60px]">
                    <img
                      src={imageUrl}
                      alt="Atividades da Coque Connecta"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

AboutSection.displayName = 'AboutSection';
