import React from 'react';
import { getDestinationHub, getMatchDistance } from '../lib/destinations.js';
import { getMatchDirectionsUrl } from '../lib/maps.js';

/** Distances à vol d'oiseau ; le clic ouvre un itinéraire routier dans Maps. */
export default function DistanceFromHub({ match }) {
  const hub = getDestinationHub(match);
  if (!hub) return null;
  const distance = getMatchDistance(match);
  const directions = getMatchDirectionsUrl(match);
  const label = distance ? `${distance.city} · ≈ ${distance.km} km de ${hub}` : `Distance depuis ${hub} indisponible`;
  if (!directions) return <span className="meta-link">{label}</span>;
  return <a className="meta-link" href={directions} target="_blank" rel="noopener noreferrer"
    title={`Ouvrir l'itinéraire Google Maps : ${hub} → ${distance.city}. La distance affichée est à vol d'oiseau.`}>{label} ↗</a>;
}
