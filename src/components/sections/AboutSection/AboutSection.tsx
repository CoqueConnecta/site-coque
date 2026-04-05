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

          {/* Wrapper do Ticker Infinito */}
          <div className="group relative flex w-full overflow-hidden pb-4">
            {/* Bloco que contém as duas listas e recebe a animação. 
                O hover pausa a animação de forma suave. */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">

              {/* Primeira Lista */}
              {/* O padding-right (pr) igual ao gap garante que a emenda com a segunda lista seja perfeita */}
              <ul className="m-0 flex min-w-max list-none gap-4 pr-4 p-0 md:gap-6 md:pr-6 lg:gap-8 lg:pr-8">
                {aboutTickerImages.map((imageUrl, index) => (
                  <TickerItem key={`img-1-${index}`} imageUrl={imageUrl} />
                ))}
              </ul>

              {/* Segunda Lista (Cópia exata da primeira, aria-hidden para não poluir leitores de tela) */}
              <ul className="m-0 flex min-w-max list-none gap-4 pr-4 p-0 md:gap-6 md:pr-6 lg:gap-8 lg:pr-8" aria-hidden="true">
                {aboutTickerImages.map((imageUrl, index) => (
                  <TickerItem key={`img-2-${index}`} imageUrl={imageUrl} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

// Componente Átomo extraído para deixar o código mais limpo e legível
const TickerItem = ({ imageUrl }: { imageUrl: string }) => (
  <li className="h-[300px] w-[240px] shrink-0 md:h-[420px] md:w-[320px] lg:h-[500px] lg:w-[400px]">
    <div className="h-full w-full overflow-hidden rounded-[40px] bg-white md:rounded-[50px] lg:rounded-[60px]">
      <img
        src={imageUrl}
        alt="Atividades da Coque Connecta"
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  </li>
);

AboutSection.displayName = 'AboutSection';
