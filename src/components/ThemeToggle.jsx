import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          {isDarkMode ? (
            <FaMoon className="theme-icon" />
          ) : (
            <FaSun className="theme-icon" />
          )}
        </div>
      </div>
    </button>
  );
}
