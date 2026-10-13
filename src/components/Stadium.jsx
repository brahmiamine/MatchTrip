import React, { useState } from 'react';
export default function Stadium({ match, compact = false }) {
  const [failed, setFailed] = useState(null);
  if (!match.stadium) return null;
  return <div className={'stadium' + (compact ? ' compact' : '')}>
    {!compact && match.stadium_image_url && failed !== match.stadium_image_url && <a href={match.stadium_source_url} target="_blank" rel="noreferrer" title={'Photo et source : ' + match.stadium}><img src={match.stadium_image_url} alt={match.stadium} loading="lazy" decoding="async" onError={() => setFailed(match.stadium_image_url)}/></a>}
    <div><a href={match.stadium_source_url} target="_blank" rel="noreferrer">{match.stadium}</a><small>Stade habituel · lieu du match à confirmer</small></div>
  </div>;
}
