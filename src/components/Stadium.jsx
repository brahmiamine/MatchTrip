import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { mapsUrl } from '../lib/maps.js';
import ImageLightbox from './ImageLightbox.jsx';

/** Icône (si photo disponible) → photo en plein écran ; nom du stade → Google Maps. */
export default function Stadium({ match, compact = false }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!match.stadium) return null;
  const hasImage = Boolean(match.stadium_image_url) && !failed;
  return <div className={'stadium' + (compact ? ' compact' : '')}>
    {hasImage && <button type="button" className="stadium-photo" title="Voir la photo du stade" aria-label={'Voir la photo : ' + match.stadium} onClick={() => setOpen(true)}><Camera size={compact ? 13 : 15}/></button>}
    <div><a href={mapsUrl(match.stadium, match.country)} target="_blank" rel="noreferrer" title="Ouvrir dans Google Maps">{match.stadium}</a>{!compact && <small>Stade habituel · lieu du match à confirmer</small>}</div>
    {open && <ImageLightbox src={match.stadium_image_url} alt={match.stadium} sourceUrl={match.stadium_source_url} onError={() => { setFailed(true); setOpen(false); }} onClose={() => setOpen(false)}/>}
  </div>;
}
