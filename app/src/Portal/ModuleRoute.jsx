import { Navigate, useOutletContext } from 'react-router-dom';
import { moduleById } from './modules';
export default function ModuleRoute({id}){
 const {role,modules=[]}=useOutletContext(),module=moduleById.get(id);
 if(!module||(role!=='super_admin'&&!modules.includes(id)))return <Navigate to="/panel" replace/>;
 const Component=module.component;return <Component/>;
}
