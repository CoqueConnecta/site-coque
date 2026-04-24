// src/pages/AdminPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '../../firebase';
import { cmsFallbackByLanguage } from '../data/cmsFallback';
import { ImageField } from '../features/admin/components/shared/ImageField';
import { ImageLibraryModal } from '../features/admin/components/layout/ImageLibraryModal';
import { AdminLayout } from '../features/admin/components/layout/AdminLayout';
import { AdminPageHeader } from '../features/admin/components/layout/AdminPageHeader';
import { AdminDiscardModal } from '../features/admin/components/layout/AdminDiscardModal';

import { HomeRoute } from '../features/admin/routes/home/HomeRoute';
import { ProjectsRoute } from '../features/admin/routes/projects/ProjectsRoute';
import { PrivacyRoute } from '../features/admin/routes/privacy/PrivacyRoute';
import { TransparencyRoute } from '../features/admin/routes/transparency/TransparencyRoute';

import { useAdminData } from '../features/admin/hooks/useAdminData';
import { useDirtyFields } from '../features/admin/hooks/useDirtyFields';
import { useImagePicker } from '../features/admin/hooks/useImagePicker';
import { useAdminRoute } from '../features/admin/hooks/useAdminRoute';
import { isGlobalSection } from '../features/admin/utils/cmsNormalize';
import {
  buildEmptyFromTemplate,
  getValueAtPath,
  isRecord,
  setValueAtPath,
} from '../features/admin/utils/editorPath';
import type { CmsLandingData, CmsLanguage } from '../types/cms';
import type { MediaAsset } from '../features/admin/types';

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    cmsData,
    setCmsData,
    originalCmsData,
    setOriginalCmsData,
    mobileLanguage,
    setMobileLanguage,
  } = useAdminData();

  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);

  const {
    dirtyFields,
    setDirtyFields,
    markDirtyField,
    isFieldDirty,
    sectionNavDirtyCount,
  } = useDirtyFields(originalCmsData, '', 'carousel');

  const {
    activeRouteId,
    setActiveRouteId,
    activeRoute,
    routeDirtyCount,
    handleSaveRoute,
    handleDiscardRoute,
  } = useAdminRoute(
    cmsData,
    originalCmsData,
    setCmsData,
    setOriginalCmsData,
    dirtyFields,
    setDirtyFields,
  );

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

  const getObjectAtPath = (source: unknown, path: Array<string | number>) => {
    const value = getValueAtPath(source, path);
    return isRecord(value) ? value : null;
  };

  const handleSectionFieldChange = (
    sectionKey: keyof CmsLandingData,
    language: CmsLanguage,
    path: Array<string | number>,
    value: unknown,
  ) => {
    setCmsData((prev) => {
      if (!prev) return prev;
      if (isGlobalSection(sectionKey)) {
        const currentGlobalSection = prev.pt[sectionKey];
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, value) as CmsLandingData[keyof CmsLandingData];
        const nextValue = getValueAtPath(updatedGlobalSection, path);
        markDirtyField('pt', sectionKey, path, nextValue);
        markDirtyField('en', sectionKey, path, nextValue);
        return {
          ...prev,
          pt: { ...prev.pt, [sectionKey]: updatedGlobalSection },
          en: { ...prev.en, [sectionKey]: updatedGlobalSection },
        };
      }
      const currentSectionData = prev[language][sectionKey];
      const updatedSectionData = setValueAtPath(currentSectionData, path, value) as CmsLandingData[keyof CmsLandingData];
      const nextValue = getValueAtPath(updatedSectionData, path);
      markDirtyField(language, sectionKey, path, nextValue);
      return { ...prev, [language]: { ...prev[language], [sectionKey]: updatedSectionData } };
    });
  };

  const handleAddArrayItem = (
    sectionKey: keyof CmsLandingData,
    language: CmsLanguage,
    path: Array<string | number>,
  ) => {
    setCmsData((prev) => {
      if (!prev) return prev;
      if (isGlobalSection(sectionKey)) {
        const currentGlobalSection = prev.pt[sectionKey];
        const currentValue = getValueAtPath(currentGlobalSection, path);
        if (!Array.isArray(currentValue)) return prev;
        const fallbackValue = getValueAtPath(cmsFallbackByLanguage.pt[sectionKey] as unknown, path);
        const templateSource =
          Array.isArray(fallbackValue) && fallbackValue.length > 0
            ? fallbackValue[0]
            : currentValue.length > 0
              ? currentValue[0]
              : '';
        const fallbackItem = buildEmptyFromTemplate(templateSource);
        const updatedArray = [...currentValue, fallbackItem];
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
        markDirtyField('pt', sectionKey, path, updatedArray);
        markDirtyField('en', sectionKey, path, updatedArray);
        return {
          ...prev,
          pt: { ...prev.pt, [sectionKey]: updatedGlobalSection },
          en: { ...prev.en, [sectionKey]: updatedGlobalSection },
        };
      }
      const currentSectionData = prev[language][sectionKey];
      const currentValue = getValueAtPath(currentSectionData, path);
      if (!Array.isArray(currentValue)) return prev;
      const fallbackSectionData = cmsFallbackByLanguage[language][sectionKey] as unknown;
      const fallbackValue = getValueAtPath(fallbackSectionData, path);
      const templateSource =
        Array.isArray(fallbackValue) && fallbackValue.length > 0
          ? fallbackValue[0]
          : currentValue.length > 0
            ? currentValue[0]
            : '';
      const fallbackItem = buildEmptyFromTemplate(templateSource);
      const updatedArray = [...currentValue, fallbackItem];
      const updatedSectionData = setValueAtPath(currentSectionData, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
      markDirtyField(language, sectionKey, path, updatedArray);
      return { ...prev, [language]: { ...prev[language], [sectionKey]: updatedSectionData } };
    });
  };

  const handleRemoveArrayItem = (
    sectionKey: keyof CmsLandingData,
    language: CmsLanguage,
    path: Array<string | number>,
    index: number,
  ) => {
    setCmsData((prev) => {
      if (!prev) return prev;
      if (isGlobalSection(sectionKey)) {
        const currentGlobalSection = prev.pt[sectionKey];
        const currentValue = getValueAtPath(currentGlobalSection, path);
        if (!Array.isArray(currentValue)) return prev;
        const updatedArray = currentValue.filter((_, i) => i !== index);
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
        markDirtyField('pt', sectionKey, path, updatedArray);
        markDirtyField('en', sectionKey, path, updatedArray);
        return {
          ...prev,
          pt: { ...prev.pt, [sectionKey]: updatedGlobalSection },
          en: { ...prev.en, [sectionKey]: updatedGlobalSection },
        };
      }
      const currentSectionData = prev[language][sectionKey];
      const currentValue = getValueAtPath(currentSectionData, path);
      if (!Array.isArray(currentValue)) return prev;
      const updatedArray = currentValue.filter((_, i) => i !== index);
      const updatedSectionData = setValueAtPath(currentSectionData, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
      markDirtyField(language, sectionKey, path, updatedArray);
      return { ...prev, [language]: { ...prev[language], [sectionKey]: updatedSectionData } };
    });
  };

  const handleHeroFieldChange = (language: CmsLanguage, field: keyof CmsLandingData['hero'], value: string) => {
    markDirtyField(language, 'hero', [field], value);
    setCmsData((prev) => {
      if (!prev) return prev;
      return { ...prev, [language]: { ...prev[language], hero: { ...prev[language].hero, [field]: value } } };
    });
  };

  const handleToggleGalleryBlockquote = (sectionKey: keyof CmsLandingData, language: CmsLanguage, cardIndex: number, enabled: boolean) => {
    if (!enabled) {
      handleSectionFieldChange(sectionKey, language, ['cards', cardIndex, 'blockquote'], undefined);
      return;
    }
    const fallbackBlockquote = cmsFallbackByLanguage[language].gallery.cards[cardIndex]?.blockquote ?? { text: '', authorName: '', authorAvatar: '' };
    handleSectionFieldChange(sectionKey, language, ['cards', cardIndex, 'blockquote'], fallbackBlockquote);
  };

  const renderImageField = (
    sectionKey: keyof CmsLandingData,
    language: CmsLanguage,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string,
  ) => (
    <ImageField
      label={label}
      value={value}
      isDirty={isFieldDirty(language, path, sectionKey)}
      placeholder={placeholder}
      onChange={(nextValue) => handleSectionFieldChange(sectionKey, language, path, nextValue)}
      onOpenLibrary={() => openImagePicker(sectionKey, language, path, label)}
    />
  );

  const applyAssetToField = (asset: MediaAsset) => {
    if (!pickerState || !cmsData) return;
    const { sectionKey, language, path } = pickerState;
    handleSectionFieldChange(sectionKey, language, path, asset.url);
    if (!shouldApplyMetadata) { closeImagePicker(); return; }
    const parentPath = path.slice(0, -1);
    const parentObject = getObjectAtPath(cmsData[language][sectionKey], parentPath);
    if (!parentObject) { closeImagePicker(); return; }
    if (Object.prototype.hasOwnProperty.call(parentObject, 'alt') && asset.alt) handleSectionFieldChange(sectionKey, language, [...parentPath, 'alt'], asset.alt);
    if (Object.prototype.hasOwnProperty.call(parentObject, 'title') && asset.title) handleSectionFieldChange(sectionKey, language, [...parentPath, 'title'], asset.title);
    closeImagePicker();
  };

  const handleRequestDiscard = () => {
    const count = routeDirtyCount(activeRouteId);
    if (count === 0) { toast('Nenhuma alteração pendente nesta página.'); return; }
    setIsDiscardConfirmOpen(true);
  };

  const handleConfirmDiscard = () => {
    handleDiscardRoute();
    setIsDiscardConfirmOpen(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const getSectionDirtyCount = (sectionKey: keyof CmsLandingData, aboutMediaMode?: 'carousel' | 'youtubeVideos') =>
    sectionNavDirtyCount({ section: sectionKey, aboutMediaMode });

  if (!cmsData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-500 text-sm">
        Carregando painel...
      </div>
    );
  }

  const totalRouteDirty = routeDirtyCount(activeRouteId);

  const routeProps = {
    cmsData,
    mobileLanguage,
    isFieldDirty,
    onSectionFieldChange: handleSectionFieldChange,
    onAddArrayItem: handleAddArrayItem,
    onRemoveArrayItem: handleRemoveArrayItem,
    onHeroFieldChange: handleHeroFieldChange,
    onToggleGalleryBlockquote: handleToggleGalleryBlockquote,
    renderImageField: renderImageField,
    getSectionDirtyCount,
  };

  return (
    <AdminLayout
      activeRouteId={activeRouteId}
      onSelectRoute={setActiveRouteId}
      routeDirtyCount={routeDirtyCount}
      onLogout={handleLogout}
    >
      <div className="p-4 lg:p-8 space-y-6">
        {/* Mobile Language Toggle */}
        <div className="lg:hidden flex rounded-lg bg-gray-100 p-1 gap-1">
          {(['pt', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setMobileLanguage(lang)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                mobileLanguage === lang
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              {lang === 'pt' ? 'Português' : 'English'}
            </button>
          ))}
        </div>

        <AdminPageHeader
          title={activeRoute.label}
          description={activeRoute.description}
          dirtyCount={totalRouteDirty}
          onSave={handleSaveRoute}
          onDiscard={handleRequestDiscard}
        />

        <div className="space-y-4">
          {activeRouteId === 'home' && <HomeRoute {...routeProps} />}
          {activeRouteId === 'projects' && <ProjectsRoute {...routeProps} />}
          {activeRouteId === 'privacy' && <PrivacyRoute {...routeProps} />}
          {activeRouteId === 'transparency' && <TransparencyRoute {...routeProps} />}
        </div>
      </div>

      <AdminDiscardModal
        isOpen={isDiscardConfirmOpen}
        onCancel={() => setIsDiscardConfirmOpen(false)}
        onConfirm={handleConfirmDiscard}
      />

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
        onSelectCategory={(id) => setSelectedMediaCategory(id as 'all')}
        filteredAssets={filteredMediaAssets}
        onSelectAsset={applyAssetToField}
      />
    </AdminLayout>
  );
}
