import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '../i18n/Language';
import Inbox from './Inbox.jsx';
import Prospecting from '../Portal/Prospecting.jsx';

export default function OrtConnect() {
  const { role } = useOutletContext();
  const { language } = useLanguage();
  const [tab, setTab] = useState('messages');
  return <section>
    {role === 'super_admin' && <nav style={{display:'flex',gap:12,marginBottom:16}} aria-label="OrtConnect">
      <button type="button" aria-pressed={tab==='messages'} onClick={()=>setTab('messages')}>{language==='en'?'Messages':'Mensajes'}</button>
      <button type="button" aria-pressed={tab==='prospects'} onClick={()=>setTab('prospects')}>{language==='en'?'Prospecting and CRM':'Prospección y CRM'}</button>
    </nav>}
    {tab==='prospects' && role==='super_admin' ? <Prospecting/> : <Inbox/>}
  </section>;
}
