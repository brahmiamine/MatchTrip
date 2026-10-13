import React from 'react';

export default function Empty({ onReset, noFavorites = false }) {
  return <div className="empty"><div className="empty-icon">∅</div><h3>Aucun match ne correspond</h3>
    <p>{noFavorites ? 'Vous n’avez pas encore de favori. Touchez ♡ sur un match pour l’ajouter.' : 'Élargissez la période, retirez un pays, assouplissez les horaires ou réactivez les week-ends exclus.'}</p>
    <button type="button" className="primary-button" onClick={onReset}>Réinitialiser les filtres</button></div>;
}

export function Skeletons() {
  return <div className="card-grid" aria-busy="true" aria-label="Chargement des matchs">{[1, 2, 3, 4].map(k => <div key={k} className="skeleton"><i style={{ width: '30%' }}/><i style={{ width: '60%', height: 32 }}/><i style={{ width: '45%' }}/><i style={{ height: 60 }}/><i style={{ height: 60 }}/></div>)}</div>;
}
