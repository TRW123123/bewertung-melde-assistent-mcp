import {merkmale} from './regeln';
import {situationen} from './vorlagen';
export type Schema={type?:string;description?:string;examples?:unknown[];properties?:Record<string,Schema>;items?:Schema;required?:string[];additionalProperties?:boolean;enum?:readonly unknown[];maxLength?:number;minLength?:number;minimum?:number;exclusiveMinimum?:number;maximum?:number;maxItems?:number;minItems?:number;pattern?:string;default?:unknown};
// Kopie der Validierung aus car-listing-check, ergänzt um exclusiveMinimum und deutsche Fehlermeldungen.
export function validate(value:unknown,s:Schema,path='arguments'):void{
 if(s.type==='object'){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error(`${path} muss ein Objekt sein.`);
  const v=value as Record<string,unknown>;
  for(const k of s.required??[])if(!(k in v))throw Error(`${path}.${k} fehlt (Pflichtfeld).`);
  for(const [k,x] of Object.entries(v)){const child=s.properties&&Object.hasOwn(s.properties,k)?s.properties[k]:undefined;if(!child){if(s.additionalProperties===false)throw Error(`${path}: unbekanntes Feld ${k}.`);}else validate(x,child,`${path}.${k}`);}
 }else if(s.type==='array'){
  if(!Array.isArray(value)||value.length<(s.minItems??0)||value.length>(s.maxItems??Infinity))throw Error(`${path} muss eine Liste mit ${s.minItems??0} bis ${s.maxItems} Einträgen sein.`);
  value.forEach((x,i)=>s.items&&validate(x,s.items,`${path}[${i}]`));
 }else if(s.type==='string'){
  if(typeof value!=='string'||!value.trim()||Array.from(value).length>(s.maxLength??Infinity)||(s.pattern&&!new RegExp(s.pattern).test(value)))throw Error(`${path} muss ein nicht leerer Text sein (höchstens ${s.maxLength} Zeichen).`);
 }else if(s.type==='number'||s.type==='integer'){
  const lower=s.exclusiveMinimum!==undefined?`größer als ${s.exclusiveMinimum}`:`mindestens ${s.minimum}`;
  if(typeof value!=='number'||!Number.isFinite(value)||value<(s.minimum??-Infinity)||(s.exclusiveMinimum!==undefined&&value<=s.exclusiveMinimum)||value>(s.maximum??Infinity)||(s.type==='integer'&&!Number.isInteger(value)))throw Error(`${path} muss eine ${s.type==='integer'?'ganze Zahl':'Zahl'} sein, ${lower} und höchstens ${s.maximum}.`);
 }
 if(s.enum&&!s.enum.includes(value))throw Error(`${path} muss einer dieser Werte sein: ${s.enum.join(', ')}.`);
}
export const checkInput:Schema={type:'object',additionalProperties:false,required:['merkmale'],properties:{
 merkmale:{type:'array',minItems:1,maxItems:13,description:'Was auf die Rezension zutrifft (ein oder mehrere Werte): kein_kundenkontakt, mitbewerber_oder_interessenkonflikt, anreiz_oder_gekauft, spam_werbung_links, beleidigung_vulgaer, hassrede, drohung_belaestigung, persoenliche_daten, unbelegte_straftat_vorwuerfe, off_topic, falschdarstellung, erpressung, sachlich_negativ.',examples:[['kein_kundenkontakt']],items:{type:'string',enum:merkmale,maxLength:40}}
}};
export const vorlageInput:Schema={type:'object',additionalProperties:false,required:['situation'],properties:{
 situation:{type:'string',description:'Art der Rezension: positiv, negativ_ungeklaert, negativ_unzufrieden, kein_kunde_gefunden, unsachlich_beleidigend, erpressung_verdacht.',examples:['kein_kunde_gefunden'],enum:situationen,maxLength:30},
 betrieb_name:{type:'string',description:'Optional: Name des Betriebs für die Grußzeile (max. 80 Zeichen, keine Links/Telefonnummern). Wird nicht gespeichert.',maxLength:80},
 unterzeichner:{type:'string',description:'Optional: Name oder Initialen für die Unterschrift (max. 60 Zeichen). Wird nicht gespeichert.',maxLength:60}
}};
