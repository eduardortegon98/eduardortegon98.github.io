import { Navigate, useOutletContext } from 'react-router-dom';
import { Layers3 } from 'lucide-react';
import { useLanguage } from '../i18n/Language';
import { availableModules } from './modules';
import Portal from './Portal';
import './Account.css';
export default function PortalHome(){
 const {role,modules=[]}=useOutletContext();
 const {language}=useLanguage(),en=language==='en';
 if(role==='super_admin')return <Portal/>;
 const first=availableModules(role,modules)[0];
 if(first)return <Navigate to={first.path} replace/>;
 return <section className="client-empty-workspace"><span><Layers3 size={30}/></span><h1>{en?'Your workspace is getting ready':'Estamos preparando tu espacio'}</h1><p>{en?'Your enabled modules will appear here when your administrator assigns them.':'Tus módulos aparecerán aquí cuando tu administrador los habilite.'}</p></section>;
}
