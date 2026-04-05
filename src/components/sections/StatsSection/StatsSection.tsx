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
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-x-[60px] gap-y-[60px] sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((stat, index) => (
            <div key={index} className="flex flex-col items-center gap-3 text-center">
              <p
                className="m-0 [font-family:var(--font-support)] text-[40px] font-light leading-[1] tracking-[-0.8px] text-[#101014] sm:text-[56px] lg:text-[72px]"
              >
                {stat.value}
              </p>
              <h4
                className="m-0 [font-family:var(--font-body)] text-[16px] font-normal leading-[1.5] text-[#101014] sm:text-[18px] lg:text-[20px]"
              >
                {stat.label}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

StatsSection.displayName = 'StatsSection';
