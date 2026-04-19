// src/pages/AdminPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { ref, get, update } from 'firebase/database';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { Menu, X } from 'lucide-react';
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
import { StatsEditor } from '../features/admin/components/sections/StatsEditor';
import { FooterEditor } from '../features/admin/components/sections/FooterEditor';
import type { CmsLandingByLanguage, MediaAsset, PickerState } from '../features/admin/types';
import {
  buildEmptyFromTemplate,
  getValueAtPath,
  isRecord,
  mergeWithFallback,
  setValueAtPath,
} from '../features/admin/utils/editorPath';
import type { CmsLandingData, CmsLanguage } from '../types/cms';

function deepEqual(left: unknown, right: unknown) {
  if (Object.is(left, right)) {
    return true;
  }

  return JSON.stringify(left) === JSON.stringify(right);
}

function parsePathSegment(segment: string): string | number {
  return /^\d+$/.test(segment) ? Number(segment) : segment;
}

function isGlobalSection(section: keyof CmsLandingData) {
  return ['aboutMedia', 'nav', 'stats', 'footer'].includes(section);
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [cmsData, setCmsData] = useState<CmsLandingByLanguage | null>(null);
  const [originalCmsData, setOriginalCmsData] = useState<CmsLandingByLanguage | null>(null);
  const [activeSection, setActiveSection] = useState<keyof CmsLandingData | ''>('');
  const [dirtyFields, setDirtyFields] = useState<Record<string, true>>({});
  const [mediaAssets] = useState<MediaAsset[]>(localImageLibrary);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [pickerState, setPickerState] = useState<PickerState>(null);
  const [mediaSearch, setMediaSearch] = useState('');
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<'all' | MediaAsset['category']>('all');
  const [shouldApplyMetadata, setShouldApplyMetadata] = useState(true);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const [isSectionsDrawerOpen, setIsSectionsDrawerOpen] = useState(false);
  const [mobileLanguage, setMobileLanguage] = useState<CmsLanguage>('pt');

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

        // Merge global fields (now: aboutMedia, nav, stats, footer)
        const mergedGlobalAboutMedia = mergeWithFallback(
          cmsFallbackByLanguage.pt.aboutMedia,
          incoming.global?.aboutMedia
        );
        normalized.pt.aboutMedia = mergedGlobalAboutMedia;
        normalized.en.aboutMedia = mergedGlobalAboutMedia;

        const mergedGlobalNav = mergeWithFallback(
          cmsFallbackByLanguage.pt.nav,
          incoming.global?.nav
        );
        normalized.pt.nav = mergedGlobalNav;
        normalized.en.nav = mergedGlobalNav;

        const mergedGlobalStats = mergeWithFallback(
          cmsFallbackByLanguage.pt.stats,
          incoming.global?.stats
        );
        normalized.pt.stats = mergedGlobalStats;
        normalized.en.stats = mergedGlobalStats;

        const mergedGlobalFooter = mergeWithFallback(
          cmsFallbackByLanguage.pt.footer,
          incoming.global?.footer
        );
        normalized.pt.footer = mergedGlobalFooter;
        normalized.en.footer = mergedGlobalFooter;

        setCmsData(normalized);
        setOriginalCmsData(normalized);
        setDirtyFields({});
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

  useEffect(() => {
    if (!isDiscardConfirmOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDiscardConfirmOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isDiscardConfirmOpen]);

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

  const buildDirtyFieldKey = (
    language: CmsLanguage,
    section: keyof CmsLandingData,
    path: Array<string | number>
  ) => [language, section, ...path.map(String)].join('.');

  const markDirtyField = (
    language: CmsLanguage,
    section: keyof CmsLandingData,
    path: Array<string | number>,
    nextValue: unknown
  ) => {
    if (!originalCmsData) {
      return;
    }

    const originalSection = originalCmsData[language][section];
    const originalValue = path.length > 0 ? getValueAtPath(originalSection, path) : originalSection;
    const fieldKey = buildDirtyFieldKey(language, section, path);
    const nextIsDirty = !deepEqual(originalValue, nextValue);

    setDirtyFields((prev) => {
      if (nextIsDirty) {
        if (prev[fieldKey]) {
          return prev;
        }
        return {
          ...prev,
          [fieldKey]: true,
        };
      }

      if (!prev[fieldKey]) {
        return prev;
      }

      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const isFieldDirty = (
    language: CmsLanguage,
    path: Array<string | number>,
    sectionOverride?: keyof CmsLandingData
  ) => {
    const section = sectionOverride ?? activeSection;
    if (!section) {
      return false;
    }

    return Boolean(dirtyFields[buildDirtyFieldKey(language, section, path)]);
  };

  const activeSectionDirtyCount = useMemo(() => {
    if (!activeSection) {
      return 0;
    }

    const ptPrefix = `pt.${activeSection}`;
    const enPrefix = `en.${activeSection}`;
    return Object.keys(dirtyFields).filter((fieldKey) => (
      fieldKey === ptPrefix
      || fieldKey.startsWith(`${ptPrefix}.`)
      || fieldKey === enPrefix
      || fieldKey.startsWith(`${enPrefix}.`)
    )).length;
  }, [activeSection, dirtyFields]);

  const sectionDirtyCountMap = useMemo(() => {
    const counts: Partial<Record<keyof CmsLandingData, number>> = {};
    Object.keys(dirtyFields).forEach((fieldKey) => {
      const [, sectionPart] = fieldKey.split('.');
      const section = sectionPart as keyof CmsLandingData;
      counts[section] = (counts[section] ?? 0) + 1;
    });
    return counts;
  }, [dirtyFields]);

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

      if (['aboutMedia', 'nav', 'stats', 'footer'].includes(activeSection)) {
        const currentGlobalSection = prev.pt[activeSection];
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, value) as CmsLandingData[keyof CmsLandingData];
        const nextValue = getValueAtPath(updatedGlobalSection, path);
        markDirtyField('pt', activeSection, path, nextValue);
        markDirtyField('en', activeSection, path, nextValue);

        return {
          ...prev,
          pt: {
            ...prev.pt,
            [activeSection]: updatedGlobalSection,
          },
          en: {
            ...prev.en,
            [activeSection]: updatedGlobalSection,
          },
        };
      }

      const currentSectionData = prev[language][activeSection];
      const updatedSectionData = setValueAtPath(currentSectionData, path, value) as CmsLandingData[keyof CmsLandingData];
      const nextValue = getValueAtPath(updatedSectionData, path);
      markDirtyField(language, activeSection, path, nextValue);

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

      if (['aboutMedia', 'nav', 'stats', 'footer'].includes(activeSection)) {
        const currentGlobalSection = prev.pt[activeSection];
        const currentValue = getValueAtPath(currentGlobalSection, path);
        if (!Array.isArray(currentValue)) {
          return prev;
        }

        const fallbackValue = getValueAtPath(cmsFallbackByLanguage.pt[activeSection] as unknown, path);
        const fallbackItem = Array.isArray(fallbackValue) && fallbackValue.length > 0
          ? buildEmptyFromTemplate(fallbackValue[0])
          : '';

        const updatedArray = [...currentValue, fallbackItem];
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
        markDirtyField('pt', activeSection, path, updatedArray);
        markDirtyField('en', activeSection, path, updatedArray);

        return {
          ...prev,
          pt: {
            ...prev.pt,
            [activeSection]: updatedGlobalSection,
          },
          en: {
            ...prev.en,
            [activeSection]: updatedGlobalSection,
          },
        };
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

      markDirtyField(language, activeSection, path, updatedArray);

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

      if (['aboutMedia', 'nav', 'stats', 'footer'].includes(activeSection)) {
        const currentGlobalSection = prev.pt[activeSection];
        const currentValue = getValueAtPath(currentGlobalSection, path);
        if (!Array.isArray(currentValue)) {
          return prev;
        }

        const updatedArray = currentValue.filter((_, itemIndex) => itemIndex !== index);
        const updatedGlobalSection = setValueAtPath(currentGlobalSection, path, updatedArray) as CmsLandingData[keyof CmsLandingData];
        markDirtyField('pt', activeSection, path, updatedArray);
        markDirtyField('en', activeSection, path, updatedArray);

        return {
          ...prev,
          pt: {
            ...prev.pt,
            [activeSection]: updatedGlobalSection,
          },
          en: {
            ...prev.en,
            [activeSection]: updatedGlobalSection,
          },
        };
      }

      const currentSectionData = prev[language][activeSection];
      const currentValue = getValueAtPath(currentSectionData, path);
      if (!Array.isArray(currentValue)) {
        return prev;
      }

      const updatedArray = currentValue.filter((_, itemIndex) => itemIndex !== index);
      const updatedSectionData = setValueAtPath(currentSectionData, path, updatedArray) as CmsLandingData[keyof CmsLandingData];

      markDirtyField(language, activeSection, path, updatedArray);

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
    const section: keyof CmsLandingData = 'hero';
    markDirtyField(language, section, [field], value);

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
        isDirty={activeSection ? isFieldDirty(language, path, activeSection) : false}
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
    if (!cmsData || !activeSection) {
      return;
    }

    const sectionKey = activeSection;
    const ptPrefix = `pt.${sectionKey}`;
    const enPrefix = `en.${sectionKey}`;
    if (isGlobalSection(sectionKey)) {
      const currentGlobalSection = cmsData.pt[sectionKey];
      const originalGlobalSection = originalCmsData?.pt[sectionKey];

      if (deepEqual(currentGlobalSection, originalGlobalSection)) {
        toast('Nenhuma alteracao pendente nesta secao.');
        return;
      }

      const savePromise = update(ref(database), {
        [`cms/v2/landing/global/${sectionKey}`]: currentGlobalSection,
      }).then(() => {
        setOriginalCmsData(cmsData);
        setDirtyFields((prev) => {
          const next: Record<string, true> = {};
          Object.keys(prev).forEach((fieldKey) => {
            if (
              fieldKey === ptPrefix
              || fieldKey.startsWith(`${ptPrefix}.`)
              || fieldKey === enPrefix
              || fieldKey.startsWith(`${enPrefix}.`)
            ) {
              return;
            }
            next[fieldKey] = true;
          });
          return next;
        });
      });

      toast.promise(savePromise, {
        loading: 'Salvando secao ativa...',
        success: <b>Secao salva com sucesso!</b>,
        error: <b>Erro ao salvar. Tente novamente.</b>,
      });
      return;
    }

    const activeSectionDirtyKeys = Object.keys(dirtyFields).filter((fieldKey) => (
      fieldKey === ptPrefix
      || fieldKey.startsWith(`${ptPrefix}.`)
      || fieldKey === enPrefix
      || fieldKey.startsWith(`${enPrefix}.`)
    ));

    if (activeSectionDirtyKeys.length === 0) {
      toast('Nenhuma alteracao pendente nesta secao.');
      return;
    }

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
        Object.keys(prev).forEach((fieldKey) => {
          if (
            fieldKey === ptPrefix
            || fieldKey.startsWith(`${ptPrefix}.`)
            || fieldKey === enPrefix
            || fieldKey.startsWith(`${enPrefix}.`)
          ) {
            return;
          }
          next[fieldKey] = true;
        });
        return next;
      });
    });

    toast.promise(savePromise, {
      loading: 'Salvando secao ativa...',
      success: <b>Secao salva com sucesso!</b>,
      error: <b>Erro ao salvar. Tente novamente.</b>,
    });
  };

  const requestDiscardActiveSectionChanges = () => {
    if (!cmsData || !originalCmsData || !activeSection) {
      return;
    }

    const sectionKey = activeSection;
    const ptPrefix = `pt.${sectionKey}`;
    const enPrefix = `en.${sectionKey}`;
    const activeSectionDirtyKeys = Object.keys(dirtyFields).filter((fieldKey) => (
      fieldKey === ptPrefix
      || fieldKey.startsWith(`${ptPrefix}.`)
      || fieldKey === enPrefix
      || fieldKey.startsWith(`${enPrefix}.`)
    ));

    if (activeSectionDirtyKeys.length === 0) {
      toast('Nenhuma alteracao pendente nesta secao.');
      return;
    }

    setIsDiscardConfirmOpen(true);
  };

  const handleDiscardActiveSectionChanges = () => {
    if (!cmsData || !originalCmsData || !activeSection) {
      return;
    }

    const sectionKey = activeSection;
    const ptPrefix = `pt.${sectionKey}`;
    const enPrefix = `en.${sectionKey}`;

    setCmsData((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        pt: {
          ...prev.pt,
          [sectionKey]: originalCmsData.pt[sectionKey],
        },
        en: {
          ...prev.en,
          [sectionKey]: originalCmsData.en[sectionKey],
        },
      };
    });

    setDirtyFields((prev) => {
      const next: Record<string, true> = {};
      Object.keys(prev).forEach((fieldKey) => {
        if (
          fieldKey === ptPrefix
          || fieldKey.startsWith(`${ptPrefix}.`)
          || fieldKey === enPrefix
          || fieldKey.startsWith(`${enPrefix}.`)
        ) {
          return;
        }
        next[fieldKey] = true;
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
    if (!cmsData) {
      return null;
    }

    const mobilePanelMaskClass = mobileLanguage === 'pt'
      ? 'max-lg:[&>div>div:nth-child(2)]:hidden'
      : 'max-lg:[&>div>div:nth-child(1)]:hidden';

    if (activeSection === 'hero') {
      return (
        <div className={mobilePanelMaskClass}>
          <HeroEditor
            cmsData={cmsData}
            isFieldDirty={isFieldDirty}
            onHeroFieldChange={handleHeroFieldChange}
            renderImageField={renderImageField}
          />
        </div>
      );
    }

    if (activeSection === 'nav') {
      return (
        <div className={mobilePanelMaskClass}>
          <NavEditor
            cmsData={cmsData}
            isFieldDirty={isFieldDirty}
            onSectionFieldChange={handleSectionFieldChange}
            onAddArrayItem={handleAddArrayItem}
            onRemoveArrayItem={handleRemoveArrayItem}
          />
        </div>
      );
    }

    if (activeSection === 'gallery') {
      return (
        <div className={mobilePanelMaskClass}>
          <GalleryEditor
            cmsData={cmsData}
            isFieldDirty={isFieldDirty}
            onSectionFieldChange={handleSectionFieldChange}
            onAddArrayItem={handleAddArrayItem}
            onRemoveArrayItem={handleRemoveArrayItem}
            onToggleGalleryBlockquote={handleToggleGalleryBlockquote}
            renderImageField={renderImageField}
          />
        </div>
      );
    }

    if (activeSection === 'stats') {
      return (
        <div className={mobilePanelMaskClass}>
          <StatsEditor
            cmsData={cmsData}
            isFieldDirty={isFieldDirty}
            onSectionFieldChange={handleSectionFieldChange}
            onAddArrayItem={handleAddArrayItem}
            onRemoveArrayItem={handleRemoveArrayItem}
          />
        </div>
      );
    }

    if (activeSection === 'footer') {
      return (
        <div className={mobilePanelMaskClass}>
          <FooterEditor
            cmsData={cmsData}
            isFieldDirty={isFieldDirty}
            onSectionFieldChange={handleSectionFieldChange}
            onAddArrayItem={handleAddArrayItem}
            onRemoveArrayItem={handleRemoveArrayItem}
          />
        </div>
      );
    }

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
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Seções</h1>
        </div>
        <nav className="p-3">
          <ul>
            {sections.map((section) => (
              <li key={section}>
                <button
                  onClick={() => {
                    setActiveSection(section);
                    setMobileLanguage('pt');
                  }}
                  className={`w-full text-left p-3 my-1 rounded-lg text-sm font-medium transition-all duration-150 ${
                    activeSection === section
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{String(section).charAt(0).toUpperCase() + String(section).slice(1).replace(/_/g, ' ')}</span>
                    {(sectionDirtyCountMap[section] ?? 0) > 0 ? (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        {sectionDirtyCountMap[section]}
                      </span>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            <div className="flex items-center gap-2 lg:gap-3">
              <Dialog.Root open={isSectionsDrawerOpen} onOpenChange={setIsSectionsDrawerOpen}>
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
                      <ul className="space-y-2">
                        {sections.map((section) => (
                          <li key={section}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSection(section);
                                setMobileLanguage('pt');
                                setIsSectionsDrawerOpen(false);
                              }}
                              className={`w-full rounded-lg p-3 text-left text-sm font-medium transition ${
                                activeSection === section
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span>{String(section).charAt(0).toUpperCase() + String(section).slice(1).replace(/_/g, ' ')}</span>
                                {(sectionDirtyCountMap[section] ?? 0) > 0 ? (
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    activeSection === section
                                      ? 'bg-white/20 text-white'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {sectionDirtyCountMap[section]}
                                  </span>
                                ) : null}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <h2 className="text-lg font-bold text-gray-800 lg:text-2xl">
                <span className="hidden lg:inline">Editando: </span>
                <span className="text-blue-600">{String(activeSection).charAt(0).toUpperCase() + String(activeSection).slice(1).replace(/_/g, ' ')}</span>
              </h2>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-600 lg:hidden"
            >
              Sair
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              activeSectionDirtyCount > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {activeSectionDirtyCount > 0
                ? `${activeSectionDirtyCount} alteracao(oes) pendente(s)`
                : 'Sem alteracoes pendentes'}
            </span>

            <div className="hidden items-center lg:flex">
            <button
              onClick={requestDiscardActiveSectionChanges}
              className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 shadow-sm transition-all duration-150"
            >
              Descartar secao ativa
            </button>
            <button onClick={handleSave} className="ml-3 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 shadow-sm transition-all duration-150 transform hover:scale-105">
              Salvar secao ativa
            </button>
            <button onClick={handleLogout} className="ml-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 shadow-sm transition-all duration-150 transform hover:scale-105">
              Sair
            </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-28 lg:p-8 lg:pb-8">
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

          {renderSectionEditor()}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            type="button"
            onClick={requestDiscardActiveSectionChanges}
            className="h-11 flex-1 rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-11 flex-1 rounded-lg bg-green-600 px-3 text-sm font-semibold text-white"
          >
            Salvar secao
          </button>
        </div>
      </div>

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

      {isDiscardConfirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setIsDiscardConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900">Tem certeza?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Esta acao vai descartar todas as alteracoes pendentes da secao ativa em PT e EN.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDiscardConfirmOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDiscardActiveSectionChanges}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Sim, descartar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
