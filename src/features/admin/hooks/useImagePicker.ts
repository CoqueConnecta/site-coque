import { useMemo, useState } from 'react';
import { localImageCategories, localImageLibrary } from '../../../data/localImageLibrary';
import type { CmsLanguage } from '../../../types/cms';
import type { MediaAsset, PickerState } from '../types';

export function useImagePicker() {
  const mediaAssets: MediaAsset[] = localImageLibrary;
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [pickerState, setPickerState] = useState<PickerState>(null);
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<'all' | MediaAsset['category']>('all');
  const [shouldApplyMetadata, setShouldApplyMetadata] = useState(true);

  const filteredMediaAssets = useMemo(() => {
    const query = mediaSearch.trim().toLowerCase();
    return mediaAssets.filter((asset) => {
      const matchesCategory =
        selectedMediaCategory === 'all' || asset.category === selectedMediaCategory;
      if (!matchesCategory) {
        return false;
      }
      if (!query) {
        return true;
      }
      return [asset.name, asset.title ?? '', asset.alt ?? '', asset.category ?? '']
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [mediaAssets, mediaSearch, selectedMediaCategory]);

  const openImagePicker = (
    language: CmsLanguage,
    path: Array<string | number>,
    label: string,
  ) => {
    setPickerState({ language, path, label });
    setShouldApplyMetadata(true);
    setIsMediaModalOpen(true);
  };

  const closeImagePicker = () => {
    setPickerState(null);
    setIsMediaModalOpen(false);
    setMediaSearch('');
    setSelectedMediaCategory('all');
  };

  return {
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
    categories: localImageCategories,
    openImagePicker,
    closeImagePicker,
  };
}
