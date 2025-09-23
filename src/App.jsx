import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ThemeToggle from "./components/ThemeToggle";
import SplashScreen from "./components/SplashScreen";
import Home from "./pages/Home";
import Report from "./pages/Report";
import IssueDetail from "./pages/IssueDetail";
import MapPage from "./pages/Map";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import ResolvedIssues from "./pages/ResolvedIssues";
import { FaBars, FaTimes, FaHome, FaPlus, FaMap, FaChartBar, FaTrophy, FaCheckCircle } from "react-icons/fa";
import "./App.css";

function Navbar({ isSidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const { t } = useLanguage();
  const navLinks = [
    { to: "/", label: t('home'), icon: FaHome },
    { to: "/report", label: t('report'), icon: FaPlus },
    { to: "/map", label: t('map'), icon: FaMap },
    { to: "/dashboard", label: t('dashboard'), icon: FaChartBar },
    { to: "/leaderboard", label: t('leaderboard'), icon: FaTrophy },
    { to: "/resolved", label: t('resolved'), icon: FaCheckCircle }
  ];
  
  return (
    <>
      <nav className="main-navbar">
        <Link to="/" className="main-navbar-logo" style={{ textDecoration: 'none' }}>
          <div className="main-navbar-brand">
            <span role="img" aria-label="logo" style={{fontSize: 38, marginRight: 12}}>🏙️</span>
            <span style={{fontSize: 38, fontWeight: 800, letterSpacing: 2}}>{t('appName')}</span>
          </div>
          <div className="main-navbar-tagline">{t('tagline')}</div>
        </Link>
        
            {/* Desktop Navigation */}
            <div className="main-navbar-links desktop-nav">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={location.pathname === link.to ? "navbar-link-active" : ""}
                >
                  {link.label}
                </Link>
              ))}
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
        
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>
      
      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <span role="img" aria-label="logo" style={{fontSize: 32, marginRight: 8}}>🏙️</span>
              <span style={{fontSize: 28, fontWeight: 800, letterSpacing: 1}}>{t('appName')}</span>
            </div>
            <button className="sidebar-close" onClick={toggleSidebar}>
              <FaTimes />
            </button>
          </div>
              <div className="sidebar-tagline">{t('tagline')}</div>
              <div className="sidebar-theme-switcher">
                <ThemeToggle />
              </div>
              <div className="sidebar-language-switcher">
                <LanguageSwitcher />
              </div>
          <nav className="sidebar-nav">
            {navLinks.map(link => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`sidebar-link ${location.pathname === link.to ? 'active' : ''}`}
                  onClick={toggleSidebar}
                >
                  <IconComponent className="sidebar-icon" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomeWithSplash />} />
          <Route path="/report" element={<Report />} />
          <Route path="/issue/:id" element={<IssueDetail />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/resolved" element={<ResolvedIssues />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Component that shows splash screen before Home page
function HomeWithSplash() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return <Home />;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
