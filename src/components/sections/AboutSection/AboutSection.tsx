import { cn } from '../../../lib/cn';
import { Typography } from '../../ui/Typography';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
import type { ResolvedAboutData } from '../../../types/cms';

export interface AboutSectionProps extends React.HTMLAttributes<HTMLElement> {
  data: ResolvedAboutData;
}

export const AboutSection = ({
  data,
  className,
  ...props
}: AboutSectionProps) => {
  return (
    <section
      id="about"
      className={cn('w-full bg-[color:var(--color-tag-bg)] py-20 sm:py-28', className)}
      {...props}
    >
      <Block>
        <FadeIn>
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12 lg:gap-16">
            <div className="mx-auto flex-shrink-0 md:mx-0">
              <img
                src="/coque-logo.svg"
                alt="Coque Connecta"
                className="w-32 sm:w-36 md:w-44 lg:w-52"
                width="208"
                height="208"
                loading="eager"
              />
            </div>
            <div className="min-w-0">
              <Typography
                variant="body"
                tone="onDark"
                className="text-[18px] leading-relaxed sm:text-[20px] lg:text-[22px]"
              >
                {data.description}
              </Typography>
            </div>
          </div>
        </FadeIn>
      </Block>
    </section>
  );
};

AboutSection.displayName = 'AboutSection';

