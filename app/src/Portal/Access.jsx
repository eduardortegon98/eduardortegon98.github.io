import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, isPasswordRecovery } from '../lib/supabase';
import { readClientModules } from './moduleData';
import PortalLoading from './PortalLoading';
import { Localized } from '../i18n/Language';
export default function Access({ admin = false, children }) {
  const [state, setState] = useState({ loading: true });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!supabase) { setState({ user: null }); return; }
    let active = true, version = 0, lastUserId = null;
    async function load() {
      const current = ++version;
      if (!lastUserId) setState({ loading: true });
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) { if (active && current === version) setState({ user: null }); return; }
        const profile = await supabase.from('portal_profiles').select('role').eq('id', data.user.id).single();
        if (profile.error || !['client', 'super_admin'].includes(profile.data?.role)) throw new Error('profile');
        let assignments;
        try { assignments={data:await readClientModules(data.user.id)}; } catch { assignments={error:true}; }
        // Missing migration or unavailable permissions fail closed for client modules.
        const modules = assignments.error ? [] : assignments.data.map(item=>item.module);
        if (active && current === version) { lastUserId = data.user.id; setState({ user: data.user, role: profile.data.role, modules }); }
      } catch { if (active && current === version) setState({ error: true }); }
    }
    load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => { if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') return; if (event === 'SIGNED_IN' && session?.user?.id === lastUserId) return; queueMicrotask(() => { if (active) load(); }); });
    return () => { active = false; version++; subscription.unsubscribe(); };
  }, [retry]);
  if (state.loading) return <PortalLoading/>;
  if (state.error) return <div className="portal-gate"><Localized as="p" role="alert">No pudimos verificar los permisos. Si es la primera instalación, configura la migración del portal en Supabase.</Localized><Localized as="button" onClick={() => setRetry(n => n + 1)}>Reintentar</Localized></div>;
  if (!state.user || isPasswordRecovery()) return <Navigate to="/login" replace />;
  if (admin && state.role !== 'super_admin') return <Navigate to="/panel" replace />;
  return children(state);
}
