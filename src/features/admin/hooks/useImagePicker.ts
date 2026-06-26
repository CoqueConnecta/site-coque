import { useEffect, useMemo, useState } from 'react';
import { uploadImageToStorage, subscribeToMediaLibrary, deleteImageFromStorage } from '../../../services/storageService';
import { localImageCategories, localImageLibrary } from '../../../data/localImageLibrary';
import type { CmsLanguage } from '../../../types/cms';
import type { MediaAsset, PickerState } from '../types';

export function useImagePicker() {
  const [rtdbAssets, setRtdbAssets] = useState<MediaAsset[]>([]);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [pickerState, setPickerState] = useState<PickerState>(null);
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<string>('all');
  const [shouldApplyMetadata, setShouldApplyMetadata] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    return subscribeToMediaLibrary(setRtdbAssets);
  }, []);

  const mediaAssets: MediaAsset[] = useMemo(
    () => [...localImageLibrary, ...rtdbAssets],
    [rtdbAssets],
  );

  const filteredMediaAssets = useMemo(() => {
    const query = mediaSearch.trim().toLowerCase();
    return mediaAssets.filter((asset) => {
      const matchesCategory =
        selectedMediaCategory === 'all' || asset.category === selectedMediaCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return [asset.name, asset.title ?? '', asset.alt ?? '', asset.category ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [mediaAssets, mediaSearch, selectedMediaCategory]);

  const openImagePicker = (
    sectionKey: string,
    language: CmsLanguage,
    path: Array<string | number>,
    label: string,
  ) => {
    setPickerState({ sectionKey, language, path, label });
    setShouldApplyMetadata(true);
    setIsMediaModalOpen(true);
  };

  const closeImagePicker = () => {
    setPickerState(null);
    setIsMediaModalOpen(false);
    setMediaSearch('');
    setSelectedMediaCategory('all');
  };

  const handleUpload = async (file: File, category: string) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      await uploadImageToStorage(file, category, setUploadProgress);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    try {
      await deleteImageFromStorage(id, url);
    } catch (err) {
      console.error('[useImagePicker] Failed to delete image:', err);
      throw err;
    }
  };

  return {
    mediaAssets,
    rtdbAssetsCount: rtdbAssets.length,
    isMediaModalOpen,
    pickerState,
    mediaSearch,
    setMediaSearch,
    selectedMediaCategory,
    setSelectedMediaCategory,
    shouldApplyMetadata,
    setShouldApplyMetadata,
    filteredMediaAssets,
    categories: localImageCategories,
    isUploading,
    uploadProgress,
    handleUpload,
    handleDelete,
    openImagePicker,
    closeImagePicker,
  };
}
