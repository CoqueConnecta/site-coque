import { Home, Lock, FileText, FolderOpen, Settings, Image } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AdminSectionConfig {
  /** Unique key for this section, used as sectionPath in dirty tracking and rtdbRouting */
  key: string;
  label: string;
}

export interface AdminRouteConfig {
  id: 'home' | 'privacy' | 'transparency' | 'projects' | 'settings' | 'media';
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
      { key: 'pages.home.hero',          label: 'Hero'           },
      { key: 'pages.home.about',         label: 'Quem Somos'     },
      { key: 'pages.home.carousel',      label: 'Carrossel'      },
      { key: 'pages.home.youtubeVideos', label: 'YouTube Videos' },
      { key: 'pages.home.waysToHelp',    label: 'Como Ajudar'    },
      { key: 'pages.home.stats',         label: 'Estatísticas'   },
    ],
  },
  {
    id: 'projects',
    label: 'Nossos Projetos',
    description: 'Gerenciar projetos',
    icon: FolderOpen,
    sections: [
      { key: 'pages.projects', label: 'Projetos' },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacidade',
    description: 'Política de privacidade',
    icon: Lock,
    sections: [
      { key: 'pages.privacy', label: 'Privacidade' },
    ],
  },
  {
    id: 'transparency',
    label: 'Transparência',
    description: 'Página de transparência',
    icon: FileText,
    sections: [
      { key: 'pages.transparency', label: 'Transparência' },
    ],
  },
  {
    id: 'settings',
    label: 'Configurações',
    description: 'Navegação, rodapé e newsletter',
    icon: Settings,
    sections: [
      { key: 'shared.nav',        label: 'Navegação'   },
      { key: 'shared.footer',     label: 'Rodapé'      },
      { key: 'shared.newsletter', label: 'Newsletter'  },
    ],
  },
  {
    id: 'media',
    label: 'Biblioteca',
    description: 'Biblioteca e galeria de imagens',
    icon: Image,
    sections: [],
  },
];

export type AdminRouteId = AdminRouteConfig['id'];
