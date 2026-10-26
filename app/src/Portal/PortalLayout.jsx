import { useState, Suspense } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Wallet, ExternalLink, LogOut, Menu, X, UserRound, UserCog, Users, Target } from 'lucide-react';
import ModuleNavigation from './ModuleNavigation';
import ModuleBrand from './ModuleBrand';
import { portalModules, moduleTitle } from './modules';
import { brandName } from './portalBrands';
import './Assignments.css';
import Access from './Access';
import PortalLoading from './PortalLoading';
import { supabase } from '../lib/supabase';
import { LanguageSwitch, useLanguage } from '../i18n/Language';
import './PortalLayout.css';
import './RolePreview.css';
import './Account.css';
import PortalNotifications from './Notifications/PortalNotifications';
import NotificationCenter from './Notifications/NotificationCenter';
import './GlobalHeader.css';
import './PortalTypography.css';
import './PortalModuleLayout.css';

export default function PortalLayout() {
  return <Access>{state => <Workspace key={state.user.id + state.role} state={state} />}</Access>;
}
function Workspace({ state }) {
  const { language } = useLanguage(), en = language === 'en';
  const [open, setOpen] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const realAdmin = state.role === 'super_admin';
  const [previewRole, setPreviewRole] = useState('super_admin');
  const actingRole = realAdmin ? previewRole : state.role;
  const admin = actingRole === 'super_admin';
  const preview = realAdmin && actingRole !== state.role;
  const modules = preview ? [] : (state.modules || []);
  const context = { ...state, modules, role: actingRole, realRole: state.role, preview };
  function changeRole(role) {
    if (!realAdmin || !['super_admin', 'client'].includes(role)) return;
    setPreviewRole(role); setOpen(false); navigate('/panel');
  }
  const activeModule=portalModules.find(module=>pathname===module.path||pathname.startsWith(module.path+'/'));
  const brandedSection = activeModule?.id || (pathname.startsWith('/panel/finanzas')?'finance':pathname.startsWith('/panel/comercial')?'commercial':pathname.startsWith('/panel/prospeccion')?'prospecting':pathname.startsWith('/panel/asignaciones')?'assignments':pathname.startsWith('/panel/analitica')||pathname==='/panel'&&admin?'analytics':null);
  const pageTitle = brandedSection ? brandName(brandedSection) : activeModule ? moduleTitle(activeModule,language) : pathname.startsWith('/panel/cuenta') ? (en?'My account':'Mi cuenta') : (en?'My workspace':'Mi espacio');
  async function logout() {
    setPending(true); setError('');
    try { const { error } = await supabase.auth.signOut(); if (error) throw error; }
    catch { setError(en ? 'Could not sign out. Try again.' : 'No pudimos cerrar sesión. Inténtalo nuevamente.'); }
    finally { setPending(false); }
  }
  return <PortalNotifications key={actingRole} userId={state.user.id} role={actingRole} admin={admin} preview={preview}><div className="admin-shell">
    <a href="#admin-content" className="admin-skip">{en ? 'Skip to content' : 'Ir al contenido'}</a>
    <aside className={'admin-sidebar' + (open ? ' is-open' : '')} id="admin-navigation">
      <Link to="/panel" className="admin-logo" onClick={() => setOpen(false)}><span>O.</span><div>Ortegón<small>{en ? 'Management portal' : 'Portal de gestión'}</small></div></Link>
      <p className="admin-nav-label">{en ? 'WORKSPACE' : 'ESPACIO DE TRABAJO'}</p>
      <nav aria-label={en ? 'Portal navigation' : 'Navegación del portal'}>
        {admin && <NavLink to="/panel/analitica" title={en?'Analytics':'Analítica'} onClick={() => setOpen(false)}><BarChart3 size={19}/><ModuleBrand id="analytics"/></NavLink>}
        {admin && <NavLink to="/panel/finanzas" title={en?'Personal finances':'Finanzas personales'} onClick={() => setOpen(false)}><Wallet size={19}/><ModuleBrand id="finance"/></NavLink>}
        {admin && <NavLink to="/panel/comercial" title={en?'Commercial management':'Gestión comercial'} onClick={() => setOpen(false)}><Users size={19}/><ModuleBrand id="commercial"/></NavLink>}
        {admin && <NavLink to="/panel/prospeccion" title={en?'Prospecting':'Prospección'} onClick={() => setOpen(false)}><Target size={19}/><span>Prospección</span></NavLink>}
        <ModuleNavigation role={actingRole} modules={modules} language={language} onNavigate={()=>setOpen(false)}/>
        {admin && <NavLink to="/panel/asignaciones" title={en?'Module assignments':'Asignación de módulos'} onClick={() => setOpen(false)}><UserCog size={19}/><ModuleBrand id="assignments"/></NavLink>}
      </nav>
      <div className="admin-sidebar-bottom"><Link to="/" className="admin-public-link"><ExternalLink size={17}/>{en ? 'View website' : 'Ver página web'}</Link><div className="admin-identity"><Link to="/panel/cuenta" className="account-profile-link" onClick={()=>setOpen(false)} aria-label={en?'Open my account':'Abrir mi cuenta'} title={en?'My account':'Mi cuenta'}><span className="admin-avatar">{state.user.email?.slice(0,1).toUpperCase() || 'O'}</span></Link><div><strong>{realAdmin ? (en ? 'Administrator' : 'Administrador') : (en ? 'Client' : 'Cliente')}</strong><span>{state.user.email}</span></div></div><button title={en ? 'Sign out' : 'Cerrar sesión'} aria-label={en ? 'Sign out' : 'Cerrar sesión'} className="admin-logout compact-action" onClick={logout} disabled={pending}><LogOut size={17} aria-hidden="true"/></button>{error && <p role="alert">{error}</p>}</div>
    </aside>
    <div className="admin-body"><header className="admin-topbar">
      <div className="admin-header-context"><button className="admin-menu" aria-controls="admin-navigation" aria-expanded={open} aria-label={en ? 'Toggle navigation' : 'Abrir o cerrar navegación'} onClick={() => setOpen(value => !value)}>{open ? <X size={20}/> : <Menu size={20}/>}</button><div className="admin-breadcrumb"><span className="admin-breadcrumb-eyebrow"><span className="admin-breadcrumb-dot" aria-hidden="true"/>Portal</span><h1 className="admin-current-section" title={pageTitle}>{brandedSection?<ModuleBrand id={brandedSection} dark/>:pageTitle}</h1></div></div>
      <div className="admin-top-actions">
        {realAdmin && <label className="admin-role-selector"><UserRound size={16} aria-hidden="true"/><span>{en ? 'Acting as' : 'Actuando como'}</span><select aria-label={en ? "Acting role" : "Rol activo"} value={actingRole} onChange={event => changeRole(event.target.value)}><option value="super_admin">Admin</option><option value="client">{en ? 'Client' : 'Cliente'}</option></select></label>}
        <div className="admin-header-utilities"><NotificationCenter userId={state.user.id}/><LanguageSwitch/><Link to="/panel/cuenta" className="account-profile-link" onClick={()=>setOpen(false)} aria-label={en?'Open my account':'Abrir mi cuenta'} title={en?'My account':'Mi cuenta'}><span className="admin-avatar">{state.user.email?.slice(0,1).toUpperCase()||'O'}</span></Link></div>
      </div>
    </header>
    {preview && <div className="admin-preview-banner" role="status"><div><strong>{en ? 'Client role preview' : 'Vista previa del rol cliente'}</strong><p>{en ? 'You remain signed in as administrator. This previews the interface, without accessing another person’s account.' : 'Sigues conectado como administrador. Esta vista simula la interfaz del cliente, sin acceder a la cuenta de otra persona.'}</p></div><button onClick={() => changeRole('super_admin')}>{en ? 'Return to administrator' : 'Volver a administrador'}</button></div>}
    <div id="admin-content" className="admin-content" tabIndex={-1}><div className="portal-module-frame"><Suspense fallback={<PortalLoading compact/>}><Outlet key={actingRole} context={context}/></Suspense></div></div></div>
  </div></PortalNotifications>;
}
