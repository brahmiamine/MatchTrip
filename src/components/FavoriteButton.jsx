import React from 'react';

export default function FavoriteButton({ active, onToggle }) {
  const label = active ? 'Retirer des favoris' : 'Ajouter aux favoris';
  return <button type="button" className={'icon-button fav' + (active ? ' is-fav' : '')} title={label} aria-label={label} aria-pressed={active} onClick={onToggle}>{active ? '♥' : '♡'}</button>;
}
