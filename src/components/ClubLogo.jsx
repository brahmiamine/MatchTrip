import React, { useState } from 'react';
import { mediaForClub } from '../lib/media.js';
export default function ClubLogo({ club, url, small = false }) {
  const src = url || mediaForClub(club).logo_url;
  const [failed, setFailed] = useState(null);
  return <span className={'club-logo' + (small ? ' small' : '')}>
    {src && failed !== src ? <img src={src} alt={'Logo de ' + club} loading="lazy" decoding="async" onError={() => setFailed(src)}/> : <span aria-label={club}>{club.slice(0, 2).toUpperCase()}</span>}
  </span>;
}
