import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Header({ origin }) {
  return <header className="topbar"><div className="wrap topbar-inner">
    <div className="logo"><span className="logo-icon">✦</span><span>match<span className="logo-accent">trip</span><small>FOOTBALL WEEKEND FINDER</small></span></div>
    <div className="top-actions"><span className="top-origin"><span className="live-dot"/>{origin === 'Supabase' ? 'Connecté à Supabase' : 'Catalogue 2026'}</span><a className="github-link" href="https://github.com/brahmiamine/matches" target="_blank" rel="noreferrer"><ArrowUpRight size={15}/> GitHub</a></div>
  </div></header>;
}
