import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { mapsUrl } from '../lib/maps.js';
import ImageLightbox from './ImageLightbox.jsx';
import { stadiumCredits } from '../lib/media.js';

/** Icône (si photo disponible) → photo en plein écran ; nom du stade → Google Maps. */
export default function Stadium({ match }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  if (!match.stadium) return null;
  const hasImage = Boolean(match.stadium_image_url) && !failed;
  const credits = stadiumCredits(match);
  return <span className="stadium">
    {hasImage && <button type="button" className="stadium-photo" title="Voir la photo du stade" aria-label={'Voir la photo : ' + match.stadium} onClick={() => setOpen(true)}><Camera size={12}/></button>}
    <a href={mapsUrl(match.stadium, match.country)} target="_blank" rel="noreferrer" title={match.venue_confirmed ? 'Lieu du match vérifié. Ouvrir dans Google Maps' : 'Stade habituel · lieu du match à confirmer. Ouvrir dans Google Maps'}>{match.stadium}</a>
    {open && <ImageLightbox src={match.stadium_image_url} alt={match.stadium} sourceUrl={credits.source} license={credits.license} author={credits.author} onError={() => { setFailed(true); setOpen(false); }} onClose={() => setOpen(false)}/>}
  </span>;
}
