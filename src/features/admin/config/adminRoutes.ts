import { Home, Lock, FileText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CmsLandingData } from '../../../types/cms';

export interface AdminSectionConfig {
  key: keyof CmsLandingData;
  label: string;
  isGlobal: boolean;
  aboutMediaMode?: 'carousel' | 'youtubeVideos';
}

export interface AdminRouteConfig {
  id: 'home' | 'privacy' | 'transparency';
  label: string;
  description: string;
  icon: LucideIcon;
  sections: AdminSectionConfig[];
}

export const ADMIN_ROUTES: AdminRouteConfig[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Página principal do site',
    icon: Home,
    sections: [
      { key: 'nav',         label: 'Navegação',     isGlobal: true  },
      { key: 'hero',        label: 'Hero',           isGlobal: false },
      { key: 'about',       label: 'Quem Somos',    isGlobal: false },
      { key: 'aboutMedia',  label: 'Carrossel',      isGlobal: true, aboutMediaMode: 'carousel' },
      { key: 'aboutMedia',  label: 'YouTube Videos', isGlobal: true, aboutMediaMode: 'youtubeVideos' },
      { key: 'gallery',    label: 'Galeria',         isGlobal: false },
      { key: 'stats',      label: 'Estatísticas',    isGlobal: true  },
      { key: 'newsletter', label: 'Newsletter',      isGlobal: false },
      { key: 'footer',     label: 'Rodapé',          isGlobal: true  },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacidade',
    description: 'Política de privacidade',
    icon: Lock,
    sections: [
      { key: 'privacy', label: 'Privacidade', isGlobal: false },
    ],
  },
  {
    id: 'transparency',
    label: 'Transparência',
    description: 'Página de transparência',
    icon: FileText,
    sections: [
      { key: 'transparency', label: 'Transparência', isGlobal: false },
    ],
  },
];

export type AdminRouteId = AdminRouteConfig['id'];
