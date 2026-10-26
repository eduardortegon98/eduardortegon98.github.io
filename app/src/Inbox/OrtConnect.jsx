import { useSearchParams, useOutletContext } from 'react-router-dom';
import { MessagesSquare, Target, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/Language';
import Inbox from './Inbox.jsx';
import Prospecting from '../Portal/Prospecting.jsx';
import './OrtConnect.css';

export default function OrtConnect() {
  const { role } = useOutletContext();
  const { language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const en = language === 'en';
  const admin = role === 'super_admin';
  const tab = admin && params.get('vista') === 'prospectos' ? 'prospects' : 'messages';
  function select(next) {
    setParams(current => {
      const updated = new URLSearchParams(current);
      if (next === 'prospects') updated.set('vista', 'prospectos');
      else updated.delete('vista');
      return updated;
    });
  }
  return <section className="ortconnect-workspace">
    {admin && <div className="ortconnect-navigation">
      <div className="ortconnect-navigation-heading">
        <div><strong>{en?'OrtConnect workspace':'Centro de trabajo OrtConnect'}</strong><p>{en?'Choose where you want to work':'Selecciona la sección que quieres gestionar'}</p></div>
        <span className="ortconnect-navigation-current">{en?'Current section':'Sección actual'}: {tab==='prospects'?(en?'Prospecting':'Prospección'):(en?'Messages':'Mensajes')}</span>
      </div>
      <nav className="ortconnect-tabs" aria-label={en?'OrtConnect sections':'Secciones de OrtConnect'}>
        <button type="button" aria-current={tab==='messages'?'page':undefined} aria-pressed={tab==='messages'} className={tab==='messages'?'active':''} onClick={()=>select('messages')}>
          <span className="ortconnect-tab-icon"><MessagesSquare size={20}/></span><span className="ortconnect-tab-copy"><strong>{en?'Messages':'Mensajes'}</strong><small>{en?'Conversations and channels':'Conversaciones y canales'}</small></span><ArrowRight className="ortconnect-tab-arrow" size={17}/>
        </button>
        <button type="button" aria-current={tab==='prospects'?'page':undefined} aria-pressed={tab==='prospects'} className={tab==='prospects'?'active':''} onClick={()=>select('prospects')}>
          <span className="ortconnect-tab-icon"><Target size={20}/></span><span className="ortconnect-tab-copy"><strong>{en?'Prospecting and CRM':'Prospección y CRM'}</strong><small>{en?'Leads, opportunities and follow-ups':'Clientes potenciales y seguimientos'}</small></span><ArrowRight className="ortconnect-tab-arrow" size={17}/>
        </button>
      </nav>
    </div>}
    <div className="ortconnect-view" key={tab}>
      {tab==='prospects' ? <Prospecting/> : <Inbox/>}
    </div>
  </section>;
}
