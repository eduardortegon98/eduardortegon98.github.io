import { Navigate, useOutletContext } from 'react-router-dom';
import { Layers3 } from 'lucide-react';
import { useLanguage } from '../i18n/Language';
import Portal from './Portal';
import './Account.css';
export default function PortalHome(){
 const {role,modules=[]}=useOutletContext();
 const {language}=useLanguage(),en=language==='en';
 if(role==='super_admin')return <Portal/>;
 if(modules.includes('messages'))return <Navigate to="/panel/mensajes" replace/>;
 if(modules.includes('arturito'))return <Navigate to="/panel/arturito" replace/>;
 return <section className="client-empty-workspace"><span><Layers3 size={30}/></span><h1>{en?'Your workspace is getting ready':'Estamos preparando tu espacio'}</h1><p>{en?'Your enabled modules will appear here when your administrator assigns them.':'Tus módulos aparecerán aquí cuando tu administrador los habilite.'}</p></section>;
}
