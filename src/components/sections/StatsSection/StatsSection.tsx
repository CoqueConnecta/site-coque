import { cn } from '../../../lib/cn';
import type { StatsData } from '../../../data/mockData';

export interface StatsSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: StatsData;
}

export const StatsSection = ({ data, className, ...props }: StatsSectionProps) => {
  return (
    <section
      className={cn('w-full bg-white', className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-screen-xl px-8 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-x-[60px] gap-y-[60px] lg:grid-cols-4">
          {data.items.map((stat, index) => (
            <div key={index} className="flex flex-col items-center gap-3 text-center">
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 'clamp(40px, 5vw, 72px)',
                  fontWeight: 300,
                  letterSpacing: '-0.8px',
                  lineHeight: '100%',
                  color: '#101014',
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#3d3d47',
                  margin: 0,
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

StatsSection.displayName = 'StatsSection';
