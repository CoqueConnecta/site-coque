// src/pages/AdminPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signOutUser } from '../services/authService';
import { ImageField } from '../features/admin/components/shared/ImageField';
import { ImageLibraryModal } from '../features/admin/components/layout/ImageLibraryModal';
import { AdminLayout } from '../features/admin/components/layout/AdminLayout';
import { AdminPageHeader } from '../features/admin/components/layout/AdminPageHeader';
import { AdminDiscardModal } from '../features/admin/components/layout/AdminDiscardModal';

import { HomeRoute } from '../features/admin/routes/home/HomeRoute';
import { ProjectsRoute } from '../features/admin/routes/projects/ProjectsRoute';
import { PrivacyRoute } from '../features/admin/routes/privacy/PrivacyRoute';
import { TransparencyRoute } from '../features/admin/routes/transparency/TransparencyRoute';
import { SettingsRoute } from '../features/admin/routes/settings/SettingsRoute';
import { MediaLibraryRoute } from '../features/admin/routes/media/MediaLibraryRoute';

import { useAdminData } from '../features/admin/hooks/useAdminData';
import { useDirtyFields } from '../features/admin/hooks/useDirtyFields';
import { useImagePicker } from '../features/admin/hooks/useImagePicker';
import { useAdminRoute } from '../features/admin/hooks/useAdminRoute';
import { useArrayFieldActions } from '../features/admin/hooks/useArrayFieldActions';
import { getValueAtPath, isRecord, setValueAtPath } from '../features/admin/utils/editorPath';
import type { MediaAsset } from '../features/admin/types';
import type { CmsAdminState } from '../features/admin/types';

export default function AdminPage() {
  const navigate = useNavigate();
  const {
    cmsData,
    setCmsData,
    originalCmsData,
    setOriginalCmsData,
  } = useAdminData();

  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);

  const {
    dirtyFields,
    setDirtyFields,
    markDirtyField,
    isFieldDirty,
    sectionDirtyCount,
  } = useDirtyFields(originalCmsData, '');

  const {
    activeRouteId,
    setActiveRouteId,
    activeRoute,
    activeSectionKey,
    setActiveSectionKey,
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
    mediaAssets,
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
    isUploading,
    uploadProgress,
    handleUpload,
    handleDelete,
    handleCreateCategory,
    handleUpdateMetadata,
    openImagePicker,
    closeImagePicker,
  } = useImagePicker();

  /**
   * Navigate into cmsData using a dotted sectionKey, then set value at path.
   * e.g. sectionKey = "pages.home.hero", path = ["headline", "pt"]
   */
  const handleFieldChange = (
    sectionKey: string,
    path: Array<string | number>,
    value: unknown,
  ) => {
    markDirtyField(sectionKey, path, value);
    setCmsData((prev) => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev)) as CmsAdminState;
      const segments = sectionKey.split('.');
      // Navigate to the section node
      let node: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (const seg of segments.slice(0, -1)) {
        node = node[seg] as Record<string, unknown>;
      }
      const lastSeg = segments[segments.length - 1];
      node[lastSeg] = setValueAtPath(node[lastSeg], path, value);
      return next;
    });
  };

  const {
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleMoveArrayItem,
    handleDuplicateArrayItem,
  } = useArrayFieldActions(setCmsData, markDirtyField);

  const getObjectAtPath = (source: unknown, path: Array<string | number>) => {
    const value = getValueAtPath(source, path);
    return isRecord(value) ? value : null;
  };

  const renderImageField = (
    sectionKey: string,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string,
    readOnly?: boolean,
  ) => (
    <ImageField
      label={label}
      value={value}
      isDirty={isFieldDirty(path, sectionKey)}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={(nextValue) => handleFieldChange(sectionKey, path, nextValue)}
      onOpenLibrary={() => openImagePicker(sectionKey, 'pt', path, label)}
    />
  );

  const applyAssetToField = (asset: MediaAsset) => {
    if (!pickerState || !cmsData) return;
    const { sectionKey, path } = pickerState;
    // Navigate to section
    const segments = sectionKey.split('.');
    let node: unknown = cmsData;
    for (const seg of segments) node = (node as Record<string, unknown>)?.[seg];
    handleFieldChange(sectionKey, path, asset.url);
    if (!shouldApplyMetadata) { closeImagePicker(); return; }
    const parentPath = path.slice(0, -1);
    const parentObject = getObjectAtPath(node, parentPath);
    if (!parentObject) { closeImagePicker(); return; }
    if (Object.prototype.hasOwnProperty.call(parentObject, 'alt') && asset.alt)
      handleFieldChange(sectionKey, [...parentPath, 'alt'], asset.alt);
    if (Object.prototype.hasOwnProperty.call(parentObject, 'title') && asset.title)
      handleFieldChange(sectionKey, [...parentPath, 'title'], asset.title);
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
    await signOutUser();
    navigate('/login');
  };

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
    activeSectionKey,
    onActiveSectionChange: setActiveSectionKey,
    isFieldDirty,
    onFieldChange: handleFieldChange,
    onAddArrayItem: handleAddArrayItem,
    onRemoveArrayItem: handleRemoveArrayItem,
    onMoveArrayItem: handleMoveArrayItem,
    onDuplicateArrayItem: handleDuplicateArrayItem,
    renderImageField,
    sectionDirtyCount,
  };

  return (
    <AdminLayout
      activeRouteId={activeRouteId}
      onSelectRoute={setActiveRouteId}
      routeDirtyCount={routeDirtyCount}
      onLogout={handleLogout}
    >
      <div className="p-4 lg:p-8 space-y-6">
        <AdminPageHeader
          title={activeRoute.label}
          description={activeRoute.description}
          dirtyCount={totalRouteDirty}
          onSave={handleSaveRoute}
          onDiscard={handleRequestDiscard}
          showActions={activeRoute.sections.length > 0}
        />

        <div className="space-y-4">
          {activeRouteId === 'home'         && <HomeRoute         {...routeProps} />}
          {activeRouteId === 'projects'     && <ProjectsRoute     {...routeProps} />}
          {activeRouteId === 'privacy'      && <PrivacyRoute      {...routeProps} />}
          {activeRouteId === 'transparency' && <TransparencyRoute {...routeProps} />}
          {activeRouteId === 'settings'     && <SettingsRoute     {...routeProps} />}
          {activeRouteId === 'media'        && (
            <MediaLibraryRoute
              mediaAssets={mediaAssets}
              mediaSearch={mediaSearch}
              onMediaSearchChange={setMediaSearch}
              categories={categories}
              selectedCategory={selectedMediaCategory ?? 'all'}
              onSelectCategory={setSelectedMediaCategory}
              filteredAssets={filteredMediaAssets}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              onUpload={handleUpload}
              onDelete={handleDelete}
              onCategoryCreate={handleCreateCategory}
              onUpdateMetadata={handleUpdateMetadata}
            />
          )}
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
        onSelectCategory={setSelectedMediaCategory}
        filteredAssets={filteredMediaAssets}
        onSelectAsset={applyAssetToField}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        onUpload={handleUpload}
        onCategoryCreate={handleCreateCategory}
        onUpdateMetadata={handleUpdateMetadata}
      />
    </AdminLayout>
  );
}
