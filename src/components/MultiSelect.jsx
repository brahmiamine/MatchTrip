import React from 'react';

export default function MultiSelect({ label, values, chosen, onToggle, emptyText, format = v => v }) {
  return (
    <details className="multi-select">
      <summary><span className="multi-label">{label}</span><span className={'multi-value' + (chosen.length ? ' on' : '')}>{chosen.length ? `${chosen.length} sélectionné${chosen.length > 1 ? 's' : ''}` : (emptyText || 'Tous')} <span className="chev">▾</span></span></summary>
      <div className="multi-options">
        {values.length ? values.map(v => <label key={v} className="check-option"><input type="checkbox" checked={chosen.includes(v)} onChange={() => onToggle(v)}/><span className="tick" aria-hidden="true">✓</span><span>{format(v)}</span></label>) : <p className="muted">Aucune option</p>}
      </div>
    </details>
  );
}
