import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Compass, Filter, Heart, MapPin, RotateCcw, Search, SlidersHorizontal, Sparkles, Star, Ticket, X } from 'lucide-react';
import { loadFixtures, configured } from './lib/api';

const FLAGS = { France: '🇫🇷', Belgique: '🇧🇪', 'Pays-Bas': '🇳🇱', Espagne: '🇪🇸', Italie: '🇮🇹' };
const START = '2026-10-17', END = '2026-12-31';
const EXCLUDED_DEFAULT = ['2026-10-31', '2026-11-07'];
const COLLATOR = new Intl.Collator('fr', { sensitivity: 'base' });
const fmtDay = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
const fmtFull = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' });
const timestamp = date => Date.parse(date + 'T12:00:00Z');
const getWeekend = date => {
  const d = new Date(date + 'T12:00:00Z');
  const weekday = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - (weekday === 0 ? 1 : weekday === 6 ? 0 : (weekday + 1) % 7));
  return d.toISOString().slice(0, 10);
};
const nextDate = date => { const d = new Date(date + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };
const formatDay = date => fmtDay.format(new Date(date + 'T12:00:00Z')).replace('.', '');
const formatFull = date => fmtFull.format(new Date(date + 'T12:00:00Z'));
const formatTime = time => time ? time.slice(0, 5).replace(':', 'h') : 'À confirmer';
const clamp = s => String(s ?? '').toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const restore = (key, fallback) => { try { const v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : fallback; } catch { return fallback; } };
const countrySort = ['France', 'Belgique', 'Pays-Bas', 'Espagne', 'Italie'];
const toggleItem = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
const valueList = (list) => [...new Set(list)].sort(COLLATOR.compare);
const Block = ({ label, values, chosen, onToggle, emptyText }) => (
  <details className="multi-select">
    <summary><span>{label}</span><span className="multi-value">{chosen.length ? chosen.length + ' sélectionné' + (chosen.length > 1 ? 's' : '') : (emptyText || 'Tous')}</span><ChevronDown size={15}/></summary>
    <div className="multi-options">
      {values.length ? values.map(v => <label key={v} className="check-option"><input type="checkbox" checked={chosen.includes(v)} onChange={() => onToggle(v)} /><span>{v}</span></label>) : <p className="muted">Aucune option</p>}
    </div>
  </details>
);

export default function App() {
  const [all, setAll] = useState([]);
  const [origin, setOrigin] = useState('chargement');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [zones, setZones] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState(START);
  const [dateTo, setDateTo] = useState(END);
  const [month, setMonth] = useState('all');
  const [day, setDay] = useState('all');
  const [slot, setSlot] = useState('all');
  const [onlyHighlights, setOnlyHighlights] = useState(false);
  const [onlyCertain, setOnlyCertain] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);
  const [excluded, setExcluded] = useState(() => restore('matchtrip-blocked', EXCLUDED_DEFAULT));
  const [favorites, setFavorites] = useState(() => restore('matchtrip-favorites', []));
  const [view, setView] = useState('weekends');
  const [sort, setSort] = useState('asc');
  const [group, setGroup] = useState('date');
  const [pageLimit, setPageLimit] = useState(40);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { let active = true; loadFixtures().then(x => { if(active){setAll(x.fixtures); setOrigin(x.origin); setError(x.error || ''); setLoading(false);} }); return () => { active = false; }; }, []);
  useEffect(() => { try { localStorage.setItem('matchtrip-favorites', JSON.stringify(favorites)); } catch {} }, [favorites]);
  useEffect(() => { try { localStorage.setItem('matchtrip-blocked', JSON.stringify(excluded)); } catch {} }, [excluded]);
  useEffect(() => { setPageLimit(40); }, [countries,zones,clubs,leagues,search,dateFrom,dateTo,month,day,slot,onlyHighlights,onlyCertain,onlyFav,excluded,view,sort,group]);

  const allCountries = countrySort.filter(c => all.some(x => x.country === c));
  const availableZones = valueList(all.filter(x => !countries.length || countries.includes(x.country)).map(x => x.zone));
  const availableClubs = valueList(all.filter(x => (!countries.length || countries.includes(x.country)) && (!zones.length || zones.includes(x.zone))).map(x => x.home));
  const availableLeagues = valueList(all.map(x => x.league));

  const filtered = useMemo(() => all.filter(m => {
    if (countries.length && !countries.includes(m.country)) return false;
    if (zones.length && !zones.includes(m.zone)) return false;
    if (clubs.length && !clubs.includes(m.home)) return false;
    if (leagues.length && !leagues.includes(m.league)) return false;
    if (search && !clamp([m.home,m.away,m.country,m.zone,m.city,m.league].join(' ')).includes(clamp(search))) return false;
    if (m.date < dateFrom || m.date > dateTo) return false;
    if (month !== 'all' && m.date.slice(5,7) !== month) return false;
    if (day !== 'all' && (new Date(m.date + 'T12:00:00Z').getUTCDay() === 6 ? 'samedi' : 'dimanche') !== day) return false;
    if (slot === 'day' && (!m.time || m.time.slice(0,5) >= '18:00')) return false;
    if (slot === 'evening' && (!m.time || m.time.slice(0,5) < '18:00')) return false;
    if (slot === 'unknown' && m.time) return false;
    if (onlyHighlights && !m.highlight) return false;
    if (onlyCertain && (m.provisional || !m.time)) return false;
    if (onlyFav && !favorites.includes(m.fixture_key)) return false;
    if (excluded.includes(getWeekend(m.date))) return false;
    return true;
  }), [all,countries,zones,clubs,leagues,search,dateFrom,dateTo,month,day,slot,onlyHighlights,onlyCertain,onlyFav,favorites,excluded]);

  const ordered = useMemo(() => [...filtered].sort((a,b) => {
    if(sort === 'highlights') return Number(b.highlight)-Number(a.highlight) || timestamp(a.date)-timestamp(b.date);
    return (sort==='desc' ? -1 : 1) * (timestamp(a.date)-timestamp(b.date) || (a.time||'99').localeCompare(b.time||'99'));
  }),[filtered,sort]);
  const grouped = useMemo(() => {
    const map = new Map();
    ordered.forEach(m => { const k = group === 'date' ? m.date : m.country + ' / ' + m.zone; if(!map.has(k))map.set(k,[]); map.get(k).push(m); });
    return [...map.entries()];
  },[ordered,group]);

  const weekends = useMemo(() => {
    const map = new Map();
    filtered.forEach(m => {
      if (!m.cluster) return;
      const weekend = getWeekend(m.date);
      const k = m.country + '|' + m.cluster + '|' + weekend;
      if (!map.has(k)) map.set(k,{weekend,cluster:m.cluster,country:m.country,items:[], zones:new Set()});
      map.get(k).items.push(m); map.get(k).zones.add(m.zone);
    });
    return [...map.values()].map(w => {
      const items = w.items.sort((a,b) => a.date.localeCompare(b.date) || (a.time||'99').localeCompare(b.time||'99'));
      const pairs = [];
      for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
        const a=items[i],b=items[j];
        // Durée de match / déplacement non garantie : créneaux identiques exclus.
        if(a.date !== b.date || (a.time && b.time && Math.abs(parseInt(a.time)*60+parseInt(a.time.slice(3))-parseInt(b.time)*60-parseInt(b.time.slice(3))) >= 240)) pairs.push([a,b]);
      }
      return {...w,items,zones:[...w.zones],pairs,score:items.filter(x=>x.highlight).length*10+items.length};
    }).filter(w => w.pairs.length > 0).sort((a,b) => sort==='desc' ? b.weekend.localeCompare(a.weekend) : sort==='highlights' ? b.score-a.score || a.weekend.localeCompare(b.weekend) : a.weekend.localeCompare(b.weekend) || b.score-a.score);
  },[filtered,sort]);

  const reset = () => { setCountries([]);setZones([]);setClubs([]);setLeagues([]);setSearch('');setDateFrom(START);setDateTo(END);setMonth('all');setDay('all');setSlot('all');setOnlyHighlights(false);setOnlyCertain(false);setOnlyFav(false);setExcluded(EXCLUDED_DEFAULT); };
  const setCountry = c => { setCountries(p=>toggleItem(p,c)); setZones([]);setClubs([]); };
  const setZone = z => {setZones(p=>toggleItem(p,z));setClubs([]);};
  const showWeekend = w => {
    setCountries([w.country]);setZones(w.zones);setClubs([]);setDateFrom(w.weekend);setDateTo(nextDate(w.weekend));setExcluded(p=>p.filter(x=>x!==w.weekend));setView('matches');
    window.scrollTo({top:0,behavior:'smooth'});
  };
  const filterCount = [countries,zones,clubs,leagues].filter(x=>x.length).length + [search,month!=='all',day!=='all',slot!=='all',onlyHighlights,onlyCertain,onlyFav].filter(Boolean).length;

  return <div className="app">
    <header className="topbar"><div className="wrap topbar-inner">
      <div className="logo"><span className="logo-icon">✦</span><span>match<span className="logo-accent">trip</span><small>FOOTBALL WEEKEND FINDER</small></span></div>
      <div className="top-actions"><span className="top-origin"><span className="live-dot"/>{origin === 'Supabase' ? 'Connecté à Supabase' : 'Catalogue 2026'}</span><a className="github-link" href="https://github.com/brahmiamine/matches" target="_blank" rel="noreferrer"><ArrowUpRight size={15}/> GitHub</a></div>
    </div></header>

    <main className="wrap">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> PLANIFIEZ VOTRE PROCHAIN DÉPLACEMENT</div>
        <h1>Le foot donne<br/><em>une destination.</em></h1>
        <p>Une seule interface pour dénicher les plus belles affiches en Europe. Combinez les filtres, repérez les week-ends et choisissez votre prochain stade.</p>
        <div className="hero-meta"><span><MapPin size={15}/> Départ : Paris</span><span><CalendarDays size={15}/> Oct. — Déc. 2026</span></div>
      </div><div className="hero-decor"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><span className="decor-ball">⚽</span><div className="decor-tag"><span>5 PAYS</span><strong>1 PASSION.</strong></div></div></section>
      <div className="stats">
        <div><span className="stat-number">{all.length}</span><span className="stat-caption">matchs en catalogue</span></div>
        <div><span className="stat-number">{new Set(all.map(m=>m.country)).size}</span><span className="stat-caption">pays à explorer</span></div>
        <div><span className="stat-number">{new Set(all.map(m=>m.zone)).size}</span><span className="stat-caption">zones de destination</span></div>
        <div className="stat-result"><span className="stat-number">{filtered.length}</span><span className="stat-caption">matchs selon vos critères</span></div>
      </div>

      <div className="content-grid">
        <aside className={'sidebar ' + (filtersOpen?'sidebar-open':'')}>
          <div className="sidebar-head"><div><SlidersHorizontal size={19}/><h2>Vos critères</h2></div><button className="reset" onClick={reset}><RotateCcw size={14}/> Réinitialiser</button></div>
          <div className="filters-body">
            <div className="field"><label>Recherche libre</label><div className="search-field"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Club, adversaire, ville…"/>{search&&<button aria-label="Effacer" onClick={()=>setSearch('')}><X size={15}/></button>}</div></div>
            <div className="field"><label>Pays <span className="field-count">choix multiples</span></label><div className="country-grid">{allCountries.map(c=><button className={'country-chip '+(countries.includes(c)?'selected':'')} key={c} onClick={()=>setCountry(c)}><span>{FLAGS[c]}</span>{c}{countries.includes(c)&&<Check size={13}/>}</button>)}</div></div>
            <div className="field"><label>Destinations et clubs</label><Block label="Zones géographiques" values={availableZones} chosen={zones} onToggle={setZone}/><Block label="Clubs à domicile" values={availableClubs} chosen={clubs} onToggle={c=>setClubs(p=>toggleItem(p,c))}/><Block label="Compétitions" values={availableLeagues} chosen={leagues} onToggle={l=>setLeagues(p=>toggleItem(p,l))}/></div>
            <div className="line"/>
            <div className="field"><label>Période</label><div className="date-row"><div><span>Du</span><input type="date" min={START} max={END} value={dateFrom} onChange={e=>setDateFrom(e.target.value || START)}/></div><div><span>Au</span><input type="date" min={START} max={END} value={dateTo} onChange={e=>setDateTo(e.target.value || END)}/></div></div></div>
            <div className="field"><label>Mois</label><div className="segment">{[['all','Tous'],['10','Oct.'],['11','Nov.'],['12','Déc.']].map(([k,n])=><button key={k} className={month===k?'active':''} onClick={()=>setMonth(k)}>{n}</button>)}</div></div>
            <div className="field"><label>Jour du match</label><div className="segment">{[['all','Tous'],['samedi','Samedi'],['dimanche','Dimanche']].map(([k,n])=><button key={k} className={day===k?'active':''} onClick={()=>setDay(k)}>{n}</button>)}</div></div>
            <div className="field"><label>Horaire</label><select className="native-select" value={slot} onChange={e=>setSlot(e.target.value)}><option value="all">Tous les horaires</option><option value="day">Avant 18h</option><option value="evening">À partir de 18h</option><option value="unknown">Heure non confirmée</option></select></div>
            <div className="line"/>
            <div className="field"><label>Préférences</label><label className="switch-row"><span><Star size={16}/> Grandes affiches uniquement</span><input type="checkbox" checked={onlyHighlights} onChange={e=>setOnlyHighlights(e.target.checked)}/></label><label className="switch-row"><span><Check size={16}/> Date et heure confirmées*</span><input type="checkbox" checked={onlyCertain} onChange={e=>setOnlyCertain(e.target.checked)}/></label><label className="switch-row"><span><Heart size={16}/> Mes favoris</span><input type="checkbox" checked={onlyFav} onChange={e=>setOnlyFav(e.target.checked)}/></label></div>
            <div className="field"><label>Week-ends indisponibles</label><div className="blocked-grid">{EXCLUDED_DEFAULT.map((d,i)=><label className="blocked-option" key={d}><input type="checkbox" checked={excluded.includes(d)} onChange={()=>setExcluded(p=>toggleItem(p,d))}/><span>{i===0?'31 oct. – 1 nov.':'7 – 8 novembre'}</span></label>)}</div><p className="hint">Les matchs de ces week-ends seront masqués. Décochez pour les afficher.</p></div>
            <p className="hint">* Signifie ici « non marqué provisoire et avec un horaire fourni ». Vérifiez toujours sur le site du club.</p>
          </div>
        </aside>

        <section className="results">
          {error && <div className="warning"><span>⚠</span>{error}</div>}
          {!configured && <div className="notice"><span className="notice-icon">i</span><div><strong>Mode catalogue autonome</strong><p>Données initiales du 13 octobre 2026. La connexion à un projet Supabase dédié peut être activée ultérieurement.</p></div></div>}
          <div className="results-title"><div><div className="section-eyebrow">EXPLOREZ LES POSSIBILITÉS</div><h2>Votre prochain week-end <span>commence ici.</span></h2></div><div className="results-count">{filtered.length} matchs</div></div>
          <div className="views-row"><div className="view-tabs"><button className={view==='weekends'?'active':''} onClick={()=>setView('weekends')}><Compass size={16}/> Combinaisons</button><button className={view==='matches'?'active':''} onClick={()=>setView('matches')}><CalendarDays size={16}/> Tous les matchs</button></div><div className="sort-wrap"><span>Trier</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="asc">Date ↑</option><option value="desc">Date ↓</option><option value="highlights">Affiches marquantes</option></select></div></div>
          <div className="active-filters"><span className="active-label"><Filter size={14}/> Filtres actifs :</span>{filterCount===0?<span className="filter-placeholder">Tous les critères</span>: <><span className="applied-count">{filterCount} personnalisé{filterCount>1?'s':''}</span><button onClick={reset}>Tout effacer <X size={13}/></button></>}{excluded.length>0&&<span className="excluded-label">{excluded.length} week-end(s) exclu(s)</span>}</div>

          {loading?<div className="empty"><div className="spinner"/><h3>Chargement des matchs…</h3></div>:view==='weekends'?<>
            <div className="section-intro"><Sparkles size={16}/><span>Des week-ends avec <strong>au moins deux matchs compatibles sur le papier</strong> dans une même zone de voyage. Temps de trajet et billets à vérifier.</span></div>
            {weekends.length===0?<Empty reset={reset}/>:<div className="weekends-grid">{weekends.slice(0,pageLimit).map(w=><article className="weekend-card" key={w.country+w.cluster+w.weekend}><div className="weekend-top"><span className="country-small">{FLAGS[w.country]} {w.country}</span><span className="weekend-count">{w.items.length} matchs</span></div><h3>{w.cluster}</h3><div className="weekend-date"><CalendarDays size={15}/>{formatFull(w.weekend)} — {formatFull(nextDate(w.weekend))}</div><div className="weekend-events">{w.items.slice(0,4).map(m=><div className="weekend-event" key={m.fixture_key}><span className="weekend-event-day">{new Date(m.date+'T12:00:00Z').getUTCDay()===6?'SAM':'DIM'}</span><div><strong>{m.home} <span>—</span> {m.away}</strong><small>{formatTime(m.time)}{m.provisional?' · Date provisoire':''}</small></div>{m.highlight&&<Star size={14} fill="currentColor" className="tiny-star"/>}</div>)}{w.items.length>4&&<span className="extra-matches">+ {w.items.length-4} autres matchs</span>}</div><button className="primary-card-button" onClick={()=>showWeekend(w)}>Examiner ce week-end <ArrowRight size={17}/></button></article>)}</div>}
            {weekends.length>pageLimit&&<button className="load-more" onClick={()=>setPageLimit(p=>p+30)}>Voir plus de week-ends <ArrowDown size={16}/></button>}
          </>:<>
            <div className="list-toolbar"><div>{ordered.length} rencontres correspondent à votre recherche</div><div className="sort-wrap"><span>Regrouper</span><select value={group} onChange={e=>setGroup(e.target.value)}><option value="date">Par date</option><option value="zone">Par destination</option></select></div></div>
            {ordered.length===0?<Empty reset={reset}/>:<div className="match-groups">{grouped.map(([key,ms])=><div className="match-group" key={key}><div className="group-title"><span>{group==='date'?formatDay(key):key}</span><small>{ms.length} match{ms.length>1?'s':''}</small></div>{ms.map(m=><div key={m.fixture_key} className={'match-row '+(m.highlight?'featured':'')}><div className="club-mark">{m.home.slice(0,2).toUpperCase()}</div><div className="match-details"><div className="match-teams"><strong>{m.home}</strong><span>vs</span><strong>{m.away}</strong></div><div className="match-sub"><span>{FLAGS[m.country]} {m.zone}</span><span className="dot-sep">·</span><span>{m.league}</span>{m.highlight&&<span className="hot-label"><Star size={11}/> Affiche</span>}</div></div><div className="match-right"><span className="time">{formatTime(m.time)}</span><span className={'reliability '+(m.provisional?'uncertain':'')}>{m.provisional?'Date provisoire':'À vérifier'}</span></div><div className="match-actions"><button title={favorites.includes(m.fixture_key)?'Retirer des favoris':'Ajouter aux favoris'} aria-label="Ajouter aux favoris" className={favorites.includes(m.fixture_key)?'is-fav':''} onClick={()=>setFavorites(p=>toggleItem(p,m.fixture_key))}><Heart size={17} fill={favorites.includes(m.fixture_key)?'currentColor':'none'}/></button><a title="Calendrier officiel" aria-label="Calendrier officiel" target="_blank" rel="noreferrer" href={m.source_url}><ArrowUpRight size={17}/></a></div></div>)}</div>)}</div>}
            {ordered.length>pageLimit&&<button className="load-more" onClick={()=>setPageLimit(p=>p+40)}>Afficher d'autres matchs <ArrowDown size={16}/></button>}
          </>}
        </section>
      </div>
      <footer><div className="footer-logo">match<span>trip</span></div><div>Les matchs peuvent être reportés ou reprogrammés. Vérifiez billets, transports et horaires avant de réserver.</div><a href="https://github.com/brahmiamine/matches" target="_blank" rel="noreferrer">Code source <ArrowUpRight size={14}/></a></footer>
    </main>
    <button className="mobile-filter" onClick={()=>setFiltersOpen(p=>!p)}>{filtersOpen?<X size={18}/>:<SlidersHorizontal size={18}/>} {filtersOpen?'Fermer les filtres':'Filtres'}{filterCount>0&&<span>{filterCount}</span>}</button>
  </div>;
}
function Empty({reset}) {return <div className="empty"><div className="empty-icon"><Search size={28}/></div><h3>Aucun résultat pour ces critères</h3><p>Essayez un autre pays, une autre date ou réactivez les week-ends exclus.</p><button onClick={reset}><RotateCcw size={15}/> Réinitialiser les filtres</button></div>}
