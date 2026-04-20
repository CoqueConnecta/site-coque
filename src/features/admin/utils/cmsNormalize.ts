import type { CmsLandingData, CmsYoutubeVideo } from '../../../types/cms';

export function deepEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  return JSON.stringify(left) === JSON.stringify(right);
}

export function parsePathSegment(segment: string): string | number {
  return /^\d+$/.test(segment) ? Number(segment) : segment;
}

export function isGlobalSection(section: keyof CmsLandingData): boolean {
  return ['aboutMedia', 'nav', 'stats', 'footer'].includes(section);
}

export function normalizeYoutubeVideos(
  videos: CmsYoutubeVideo[],
  dropLegacyTitle = false,
): CmsYoutubeVideo[] {
  return videos.map((video) => {
    const normalizedTitles = video.titles ?? {
      pt: video.title ?? '',
      en: video.title ?? '',
    };

    if (dropLegacyTitle) {
      return {
        id: video.id,
        titles: normalizedTitles,
      };
    }

    return {
      ...video,
      titles: normalizedTitles,
    };
  });
}

export function normalizeAboutMedia(
  aboutMedia: CmsLandingData['aboutMedia'],
  dropLegacyYoutubeTitle = false,
): CmsLandingData['aboutMedia'] {
  return {
    ...aboutMedia,
    youtubeVideos: normalizeYoutubeVideos(aboutMedia.youtubeVideos, dropLegacyYoutubeTitle),
  };
}
