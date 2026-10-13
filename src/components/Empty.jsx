import React from 'react';
import { RotateCcw, Search } from 'lucide-react';

export default function Empty({ onReset }) {
  return <div className="empty"><div className="empty-icon"><Search size={28}/></div><h3>Aucun résultat pour ces critères</h3><p>Essayez un autre pays, une autre date ou réactivez les week-ends exclus.</p><button onClick={onReset}><RotateCcw size={15}/> Réinitialiser les filtres</button></div>;
}
