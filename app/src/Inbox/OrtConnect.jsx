import { useState } from 'react';
import { CalendarDays, MessagesSquare } from 'lucide-react';
import Inbox from './Inbox.jsx';
import MeetingPanel from './MeetingPanel.jsx';

export default function OrtConnect() {
  const [tab,setTab]=useState('messages');
  return <section className="ortconnect-workspace">
    <nav className="ortconnect-tabs" aria-label="Secciones de OrtConnect">
      <button aria-selected={tab==='messages'} onClick={()=>setTab('messages')}><MessagesSquare size={16}/> Mensajes</button>
      <button aria-selected={tab==='meetings'} onClick={()=>setTab('meetings')}><CalendarDays size={16}/> Agenda comercial</button>
    </nav>
    {tab==='messages'?<Inbox/>:<MeetingPanel/>}
  </section>;
}
