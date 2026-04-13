// src/pages/AdminPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../../firebase';
import toast from 'react-hot-toast';
import { cmsFallbackByLanguage } from '../data/cmsFallback';
import type { CmsLandingData, CmsLanguage } from '../types/cms';

type CmsLandingByLanguage = {
  pt: CmsLandingData;
  en: CmsLandingData;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeWithFallback<T>(fallback: T, incoming: unknown): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(incoming) ? incoming : fallback) as T;
  }

  if (isRecord(fallback)) {
    if (!isRecord(incoming)) {
      return fallback;
    }

    const result: Record<string, unknown> = { ...fallback };
    for (const key of Object.keys(fallback)) {
      result[key] = mergeWithFallback(
        (fallback as Record<string, unknown>)[key],
        incoming[key]
      );
    }
    return result as T;
  }

  return (incoming === undefined || incoming === null ? fallback : incoming) as T;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [cmsData, setCmsData] = useState<CmsLandingByLanguage | null>(null);
  const [activeSection, setActiveSection] = useState<keyof CmsLandingData | ''>('');

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

  const formatLabel = (value: string) =>
    value
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^./, (char) => char.toUpperCase());

  const getValueAtPath = (source: unknown, path: Array<string | number>): unknown => {
    return path.reduce<unknown>((accumulator, key) => {
      if (Array.isArray(accumulator) && typeof key === 'number') {
        return accumulator[key];
      }

      if (isRecord(accumulator) && typeof key === 'string') {
        return accumulator[key];
      }

      return undefined;
    }, source);
  };

  const buildEmptyFromTemplate = (template: unknown): unknown => {
    if (Array.isArray(template)) {
      return [];
    }

    if (isRecord(template)) {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(template)) {
        result[key] = buildEmptyFromTemplate(value);
      }
      return result;
    }

    if (typeof template === 'number') {
      return 0;
    }

    if (typeof template === 'boolean') {
      return false;
    }

    return '';
  };

  const setValueAtPath = (
    source: unknown,
    path: Array<string | number>,
    value: unknown
  ): unknown => {
    if (path.length === 0) {
      return value;
    }

    const [head, ...rest] = path;

    if (Array.isArray(source) && typeof head === 'number') {
      const next = [...source];
      next[head] = setValueAtPath(next[head], rest, value);
      return next;
    }

    if (isRecord(source) && typeof head === 'string') {
      return {
        ...source,
        [head]: setValueAtPath(source[head], rest, value),
      };
    }

    return source;
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

  const renderNavEditor = (language: CmsLanguage) => {
    if (!cmsData) {
      return null;
    }

    const navData = cmsData[language].nav;

    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Links do menu</p>
            <button
              type="button"
              onClick={() => handleAddArrayItem(language, ['links'])}
              className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200"
            >
              + Adicionar link
            </button>
          </div>

          <div className="space-y-3">
            {navData.links.map((link, index) => (
              <div key={`${language}-nav-link-${index}`} className="rounded-md border border-gray-200 bg-white p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Link {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(language, ['links'], index)}
                    className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                  >
                    Remover
                  </button>
                </div>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Identificador interno</span>
                  <input
                    type="text"
                    value={link.id}
                    onChange={(e) => handleSectionFieldChange(language, ['links', index, 'id'], e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="about"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Texto exibido</span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleSectionFieldChange(language, ['links', index, 'label'], e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Quem Somos"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Link (href)</span>
                  <input
                    type="text"
                    value={link.href}
                    onChange={(e) => handleSectionFieldChange(language, ['links', index, 'href'], e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="/#about"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">Botão principal (CTA)</p>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Texto do botão</span>
            <input
              type="text"
              value={navData.cta.label}
              onChange={(e) => handleSectionFieldChange(language, ['cta', 'label'], e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="DOE AGORA"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">Link do botão</span>
            <input
              type="text"
              value={navData.cta.href}
              onChange={(e) => handleSectionFieldChange(language, ['cta', 'href'], e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </label>
        </div>
      </div>
    );
  };

  const renderGalleryEditor = (language: CmsLanguage) => {
    if (!cmsData) {
      return null;
    }

    const galleryData = cmsData[language].gallery;

    return (
      <div className="space-y-5">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Título da seção</span>
          <input
            type="text"
            value={galleryData.headline}
            onChange={(e) => handleSectionFieldChange(language, ['headline'], e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">Subtítulo da seção</span>
          <textarea
            value={galleryData.subtitle}
            onChange={(e) => handleSectionFieldChange(language, ['subtitle'], e.target.value)}
            className="min-h-24 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Cards de ajuda</p>
            <button
              type="button"
              onClick={() => handleAddArrayItem(language, ['cards'])}
              className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200"
            >
              + Adicionar card
            </button>
          </div>

          <div className="space-y-4">
            {galleryData.cards.map((card, cardIndex) => (
              <div key={`${language}-gallery-card-${cardIndex}`} className="rounded-md border border-gray-200 bg-white p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Card {cardIndex + 1}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(language, ['cards'], cardIndex)}
                    className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                  >
                    Remover
                  </button>
                </div>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">ID interno</span>
                  <input
                    type="text"
                    value={card.id}
                    onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'id'], e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="doacoes"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Título</span>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'title'], e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Descrição</span>
                  <textarea
                    value={card.description}
                    onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'description'], e.target.value)}
                    className="min-h-24 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Imagem (URL ou caminho local)</span>
                  <input
                    type="text"
                    value={card.image ?? ''}
                    onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'image'], e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="/pessoa-segurando-caixa.jpg"
                  />
                </label>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Tags do card</p>
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem(language, ['cards', cardIndex, 'tags'])}
                      className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                    >
                      + Tag
                    </button>
                  </div>
                  <div className="space-y-2">
                    {card.tags.map((tag, tagIndex) => (
                      <div key={`${language}-gallery-card-${cardIndex}-tag-${tagIndex}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tag}
                          onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'tags', tagIndex], e.target.value)}
                          className="h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem(language, ['cards', cardIndex, 'tags'], tagIndex)}
                          className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Depoimento (blockquote)</p>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={Boolean(card.blockquote)}
                        onChange={(e) => handleToggleGalleryBlockquote(language, cardIndex, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Ativo
                    </label>
                  </div>

                  {card.blockquote ? (
                    <>
                      <label className="block">
                        <span className="block text-sm font-medium text-gray-700 mb-2">Texto do depoimento</span>
                        <textarea
                          value={card.blockquote.text}
                          onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'blockquote', 'text'], e.target.value)}
                          className="min-h-24 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </label>

                      <label className="block">
                        <span className="block text-sm font-medium text-gray-700 mb-2">Nome do autor</span>
                        <input
                          type="text"
                          value={card.blockquote.authorName}
                          onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'blockquote', 'authorName'], e.target.value)}
                          className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                      </label>

                      <label className="block">
                        <span className="block text-sm font-medium text-gray-700 mb-2">Avatar do autor (opcional)</span>
                        <input
                          type="text"
                          value={card.blockquote.authorAvatar ?? ''}
                          onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'blockquote', 'authorAvatar'], e.target.value)}
                          className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                          placeholder="/avatar.jpg"
                        />
                      </label>
                    </>
                  ) : null}
                </div>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Variação visual</span>
                  <select
                    value={card.variant}
                    onChange={(e) => handleSectionFieldChange(language, ['cards', cardIndex, 'variant'], e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Claro (light)</option>
                    <option value="dark">Escuro (dark)</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDynamicField = (
    language: CmsLanguage,
    value: unknown,
    path: Array<string | number>,
    label: string
  ) => {
    if (Array.isArray(value)) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="block text-sm font-medium text-gray-700">{label}</span>
            <button
              type="button"
              onClick={() => handleAddArrayItem(language, path)}
              className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200"
            >
              + Adicionar item
            </button>
          </div>
          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
            {value.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum item cadastrado.</p>
            ) : null}
            {value.map((item, index) => (
              <div key={`${label}-${index}`} className="rounded-md border border-gray-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Item {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem(language, path, index)}
                    className="rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
                  >
                    Remover
                  </button>
                </div>
                {renderDynamicField(language, item, [...path, index], `${label} ${index + 1}`)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isRecord(value)) {
      return (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          {Object.entries(value).map(([key, nestedValue]) => (
            <div key={`${path.join('-')}-${key}`}>
              {renderDynamicField(language, nestedValue, [...path, key], formatLabel(key))}
            </div>
          ))}
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => handleSectionFieldChange(language, path, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
      );
    }

    if (typeof value === 'number') {
      return (
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
          <input
            type="number"
            value={value}
            onChange={(e) => handleSectionFieldChange(language, path, Number(e.target.value))}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </label>
      );
    }

    const textValue = value === null || value === undefined ? '' : String(value);
    const useTextarea = textValue.includes('\n') || textValue.length > 80;

    return (
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
        {useTextarea ? (
          <textarea
            value={textValue}
            onChange={(e) => handleSectionFieldChange(language, path, e.target.value)}
            className="min-h-24 w-full rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <input
            type="text"
            value={textValue}
            onChange={(e) => handleSectionFieldChange(language, path, e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        )}
      </label>
    );
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-5">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4">Português (PT)</h3>
                <p className="text-sm text-gray-500">Preencha os campos abaixo para editar o Hero sem precisar de JSON.</p>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Headline</span>
                  <textarea
                    value={cmsData.pt.hero.headline}
                    onChange={(e) => handleHeroFieldChange('pt', 'headline', e.target.value)}
                    className="min-h-24 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Subheadline</span>
                  <textarea
                    value={cmsData.pt.hero.subheadline}
                    onChange={(e) => handleHeroFieldChange('pt', 'subheadline', e.target.value)}
                    className="min-h-32 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Texto do botão (CTA)</span>
                  <input
                    type="text"
                    value={cmsData.pt.hero.ctaText}
                    onChange={(e) => handleHeroFieldChange('pt', 'ctaText', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Imagem de fundo (opcional)</span>
                  <input
                    type="text"
                    value={cmsData.pt.hero.backgroundImage ?? ''}
                    onChange={(e) => handleHeroFieldChange('pt', 'backgroundImage', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="/assets/banner.jpg"
                  />
                </label>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-5">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4">Inglês (EN)</h3>
                <p className="text-sm text-gray-500">Preencha os campos abaixo para editar o Hero sem precisar de JSON.</p>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Headline</span>
                  <textarea
                    value={cmsData.en.hero.headline}
                    onChange={(e) => handleHeroFieldChange('en', 'headline', e.target.value)}
                    className="min-h-24 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Subheadline</span>
                  <textarea
                    value={cmsData.en.hero.subheadline}
                    onChange={(e) => handleHeroFieldChange('en', 'subheadline', e.target.value)}
                    className="min-h-32 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Button text (CTA)</span>
                  <input
                    type="text"
                    value={cmsData.en.hero.ctaText}
                    onChange={(e) => handleHeroFieldChange('en', 'ctaText', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-2">Background image (optional)</span>
                  <input
                    type="text"
                    value={cmsData.en.hero.backgroundImage ?? ''}
                    onChange={(e) => handleHeroFieldChange('en', 'backgroundImage', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="/assets/banner.jpg"
                  />
                </label>
              </div>
            </div>
          ) : activeSection === 'nav' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Português (PT)</h3>
                <p className="mb-3 text-sm text-gray-500">Editor premium de navegação com campos guiados.</p>
                {renderNavEditor('pt')}
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Inglês (EN)</h3>
                <p className="mb-3 text-sm text-gray-500">Premium navigation editor with guided fields.</p>
                {renderNavEditor('en')}
              </div>
            </div>
          ) : activeSection === 'gallery' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Português (PT)</h3>
                <p className="mb-3 text-sm text-gray-500">Editor premium da galeria com cards, tags e depoimentos.</p>
                {renderGalleryEditor('pt')}
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Inglês (EN)</h3>
                <p className="mb-3 text-sm text-gray-500">Premium gallery editor with cards, tags, and blockquotes.</p>
                {renderGalleryEditor('en')}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Português (PT)</h3>
                <p className="mb-3 text-sm text-gray-500">Edite os campos abaixo em formato de formulário.</p>
                {activeSection
                  ? renderDynamicField('pt', cmsData.pt[activeSection], [], formatLabel(String(activeSection)))
                  : null}
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Inglês (EN)</h3>
                <p className="mb-3 text-sm text-gray-500">Edite os campos abaixo em formato de formulário.</p>
                {activeSection
                  ? renderDynamicField('en', cmsData.en[activeSection], [], formatLabel(String(activeSection)))
                  : null}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
