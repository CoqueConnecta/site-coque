import { useEffect, useState } from 'react';
import { cn } from '../../../lib/cn';
import type { CmsCarouselImage } from '../../../types/cms';

export interface HeroPhotoCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  photos: CmsCarouselImage[];
  intervalMs?: number;
}

export const HeroPhotoCarousel = ({
  photos,
  intervalMs = 5500,
  className,
  ...props
}: HeroPhotoCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    if (photos.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % photos.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [photos.length, intervalMs]);

  return (
    <div className={cn('absolute inset-0', className)} aria-hidden="true" {...props}>
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo.src}
          alt={photo.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            // Reduced motion: mantém o ciclo automático (não é o tipo de movimento contínuo
            // que a media query visa eliminar), só troca o crossfade por um corte abrupto.
            prefersReducedMotion ? 'transition-none' : 'transition-opacity duration-1000',
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          )}
        />
      ))}
    </div>
  );
};

HeroPhotoCarousel.displayName = 'HeroPhotoCarousel';
