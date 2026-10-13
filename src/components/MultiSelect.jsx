import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function MultiSelect({ label, values, chosen, onToggle, emptyText }) {
  return (
    <details className="multi-select">
      <summary><span>{label}</span><span className="multi-value">{chosen.length ? `${chosen.length} sélectionné${chosen.length > 1 ? 's' : ''}` : (emptyText || 'Tous')}</span><ChevronDown size={15}/></summary>
      <div className="multi-options">
        {values.length ? values.map(v => <label key={v} className="check-option"><input type="checkbox" checked={chosen.includes(v)} onChange={() => onToggle(v)} /><span>{v}</span></label>) : <p className="muted">Aucune option</p>}
      </div>
    </details>
  );
}
