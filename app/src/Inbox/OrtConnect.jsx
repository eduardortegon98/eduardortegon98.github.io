import { useState } from 'react';
import {useLanguage} from '../i18n/Language';
import { CalendarDays, MessagesSquare } from 'lucide-react';
import Inbox from './Inbox.jsx';
import MeetingPanel from './MeetingPanel.jsx';

export default function OrtConnect() {
  const [tab,setTab]=useState('messages');
  const {language}=useLanguage(); const en=language==='en';
  return <section className="ortconnect-workspace">
    <nav className="ortconnect-tabs" aria-label={en?"OrtConnect sections":"Secciones de OrtConnect"}>
      <button aria-selected={tab==='messages'} onClick={()=>setTab('messages')}><MessagesSquare size={16}/{en?' Messages':' Mensajes'}</button>
      <button aria-selected={tab==='meetings'} onClick={()=>setTab('meetings')}><CalendarDays size={16}/{en?' Sales calendar':' Agenda comercial'}</button>
    </nav>
    {tab==='messages'?<Inbox/>:<MeetingPanel/>}
  </section>;
}
