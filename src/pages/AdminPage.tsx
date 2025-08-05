// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, database } from '../../firebase';

type Translations = {
  [key: string]: string | Translations;
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [translations, setTranslations] = useState<{ pt: Translations; en: Translations } | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Cria uma referência para o nó 'locales' no Realtime Database
      const localesRef = ref(database, 'locales');
      try {
        // Faz a leitura dos dados desse nó
        const snapshot = await get(localesRef);
        if (snapshot.exists()) {
          // Se os dados existem, atualiza o estado com eles
          setTranslations(snapshot.val());
        } else {
          console.log("Nenhum dado encontrado em /locales");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (lang: 'pt' | 'en', path: string[], value: string) => {
    if (!translations) return;

    // Cria uma cópia profunda do estado para evitar mutação direta
    const newTranslations = JSON.parse(JSON.stringify(translations));

    // Navega no objeto para encontrar o local exato a ser atualizado
    let current = newTranslations[lang].translation;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;

    setTranslations(newTranslations);
  };

  // Função para salvar os dados de volta no Firebase
  const handleSave = async () => {
    if (!translations) return;
    setStatusMessage('Salvando...');
    const localesRef = ref(database, 'locales');
    try {
      // A função 'set' sobrescreve todos os dados no nó 'locales' com os novos dados
      await set(localesRef, translations);
      setStatusMessage('Traduções salvas com sucesso!');
      // Limpa a mensagem após alguns segundos
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setStatusMessage('Erro ao salvar. Tente novamente.');
      console.error("Erro ao salvar no Firebase:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Função auxiliar para renderizar os campos do formulário recursivamente
  const renderFormFields = (obj: Translations, lang: 'pt' | 'en', path: string[] = []) => {
    return Object.entries(obj).map(([key, value]) => {
      const currentPath = [...path, key];
      if (typeof value === 'string') {
        // Se o valor é uma string, renderiza um input
        return (
          <div key={currentPath.join('-')} style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>
              {currentPath.join(' > ')}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(lang, currentPath, e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        );
      }
      // Se o valor é um objeto, renderiza um título para a seção e chama a função novamente
      return (
        <fieldset key={currentPath.join('-')} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <legend style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{key.toUpperCase()}</legend>
          {renderFormFields(value, lang, currentPath)}
        </fieldset>
      );
    });
  };

  // Se os dados ainda não foram carregados, mostra uma mensagem
  if (!translations) {
    return <div>Carregando traduções...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Painel de Edição de Conteúdo</h1>
        <button onClick={handleLogout} style={{ padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>
          Sair
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Coluna para Português */}
        <div style={{ flex: 1 }}>
          <h2>Português (PT)</h2>
          {renderFormFields(translations.pt.translation as Translations, 'pt')}
        </div>
        {/* Coluna para Inglês */}
        <div style={{ flex: 1 }}>
          <h2>Inglês (EN)</h2>
          {renderFormFields(translations.en.translation as Translations, 'en')}
        </div>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div style={{ textAlign: 'center' }}>
        <button onClick={handleSave} style={{ padding: '15px 30px', fontSize: '18px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          Salvar Todas as Alterações
        </button>
        {statusMessage && <p style={{ marginTop: '10px', fontSize: '16px' }}>{statusMessage}</p>}
      </div>
    </div>
  );
}
