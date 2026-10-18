import { readSources, writeSources, removeSource } from './localKnowledge';
import { STO_CONTEXT_TEXT, STO_CONTEXT_VERSION } from './stoContext';
import { renderSTOEcosystemHTML } from './stoKnowledgeDocument';

// A single library record contains both an HTML visualization and the future Ortex context.
const SOURCE_ID='sto-ecosystem-strategy-v3';
const FLAG='ortdesk:knowledge:seeded:sto-ecosystem-v3';
const PREVIOUS=['sto-ecosystem-strategy-v1','sto-ecosystem-strategy-v2'];

export async function seedSTOEcosystem(owner){
 const key=FLAG+':'+owner;
 const current=await readSources(owner);
 if(localStorage.getItem(key)==='done')return current;
 const existing=current.find(s=>s.id===SOURCE_ID);
 const html=renderSTOEcosystemHTML();
 const content='# Ecosistema STO — Arquitectura y visión\nVersión: '+STO_CONTEXT_VERSION+'\n\n'+STO_CONTEXT_TEXT;
 if(!existing){
  const blob=new Blob([html],{type:'text/html;charset=utf-8'});
  const source={id:SOURCE_ID,title:'Ecosistema STO — Arquitectura, mapa y contexto.html',kind:'document',category:'business',origin:'own',originName:'',content,blob,size:blob.size,reviewed:false,createdAt:new Date().toISOString()};
  await writeSources(owner,[source]);
 }
 // Remove only obsolete automatic versions of this specific document, not user uploads.
 for(const old of current.filter(s=>PREVIOUS.includes(s.id)))await removeSource(owner,old.id);
 localStorage.setItem(key,'done');
 return readSources(owner);
}
