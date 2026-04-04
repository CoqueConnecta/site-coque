import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { Surface } from '../../ui/Surface';
import { Tag } from '../../ui/Tag';
import { SectionContainer } from '../../ui/SectionContainer';
import type { AboutData } from '../../../data/mockData';

export interface AboutSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: AboutData;
}

export const AboutSection = ({ data, className, ...props }: AboutSectionProps) => {
  return (
    <section id="about" className={cn('w-full bg-white', className)} {...props}>
      {/* Main About Content */}
      <SectionContainer spacing="lg" gutter>
        <div className="space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <Tag variant="accent">Sobre</Tag>
            <Typography variant="h1" className="text-4xl sm:text-5xl">
              {data.headline}
            </Typography>
            <Typography variant="body" tone="muted" className="max-w-3xl text-lg">
              {data.description}
            </Typography>
          </div>

          {/* Two Column Layout */}
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left Column - Subheadline & Description */}
            <div className="space-y-4">
              <Typography variant="h2" className="text-3xl">
                {data.subheadline}
              </Typography>
              <Typography variant="body" tone="muted" className="leading-relaxed">
                {data.subdescription}
              </Typography>
            </div>

            {/* Right Column - Mission & Vision Cards */}
            <div className="space-y-4">
              <Surface variant="cardLight" padding="md">
                <Typography variant="h3" className="mb-2">
                  {data.mission.title}
                </Typography>
                <Typography variant="bodySm" tone="muted">
                  {data.mission.description}
                </Typography>
              </Surface>
              <Surface variant="cardLight" padding="md">
                <Typography variant="h3" className="mb-2">
                  {data.vision.title}
                </Typography>
                <Typography variant="bodySm" tone="muted">
                  {data.vision.description}
                </Typography>
              </Surface>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Values Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <SectionContainer spacing="lg" gutter>
          <div className="space-y-12">
            <div className="space-y-2">
              <Typography variant="h2" className="text-3xl sm:text-4xl">
                {data.values.title}
              </Typography>
              <Typography variant="body" tone="muted">
                Os princípios que nos guiam em tudo que fazemos
              </Typography>
            </div>

            {/* Values Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.values.items.map((value) => (
                <Surface
                  key={value.id}
                  variant="cardStrong"
                  padding="md"
                  className="border-l-4 border-l-orange-600"
                >
                  <Typography variant="h3" className="mb-2 text-lg font-bold text-orange-600">
                    {value.label}
                  </Typography>
                  <Typography variant="bodySm" tone="muted">
                    {value.description}
                  </Typography>
                </Surface>
              ))}
            </div>
          </div>
        </SectionContainer>
      </div>
    </section>
  );
};

AboutSection.displayName = 'AboutSection';
