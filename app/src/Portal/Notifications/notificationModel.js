import { reminders } from '../../CRM/model';
export const notificationKey=(userId,role)=>`ortdesk:notifications:v1:${userId}:${role}`;
export function readRegistry(userId,role){try{const value=JSON.parse(localStorage.getItem(notificationKey(userId,role))||'[]');return Array.isArray(value)?value:[];}catch{return [];}}
export function commercialNotifications(rows,workspace,at=new Date()){
  const allowed=new Set(rows.map(row=>row.id));
  const events=workspace.events.filter(item=>allowed.has(item.contactId));
  return [...events,...reminders(rows,workspace,at)].map(item=>({...item,id:'crm:'+item.id,sourceId:item.id,module:'commercial',read:workspace.read.includes(item.id),path:'/panel/comercial?contact='+encodeURIComponent(item.contactId)+'&section='+({action:'communications',payment:'payments',reply:'history',contract:'legal'}[item.kind]||'hiring')}));
}
export function mergeNotifications(commercial,registry){
  const items=new Map();
  for(const item of [...commercial,...registry])if(item?.id&&item.title&&typeof item.path==='string'&&item.path.startsWith('/panel')&&!item.path.startsWith('//'))items.set(item.id,item);
  return [...items.values()].sort((a,b)=>Number(a.read)-Number(b.read)||Number(!!b.overdue)-Number(!!a.overdue)||String(a.due||'9999').localeCompare(String(b.due||'9999')));
}
