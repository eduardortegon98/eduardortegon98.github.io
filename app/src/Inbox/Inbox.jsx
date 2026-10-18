import { Navigate, useOutletContext } from 'react-router-dom';
import RegisteredMessages from './RegisteredMessages';
export default function Inbox(){
 const {role,modules=[]}=useOutletContext();
 if(role!=='super_admin'&&!modules.includes('messages'))return <Navigate to="/panel" replace/>;
 return <RegisteredMessages admin={role==='super_admin'}/>;
}
