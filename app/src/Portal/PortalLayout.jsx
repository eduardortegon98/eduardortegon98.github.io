import { useState, Suspense } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, MessagesSquare, ExternalLink, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import Access from './Access';
import { supabase } from '../lib/supabase';
import { LanguageSwitch, useLanguage } from '../i18n/Language';
import './PortalLayout.css';

export default function PortalLayout() {
  return <Access>{state => <Workspace key={state.user.id + state.role} state={state} />}</Access>;
}
function Workspace({ state }) {
  const { language } = useLanguage(), en = language === 'en';
  const [open, setOpen] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState('');
  const { pathname } = useLocation();
  const admin = state.role === 'super_admin';
  const title = pathname.startsWith('/panel/analitica') ? (en ? 'Website analytics' : 'Analítica de la web') : pathname.startsWith('/panel/mensajes') ? (en ? 'Unified inbox' : 'Bandeja unificada') : (en ? 'Dashboard' : 'Dashboard');
  async function logout() {
    setPending(true); setError('');
    try { const { error } = await supabase.auth.signOut(); if (error) throw error; }
    catch { setError(en ? 'Could not sign out. Try again.' : 'No pudimos cerrar sesión. Inténtalo nuevamente.'); }
    finally { setPending(false); }
  }
  return <div className="admin-shell">
    <a href="#admin-content" className="admin-skip">{en ? 'Skip to content' : 'Ir al contenido'}</a>
    <aside className={'admin-sidebar' + (open ? ' is-open' : '')} id="admin-navigation">
      <Link to="/panel" className="admin-logo" onClick={() => setOpen(false)}><span>O.</span><div>Ortegón<small>{en ? 'Management portal' : 'Portal de gestión'}</small></div></Link>
      <p className="admin-nav-label">{en ? 'WORKSPACE' : 'ESPACIO DE TRABAJO'}</p>
      <nav aria-label={en ? 'Portal navigation' : 'Navegación del portal'}>
        <NavLink to="/panel" end onClick={() => setOpen(false)}><LayoutDashboard size={19}/><span>Dashboard</span></NavLink>
        {admin && <><NavLink to="/panel/analitica" onClick={() => setOpen(false)}><BarChart3 size={19}/><span>{en ? 'Analytics' : 'Analítica'}</span></NavLink><NavLink to="/panel/mensajes" onClick={() => setOpen(false)}><MessagesSquare size={19}/><span>{en ? 'Messages' : 'Mensajes'}</span><small>Demo</small></NavLink></>}
      </nav>
      <div className="admin-sidebar-bottom"><Link to="/" className="admin-public-link"><ExternalLink size={17}/>{en ? 'View website' : 'Ver página web'}</Link><div className="admin-identity"><span className="admin-avatar">{state.user.email?.slice(0,1).toUpperCase() || 'O'}</span><div><strong>{admin ? (en ? 'Administrator' : 'Administrador') : (en ? 'Client' : 'Cliente')}</strong><span>{state.user.email}</span></div></div><button className="admin-logout" onClick={logout} disabled={pending}><LogOut size={17}/>{pending ? (en ? 'Signing out…' : 'Saliendo…') : (en ? 'Sign out' : 'Cerrar sesión')}</button>{error && <p role="alert">{error}</p>}</div>
    </aside>
    <div className="admin-body"><header className="admin-topbar"><button className="admin-menu" aria-controls="admin-navigation" aria-expanded={open} aria-label={en ? 'Toggle navigation' : 'Abrir o cerrar navegación'} onClick={() => setOpen(value => !value)}>{open ? <X size={20}/> : <Menu size={20}/>}</button><div className="admin-breadcrumb"><span>{en ? 'Portal' : 'Portal'}</span><span>/</span><strong>{title}</strong></div><div className="admin-top-actions"><span className="admin-access"><ShieldCheck size={15}/>{admin ? (en ? 'Admin access' : 'Acceso admin') : (en ? 'Client account' : 'Cuenta de cliente')}</span><LanguageSwitch/></div></header>
    <div id="admin-content" className="admin-content" tabIndex={-1}><Suspense fallback={<p role="status" className="admin-loading">{en ? 'Loading section…' : 'Cargando sección…'}</p>}><Outlet context={state}/></Suspense></div></div>
  </div>;
}
