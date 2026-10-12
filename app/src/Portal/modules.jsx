import { lazy } from 'react';
import { MessagesSquare, PawPrint, BrainCircuit } from 'lucide-react';
// One registration per implemented module. Routes, navigation and landing use this registry.
export const portalModules=[
 {id:'messages',path:'/panel/mensajes',label:{es:'Mensajes',en:'Messages'},category:'communications',categoryLabel:{es:'Comunicaciones',en:'Communications'},tag:'Demo',icon:MessagesSquare,component:lazy(()=>import('../Inbox/Inbox.jsx'))},
 {id:'arturito',path:'/panel/arturito',label:{es:'Arturito',en:'Arturito'},category:'pets',categoryLabel:{es:'Mascotas',en:'Pets'},tag:'Beta',icon:PawPrint,component:lazy(()=>import('../Arturito/Arturito.jsx'))},
 {id:'ortdesk_ai',path:'/panel/ortdesk-ai',label:{es:'ORTDESK.AI',en:'ORTDESK.AI'},category:'intelligence',categoryLabel:{es:'Inteligencia artificial',en:'Artificial intelligence'},tag:'Beta',icon:BrainCircuit,component:lazy(()=>import('../OrtDeskAI/OrtDeskAI.jsx'))}
];
export const moduleById=new Map(portalModules.map(module=>[module.id,module]));
export const availableModules=(role,ids=[])=>{const allowed=new Set(ids);return portalModules.filter(module=>role==='super_admin'||allowed.has(module.id));};
export const moduleTitle=(module,language)=>module.label[language]||module.label.es;
