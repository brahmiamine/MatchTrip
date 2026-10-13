import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return <footer><div className="footer-logo">match<span>trip</span></div><div>Les matchs peuvent être reportés ou reprogrammés. Vérifiez billets, transports et horaires avant de réserver.</div><a href="https://github.com/brahmiamine/matches" target="_blank" rel="noreferrer">Code source <ArrowUpRight size={14}/></a></footer>;
}
