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
  const [jsonDraft, setJsonDraft] = useState<Record<CmsLanguage, string>>({ pt: '', en: '' });
  const [jsonError, setJsonError] = useState<Record<CmsLanguage, string | undefined>>({
    pt: undefined,
    en: undefined,
  });

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

  useEffect(() => {
    if (!cmsData || !activeSection) {
      return;
    }

    setJsonDraft({
      pt: JSON.stringify(cmsData.pt[activeSection], null, 2),
      en: JSON.stringify(cmsData.en[activeSection], null, 2),
    });
    setJsonError({ pt: undefined, en: undefined });
  }, [activeSection, cmsData]);

  const handleJsonChange = (language: CmsLanguage, value: string) => {
    setJsonDraft((prev) => ({ ...prev, [language]: value }));

    if (!cmsData || !activeSection) {
      return;
    }

    try {
      const parsed = JSON.parse(value) as CmsLandingData[keyof CmsLandingData];
      setJsonError((prev) => ({ ...prev, [language]: undefined }));

      setCmsData((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          [language]: {
            ...prev[language],
            [activeSection]: parsed,
          },
        };
      });
    } catch {
      setJsonError((prev) => ({ ...prev, [language]: 'JSON inválido para esta seção.' }));
    }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Português (PT)</h3>
              <p className="mb-3 text-sm text-gray-500">Edite a seção em JSON. Alterações válidas são aplicadas em tempo real.</p>
              <textarea
                value={jsonDraft.pt}
                onChange={(e) => handleJsonChange('pt', e.target.value)}
                className="h-[65vh] w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              {jsonError.pt ? <p className="mt-2 text-sm text-red-600">{jsonError.pt}</p> : null}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Inglês (EN)</h3>
              <p className="mb-3 text-sm text-gray-500">Edite a seção em JSON. Alterações válidas são aplicadas em tempo real.</p>
              <textarea
                value={jsonDraft.en}
                onChange={(e) => handleJsonChange('en', e.target.value)}
                className="h-[65vh] w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              {jsonError.en ? <p className="mt-2 text-sm text-red-600">{jsonError.en}</p> : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
