/**
 * Maps admin sectionKey (dotted path) to the Firebase RTDB path to write.
 * The sectionKey matches AdminSectionConfig.key (e.g. "pages.home.hero").
 * The rtdbPath is the actual path in the database (e.g. "cms/v3/pages/home/hero").
 */
export const RTDB_SECTION_PATHS: Record<string, string> = {
  'pages.home.hero':          'cms/v3/pages/home/hero',
  'pages.home.about':         'cms/v3/pages/home/about',
  'pages.home.carousel':      'cms/v3/pages/home/carousel',
  'pages.home.youtubeVideos': 'cms/v3/pages/home/youtubeVideos',
  'pages.home.gallery':       'cms/v3/pages/home/gallery',
  'pages.home.stats':         'cms/v3/pages/home/stats',
  'pages.projects':           'cms/v3/pages/projects',
  'pages.privacy':            'cms/v3/pages/privacy',
  'pages.transparency':       'cms/v3/pages/transparency',
  'shared.nav':               'cms/v3/shared/nav',
  'shared.footer':            'cms/v3/shared/footer',
  'shared.newsletter':        'cms/v3/shared/newsletter',
};

/**
 * Returns the RTDB path for a given section key.
 * Throws if the section key is not registered.
 */
export function getRtdbPath(sectionKey: string): string {
  const path = RTDB_SECTION_PATHS[sectionKey];
  if (!path) {
    throw new Error(`[rtdbRouting] No RTDB path registered for sectionKey: "${sectionKey}"`);
  }
  return path;
}
