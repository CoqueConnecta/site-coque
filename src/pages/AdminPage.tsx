// src/pages/AdminPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../../firebase';
import toast from 'react-hot-toast';
import { cmsFallbackByLanguage } from '../data/cmsFallback';
import { localImageCategories, localImageLibrary } from '../data/localImageLibrary';
import { ImageField } from '../features/admin/components/ImageField';
import { ImageLibraryModal } from '../features/admin/components/ImageLibraryModal';
import { GalleryEditor } from '../features/admin/components/sections/GalleryEditor';
import { DynamicSectionEditor } from '../features/admin/components/sections/DynamicSectionEditor';
import { HeroEditor } from '../features/admin/components/sections/HeroEditor';
import { NavEditor } from '../features/admin/components/sections/NavEditor';
import type { CmsLandingByLanguage, MediaAsset, PickerState } from '../features/admin/types';
import {
  buildEmptyFromTemplate,
  getValueAtPath,
  isRecord,
  mergeWithFallback,
  setValueAtPath,
} from '../features/admin/utils/editorPath';
import type { CmsLandingData, CmsLanguage } from '../types/cms';

export default function AdminPage() {
  const navigate = useNavigate();
  const [cmsData, setCmsData] = useState<CmsLandingByLanguage | null>(null);
  const [activeSection, setActiveSection] = useState<keyof CmsLandingData | ''>('');
  const [mediaAssets] = useState<MediaAsset[]>(localImageLibrary);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [pickerState, setPickerState] = useState<PickerState>(null);
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<'all' | MediaAsset['category']>('all');
  const [shouldApplyMetadata, setShouldApplyMetadata] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cmsRef = ref(database, 'cms/v2/landing');
      try {
        const snapshot = await get(cmsRef);
        const incoming = snapshot.exists() ? snapshot.val() : {};

        const normalized: CmsLandingByLanguage = {
          pt: mergeWithFallback(cmsFallbackByLanguage.pt, incoming.pt),
          en: mergeWithFallback(cmsFallbackByLanguage.en, incoming.en),
        };

        setCmsData(normalized);
        const firstSection = Object.keys(normalized.pt)[0] as keyof CmsLandingData | undefined;
        if (firstSection) {
          setActiveSection(firstSection);
        }
      } catch (error) {
        toast.error("Falha ao carregar os dados do painel.");
        console.error("Erro ao buscar dados do Firebase:", error);
      }
    };
    fetchData();
  }, []);

  const sections = useMemo(() => {
    if (!cmsData) {
      return [] as Array<keyof CmsLandingData>;
    }
    return Object.keys(cmsData.pt) as Array<keyof CmsLandingData>;
  }, [cmsData]);

  const filteredMediaAssets = useMemo(() => {
    const query = mediaSearch.trim().toLowerCase();
    return mediaAssets.filter((asset) => {
      const matchesCategory = selectedMediaCategory === 'all' || asset.category === selectedMediaCategory;
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

  const getObjectAtPath = (source: unknown, path: Array<string | number>) => {
    const value = getValueAtPath(source, path);
    return isRecord(value) ? value : null;
  };

  const openImagePicker = (
    language: CmsLanguage,
    path: Array<string | number>,
    label: string
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

  const applyAssetToField = (asset: MediaAsset) => {
    if (!pickerState || !activeSection || !cmsData) {
      return;
    }

    const { language, path } = pickerState;
    handleSectionFieldChange(language, path, asset.url);

    if (!shouldApplyMetadata) {
      closeImagePicker();
      return;
    }

    const parentPath = path.slice(0, -1);
    const targetSection = cmsData[language][activeSection];
    const parentObject = getObjectAtPath(targetSection, parentPath);
    if (!parentObject) {
      closeImagePicker();
      return;
    }

    if (Object.prototype.hasOwnProperty.call(parentObject, 'alt') && asset.alt) {
      handleSectionFieldChange(language, [...parentPath, 'alt'], asset.alt);
    }

    if (Object.prototype.hasOwnProperty.call(parentObject, 'title') && asset.title) {
      handleSectionFieldChange(language, [...parentPath, 'title'], asset.title);
    }

    closeImagePicker();
  };

  const handleSectionFieldChange = (
    language: CmsLanguage,
    path: Array<string | number>,
    value: unknown
  ) => {
    if (!activeSection) {
      return;
    }

    setCmsData((prev) => {
      if (!prev) {
        return prev;
      }

      const currentSectionData = prev[language][activeSection];
      const updatedSectionData = setValueAtPath(currentSectionData, path, value) as CmsLandingData[keyof CmsLandingData];

      return {
        ...prev,
        [language]: {
          ...prev[language],
          [activeSection]: updatedSectionData,
        },
      };
    });
  };

  const handleAddArrayItem = (language: CmsLanguage, path: Array<string | number>) => {
    if (!activeSection) {
      return;
    }

    setCmsData((prev) => {
      if (!prev) {
        return prev;
      }

      const currentSectionData = prev[language][activeSection];
      const currentValue = getValueAtPath(currentSectionData, path);
      if (!Array.isArray(currentValue)) {
        return prev;
      }

      const fallbackSectionData = cmsFallbackByLanguage[language][activeSection] as unknown;
      const fallbackValue = getValueAtPath(fallbackSectionData, path);
      const fallbackItem = Array.isArray(fallbackValue) && fallbackValue.length > 0
        ? buildEmptyFromTemplate(fallbackValue[0])
        : '';

      const updatedArray = [...currentValue, fallbackItem];
      const updatedSectionData = setValueAtPath(currentSectionData, path, updatedArray) as CmsLandingData[keyof CmsLandingData];

      return {
        ...prev,
        [language]: {
          ...prev[language],
          [activeSection]: updatedSectionData,
        },
      };
    });
  };

  const handleRemoveArrayItem = (
    language: CmsLanguage,
    path: Array<string | number>,
    index: number
  ) => {
    if (!activeSection) {
      return;
    }

    setCmsData((prev) => {
      if (!prev) {
        return prev;
      }

      const currentSectionData = prev[language][activeSection];
      const currentValue = getValueAtPath(currentSectionData, path);
      if (!Array.isArray(currentValue)) {
        return prev;
      }

      const updatedArray = currentValue.filter((_, itemIndex) => itemIndex !== index);
      const updatedSectionData = setValueAtPath(currentSectionData, path, updatedArray) as CmsLandingData[keyof CmsLandingData];

      return {
        ...prev,
        [language]: {
          ...prev[language],
          [activeSection]: updatedSectionData,
        },
      };
    });
  };

  const handleHeroFieldChange = (
    language: CmsLanguage,
    field: keyof CmsLandingData['hero'],
    value: string
  ) => {
    setCmsData((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        [language]: {
          ...prev[language],
          hero: {
            ...prev[language].hero,
            [field]: value,
          },
        },
      };
    });
  };

  const renderImageField = (
    language: CmsLanguage,
    value: string,
    path: Array<string | number>,
    label: string,
    placeholder?: string
  ) => {
    return (
      <ImageField
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={(nextValue) => handleSectionFieldChange(language, path, nextValue)}
        onOpenLibrary={() => openImagePicker(language, path, label)}
      />
    );
  };

  const handleToggleGalleryBlockquote = (
    language: CmsLanguage,
    cardIndex: number,
    enabled: boolean
  ) => {
    if (!enabled) {
      handleSectionFieldChange(language, ['cards', cardIndex, 'blockquote'], undefined);
      return;
    }

    const fallbackBlockquote =
      cmsFallbackByLanguage[language].gallery.cards[cardIndex]?.blockquote ?? {
        text: '',
        authorName: '',
        authorAvatar: '',
      };

    handleSectionFieldChange(language, ['cards', cardIndex, 'blockquote'], fallbackBlockquote);
  };

  const handleSave = () => {
    if (!cmsData) return;
    const savePromise = set(ref(database, 'cms/v2/landing'), cmsData);
    toast.promise(savePromise, {
      loading: 'Salvando...',
      success: <b>Conteúdo CMS v2 salvo com sucesso!</b>,
      error: <b>Erro ao salvar. Tente novamente.</b>,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!cmsData) {
    return <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">Carregando painel...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Seções</h1>
        </div>
        <nav className="p-3">
          <ul>
            {sections.map((section) => (
              <li key={section}>
                <button
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left p-3 my-1 rounded-lg text-sm font-medium transition-all duration-150 ${
                    activeSection === section
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {String(section).charAt(0).toUpperCase() + String(section).slice(1).replace(/_/g, ' ')}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Editando: <span className="text-blue-600">{String(activeSection).charAt(0).toUpperCase() + String(activeSection).slice(1).replace(/_/g, ' ')}</span>
          </h2>
          <div className="flex items-center">
            <button onClick={handleSave} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 shadow-sm transition-all duration-150 transform hover:scale-105">
              Salvar CMS v2
            </button>
            <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 shadow-sm transition-all duration-150 transform hover:scale-105">
              Sair
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {activeSection === 'hero' ? (
            <HeroEditor
              cmsData={cmsData}
              onHeroFieldChange={handleHeroFieldChange}
              renderImageField={renderImageField}
            />
          ) : activeSection === 'nav' ? (
            <NavEditor
              cmsData={cmsData}
              onSectionFieldChange={handleSectionFieldChange}
              onAddArrayItem={handleAddArrayItem}
              onRemoveArrayItem={handleRemoveArrayItem}
            />
          ) : activeSection === 'gallery' ? (
            <GalleryEditor
              cmsData={cmsData}
              onSectionFieldChange={handleSectionFieldChange}
              onAddArrayItem={handleAddArrayItem}
              onRemoveArrayItem={handleRemoveArrayItem}
              onToggleGalleryBlockquote={handleToggleGalleryBlockquote}
              renderImageField={renderImageField}
            />
          ) : (
            <DynamicSectionEditor
              sectionName={String(activeSection)}
              ptValue={activeSection ? cmsData.pt[activeSection] : {}}
              enValue={activeSection ? cmsData.en[activeSection] : {}}
              onSectionFieldChange={handleSectionFieldChange}
              onAddArrayItem={handleAddArrayItem}
              onRemoveArrayItem={handleRemoveArrayItem}
              renderImageField={renderImageField}
            />
          )}
        </div>
      </main>

      <ImageLibraryModal
        isOpen={isMediaModalOpen}
        pickerLabel={pickerState?.label}
        onClose={closeImagePicker}
        shouldApplyMetadata={shouldApplyMetadata}
        onToggleShouldApplyMetadata={setShouldApplyMetadata}
        mediaAssetsCount={mediaAssets.length}
        mediaSearch={mediaSearch}
        onMediaSearchChange={setMediaSearch}
        categories={localImageCategories}
        selectedCategory={selectedMediaCategory ?? 'all'}
        onSelectCategory={(categoryId) => setSelectedMediaCategory(categoryId as 'all' | MediaAsset['category'])}
        filteredAssets={filteredMediaAssets}
        onSelectAsset={applyAssetToField}
      />
    </div>
  );
}
