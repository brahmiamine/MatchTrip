import { describe, expect, it } from 'vitest';
import { applyFilters, buildOptions, defaultFilters } from '../src/lib/filters.js';
import { mk } from './helpers.js';

const rows = [
  mk({fixture_key:'fri',home:'PSG',away:'Lyon',date:'2026-12-25',time:'10:00',highlight:true}),
  mk({fixture_key:'sat',home:'Paris FC',away:'Rennes',date:'2026-12-26',time:'18:00'}),
  mk({fixture_key:'sun',home:'Lyon',away:'Marseille',zone:'Lyon',date:'2026-12-27',time:'19:00'}),
  ...['2026-12-28','2026-12-29','2026-12-30','2026-12-31'].map(date=>mk({fixture_key:date,home:'PSG',date,time:'15:00'})),
  mk({fixture_key:'next-fri',country:'Pays-Bas',zone:'Amsterdam / Alkmaar',league:'Eredivisie',home:'Ajax',away:'PSV',date:'2027-01-01',time:'14:00',highlight:true}),
  mk({fixture_key:'unverified-time',country:'Pays-Bas',zone:'Eindhoven / Tilburg',league:'Eredivisie',home:'PSV',away:'Ajax',date:'2027-01-02',time:'16:00',time_confirmed:false}),
  mk({fixture_key:'no-time',country:'Pays-Bas',zone:'Rotterdam / La Haye',league:'Eredivisie',home:'Feyenoord',away:'AZ Alkmaar',date:'2027-01-03',time:null,time_confirmed:false}),
  mk({fixture_key:'fri-sun-window',country:'Allemagne',zone:'Munich / Augsbourg',league:'Bundesliga',home:'Bayern Munich',away:'Schalke 04',date:'2027-01-02',time:null,provisional:true,date_confirmed:false,time_confirmed:false,date_window_start:'2027-01-01',date_window_end:'2027-01-03'}),
  mk({fixture_key:'fri-mon-window',country:'Espagne',zone:'Madrid',league:'LaLiga',home:'Real Madrid',away:'Alavés',date:'2027-01-03',time:null,provisional:true,date_confirmed:false,time_confirmed:false,date_window_start:'2027-01-01',date_window_end:'2027-01-04'}),
];
const run = (filters={},favorites=[])=>applyFilters(rows,{...defaultFilters(),...filters},favorites).map(r=>r.fixture_key);

describe('limites des week-ends et cumul des filtres',()=>{
  it('Tous couvre uniquement vendredi, samedi, dimanche et les fenêtres entièrement comprises dans ces jours',()=>{
    expect(run()).toEqual(['fri','sat','sun','next-fri','unverified-time','no-time','fri-sun-window']);
  });
  it('un week-end choisi ne capture aucun des quatre jours de semaine suivants',()=>{
    expect(run({weekends:['2026-12-26']})).toEqual(['fri','sat','sun']);
    expect(run({weekends:['2027-01-02']})).toEqual(['next-fri','unverified-time','no-time','fri-sun-window']);
  });
  it('plusieurs week-ends se cumulent et une exclusion garde priorité',()=>{
    expect(run({weekends:['2026-12-26','2027-01-02'],excluded:['2026-12-26']})).toEqual(['next-fri','unverified-time','no-time','fri-sun-window']);
    expect(run({weekends:['2026-12-26'],excluded:['2026-12-26']})).toEqual([]);
  });
  it.each([
    [{countries:['France'],zones:['Paris']},['fri','sat']],
    [{countries:['France','Pays-Bas'],clubs:['Ajax','PSG']},['fri','next-fri']],
    [{leagues:['Eredivisie'],day:'vendredi'},['next-fri']],
    [{search:'MARSEILLÉ'},['sun']],
    [{day:'samedi'},['sat','unverified-time']],
    [{day:'dimanche'},['sun','no-time']],
    [{dateFrom:'2027-01-01',dateTo:'2027-01-03'},['next-fri','unverified-time','no-time','fri-sun-window']],
    [{dateFrom:'2027-01-03',dateTo:'2027-01-02'},['unverified-time','no-time']],
    [{slot:'day'},['fri','next-fri']],
    [{slot:'evening'},['sat','sun']],
    [{slot:'unknown'},['unverified-time','no-time','fri-sun-window']],
    [{timeFrom:'10:00',timeTo:'19:00'},['fri','sat','next-fri']],
    [{timeFrom:'19:00',timeTo:'19:00'},[]],
    [{onlyHighlights:true},['fri','next-fri']],
    [{onlyCertain:true},['fri','sat','sun','next-fri']],
    [{countries:['Pays-Bas'],clubs:['PSV'],slot:'unknown'},['unverified-time']],
    [{countries:['Pays-Bas'],clubs:['PSV'],slot:'unknown',timeFrom:'10:00'},[]],
  ])('respecte les contraintes %j', (filters,expected)=>expect(run(filters)).toEqual(expected));
  it('les favoris restent soumis aux jours et aux autres critères',()=>{
    expect(run({onlyFav:true},['fri','2026-12-28','unverified-time'])).toEqual(['fri','unverified-time']);
    expect(run({onlyFav:true,onlyCertain:true},['fri','unverified-time'])).toEqual(['fri']);
  });
  it('ne propose aucun week-end provenant uniquement d’un jour de semaine ou d’une fenêtre jusqu’au lundi',()=>{
    const ineligible=rows.filter(r=>['2026-12-28','fri-mon-window'].includes(r.fixture_key));
    expect(buildOptions(ineligible,defaultFilters()).weekends).toEqual([]);
  });
});
