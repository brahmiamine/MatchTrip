import React, { useState } from 'react';
import { mediaForClub } from '../lib/media.js';
import { clubCode, clubHue } from '../lib/clubCode.js';

/** Écusson d'un club : logo officiel si disponible, sinon sigle sur fond coloré. */
export default function ClubLogo({ club, url, small = false }) {
  const src = url || mediaForClub(club).logo_url;
  const [failed, setFailed] = useState(null);
  const hasImg = Boolean(src) && failed !== src;
  const h = clubHue(club);
  const style = hasImg ? undefined : { background: `linear-gradient(160deg,oklch(0.82 0.12 ${h}),oklch(0.62 0.14 ${h}))` };
  return <span className={'crest' + (small ? ' small' : '') + (hasImg ? ' has-img' : '')} style={style} title={club}>
    {hasImg ? <img src={src} alt={'Logo de ' + club} loading="lazy" decoding="async" onError={() => setFailed(src)}/> : <span aria-label={club}>{clubCode(club)}</span>}
  </span>;
}

/** Écussons domicile + extérieur qui se chevauchent. */
export function CrestPair({ match, small = false }) {
  return <span className="crest-pair">
    <ClubLogo club={match.home} url={match.home_logo_url} small={small}/>
    <ClubLogo club={match.away} url={match.away_logo_url} small={small}/>
  </span>;
}
