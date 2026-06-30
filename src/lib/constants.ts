export const ROUTE_HASHES = {
  hero: '#hero',
  about: '#about',
  contact: '#contact',
  waysToHelp: '#ways-to-help',
} as const;

export const ROUTES = {
  about:        '/quem-somos',
  waysToHelp:   '/como-ajudar',
  whatWeDo:     '/nossos-projetos',
  transparency: '/transparencia',
  privacy:      '/privacidade',
} as const;

export const STORAGE_KEYS = {
  language: 'site-coque-language',
  adminTheme: 'admin-theme',
} as const;

export const NEWSLETTER_SUCCESS_RESET_MS = 5000;
