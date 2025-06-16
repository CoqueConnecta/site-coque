import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageToggle.css';

const LanguageToggle = () => {
    const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language === 'en');

  const handleToggle = () => {
    const newLang = !lang;
    setLang(newLang);
    i18n.changeLanguage(newLang ? 'en' : 'pt');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <div className="switch">
          <input
            id="language-toggle"
            className="check-toggle check-toggle-round-flat"
            type="checkbox"
            checked={lang}
            onChange={handleToggle}
            aria-label="Alternar idioma"
          />
          <label htmlFor="language-toggle"></label>
          <span className="on">PT-BR</span>
          <span className="off">EN</span>
        </div>
      </div>
  )
}

export default LanguageToggle