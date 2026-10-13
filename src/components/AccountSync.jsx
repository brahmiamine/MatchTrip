import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

export default function AccountSync() {
  const [user, setUser] = useState(null), [open, setOpen] = useState(false);
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); });
    const onError = event => setMessage(event.detail);
    window.addEventListener('matchtrip-sync-error', onError);
    return () => { data.subscription.unsubscribe(); window.removeEventListener('matchtrip-sync-error', onError); };
  }, []);
  const submit = async (event, signup = false) => {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const { data, error } = signup ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setPassword('');
      setMessage(data.session ? 'Connexion réussie. Synchronisation de vos préférences…' : 'Confirmez votre adresse avec le message reçu par e-mail, puis connectez-vous.');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };
  return <div className="account-sync">
    <button className="pill-button" onClick={() => setOpen(x => !x)} aria-expanded={open}>{user ? 'Mon compte' : 'Sauvegarder mes choix'}</button>
    {open && <div className="account-panel">
      {user ? <><p>{user.email}</p><p>Favoris, filtres et préférences sauvegardés dans votre compte.</p><button className="pill-button" onClick={async () => { const { error } = await supabase.auth.signOut(); if (error) setMessage(error.message); }}>Déconnexion</button></> : <form onSubmit={submit}>
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
