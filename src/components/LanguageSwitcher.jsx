import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FaGlobe, FaChevronDown } from 'react-icons/fa';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { language, changeLanguage, availableLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button 
        className="language-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={t('changeLanguage')}
      >
        <FaGlobe className="language-icon" />
        <span className="language-text">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
        <FaChevronDown className={`language-arrow ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${language === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
              {language === lang.code && (
                <span className="language-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
