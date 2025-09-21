import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import './SplashScreen.css';

export default function SplashScreen({ onComplete }) {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();
  const [showLogo, setShowLogo] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Logo animation starts immediately
    const logoTimer = setTimeout(() => setShowLogo(true), 300);
    
    // Tagline appears after logo
    const taglineTimer = setTimeout(() => setShowTagline(true), 1200);
    
    // Subtitle appears after tagline
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 2000);
    
    // Complete animation and show main app
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => onComplete(), 500); // Fade out before showing main app
    }, 3500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(taglineTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isComplete ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* Animated Logo */}
        <div className={`logo-container ${showLogo ? 'animate' : ''}`}>
          <div className="logo-icon">
            <span className="logo-emoji">🏙️</span>
          </div>
          <div className="logo-text">
            <span className="logo-letter">E</span>
            <span className="logo-letter">C</span>
            <span className="logo-letter">H</span>
            <span className="logo-letter">O</span>
          </div>
        </div>

        {/* Animated Tagline */}
        <div className={`tagline-container ${showTagline ? 'animate' : ''}`}>
          <h1 className="tagline-text">{t('tagline')}</h1>
        </div>

        {/* Animated Subtitle */}
        <div className={`subtitle-container ${showSubtitle ? 'animate' : ''}`}>
          <p className="subtitle-text">{t('byTeamREACTronauts')}</p>
        </div>

        {/* Loading Animation */}
        <div className={`loading-container ${showSubtitle ? 'animate' : ''}`}>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="splash-background">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
        <div className="bg-circle circle-4"></div>
      </div>
    </div>
  );
}
