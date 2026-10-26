import { lazy } from 'react';
import { brandName } from './portalBrands';
import { MessagesSquare, PawPrint, BrainCircuit, Globe2 } from 'lucide-react';
// One registration per implemented module. Routes, navigation and landing use this registry.
export const portalModules=[
 {id:'messages',path:'/panel/mensajes',label:{es:brandName('messages'),en:brandName('messages')},category:'communications',categoryLabel:{es:'Comunicaciones',en:'Communications'},tag:'Beta',icon:MessagesSquare,component:lazy(()=>import('../Inbox/OrtConnect.jsx'))},
 {id:'arturito',path:'/panel/arturito',label:{es:brandName('arturito'),en:brandName('arturito')},category:'pets',categoryLabel:{es:'Mascotas',en:'Pets'},tag:'Beta',icon:PawPrint,component:lazy(()=>import('../Arturito/Arturito.jsx'))},
 {id:'ortdesk_ai',path:'/panel/ortdesk-ai',label:{es:brandName('ortdesk_ai'),en:brandName('ortdesk_ai')},category:'intelligence',categoryLabel:{es:'Inteligencia artificial',en:'Artificial intelligence'},tag:'Beta',icon:BrainCircuit,component:lazy(()=>import('../OrtDeskAI/OrtDeskAI.jsx'))},
 {id:'websites',path:'/panel/websites',label:{es:brandName('websites'),en:brandName('websites')},category:'web',categoryLabel:{es:'Sitios web',en:'Websites'},tag:'Beta',icon:Globe2,component:lazy(()=>import('../Websites/Websites.jsx'))}
];
export const moduleById=new Map(portalModules.map(module=>[module.id,module]));
export const availableModules=(role,ids=[])=>{const allowed=new Set(ids);return portalModules.filter(module=>role==='super_admin'||allowed.has(module.id));};
export const moduleTitle=(module,language)=>module.label[language]||module.label.es;
