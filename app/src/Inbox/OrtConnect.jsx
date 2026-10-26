import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MessagesSquare, Target } from 'lucide-react';
import { useLanguage } from '../i18n/Language';
import Inbox from './Inbox.jsx';
import Prospecting from '../Portal/Prospecting.jsx';
import './OrtConnect.css';

export default function OrtConnect() {
  const { role } = useOutletContext();
  const { language } = useLanguage();
  const [tab, setTab] = useState('messages');
  const en = language === 'en';
  return <section className="ortconnect-workspace">
    {role === 'super_admin' && <nav className="ortconnect-tabs" aria-label={en?'OrtConnect sections':'Secciones de OrtConnect'}>
      <button type="button" className={tab==='messages'?'active':''} aria-pressed={tab==='messages'} onClick={()=>setTab('messages')}><MessagesSquare size={17}/>{en?'Messages':'Mensajes'}</button>
      <button type="button" className={tab==='prospects'?'active':''} aria-pressed={tab==='prospects'} onClick={()=>setTab('prospects')}><Target size={17}/>{en?'Prospecting and CRM':'Prospección y CRM'}</button>
    </nav>}
    {tab==='prospects' && role==='super_admin' ? <Prospecting/> : <Inbox/>}
  </section>;
}
