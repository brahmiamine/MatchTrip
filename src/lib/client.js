// Client de l'API MatchTrip (MariaDB). Surchargeable via VITE_API_URL (voir .env.example).
export const API_URL = (import.meta.env.VITE_API_URL ?? 'https://match.clubika.com/api').replace(/\/+$/, '');
export const configured = Boolean(API_URL);
const SESSION_KEY = 'matchtrip-session';

export class ApiError extends Error {
  constructor(message, status, code) { super(message); this.status = status; this.code = code; }
}

const listeners = new Set();
const readSession = () => {
  try {
    const value = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return value && typeof value.token === 'string' && value.user?.id ? value : null;
  } catch { return null; }
};
let current = readSession();
const setSession = session => {
  current = session;
  try { if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session)); else localStorage.removeItem(SESSION_KEY); } catch { /* stockage indisponible */ }
  listeners.forEach(listener => listener(session));
};

export async function api(method, path, body) {
  const token = current?.token;
  let response;
  try {
    response = await fetch(API_URL + path, {
      method,
      headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch { throw new ApiError('Serveur injoignable.', 0, 'network'); }
  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    // Session révoquée ou expirée : retour au mode visiteur (les choix locaux sont conservés).
    if (response.status === 401 && token && current?.token === token) setSession(null);
    throw new ApiError(data?.message || 'Erreur serveur.', response.status, data?.error);
  }
  return data;
}

export const auth = {
  getSession: () => current,
  onChange(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  async signIn(email, password) { setSession(await api('POST', '/auth/login', { email, password })); },
  async signUp(email, password) { setSession(await api('POST', '/auth/signup', { email, password })); },
  async signOut() { try { await api('POST', '/auth/logout'); } catch { /* déconnexion locale quand même */ } setSession(null); },
  /** Vérifie la session stockée ; une panne réseau la conserve (mode hors connexion). */
  async refresh() {
    if (!current) return;
    try { const { user } = await api('GET', '/auth/user'); if (current) setSession({ ...current, user }); }
    catch (error) { if (!(error instanceof ApiError) || error.status !== 0) throw error; }
  }
};
