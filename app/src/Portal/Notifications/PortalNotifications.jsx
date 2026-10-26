import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { loadQualifiedContacts } from '../contactStages';
import { loadWorkspace, saveWorkspace, storageKey } from '../../CRM/model';
import { commercialNotifications, mergeNotifications, notificationKey, readRegistry } from './notificationModel';
import {NotificationContext} from './NotificationContext';
export default function PortalNotifications({userId,role,admin,preview,children}){
  const [workspace,setWorkspace]=useState(()=>loadWorkspace(userId));
  const [registry,setRegistry]=useState(()=>readRegistry(userId,role));
  const [rows,setRows]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false),[clock,setClock]=useState(()=>new Date());
  const refresh=useCallback(async()=>{
    setWorkspace(loadWorkspace(userId));setRegistry(readRegistry(userId,role));
    if(!admin||preview){setRows([]);return;}
    setLoading(true);setError('');
    try{setRows(await loadQualifiedContacts(supabase));}catch{setError('contacts_unavailable');}
    finally{setLoading(false);}
  },[userId,role,admin,preview]);
  useEffect(()=>{
    refresh();
    function update(event){
      if(event.type==='storage'){
        if(event.key===storageKey(userId)||event.key===null)setWorkspace(loadWorkspace(userId));
        if(event.key===notificationKey(userId,role)||event.key===null)setRegistry(readRegistry(userId,role));
      }else if(event.detail?.userId===userId)setWorkspace(loadWorkspace(userId));
    }
    const tick=setInterval(()=>{if(document.visibilityState==='visible')setClock(new Date());},60000);
    window.addEventListener('storage',update);window.addEventListener('ortdesk:commercial-change',update);
    return()=>{clearInterval(tick);window.removeEventListener('storage',update);window.removeEventListener('ortdesk:commercial-change',update);};
  },[userId,role,refresh]);
  const items=useMemo(()=>preview?[]:mergeNotifications(admin?commercialNotifications(rows,workspace,clock):[],registry),[admin,preview,rows,workspace,registry,clock]);
  function persistRegistry(next){try{localStorage.setItem(notificationKey(userId,role),JSON.stringify(next));setRegistry(next);setError('');return true;}catch{setError('save_failed');return false;}}
  function markRead(ids){
    const wanted=new Set(ids);
    const crm=items.filter(item=>wanted.has(item.id)&&item.module==='commercial').map(item=>item.sourceId);
    try{if(crm.length){const current=loadWorkspace(userId);saveWorkspace(userId,{...current,read:[...new Set([...current.read,...crm])]});}}
    catch{setError('save_failed');return false;}
    return persistRegistry(readRegistry(userId,role).map(item=>wanted.has(item.id)?{...item,read:true}:item));
  }
  function publish(notification){
    if(preview||!notification?.id||!notification.title||!notification.path?.startsWith('/panel')||notification.id.startsWith('crm:'))return false;
    const current=readRegistry(userId,role),existing=current.find(item=>item.id===notification.id);
    return persistRegistry([{...notification,read:existing?.read||false,at:notification.at||new Date().toISOString()},...current.filter(item=>item.id!==notification.id)]);
  }
  return <NotificationContext.Provider value={{items,unread:items.filter(item=>!item.read).length,loading,error,refresh,markRead,publish,preview}}>{children}</NotificationContext.Provider>;
}
