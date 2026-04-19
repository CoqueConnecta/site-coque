import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { Menu, X } from 'lucide-react';
import type { CmsLandingData, CmsLanguage } from '../../../types/cms';

export type SectionNavItem = {
  id: string;
  section: keyof CmsLandingData;
  label: string;
  aboutMediaMode?: 'carousel' | 'youtubeVideos';
};

type AdminSectionNavProps = {
  sectionNavItems: SectionNavItem[];
  activeSection: keyof CmsLandingData | '';
  activeAboutMediaMode: 'carousel' | 'youtubeVideos';
  sectionNavDirtyCount: (item: {
    section: keyof CmsLandingData;
    aboutMediaMode?: 'carousel' | 'youtubeVideos';
  }) => number;
  activeSectionTitle: string;
  activeSectionDirtyCount: number;
  mobileLanguage: CmsLanguage;
  showMobileLanguageTabs: boolean;
  isDrawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
  onSelectSection: (section: keyof CmsLandingData, aboutMediaMode?: 'carousel' | 'youtubeVideos') => void;
  onMobileLanguageChange: (lang: CmsLanguage) => void;
  onSave: () => void;
  onDiscard: () => void;
  onLogout: () => void;
};

export function AdminSectionNav({
  sectionNavItems,
  activeSection,
  activeAboutMediaMode,
  sectionNavDirtyCount,
  activeSectionTitle,
  activeSectionDirtyCount,
  mobileLanguage,
  showMobileLanguageTabs,
  isDrawerOpen,
  onDrawerOpenChange,
  onSelectSection,
  onMobileLanguageChange,
  onSave,
  onDiscard,
  onLogout,
}: AdminSectionNavProps) {
  const isActive = (item: SectionNavItem) =>
    activeSection === item.section &&
    (!item.aboutMediaMode || activeAboutMediaMode === item.aboutMediaMode);

  const navList = (onClickExtra?: () => void) => (
    <ul className="space-y-1 sm:space-y-2">
      {sectionNavItems.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => {
              onSelectSection(item.section, item.aboutMediaMode);
              onClickExtra?.();
            }}
            className={`w-full rounded-lg p-3 text-left text-sm font-medium transition ${
              isActive(item)
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span>{item.label}</span>
              {sectionNavDirtyCount(item) > 0 ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive(item)
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {sectionNavDirtyCount(item)}
                </span>
              ) : null}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Seções</h1>
        </div>
        <nav className="p-3">{navList()}</nav>
      </aside>

      {/* Header mobile + desktop */}
      <header className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2 lg:gap-4">
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Drawer mobile */}
            <Dialog.Root open={isDrawerOpen} onOpenChange={onDrawerOpenChange}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 lg:hidden"
                >
                  <Menu className="h-4 w-4" />
                  Seções
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 lg:hidden" />
                <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm border-r border-gray-200 bg-white p-4 shadow-xl lg:hidden">
                  <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
                    <Dialog.Title className="text-lg font-bold text-gray-900">Seções</Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        aria-label="Fechar painel de seções"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <nav className="h-[calc(100%-64px)] overflow-y-auto pr-1">
                    {navList(() => onDrawerOpenChange(false))}
                  </nav>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <h2 className="text-lg font-bold text-gray-800 lg:text-2xl">
              <span className="hidden lg:inline">Editando: </span>
              <span className="text-blue-600">{activeSectionTitle}</span>
            </h2>
          </div>

          <button
            onClick={onLogout}
            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-600 lg:hidden"
          >
            Sair
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              activeSectionDirtyCount > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {activeSectionDirtyCount > 0
              ? `${activeSectionDirtyCount} alteracao(oes) pendente(s)`
              : 'Sem alteracoes pendentes'}
          </span>

          <div className="hidden items-center lg:flex">
            <button
              onClick={onDiscard}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 shadow-sm transition-all duration-150"
            >
              Descartar secao ativa
            </button>
            <button
              onClick={onSave}
              className="ml-3 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 shadow-sm transition-all duration-150 transform hover:scale-105"
            >
              Salvar secao ativa
            </button>
            <button
              onClick={onLogout}
              className="ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 shadow-sm transition-all duration-150 transform hover:scale-105"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Abas PT/EN mobile */}
        {showMobileLanguageTabs ? (
          <Tabs.Root
            className="mt-3 lg:hidden"
            value={mobileLanguage}
            onValueChange={(value) => onMobileLanguageChange(value as CmsLanguage)}
          >
            <Tabs.List className="grid w-full grid-cols-2 rounded-lg bg-gray-200 p-1">
              <Tabs.Trigger
                value="pt"
                className="rounded-md px-3 py-2 text-sm font-semibold text-gray-600 transition data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Portugues
              </Tabs.Trigger>
              <Tabs.Trigger
                value="en"
                className="rounded-md px-3 py-2 text-sm font-semibold text-gray-600 transition data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                Ingles
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        ) : null}
      </header>
    </>
  );
}
