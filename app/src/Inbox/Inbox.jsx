import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, CheckCheck, LogOut, MessageCircle, Search, Send, Inbox as InboxIcon } from "lucide-react";
import { supabase, isPasswordRecovery } from "../lib/supabase";
import "./Inbox.css";
const channels = ["WhatsApp", "Instagram", "Facebook"];
const seed = [
  { id: 1, name: "Laura Martínez", company: "Clínica Vet Norte", channel: "WhatsApp", unread: true, status: "Pendiente", time: "10:42", messages: [{ text: "Hola, quisiera una página web para mi veterinaria. ¿Podemos hablar de los servicios?", own: false, time: "10:42" }] },
  { id: 2, name: "Andrés Gómez", company: "Estudio creativo", channel: "Instagram", unread: true, status: "Pendiente", time: "10:28", messages: [{ text: "Vi sus proyectos y me interesa automatizar las respuestas de mi negocio.", own: false, time: "10:28" }] },
  { id: 3, name: "Carolina Ruiz", company: "Tienda Carolina", channel: "Facebook", unread: false, status: "En curso", time: "09:56", messages: [{ text: "¿También desarrollan tiendas en línea?", own: false, time: "09:50" }, { text: "Sí, podemos ayudarte a definir el catálogo y el proceso de compra. ¿Qué productos vendes?", own: true, time: "09:56" }] },
  { id: 4, name: "Diego Torres", company: "Consultoría Torres", channel: "WhatsApp", unread: false, status: "Resuelto", time: "Ayer", messages: [{ text: "Gracias por la información. Ya tengo lo necesario para empezar.", own: false, time: "Ayer" }] },
];
export default function Inbox() {
  const [session, setSession] = useState(undefined);
  const [authError, setAuthError] = useState("");
  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, value) => { if (active) setSession(value); });
    supabase.auth.getSession().then(({ data, error }) => { if (active) { if (error) setAuthError("No pudimos comprobar tu sesión. Vuelve a iniciar sesión."); setSession(data.session); } }).catch(() => { if (active) { setAuthError("No pudimos comprobar tu sesión."); setSession(null); } });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  if (authError) return <div className="inbox-loading" role="alert">{authError}<Link to="/login">Volver al login</Link></div>;
  if (session === undefined) return <div className="inbox-loading" role="status">Cargando tu espacio de trabajo…</div>;
  if (!session || isPasswordRecovery()) return <Navigate to="/login" replace />;
  return <Workspace key={session.user.id} user={session.user} />;
}
function Workspace({ user }) {
  const [conversations, setConversations] = useState(seed);
  const [channel, setChannel] = useState("Todos"), [filter, setFilter] = useState("Todos"), [query, setQuery] = useState("");
  const [selected, setSelected] = useState(1), [mobileOpen, setMobileOpen] = useState(false), [drafts, setDrafts] = useState({});
  const [notice, setNotice] = useState(""), [signingOut, setSigningOut] = useState(false);
  const bottom = useRef(null);
  const current = conversations.find(c => c.id === selected);
  const draft = drafts[selected] || "";
  const visible = conversations.filter(c => (channel === "Todos" || c.channel === channel) && (filter === "Todos" || (filter === "Sin leer" ? c.unread : c.status === filter)) && `${c.name} ${c.company} ${c.messages.at(-1).text}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  useEffect(() => { bottom.current?.scrollIntoView({ block: "nearest" }); }, [selected, current.messages.length]);
  function open(c) { setSelected(c.id); setMobileOpen(true); setNotice(""); setConversations(all => all.map(item => item.id === c.id ? { ...item, unread: false } : item)); }
  function send(e) {
    e.preventDefault(); const text = draft.trim(); if (!text || text.length > 1500) return;
    const time = new Intl.DateTimeFormat("es-CO", { hour: "2-digit", minute: "2-digit" }).format(new Date());
    setConversations(all => all.map(c => c.id === selected ? { ...c, status: "En curso", unread: false, time, messages: [...c.messages, { own: true, text, time }] } : c));
    setDrafts(all => ({ ...all, [selected]: "" })); setNotice("Respuesta añadida a la demo. No se envió a ninguna red social.");
  }
  async function logout() { setSigningOut(true); try { const { error } = await supabase.auth.signOut(); if (error) throw error; } catch { setNotice("No pudimos cerrar sesión. Inténtalo nuevamente."); } finally { setSigningOut(false); } }
  return <div className="inbox-app">
    <aside className="inbox-nav"><Link className="inbox-brand" to="/"><span>O.</span><div>Ortegón<small>Centro de mensajes</small></div></Link><p className="inbox-nav-label">ESPACIO DE TRABAJO</p><div className="inbox-nav-active"><InboxIcon size={18} /> Bandeja unificada</div><p className="inbox-nav-label">CANALES</p><nav aria-label="Filtrar por red social">{["Todos", ...channels].map(name => <button key={name} aria-pressed={channel === name} className={channel === name ? "active" : ""} onClick={() => { setChannel(name); setMobileOpen(false); }}><span className={`channel-dot ${name.toLowerCase()}`} />{name}<b>{conversations.filter(c => (name === "Todos" || c.channel === name) && c.unread).length}</b></button>)}</nav><div className="inbox-demo-note"><strong>Tu próxima conexión</strong><p>Los tres canales están en modo demo. La integración con Meta llegará en la siguiente etapa.</p></div><div className="inbox-account"><span title={user.email}>{user.email}</span><button onClick={logout} disabled={signingOut}><LogOut size={16} />{signingOut ? "Saliendo…" : "Cerrar sesión"}</button></div></aside>
    <main className="inbox-workspace"><header className="inbox-top"><div><p>MENOS PESTAÑAS. MÁS CONVERSACIONES.</p><h1>Tu bandeja, en un solo lugar.</h1></div><span className="inbox-demo-badge">Demo · Sin conexiones reales</span></header>
    <section className={`inbox-grid ${mobileOpen ? "conversation-open" : ""}`} aria-label="Gestión de conversaciones">
      <aside className="inbox-list"><div className="inbox-list-heading"><h2>Conversaciones <span>{visible.length}</span></h2><p>{conversations.filter(c => c.unread).length} pendientes de lectura</p><label className="inbox-search"><Search size={17} /><input aria-label="Buscar conversaciones" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar nombre o mensaje" /></label><select aria-label="Filtrar por estado" value={filter} onChange={e => setFilter(e.target.value)}>{["Todos", "Sin leer", "Pendiente", "En curso", "Resuelto"].map(s => <option key={s}>{s}</option>)}</select></div><div className="inbox-conversations">{visible.length ? visible.map(c => <button key={c.id} className={`inbox-conversation ${selected === c.id ? "selected" : ""}`} onClick={() => open(c)} aria-pressed={selected === c.id}><span className="inbox-avatar">{c.name.split(" ").map(n => n[0]).join("")}</span><div><div className="inbox-conversation-title"><strong>{c.name}</strong><small>{c.time}</small></div><p>{c.messages.at(-1).text}</p><span className={`channel-tag ${c.channel.toLowerCase()}`}>{c.channel}</span>{c.unread && <i aria-label="Sin leer" />}</div></button>) : <div className="inbox-empty"><Search /><h3>No hay coincidencias</h3><p>Prueba otro nombre, canal o estado.</p><button onClick={() => { setChannel("Todos"); setFilter("Todos"); setQuery(""); }}>Limpiar filtros</button></div>}</div></aside>
      <section className="inbox-thread" aria-label={`Conversación con ${current.name}`}><header className="inbox-thread-header"><button className="inbox-back" aria-label="Volver a conversaciones" onClick={() => setMobileOpen(false)}><ArrowLeft size={20} /></button><span className="inbox-avatar">{current.name.split(" ").map(n => n[0]).join("")}</span><div><h2>{current.name}</h2><span className={`channel-tag ${current.channel.toLowerCase()}`}>{current.channel}</span></div><label className="inbox-status">Estado<select value={current.status} onChange={e => setConversations(all => all.map(c => c.id === selected ? { ...c, status: e.target.value } : c))}>{["Pendiente", "En curso", "Resuelto"].map(s => <option key={s}>{s}</option>)}</select></label></header><div className="inbox-messages"><p className="inbox-day">Conversación de demostración</p>{current.messages.map((m, i) => <div key={i} className={`inbox-bubble ${m.own ? "own" : ""}`}><p>{m.text}</p><small>{m.time} {m.own && <CheckCheck size={13} aria-label="Guardado en la demo" />}</small></div>)}<div ref={bottom} /></div><form className="inbox-compose" onSubmit={send}><label htmlFor="inbox-reply">Responder en la demo</label><textarea id="inbox-reply" placeholder={`Escribe una respuesta para ${current.name.split(" ")[0]}…`} value={draft} maxLength={1500} onChange={e => setDrafts(all => ({ ...all, [selected]: e.target.value }))} /><div><small>{draft.length}/1500 · Se borra al recargar</small><button disabled={!draft.trim()} type="submit">Añadir respuesta <Send size={16} /></button></div><p role="status">{notice || "Ningún mensaje de esta pantalla se envía a WhatsApp, Instagram o Facebook."}</p></form></section>
      <aside className="inbox-details"><p className="inbox-nav-label">INFORMACIÓN DEL CONTACTO</p><span className="inbox-avatar large">{current.name.split(" ").map(n => n[0]).join("")}</span><h2>{current.name}</h2><p>{current.company}</p><dl><dt>Canal de origen</dt><dd>{current.channel}</dd><dt>Estado</dt><dd>{current.status}</dd><dt>Responsable</dt><dd>Mi bandeja</dd></dl><div className="inbox-detail-note"><MessageCircle size={20} /><h3>Todo el contexto, a mano.</h3><p>Aquí se integrarán los datos reales del contacto cuando conectemos cada canal.</p></div></aside>
    </section></main></div>;
}
