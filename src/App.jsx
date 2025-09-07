import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import IssueDetail from "./pages/IssueDetail";
import MapPage from "./pages/Map";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import ResolvedIssues from "./pages/ResolvedIssues";
import "./App.css";

function Navbar() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/report", label: "Report" },
    { to: "/map", label: "Map" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/resolved", label: "Resolved" }
  ];
  return (
    <nav className="main-navbar">
      <Link to="/" className="main-navbar-logo" style={{ textDecoration: 'none' }}>
        <div className="main-navbar-brand">
          <span role="img" aria-label="logo" style={{fontSize: 38, marginRight: 12}}>🏙️</span>
          <span style={{fontSize: 38, fontWeight: 800, letterSpacing: 2}}>ECHO</span>
        </div>
        <div className="main-navbar-tagline">Turning complaints into change</div>
      </Link>
      <div className="main-navbar-links">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "navbar-link-active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
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
