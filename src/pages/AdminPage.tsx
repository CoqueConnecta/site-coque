// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../../firebase';
import toast from 'react-hot-toast';

// Tipos de dados (sem alterações)
type TranslationContent = {
  [key: string]: string | TranslationContent;
};
type LocaleData = {
  translation: TranslationContent;
};
type FullTranslations = {
  pt: LocaleData;
  en: LocaleData;
};

export default function AdminPage() {
  // Hooks de estado (sem alterações)
  const navigate = useNavigate();
  const [translations, setTranslations] = useState<FullTranslations | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  // Lógica de busca e salvamento (sem alterações)
  useEffect(() => {
    const fetchData = async () => {
      const localesRef = ref(database, 'locales');
      try {
        const snapshot = await get(localesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setTranslations(data);
          if (data.pt?.translation) {
            setActiveSection(Object.keys(data.pt.translation)[0]);
          }
        }
      } catch (error) {
        toast.error("Falha ao carregar os dados do painel.");
        console.error("Erro ao buscar dados do Firebase:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (lang: 'pt' | 'en', path: string[], value: string) => {
    if (!translations) return;
    const newTranslations = JSON.parse(JSON.stringify(translations));
    let current: any = newTranslations[lang].translation;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setTranslations(newTranslations);
  };

  const handleSave = () => {
    if (!translations) return;
    const savePromise = set(ref(database, 'locales'), translations);
    toast.promise(savePromise, {
      loading: 'Salvando...',
      success: <b>Traduções salvas com sucesso!</b>,
      error: <b>Erro ao salvar. Tente novamente.</b>,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // --- FUNÇÃO DE RENDERIZAÇÃO COM O POLIMENTO ESTÉTICO ---
  const renderFormFields = (obj: TranslationContent, lang: 'pt' | 'en', path: string[] = []) => {
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = [...path, key];
      if (typeof value === 'string') {
        const isTextarea = key.toLowerCase().includes('descricao');
        return (
          <div key={currentPath.join('-')} className="mb-5"> {/* Aumentamos a margem inferior */}
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"> {/* Rótulo menor, cinza e com espaçamento entre letras */}
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
            </label>
            {isTextarea ? (
              <textarea
                value={value}
                onChange={(e) => handleInputChange(lang, currentPath, e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                rows={6}
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => handleInputChange(lang, currentPath, e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
              />
            )}
          </div>
        );
      }
      // Renderização de sub-seções (se houver)
      return (
        <div key={currentPath.join('-')} className="border-t mt-8 pt-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">{key.toUpperCase()}</h4>
          {renderFormFields(value, lang, currentPath)}
        </div>
      );
    });
  };

  if (!translations) {
    return <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">Carregando painel...</div>;
  }

  // --- JSX PRINCIPAL COM O POLIMENTO ESTÉTICO ---
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Seções</h1>
        </div>
        <nav className="p-3">
          <ul>
            {Object.keys(translations.pt.translation).map((section) => (
              <li key={section}>
                <button
                  onClick={() => setActiveSection(section)}
                  className={`w-full text-left p-3 my-1 rounded-lg text-sm font-medium transition-all duration-150 ${
                    activeSection === section
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1).replace(/_/g, ' ')}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Editando: <span className="text-blue-600">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace(/_/g, ' ')}</span>
          </h2>
          <div className="flex items-center">
            <button onClick={handleSave} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 shadow-sm transition-all duration-150 transform hover:scale-105">
              Salvar Alterações
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
              {renderFormFields(translations.pt.translation[activeSection] as TranslationContent, 'pt', [activeSection])}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">Inglês (EN)</h3>
              {renderFormFields(translations.en.translation[activeSection] as TranslationContent, 'en', [activeSection])}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
