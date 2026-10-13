import React from 'react';
import { CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { fixtureVerification } from '../lib/fixtureVerification.js';

export default function FixtureStatus({ match, compact = false }) {
  const state = fixtureVerification(match);
  return <span className={compact ? 'weekend-fixture-status' : 'match-verification'}>
    <span className={`fixture-status ${state.kind}`}>
      {state.kind === 'verified' ? <CheckCircle2 size={11}/> : <AlertCircle size={11}/>}
      {state.label}
    </span>
    {state.source && <a className="fixture-source" href={state.source}
      target="_blank" rel="noopener noreferrer" title="Calendrier officiel vérifié">
      Source <ExternalLink size={10} aria-hidden="true"/>
    </a>}
  </span>;
}
