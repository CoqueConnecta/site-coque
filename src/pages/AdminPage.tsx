// src/pages/AdminPage.tsx
import { useEffect, useMemo, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import toast from 'react-hot-toast';
import { auth, database } from '../../firebase';
import { cmsFallbackByLanguage } from '../data/cmsFallback';
import { ImageField } from '../features/admin/components/ImageField';
import { ImageLibraryModal } from '../features/admin/components/ImageLibraryModal';
import { AdminHeader } from '../features/admin/components/AdminNavShell';
import { AdminDiscardModal } from '../features/admin/components/AdminDiscardModal';
import { GalleryEditor } from '../features/admin/components/sections/GalleryEditor';
import { DynamicSectionEditor } from '../features/admin/components/sections/DynamicSectionEditor';
import { HeroEditor } from '../features/admin/components/sections/HeroEditor';
import { NavEditor } from '../features/admin/components/sections/NavEditor';
import { StatsEditor } from '../features/admin/components/sections/StatsEditor';
import { FooterEditor } from '../features/admin/components/sections/FooterEditor';
import { AboutMediaEditor } from '../features/admin/components/sections/AboutMediaEditor';
import { useAdminData } from '../features/admin/hooks/useAdminData';
import { useDirtyFields } from '../features/admin/hooks/useDirtyFields';
import { useImagePicker } from '../features/admin/hooks/useImagePicker';
import {
  deepEqual,
  isGlobalSection,
  normalizeAboutMedia,
  parsePathSegment,
} from '../features/admin/utils/cmsNormalize';
import {
  buildEmptyFromTemplate,
  getValueAtPath,
  isRecord,
  setValueAtPath,
} from '../features/admin/utils/editorPath';
import type { CmsAboutMediaData, CmsLandingData, CmsLanguage } from '../types/cms';
import type { CmsLandingByLanguage, MediaAsset } from '../features/admin/types';
import type { SectionNavItem } from '../features/admin/components/AdminNavShell';

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    cmsData,
    setCmsData,
    originalCmsData,
    setOriginalCmsData,
    activeSection,
    setActiveSection,
    mobileLanguage,
    setMobileLanguage,
  } = useAdminData();

  const [activeAboutMediaMode, setActiveAboutMediaMode] = useState<'carousel' | 'youtubeVideos'>('carousel');
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState(false);

  const {
    dirtyFields,
    setDirtyFields,
    markDirtyField,
    isFieldDirty,
    activeSectionDirtyCount,
    sectionNavDirtyCount,
  } = useDirtyFields(originalCmsData, activeSection, activeAboutMediaMode);

  const {
    isMediaModalOpen,
    pickerState,
    mediaSearch,
    setMediaSearch,
    selectedMediaCategory,
    setSelectedMediaCategory,
    shouldApplyMetadata,
    setShouldApplyMetadata,
    filteredMediaAssets,
    categories,
    openImagePicker,
    closeImagePicker,
  } = useImagePicker();

  useEffect(() => {
    if (!isDiscardConfirmOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDiscardConfirmOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDiscardConfirmOpen]);

  const sectionNavItems = useMemo<SectionNavItem[]>(() => {
    if (!cmsData) return [];
    const sections = Object.keys(cmsData.pt) as Array<keyof CmsLandingData>;
    const items: SectionNavItem[] = [];
    sections.forEach((section) => {
      if (section === 'aboutMedia') {
        items.push(
          { id: 'carousel', section, label: 'Carrossel', aboutMediaMode: 'carousel' },
          { id: 'youtubeVideos', section, label: 'YouTube Videos', aboutMediaMode: 'youtubeVideos' },
        );
        return;
      }
      items.push({
        id: section,
        section,
        label: String(section).charAt(0).toUpperCase() + String(section).slice(1).replace(/_/g, ' '),
      });
    });
    return items;
  }, [cmsData]);

  const activeSectionTitle =
    activeSection === 'aboutMedia'
      ? activeAboutMediaMode === 'carousel' ? 'Carrossel' : 'YouTube Videos'
      : String(activeSection).charAt(0).toUpperCase() + String(activeSection).slice(1).replace(/_/g, ' ');

  const getObjectAtPath = (source: unknown, path: Array<string | number>) => {
    const value = getValueAtPath(source, path);
    return isRecord(value) ? value : null;
  };

  const handleSectionFieldChange = (language: CmsLanguage, path: Array<string | number>, value: unknown) => {
    if (!activeSection) return;
    setCmsData((prev) => {
      if (!prev) return prev;
      if (isGlobalSection(activeSection)) {
        const currentGlobalSection = prev.pt[activeSection];
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, value) as CmsLandingData[keyof CmsLandingData];
        const nextValue = getValueAtPath(updatedGlobalSection, path);
        markDirtyField('pt', activeSection, path, nextValue);
        markDirtyField('en', activeSection, path, nextValue);
        return { ...prev, pt: { ...prev.pt, [activeSection]: updatedGlobalSection }, en: { ...prev.en, [activeSection]: updatedGlobalSection } };
      }
      const currentSectionData = prev[language][activeSection];
      const updatedSectionData = setValueAtPath(currentSectionData, path, value) as CmsLandingData[keyof CmsLandingData];
      const nextValue = getValueAtPath(updatedSectionData, path);
      markDirtyField(language, activeSection, path, nextValue);
      return { ...prev, [language]: { ...prev[language], [activeSection]: updatedSectionData } };
    });
  };

  const handleAddArrayItem = (language: CmsLanguage, path: Array<string | number>) => {
    if (!activeSection) return;
    setCmsData((prev) => {
      if (!prev) return prev;
      if (isGlobalSection(activeSection)) {
        const currentGlobalSection = prev.pt[activeSection];
        const currentValue = getValueAtPath(currentGlobalSection, path);
        if (!Array.isArray(currentValue)) return prev;
        const fallbackValue = getValueAtPath(cmsFallbackByLanguage.pt[activeSection] as unknown, path);
        const fallbackItem = Array.isArray(fallbackValue) && fallbackValue.length > 0 ? buildEmptyFromTemplate(fallbackValue[0]) : '';
        const updatedArray = [...currentValue, fallbackItem];
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
        markDirtyField('pt', activeSection, path, updatedArray);
        markDirtyField('en', activeSection, path, updatedArray);
        return { ...prev, pt: { ...prev.pt, [activeSection]: updatedGlobalSection }, en: { ...prev.en, [activeSection]: updatedGlobalSection } };
      }
      const currentSectionData = prev[language][activeSection];
      const currentValue = getValueAtPath(currentSectionData, path);
      if (!Array.isArray(currentValue)) return prev;
      const fallbackSectionData = cmsFallbackByLanguage[language][activeSection] as unknown;
      const fallbackValue = getValueAtPath(fallbackSectionData, path);
      const fallbackItem = Array.isArray(fallbackValue) && fallbackValue.length > 0 ? buildEmptyFromTemplate(fallbackValue[0]) : '';
      const updatedArray = [...currentValue, fallbackItem];
      const updatedSectionData = setValueAtPath(currentSectionData, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
      markDirtyField(language, activeSection, path, updatedArray);
      return { ...prev, [language]: { ...prev[language], [activeSection]: updatedSectionData } };
    });
  };

  const handleRemoveArrayItem = (language: CmsLanguage, path: Array<string | number>, index: number) => {
    if (!activeSection) return;
    setCmsData((prev) => {
      if (!prev) return prev;
      if (isGlobalSection(activeSection)) {
        const currentGlobalSection = prev.pt[activeSection];
        const currentValue = getValueAtPath(currentGlobalSection, path);
        if (!Array.isArray(currentValue)) return prev;
        const updatedArray = currentValue.filter((_, i) => i !== index);
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
        markDirtyField('pt', activeSection, path, updatedArray);
        markDirtyField('en', activeSection, path, updatedArray);
        return { ...prev, pt: { ...prev.pt, [activeSection]: updatedGlobalSection }, en: { ...prev.en, [activeSection]: updatedGlobalSection } };
      }
      const currentSectionData = prev[language][activeSection];
      const currentValue = getValueAtPath(currentSectionData, path);
      if (!Array.isArray(currentValue)) return prev;
      const updatedArray = currentValue.filter((_, i) => i !== index);
      const updatedSectionData = setValueAtPath(currentSectionData, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
      markDirtyField(language, activeSection, path, updatedArray);
      return { ...prev, [language]: { ...prev[language], [activeSection]: updatedSectionData } };
    });
  };

  const handleHeroFieldChange = (language: CmsLanguage, field: keyof CmsLandingData['hero'], value: string) => {
    const section: keyof CmsLandingData = 'hero';
    markDirtyField(language, section, [field], value);
    setCmsData((prev) => {
      if (!prev) return prev;
      return { ...prev, [language]: { ...prev[language], hero: { ...prev[language].hero, [field]: value } } };
    });
  };

  const renderImageField = (language: CmsLanguage, value: string, path: Array<string | number>, label: string, placeholder?: string) => (
    <ImageField
      label={label}
      value={value}
      isDirty={activeSection ? isFieldDirty(language, path, activeSection) : false}
      placeholder={placeholder}
      onChange={(nextValue) => handleSectionFieldChange(language, path, nextValue)}
      onOpenLibrary={() => openImagePicker(language, path, label)}
    />
  );

  const handleToggleGalleryBlockquote = (language: CmsLanguage, cardIndex: number, enabled: boolean) => {
    if (!enabled) {
      handleSectionFieldChange(language, ['cards', cardIndex, 'blockquote'], undefined);
      return;
    }
    const fallbackBlockquote = cmsFallbackByLanguage[language].gallery.cards[cardIndex]?.blockquote ?? { text: '', authorName: '', authorAvatar: '' };
    handleSectionFieldChange(language, ['cards', cardIndex, 'blockquote'], fallbackBlockquote);
  };

  const applyAssetToField = (asset: MediaAsset) => {
    if (!pickerState || !activeSection || !cmsData) return;
    const { language, path } = pickerState;
    handleSectionFieldChange(language, path, asset.url);
    if (!shouldApplyMetadata) { closeImagePicker(); return; }
    const parentPath = path.slice(0, -1);
    const parentObject = getObjectAtPath(cmsData[language][activeSection], parentPath);
    if (!parentObject) { closeImagePicker(); return; }
    if (Object.prototype.hasOwnProperty.call(parentObject, 'alt') && asset.alt) handleSectionFieldChange(language, [...parentPath, 'alt'], asset.alt);
    if (Object.prototype.hasOwnProperty.call(parentObject, 'title') && asset.title) handleSectionFieldChange(language, [...parentPath, 'title'], asset.title);
    closeImagePicker();
  };

  const handleSave = () => {
    if (!cmsData || !activeSection) return;
    const sectionKey = activeSection;
    const aboutMediaPrefix = activeAboutMediaMode === 'carousel' ? 'tickerImages' : 'youtubeVideos';
    const ptPrefix = `pt.${sectionKey}`;
    const enPrefix = `en.${sectionKey}`;

    if (isGlobalSection(sectionKey)) {
      const currentGlobalSection = sectionKey === 'aboutMedia'
        ? normalizeAboutMedia(cmsData.pt.aboutMedia, true)
        : cmsData.pt[sectionKey];
      const originalGlobalSection = originalCmsData?.pt[sectionKey];
      const currentComparable = sectionKey === 'aboutMedia' ? getValueAtPath(currentGlobalSection, [aboutMediaPrefix]) : currentGlobalSection;
      const originalComparable = sectionKey === 'aboutMedia' ? getValueAtPath(originalGlobalSection, [aboutMediaPrefix]) : originalGlobalSection;

      if (deepEqual(currentComparable, originalComparable)) { toast('Nenhuma alteracao pendente nesta secao.'); return; }

      const savePromise = update(ref(database), { [`cms/v2/landing/global/${sectionKey}`]: currentGlobalSection }).then(() => {
        if (sectionKey === 'aboutMedia') {
          const nextAboutMedia = currentGlobalSection as CmsAboutMediaData;
          const applyAM = (prev: CmsLandingByLanguage | null): CmsLandingByLanguage | null => {
            if (!prev) return prev;
            return { ...prev, pt: { ...prev.pt, aboutMedia: nextAboutMedia }, en: { ...prev.en, aboutMedia: nextAboutMedia } };
          };
          setCmsData(applyAM);
          setOriginalCmsData(applyAM);
        } else {
          setOriginalCmsData(cmsData);
        }
        setDirtyFields((prev) => {
          const next: Record<string, true> = {};
          Object.keys(prev).forEach((k) => {
            if (sectionKey === 'aboutMedia') {
              const ptS = `${ptPrefix}.${aboutMediaPrefix}`, enS = `${enPrefix}.${aboutMediaPrefix}`;
              if (k === ptS || k.startsWith(`${ptS}.`) || k === enS || k.startsWith(`${enS}.`)) return;
              next[k] = true; return;
            }
            if (k === ptPrefix || k.startsWith(`${ptPrefix}.`) || k === enPrefix || k.startsWith(`${enPrefix}.`)) return;
            next[k] = true;
          });
          return next;
        });
      });
      toast.promise(savePromise, { loading: 'Salvando secao ativa...', success: <b>Secao salva com sucesso!</b>, error: <b>Erro ao salvar. Tente novamente.</b> });
      return;
    }

    const activeSectionDirtyKeys = Object.keys(dirtyFields).filter(
      (k) => k === ptPrefix || k.startsWith(`${ptPrefix}.`) || k === enPrefix || k.startsWith(`${enPrefix}.`),
    );
    if (activeSectionDirtyKeys.length === 0) { toast('Nenhuma alteracao pendente nesta secao.'); return; }

    const partialPayload: Record<string, unknown> = {};
    activeSectionDirtyKeys.forEach((fieldKey) => {
      const [languagePart, sectionPart, ...rawPath] = fieldKey.split('.');
      const language = languagePart as CmsLanguage;
      const section = sectionPart as keyof CmsLandingData;
      const typedPath = rawPath.map(parsePathSegment);
      const sourceSection = cmsData[language][section];
      const nextValue = typedPath.length > 0 ? getValueAtPath(sourceSection, typedPath) : sourceSection;
      partialPayload[`cms/v2/landing/${language}/${section}/${rawPath.join('/')}`] = nextValue ?? null;
    });
    const savePromise = update(ref(database), partialPayload).then(() => {
      setOriginalCmsData(cmsData);
      setDirtyFields((prev) => {
        const next: Record<string, true> = {};
        Object.keys(prev).forEach((k) => {
          if (k === ptPrefix || k.startsWith(`${ptPrefix}.`) || k === enPrefix || k.startsWith(`${enPrefix}.`)) return;
          next[k] = true;
        });
        return next;
      });
    });
    toast.promise(savePromise, { loading: 'Salvando secao ativa...', success: <b>Secao salva com sucesso!</b>, error: <b>Erro ao salvar. Tente novamente.</b> });
  };

  const requestDiscardActiveSectionChanges = () => {
    if (!cmsData || !originalCmsData || !activeSection) return;
    const sectionKey = activeSection;
    const aboutMediaPrefix = activeAboutMediaMode === 'carousel' ? 'tickerImages' : 'youtubeVideos';
    const ptPrefix = `pt.${sectionKey}`, enPrefix = `en.${sectionKey}`;
    const keys = Object.keys(dirtyFields).filter((k) => {
      if (sectionKey !== 'aboutMedia') return k === ptPrefix || k.startsWith(`${ptPrefix}.`) || k === enPrefix || k.startsWith(`${enPrefix}.`);
      const ptS = `${ptPrefix}.${aboutMediaPrefix}`, enS = `${enPrefix}.${aboutMediaPrefix}`;
      return k === ptS || k.startsWith(`${ptS}.`) || k === enS || k.startsWith(`${enS}.`);
    });
    if (keys.length === 0) { toast('Nenhuma alteracao pendente nesta secao.'); return; }
    setIsDiscardConfirmOpen(true);
  };

  const handleDiscardActiveSectionChanges = () => {
    if (!cmsData || !originalCmsData || !activeSection) return;
    const sectionKey = activeSection;
    const aboutMediaPrefix = activeAboutMediaMode === 'carousel' ? 'tickerImages' : 'youtubeVideos';
    const ptPrefix = `pt.${sectionKey}`, enPrefix = `en.${sectionKey}`;

    setCmsData((prev) => {
      if (!prev) return prev;
      if (sectionKey !== 'aboutMedia') {
        return { ...prev, pt: { ...prev.pt, [sectionKey]: originalCmsData.pt[sectionKey] }, en: { ...prev.en, [sectionKey]: originalCmsData.en[sectionKey] } };
      }
      const nextAM = setValueAtPath(prev.pt.aboutMedia, [aboutMediaPrefix], getValueAtPath(originalCmsData.pt.aboutMedia, [aboutMediaPrefix])) as CmsLandingData['aboutMedia'];
      return { ...prev, pt: { ...prev.pt, aboutMedia: nextAM }, en: { ...prev.en, aboutMedia: nextAM } };
    });

    setDirtyFields((prev) => {
      const next: Record<string, true> = {};
      Object.keys(prev).forEach((k) => {
        if (sectionKey === 'aboutMedia') {
          const ptS = `${ptPrefix}.${aboutMediaPrefix}`, enS = `${enPrefix}.${aboutMediaPrefix}`;
          if (k === ptS || k.startsWith(`${ptS}.`) || k === enS || k.startsWith(`${enS}.`)) return;
          next[k] = true; return;
        }
        if (k === ptPrefix || k.startsWith(`${ptPrefix}.`) || k === enPrefix || k.startsWith(`${enPrefix}.`)) return;
        next[k] = true;
      });
      return next;
    });

    setIsDiscardConfirmOpen(false);
    toast.success('Alteracoes da secao ativa descartadas.');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const renderSectionEditor = () => {
    if (!cmsData) return null;
    const mobilePanelMaskClass = activeSection === 'aboutMedia'
      ? ''
      : mobileLanguage === 'pt'
        ? 'max-lg:[&>div>div:nth-child(2)]:hidden'
        : 'max-lg:[&>div>div:nth-child(1)]:hidden';

    if (activeSection === 'hero') return <div className={mobilePanelMaskClass}><HeroEditor cmsData={cmsData} isFieldDirty={isFieldDirty} onHeroFieldChange={handleHeroFieldChange} renderImageField={renderImageField} /></div>;
    if (activeSection === 'nav') return <div className={mobilePanelMaskClass}><NavEditor cmsData={cmsData} isFieldDirty={isFieldDirty} onSectionFieldChange={handleSectionFieldChange} onAddArrayItem={handleAddArrayItem} onRemoveArrayItem={handleRemoveArrayItem} /></div>;
    if (activeSection === 'gallery') return <div className={mobilePanelMaskClass}><GalleryEditor cmsData={cmsData} isFieldDirty={isFieldDirty} onSectionFieldChange={handleSectionFieldChange} onAddArrayItem={handleAddArrayItem} onRemoveArrayItem={handleRemoveArrayItem} onToggleGalleryBlockquote={handleToggleGalleryBlockquote} renderImageField={renderImageField} /></div>;
    if (activeSection === 'aboutMedia') return <div className={mobilePanelMaskClass}><AboutMediaEditor mode={activeAboutMediaMode} cmsData={cmsData} isFieldDirty={isFieldDirty} onSectionFieldChange={handleSectionFieldChange} onAddArrayItem={handleAddArrayItem} onRemoveArrayItem={handleRemoveArrayItem} renderImageField={renderImageField} /></div>;
    if (activeSection === 'stats') return <div className={mobilePanelMaskClass}><StatsEditor cmsData={cmsData} isFieldDirty={isFieldDirty} onSectionFieldChange={handleSectionFieldChange} onAddArrayItem={handleAddArrayItem} onRemoveArrayItem={handleRemoveArrayItem} /></div>;
    if (activeSection === 'footer') return <div className={mobilePanelMaskClass}><FooterEditor cmsData={cmsData} isFieldDirty={isFieldDirty} onSectionFieldChange={handleSectionFieldChange} onAddArrayItem={handleAddArrayItem} onRemoveArrayItem={handleRemoveArrayItem} /></div>;

    return (
      <div className={mobilePanelMaskClass}>
        <DynamicSectionEditor
          sectionName={String(activeSection)}
          ptValue={activeSection ? cmsData.pt[activeSection] : {}}
          enValue={activeSection ? cmsData.en[activeSection] : {}}
          isFieldDirty={isFieldDirty}
          onSectionFieldChange={handleSectionFieldChange}
          onAddArrayItem={handleAddArrayItem}
          onRemoveArrayItem={handleRemoveArrayItem}
          renderImageField={renderImageField}
        />
      </div>
    );
  };

  if (!cmsData) {
    return <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">Carregando painel...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <main className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          sectionNavItems={sectionNavItems}
          activeSection={activeSection}
          activeAboutMediaMode={activeAboutMediaMode}
          sectionNavDirtyCount={sectionNavDirtyCount}
          onSelectSection={(section, aboutMediaMode) => {
            setActiveSection(section);
            if (aboutMediaMode) setActiveAboutMediaMode(aboutMediaMode);
            setMobileLanguage('pt');
          }}
          activeSectionTitle={activeSectionTitle}
          activeSectionDirtyCount={activeSectionDirtyCount}
          isDrawerOpen={isSectionsDrawerOpen}
          onDrawerOpenChange={setIsSectionsDrawerOpen}
          onSave={handleSave}
          onDiscard={requestDiscardActiveSectionChanges}
          onLogout={handleLogout}
        />

        <div className="flex-1 overflow-y-auto p-4 pb-28 lg:p-8 lg:pb-8">
          {activeSection !== 'aboutMedia' ? (
            <Tabs.Root
              className="mb-4 lg:hidden"
              value={mobileLanguage}
              onValueChange={(value) => setMobileLanguage(value as CmsLanguage)}
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

          {renderSectionEditor()}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button type="button" onClick={requestDiscardActiveSectionChanges} className="h-11 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700">Descartar</button>
          <button type="button" onClick={handleSave} className="h-11 flex-1 rounded-lg bg-green-600 px-3 text-sm font-semibold text-white">Salvar secao</button>
        </div>
      </div>

      <ImageLibraryModal
        isOpen={isMediaModalOpen}
        pickerLabel={pickerState?.label}
        onClose={closeImagePicker}
        shouldApplyMetadata={shouldApplyMetadata}
        onToggleShouldApplyMetadata={setShouldApplyMetadata}
        mediaAssetsCount={filteredMediaAssets.length}
        mediaSearch={mediaSearch}
        onMediaSearchChange={setMediaSearch}
        categories={categories}
        selectedCategory={selectedMediaCategory ?? 'all'}
        onSelectCategory={(categoryId) => setSelectedMediaCategory(categoryId as 'all' | MediaAsset['category'])}
        filteredAssets={filteredMediaAssets}
        onSelectAsset={applyAssetToField}
      />

      <AdminDiscardModal isOpen={isDiscardConfirmOpen} onCancel={() => setIsDiscardConfirmOpen(false)} onConfirm={handleDiscardActiveSectionChanges} />
    </div>
  );
}
