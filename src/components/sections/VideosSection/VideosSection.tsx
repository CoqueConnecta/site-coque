import { cn } from '../../../lib/cn';
import { Block } from '../../ui/Block';
import { FadeIn } from '../../ui/FadeIn';
import { YouTubeFeed } from '../../ui/YouTubeFeed';
import type { ResolvedYoutubeVideo } from '../../../types/cms';

export interface VideosSectionProps extends React.HTMLAttributes<HTMLElement> {
  videos?: ResolvedYoutubeVideo[];
}

export const VideosSection = ({
  videos,
  className,
  ...props
}: VideosSectionProps) => {
  return (
    <section
      className={cn('w-full bg-white pt-12 pb-0 md:pt-16 md:pb-0', className)}
      {...props}
    >
      <Block>
        <FadeIn>
          <YouTubeFeed videos={videos} />
        </FadeIn>
      </Block>
    </section>
  );
};

VideosSection.displayName = 'VideosSection';
