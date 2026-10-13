import React from 'react';

export default function Stats({ all, filteredCount }) {
  return <div className="stats">
    <div><span className="stat-number">{all.length}</span><span className="stat-caption">matchs en catalogue</span></div>
    <div><span className="stat-number">{new Set(all.map(m => m.country)).size}</span><span className="stat-caption">pays à explorer</span></div>
    <div><span className="stat-number">{new Set(all.map(m => m.zone)).size}</span><span className="stat-caption">zones de destination</span></div>
    <div className="stat-result"><span className="stat-number">{filteredCount}</span><span className="stat-caption">matchs selon vos critères</span></div>
  </div>;
}
