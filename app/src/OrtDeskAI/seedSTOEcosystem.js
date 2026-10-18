import { readSources, writeSources } from './localKnowledge';
import { STO_CONTEXT_TEXT, STO_CONTEXT_VERSION } from './stoContext';

// Local-only administrative document. No backend, model calls or outbound requests.
const SOURCE_ID = 'sto-ecosystem-strategy-v2';
const FLAG = 'ortdesk:knowledge:seeded:sto-ecosystem-v2';
const OLD_SOURCE_ID = 'sto-ecosystem-strategy-v1';

export async function seedSTOEcosystem(owner) {
  const key = FLAG + ':' + owner;
  const current = await readSources(owner);
  if (localStorage.getItem(key) === 'done' || current.some(x => x.id === SOURCE_ID)) {
    localStorage.setItem(key, 'done');
    return current;
  }
  const content = '# Ecosistema STO — Arquitectura y visión\nVersión: '+STO_CONTEXT_VERSION+'\n\n'+STO_CONTEXT_TEXT;
  const source = {
    id:SOURCE_ID,
    title:'Ecosistema STO — Arquitectura y visión (HTML / contexto)',
    kind:'text',
    category:'business',
    origin:'own',
    originName:'',
    content,
    size:new Blob([content]).size,
    reviewed:false,
    createdAt:new Date().toISOString()
  };
  await writeSources(owner,[source]);
  localStorage.setItem(key,'done');
  // Preserve earlier locally saved information; remove nothing without user action.
  return [...current,{...source,owner}];
}
