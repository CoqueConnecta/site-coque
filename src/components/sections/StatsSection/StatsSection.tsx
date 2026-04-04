import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { Surface } from '../../ui/Surface';
import { SectionContainer } from '../../ui/SectionContainer';
import type { StatsData } from '../../../data/mockData';

export interface StatsSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: StatsData;
}

export const StatsSection = ({ data, className, ...props }: StatsSectionProps) => {
  return (
    <section
      className={cn(
        'w-full bg-gradient-to-r from-orange-600 to-orange-700 py-16 sm:py-24 lg:py-32',
        className
      )}
      {...props}
    >
      <SectionContainer spacing="none" gutter>
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <Typography variant="h2" tone="onDark" className="text-3xl sm:text-4xl lg:text-5xl">
              Impacto em Números
            </Typography>
            <Typography variant="body" tone="onDark" className="opacity-90">
              Veja o alcance da Coque Connecta
            </Typography>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.items.map((stat, index) => (
              <Surface
                key={index}
                variant="cardLight"
                padding="lg"
                className="text-center space-y-2 transform transition-transform hover:scale-105"
              >
                <Typography variant="h1" className="text-4xl sm:text-5xl font-bold text-orange-600">
                  {stat.value}
                </Typography>
                <Typography variant="body" tone="muted" className="font-medium">
                  {stat.label}
                </Typography>
              </Surface>
            ))}
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};

StatsSection.displayName = 'StatsSection';
