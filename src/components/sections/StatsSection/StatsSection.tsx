import { cn } from '../../../lib/cn';
import type { ResolvedStatsData } from '../../../types/cms';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';

export interface StatsSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedStatsData;
}

export const StatsSection = ({ data, className, ...props }: StatsSectionProps) => {
  return (
    <section
      className={cn('w-full bg-[#101014]', className)}
      {...props}
    >
      <Block className="py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-x-[60px] gap-y-[60px] sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((stat, index) => (
            <FadeIn key={index} delay={index * 100} className="flex flex-col items-center gap-3 text-center">
              <p
                className="m-0 [font-family:var(--font-support)] text-[40px] font-light leading-[1] tracking-[-0.8px] text-[#f97316] sm:text-[56px] lg:text-[72px]"
              >
                {stat.value}
              </p>
              <h4
                className="m-0 [font-family:var(--font-body)] text-[16px] font-normal leading-[1.5] text-[#fef7ee] sm:text-[18px] lg:text-[20px]"
              >
                {stat.label}
              </h4>
            </FadeIn>
          ))}
        </div>
      </Block>
    </section>
  );
};

StatsSection.displayName = 'StatsSection';
