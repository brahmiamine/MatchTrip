import React, { useEffect, useState } from 'react';
import { auth, configured } from '../lib/client.js';

export default function AccountSync() {
  const [user, setUser] = useState(null), [open, setOpen] = useState(false);
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!configured) return;
    setUser(auth.getSession()?.user ?? null);
    auth.refresh().catch(() => {});
    const unsubscribe = auth.onChange(session => setUser(session?.user ?? null));
    const onError = event => setMessage(event.detail);
    window.addEventListener('matchtrip-sync-error', onError);
    return () => { unsubscribe(); window.removeEventListener('matchtrip-sync-error', onError); };
  }, []);
  const submit = async (event, signup = false) => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      await (signup ? auth.signUp(email, password) : auth.signIn(email, password));
      setPassword('');
      setMessage('Connexion réussie. Synchronisation de vos préférences…');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };
  return <div className="account-sync">
    <button className="pill-button" onClick={() => setOpen(x => !x)} aria-expanded={open}>{user ? 'Mon compte' : 'Sauvegarder mes choix'}</button>
    {open && <div className="account-panel">
      {user ? <><p>{user.email}</p><p>Favoris, filtres et préférences sauvegardés dans votre compte.</p><button className="pill-button" onClick={() => auth.signOut()}>Déconnexion</button></> : <form onSubmit={submit}>
        <p>Connectez-vous pour retrouver vos favoris et vos choix sur vos appareils.</p>
        <label>E-mail<input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Mot de passe<input type="password" required minLength={8} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        <div className="account-buttons"><button className="pill-button" disabled={busy} type="submit">Connexion</button><button className="pill-button" disabled={busy} type="button" onClick={e => { if (e.currentTarget.form.reportValidity()) submit(e, true); }}>Créer un compte</button></div>
      </form>}
      {message && <p role="status">{message}</p>}
    </div>}
    {!open && message && <span role="status" className="account-status">{message}</span>}
  </div>;
}
