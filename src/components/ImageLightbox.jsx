import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/** Image en plein écran ; Échap, clic sur le fond ou le bouton ferment. */
export default function ImageLightbox({ src, alt, sourceUrl, license, author, onError, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button className="lightbox-close" aria-label="Fermer" onClick={onClose}><X size={22}/></button>
      <figure onClick={e => e.stopPropagation()}>
        <img src={src} alt={alt} onError={onError}/>
        <figcaption>{alt}{author && <> · {author}</>}{license && <> · {license}</>}{sourceUrl && <> · <a href={sourceUrl} target="_blank" rel="noreferrer">Source de la photo</a></>}</figcaption>
      </figure>
    </div>, document.body);
}
