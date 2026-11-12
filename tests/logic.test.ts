import {describe,it,expect} from 'vitest';
import {checkMeldung} from '../src/logic';
import {getAntwortVorlage,situationen} from '../src/vorlagen';
import {merkmale,regeln,Q,STAND} from '../src/regeln';
import {validate,checkInput,vorlageInput} from '../src/schema';
describe('Melde-Checkliste',()=>{
 it.each([[['kein_kundenkontakt'],'meldung_kann_sinn_haben'],[['spam_werbung_links','beleidigung_vulgaer'],'meldung_kann_sinn_haben'],[['sachlich_negativ'],'meldung_eher_nicht_sinnvoll'],[['erpressung'],'erpressung_sonderweg'],[['erpressung','kein_kundenkontakt'],'erpressung_sonderweg']] as const)('%j → %s',(m,e)=>expect(checkMeldung({merkmale:[...m]}).einschaetzung).toBe(e));
 it('jedes Merkmal hat Google-Kategorie und Google-Quelle',()=>{expect(Object.keys(regeln)).toEqual([...merkmale]);for(const k of merkmale){expect(regeln[k].google_kategorie.length).toBeGreaterThan(3);expect(regeln[k].quelle.startsWith('https://support.google.com/')).toBe(true);}});
 it('Erpressung: nicht zahlen, Beweise sichern, Formular-Link',()=>{const r=checkMeldung({merkmale:['erpressung']});const s=r.naechste_schritte.join(' ');expect(s).toContain('Nicht zahlen');expect(s).toContain('Beweise');expect(s).toContain(Q.erpressungFormular.url);expect(r.quellen.map(q=>q.url)).toContain(Q.erpressung.url);});
 it('sachlich negativ: Google rät vom Melden ab',()=>{const r=checkMeldung({merkmale:['sachlich_negativ']});expect(r.begruendung).toContain('nicht gegen die Richtlinien');expect(r.treffer[0].google_sagt).toContain('sachlich korrekt');});
 it('Mischung aus sachlich und Verstoß wird markiert, Duplikate entfernt',()=>{const r=checkMeldung({merkmale:['sachlich_negativ','off_topic','off_topic']});expect(r.hinweis_mischung).toContain('Achtung');expect(r.treffer).toHaveLength(2);});
 it('Meldeschritte, Einspruch und Verbote aus der Google-Hilfe',()=>{const r=checkMeldung({merkmale:['kein_kundenkontakt']});expect(r.naechste_schritte.join(' ')).toContain('einmalig');expect(r.nicht_tun.join(' ')).toContain('Anreize');expect(r.hinweis).toContain('Keine Rechtsberatung');expect(r.stand).toBe(STAND);});
 it('leere Liste wird abgelehnt',()=>expect(()=>checkMeldung({merkmale:[]})).toThrow(/Mindestens/));
});
describe('Antwort-Vorlagen',()=>{
 it('jede Situation liefert Vorlage ohne Schuldeingeständnis oder Fälschungsvorwurf',()=>{for(const s of situationen){const v=getAntwortVorlage({situation:s});expect(v.vorlagen.length).toBeGreaterThan(0);const t=v.vorlagen.join(' ').toLowerCase();for(const bad of ['unser fehler','wir haben einen fehler','schuld','fake','gefälscht','lüge','lügen','anwalt','rabatt','gutschein','kostenlos'])expect(t).not.toContain(bad);expect(v.kein_schuldeingestaendnis).toContain('keine Vorwürfe');expect(v.quellen.every(q=>q.url.startsWith('https://support.google.com/'))).toBe(true);}});
 it('Grußzeile mit Name und Betrieb, sonst Platzhalter',()=>{expect(getAntwortVorlage({situation:'positiv',betrieb_name:'Malerbetrieb Muster',unterzeichner:'M. Muster'}).vorlagen[0]).toContain('M. Muster – Malerbetrieb Muster');expect(getAntwortVorlage({situation:'positiv'}).vorlagen[0]).toContain('[Ihr Name / Ihr Betrieb]');});
 it.each(['https://x.de','info@x.de','<b>x</b>','Tel 0123 456789'])('lehnt %s in der Grußzeile ab',bad=>expect(()=>getAntwortVorlage({situation:'positiv',betrieb_name:bad})).toThrow());
 it('Erpressung nennt Formular, Tipps nennen Google-Prüfzeit',()=>{const v=getAntwortVorlage({situation:'erpressung_verdacht'});expect(v.quellen.map(q=>q.url)).toContain(Q.erpressungFormular.url);expect(v.antwort_tipps.join(' ')).toContain('30 Tage');});
});
describe('Schema',()=>{
 it.each([[{merkmale:['spam_werbung_links']}],[{merkmale:['erpressung','hassrede']}]])('akzeptiert %j',a=>expect(()=>validate(a,checkInput)).not.toThrow());
 it.each([[{}],[{merkmale:[]}],[{merkmale:'spam'}],[{merkmale:['quatsch']}],[{merkmale:['spam_werbung_links'],x:1}],[{merkmale:Array(14).fill('hassrede')}]])('lehnt %j ab',a=>expect(()=>validate(a,checkInput)).toThrow());
 it.each([[{}],[{situation:'neutral'}],[{situation:'positiv',betrieb_name:'x'.repeat(81)}],[{situation:'positiv',kontakt:'x'}]])('Vorlage lehnt %j ab',a=>expect(()=>validate(a,vorlageInput)).toThrow());
});
