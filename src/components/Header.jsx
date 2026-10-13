import React from 'react';

export default function Header({ origin, theme, onToggleTheme }) {
  return <header className="topbar"><div className="wrap topbar-inner">
    <div className="logo"><span className="logo-icon">m</span><span className="logo-word">match<span>trip</span></span></div>
    <div className="top-actions">
      <span className="top-origin"><span className="live-dot"/>{origin === 'Supabase' ? 'Connecté à Supabase' : 'Catalogue 2026'}</span>
      <button type="button" className="pill-button" onClick={onToggleTheme}>{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</button>
    </div>
  </div></header>;
}
