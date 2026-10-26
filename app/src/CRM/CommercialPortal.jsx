import { createElement, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Link, Navigate, useOutletContext, useSearchParams } from "react-router-dom";
import { Users, Columns3, CalendarClock, BarChart3, Plug, CreditCard, Search, Plus, X, Info, Upload, Download, Trash2, Check, ArrowRight, FileText, RefreshCw, ChevronRight, AlertCircle, History, Scale, MessagesSquare, FolderKanban } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/Language";
import { loadQualifiedContacts, CONTACT_STAGES } from "../Portal/contactStages";
import { getContactChannel } from "../Analytics/prospectChannels";
import { portalModules, moduleTitle } from "../Portal/modules";
import PortalLoading from "../Portal/PortalLoading";
import { schemas, initialValues, currencies } from "./fields";
import { uid, now, loadWorkspace, saveWorkspace, contactData, money, duplicateGroups, reminders, metrics, putFile, getFile, deleteFile } from "./model";
import "./CommercialPortal.css";
import ContactStageTooltip, { ContactStageBadge } from '../Portal/ContactStageTooltip';
const navigation = [
  ["contacts", Users, "Contrataci\xF3n", "Contracting"],
  ["history", History, "Historial", "History"],
  ["legal", Scale, "Legal", "Legal"],
  ["methods", CreditCard, "Pagos", "Payments"],
  ["connections", MessagesSquare, "Seguimiento", "Follow-up"],
  ["operations", FolderKanban, "Proyectos", "Projects"]
];
const detailTabs = [
  ["hiring", "Contrataci\xF3n", "Contracting"],
  ["history", "Historial", "History"],
  ["legal", "Legal", "Legal"],
  ["payments", "Pagos", "Payments"],
  ["communications", "Seguimiento", "Follow-up"],
  ["projects", "Proyectos", "Projects"]
];
const recordTitles = [["profile", "Ficha", "Profile"], ["history", "Historial", "Timeline"], ["files", "Archivos", "Files"], ["actions", "Seguimiento", "Follow-up"], ["notes", "Notas", "Notes"], ["quotes", "Cotizaciones", "Quotes"], ["contracts", "Contratos", "Contracts"], ["payments", "Pagos", "Payments"], ["projects", "Proyectos", "Projects"]];
const contactSection = (target) => ({ profile: "hiring", quotes: "hiring", actions: "communications", notes: "communications", files: "legal", contracts: "legal" })[target] || target;
const statusNames = { draft: ["Borrador", "Draft"], sent: ["Enviado", "Sent"], accepted: ["Aceptada", "Accepted"], rejected: ["Rechazada", "Rejected"], signed: ["Firmado", "Signed"], pending: ["Pendiente", "Pending"], paid: ["Pagado \xB7 manual", "Paid \xB7 manual"], planned: ["Planeado", "Planned"], progress: ["En ejecuci\xF3n", "In progress"], review: ["En aprobaci\xF3n", "Awaiting approval"], approved: ["Aprobado", "Approved"] };
function Modal({ title, onClose, children, wide = false }) {
  const titleId = useId();
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    return () => {
      if (d.open) d.close();
    };
  }, []);
  return <dialog ref={ref} aria-labelledby={titleId} className={"crm-dialog" + (wide ? " crm-dialog-wide" : "")} onCancel={(e) => {
    e.preventDefault();
    onClose();
  }} onClick={(e) => {
    if (e.target === ref.current) {
      const r = ref.current.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose();
    }
  }}><header><h2 id={titleId}>{title}</h2><button type="button" className="crm-icon" aria-label="Close / Cerrar" onClick={onClose}><X size={18} /></button></header>{children}</dialog>;
}
function Rating({stage,en}) { return <ContactStageBadge stage={stage} en={en}/>; }
function RecordForm({ kind, values, onSubmit, onClose, en, workspace, contact, externalError }) {
  const fields = schemas[kind], t = (es, english) => en ? english : es;
  const [draft, setDraft] = useState(() => ({ ...initialValues(fields), ...values }));
  const [selected, setSelected] = useState(values?.modules || []);
  const [failure, setFailure] = useState("");
  function submit(e) {
    e.preventDefault();
    if (kind === "contracts" && draft.status === "signed" && !draft.signedAt) {
      setFailure(t("Indica la fecha de firma.", "Enter the signature date."));
      return;
    }
    if (kind === "methods" && draft.url && !/^https:\/\//i.test(draft.url)) {
      setFailure(t("El enlace debe empezar por https://", "The link must start with https://"));
      return;
    }
    onSubmit({ ...draft, ...kind === "conversion" ? { modules: selected } : {} });
  }
  return <form className="crm-form" onSubmit={submit}>{fields.map((field) => {
    let options = field.options;
    if (field.type === "team") options = workspace.team.map((r) => ({ value: r.id, es: r.title, en: r.title }));
    if (field.type === "files") options = (contact.files || []).map((r) => ({ value: r.id, es: r.name, en: r.name }));
    if (field.type === "methods") options = workspace.methods.filter((r) => !r.archived || r.id === draft.methodId).map((r) => ({ value: r.id, es: r.title, en: r.title }));
    return <label key={field.key} className={field.type === "textarea" ? "crm-field-wide" : ""}><span>{en ? field.en : field.es}{field.required ? " *" : ""}</span>{options ? <select value={draft[field.key] ?? ""} required={field.required} onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })}><option value="">{t("Seleccionar", "Select")}</option>{options.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{en ? o.en : o.es}</option>)}</select> : field.type === "textarea" ? <textarea value={draft[field.key] || ""} required={field.required} onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })} /> : <input type={field.type} value={draft[field.key] ?? ""} min={field.type === "number" ? 0 : void 0} step={field.type === "number" ? "0.01" : void 0} required={field.required} onChange={(e) => setDraft({ ...draft, [field.key]: e.target.value })} />}</label>;
  })}{kind === "conversion" && <fieldset className="crm-field-wide"><legend>{t("M\xF3dulos solicitados", "Requested modules")}</legend>{portalModules.map((m) => <label className="crm-check" key={m.id}><input type="checkbox" checked={selected.includes(m.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, m.id] : selected.filter((id) => id !== m.id))} />{moduleTitle(m, en ? "en" : "es")}</label>)}<p>{t("Se guarda una solicitud local. No crea cuentas ni concede accesos.", "Saves a local request. Does not create accounts or grant access.")}</p></fieldset>}{kind === "methods" && <p className="crm-field-wide crm-muted">{t("Solo referencias comerciales. No guardes n\xFAmeros de tarjeta, CVV, contrase\xF1as ni claves.", "Business references only. Do not store card numbers, CVV, passwords or keys.")}</p>}{(failure || externalError) && <p role="alert" className="crm-field-wide">{failure || externalError}</p>}<div className="crm-form-actions crm-field-wide"><button type="button" className="crm-secondary" onClick={onClose}>{t("Cancelar", "Cancel")}</button><button type="submit">{t("Guardar localmente", "Save locally")}</button></div></form>;
}
function CommercialPortal() {
  const context = useOutletContext();
  if (context.role !== "super_admin") return <Navigate to="/panel" replace />;
  return <Workspace key={context.user.id} user={context.user} />;
}
function Workspace({ user }) {
  const { language } = useLanguage(), en = language === "en";
  const t = useCallback((es, english) => en ? english : es, [en]);
  const [params, setParams] = useSearchParams();
  const requested = params.get("view");
  const [view, setView] = useState([...navigation.map((n) => n[0]), "board", "metrics"].includes(requested) ? requested : "contacts");
  const [workspace, setWorkspace] = useState(() => loadWorkspace(user.id)), [rows, setRows] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(""), [message, setMessage] = useState("");
  const [term, setTerm] = useState(""), [owner, setOwner] = useState(""), [stageFilter, setStageFilter] = useState(""), [selected, setSelected] = useState(params.get("contact") || null), [tab, setTab] = useState("hiring"), [form, setForm] = useState(null), [help, setHelp] = useState(false), [busy, setBusy] = useState(false), [category, setCategory] = useState("Contrato");
  const [clock, setClock] = useState(() => /* @__PURE__ */ new Date());
  const [remoteTasks, setRemoteTasks] = useState([]);
  const [prospectRows, setProspectRows] = useState([]);
  const [taskBusy, setTaskBusy] = useState(null);
  const [followupSearch, setFollowupSearch] = useState("");
  const [taskSearchByContact, setTaskSearchByContact] = useState({});
  useEffect(() => {
    const timer = setInterval(() => setClock(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(timer);
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const real = await loadQualifiedContacts(supabase);
       const allProspects = [];
       for (let offset=0;;offset+=500) {
         const {data,error:prospectError}=await supabase.from("sales_prospects").select("id,company,person,email,status").order("company").range(offset,offset+499);
         if(prospectError) throw prospectError;
         allProspects.push(...data);
         if(data.length<500)break;
       }
       setProspectRows(allProspects);
       const allTasks=[];
       for(let offset=0;;offset+=500){
         const {data,error:taskError}=await supabase.from("sales_followup_tasks").select("id,prospect_id,title,details,due_at,completed_at,created_at").order("created_at",{ascending:false}).range(offset,offset+499);
         if(taskError)throw taskError;
         allTasks.push(...data);
         if(data.length<500)break;
       }
       setRemoteTasks(allTasks);
      setRows(real.map((r) => ({ ...r, channel: getContactChannel(r) })));
      const stageRows = [];
      let stageError = null;
      for (let offset = 0; ; offset += 500) {
        const result = await supabase.from("sales_contact_stages").select("prospect_id,stage").order("prospect_id").range(offset, offset + 499);
        if (result.error) {
          stageError = result.error;
          break;
        }
        stageRows.push(...result.data);
        if (result.data.length < 500) break;
      }
      const current = loadWorkspace(user.id);
      let changed = false;
      if (!stageError) for (const r of stageRows) {
        if (!current.contacts[r.prospect_id]) {
          current.contacts[r.prospect_id] = { ...contactData(current, r.prospect_id), stage: r.stage };
          changed = true;
        }
      }
      if (Array.isArray(current.seenContacts)) {
        const unseen = real.filter((r) => !current.seenContacts.includes(r.id));
        if (unseen.length) {
          current.events = [...unseen.map((r) => ({ id: "reply:" + r.id, contactId: r.id, title: t("Respuesta confirmada en CRM", "Confirmed CRM reply"), company: r.company, kind: "reply" })), ...current.events];
          changed = true;
        }
      }
      if (!current.seenContacts || real.some((r) => !current.seenContacts.includes(r.id))) {
        current.seenContacts = [.../* @__PURE__ */ new Set([...current.seenContacts || [], ...real.map((r) => r.id)])];
        changed = true;
      }
      if (changed) {
        try {
          saveWorkspace(user.id, current);
          setWorkspace(current);
        } catch {
          setError(t("Contactos cargados, pero no se pudo guardar la referencia local.", "Contacts loaded, but the local snapshot could not be saved."));
        }
      }
    } catch (e) {
      setError(t("No se pudieron cargar los contactos: ", "Could not load contacts: ") + e.message);
    } finally {
      setLoading(false);
    }
  }, [user.id, t]);
  useEffect(() => {
    let active = true;
    load();
    function changes(e) {
      if ((e.key === `ortdesk:commercial:v1:${user.id}` || e.detail?.userId===user.id || e.type==='storage'&&e.key===null) && active) setWorkspace(loadWorkspace(user.id));
    }
    window.addEventListener("storage", changes);
    window.addEventListener("ortdesk:commercial-change", changes);
    return () => {
      active = false;
      window.removeEventListener("storage", changes);
      window.removeEventListener("ortdesk:commercial-change", changes);
    };
  }, [user.id, load]);

  useEffect(()=>{
    const id=params.get('contact');
    setSelected(id||null);
    const target=params.get('section');
    if(target&&detailTabs.some(item=>item[0]===target))setTab(target);
  },[params]);
  function commit(next) {
    try {
      saveWorkspace(user.id, next);
      setWorkspace(next);
      setError("");
      return true;
    } catch {
      setError(t("No se pudo guardar en el navegador. Revisa el espacio disponible; el cambio no fue aplicado.", "Could not save in this browser. Check available space; the change was not applied."));
      return false;
    }
  }
  function updateContact(id, patch, title) {
    const c = contactData(workspace, id);
    return commit({ ...workspace, contacts: { ...workspace.contacts, [id]: { ...c, ...patch, history: [{ id: uid(), at: now(), title }, ...c.history] } } });
  }
  function openContact(id, target = "profile") {
    setSelected(id);
    setTab(contactSection(target));
    const next = new URLSearchParams(params);
    next.set("contact", id);
    next.set("section", contactSection(target));
    setParams(next, { replace: true });
  }
  function closeContact() {
    setSelected(null);
    const next = new URLSearchParams(params);
    next.delete("contact");
    next.delete("section");
    setParams(next, { replace: true });
  }
  function changeView(next) {
    setView(next);
    const p = new URLSearchParams(params);
    p.set("view", next);
    setParams(p, { replace: true });
  }
  function setStage(id, stage) {
    const c = contactData(workspace, id);
    if (c.stage !== stage) updateContact(id, { stage }, t("Etapa actualizada: Contacto ", "Stage updated: Contact ") + stage);
  }
  const filtered = useMemo(() => rows.filter((r) => {
    const c = contactData(workspace, r.id), p = c.profile;
    return [r.company, r.person, r.email, p.person, p.email, p.phone, p.service, ...c.notes.map((n) => n.title), ...c.files.map((f) => f.name), ...c.quotes.map((q) => q.title), ...c.projects.map((p2) => p2.title)].join(" ").toLowerCase().includes(term.toLowerCase()) && (!owner || p.owner === owner) && (stageFilter === "" || c.stage === Number(stageFilter));
  }), [rows, workspace, term, owner, stageFilter]);
  const row = rows.find((r) => r.id === selected), contact = row ? contactData(workspace, row.id) : null;
  const alerts = useMemo(() => [...workspace.events.filter((e) => rows.some((r) => r.id === e.contactId)), ...reminders(rows, workspace, clock)], [rows, workspace, clock]);
  const duplicate = useMemo(() => duplicateGroups(rows, workspace), [rows, workspace]);
  const stats = useMemo(() => metrics(rows, workspace), [rows, workspace]);
  const ownerName = (id) => workspace.team.find((m) => m.id === id)?.title || t("Sin asignar", "Unassigned");
  const date = (value) => value ? new Date(value.length === 10 ? value + "T12:00:00" : value).toLocaleString(en ? "en-US" : "es-CO", { dateStyle: "medium", ...value.length > 10 ? { timeStyle: "short" } : {} }) : "\u2014";
  const titleOf = (kind) => recordTitles.find((d) => d[0] === kind)?.[en ? 2 : 1] || { methods: t("M\xE9todo de pago", "Payment method"), team: t("Responsable", "Owner"), conversion: t("Preparar cliente", "Prepare client") }[kind];
  function submitRecord(values) {
    if (!form) return;
    const kind = form.kind;
    if (["methods", "team"].includes(kind)) {
      const record2 = { ...values, id: form.record?.id || uid() };
      const list2 = workspace[kind];
      if (commit({ ...workspace, [kind]: form.record ? list2.map((r) => r.id === record2.id ? record2 : r) : [...list2, record2] })) setForm(null);
      return;
    }
    if (!row) return;
    if (kind === "profile") {
      if (updateContact(row.id, { profile: values }, t("Ficha comercial actualizada", "Commercial profile updated"))) setForm(null);
      return;
    }
    if (kind === "conversion") {
      const project = { id: uid(), title: values.projectName, status: "planned", due: "", owner: contact.profile.owner || "", milestones: "" };
      if (updateContact(row.id, { conversion: { ...values, at: now(), status: "local" }, projects: [...contact.projects, project] }, t("Solicitud de cliente preparada \xB7 pendiente de backend", "Client request prepared \xB7 backend pending"))) setForm(null);
      return;
    }
    const record = { ...values, id: form.record?.id || uid(), at: form.record?.at || now() };
    const list = contact[kind];
    if (updateContact(row.id, { [kind]: form.record ? list.map((r) => r.id === record.id ? record : r) : [record, ...list] }, (form.record ? t("Actualizado: ", "Updated: ") : t("Agregado: ", "Added: ")) + titleOf(kind))) setForm(null);
  }
  async function upload(event, fileCategory = category) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !row) return;
    if (file.size > 20 * 1024 * 1024) {
      setError(t("M\xE1ximo 20 MB por archivo.", "Maximum 20 MB per file."));
      return;
    }
    setBusy(true);
    const id = uid(), key = user.id + ":" + row.id + ":" + id;
    try {
      await putFile(key, file);
      const metadata = { id, key, name: file.name, size: file.size, type: file.type, category: fileCategory, at: now() };
      if (!updateContact(row.id, { files: [metadata, ...contact.files] }, t("Archivo adjunto: ", "File attached: ") + file.name)) await deleteFile(key);
    } catch {
      setError(t("No se pudo guardar el archivo localmente.", "Could not save the file locally."));
    } finally {
      setBusy(false);
    }
  }
  async function download(file) {
    try {
      const blob = await getFile(file.key);
      if (!blob) throw Error();
      const url = URL.createObjectURL(blob), a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1e3);
    } catch {
      setError(t("Este archivo no est\xE1 disponible en este navegador.", "This file is not available in this browser."));
    }
  }
  async function removeFile(file) {
    if (!window.confirm(t("\xBFEliminar este archivo local?", "Delete this local file?"))) return;
    if (updateContact(row.id, { files: contact.files.filter((f) => f.id !== file.id) }, t("Archivo eliminado: ", "File removed: ") + file.name)) {
      try {
        await deleteFile(file.key);
      } catch {
        setError(t("Se quit\xF3 la referencia, pero no fue posible limpiar el archivo local.", "Reference removed, but the local file could not be cleaned up."));
      }
    }
  }
  function toggleAction(action) {
    updateContact(row.id, { actions: contact.actions.map((a) => a.id === action.id ? { ...a, done: !a.done } : a) }, t("Seguimiento actualizado", "Follow-up updated"));
  }
  function renderRecords(kind) {
    return <><div className="crm-section-heading"><h3>{titleOf(kind)}</h3><button onClick={() => setForm({ kind })}><Plus size={16} />{t("Agregar", "Add")}</button></div>{kind === "payments" && <div className="crm-balance">{currencies.map((currency) => {
      const ps = contact.payments.filter((p) => p.currency === currency), total = ps.reduce((sum, p) => sum + Number(p.amount), 0), paid = ps.filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0);
      return ps.length > 0 && <span key={currency}><b>{currency}</b>{t("Acordado: ", "Agreed: ")}{money(total, currency, en)} · {t("Registrado pagado: ", "Recorded paid: ")}{money(paid, currency, en)} · {t("Saldo: ", "Balance: ")}{money(total - paid, currency, en)}</span>;
    })}</div>}{contact[kind].map((record) => <article className={"crm-record" + (record.done ? " complete" : "")} key={record.id}><div className="crm-record-title"><strong>{record.title}</strong><div className="crm-inline-actions">{kind === "actions" && <button className="crm-icon" title={t("Completar / reabrir", "Complete / reopen")} aria-label={t("Completar o reabrir acci\xF3n", "Complete or reopen action")} onClick={() => toggleAction(record)}><Check size={16} /></button>}<button className="crm-text-action" onClick={() => setForm({ kind, record })}>{t("Editar", "Edit")}</button></div></div><div className="crm-record-meta">{record.status && <span className="crm-pill">{statusNames[record.status]?.[en ? 1 : 0] || record.status}</span>}{record.amount !== void 0 && <b>{money(record.amount, record.currency || "COP", en)}</b>}{record.version && <span>v{record.version}</span>}{record.due && <span>{date(record.due)}</span>}{record.owner && <span>{ownerName(record.owner)}</span>}{record.signedAt && <span>{t("Firma: ", "Signed: ")}{date(record.signedAt)}</span>}{record.methodId && <span>{workspace.methods.find((m) => m.id === record.methodId)?.title || "\u2014"}</span>}</div>{record.reference && <p>{record.reference}</p>}{record.milestones && <ul className="crm-milestones">{record.milestones.split("\n").filter(Boolean).map((line, i) => <li key={i}><label><input type="checkbox" checked={!!record.completedMilestones?.includes(i)} onChange={(e) => updateContact(row.id, { projects: contact.projects.map((p) => p.id === record.id ? { ...p, completedMilestones: e.target.checked ? [...p.completedMilestones || [], i] : (p.completedMilestones || []).filter((n) => n !== i) } : p) }, t("Hito actualizado", "Milestone updated"))} />{line}</label></li>)}</ul>}{record.fileId && (contact.files.some((f) => f.id === record.fileId) ? <button className="crm-text-action" onClick={() => download(contact.files.find((f) => f.id === record.fileId))}><Download size={14} />{contact.files.find((f) => f.id === record.fileId).name}</button> : <small>{t("El archivo vinculado fue eliminado.", "The linked file was removed.")}</small>)}</article>)}{!contact[kind].length && <Empty t={t} />}</>;
  }
  function renderFiles(categories) {
    const visibleFiles = contact.files.filter((file) => categories.includes(file.category));
    return <><div className="crm-upload"><select aria-label={t("Categor\xEDa del archivo", "File category")} value={categories.includes(category) ? category : categories[0]} onChange={(e) => setCategory(e.target.value)}>{[["Contrato", "Contract"], ["Cotizaci\xF3n", "Quote"], ["Propuesta", "Proposal"], ["Entregable", "Deliverable"], ["Comprobante", "Receipt"], ["Otro", "Other"]].filter(([es]) => categories.includes(es)).map(([es, english]) => <option key={es} value={es}>{t(es, english)}</option>)}</select><label className={"crm-upload-button" + (busy ? " busy" : "")}><Upload size={16} />{busy ? t("Guardando\u2026", "Saving\u2026") : t("Adjuntar archivo", "Attach file")}<input type="file" disabled={busy} onChange={(event) => upload(event, categories.includes(category) ? category : categories[0])} /></label></div><p className="crm-muted">{t("Hasta 20 MB. Archivos en IndexedDB de este navegador, sin nube ni enlaces p\xFAblicos. No equivale a almacenamiento privado seguro del servidor.", "Up to 20 MB. Files stay in this browser\u2019s IndexedDB, without cloud storage or public links. This is not secure private server storage.")}</p>{visibleFiles.map((file) => <article className="crm-file" key={file.id}><FileText size={20} /><div><strong>{file.name}</strong><small>{file.category} · {(file.size / 1024 / 1024).toFixed(2)} MB · {date(file.at)}</small></div><button className="crm-icon" title={t("Descargar", "Download")} aria-label={t("Descargar ", "Download ") + file.name} onClick={() => download(file)}><Download size={17} /></button><button className="crm-icon" disabled={busy} aria-label={t("Eliminar ", "Delete ") + file.name} onClick={() => removeFile(file)}><Trash2 size={17} /></button></article>)}{!visibleFiles.length && <Empty t={t} />}</>;
  }
  function globalRecords(kind) {
    const entries = rows.flatMap((r) => contactData(workspace, r.id)[kind].filter((record) => kind !== "files" || ["Contrato", "Otro"].includes(record.category)).map((record) => ({ row: r, record }))).sort((a, b) => String(b.record.at || "").localeCompare(String(a.record.at || "")));
    return <section className="crm-panel"><h3>{titleOf(kind)}</h3>{entries.map(({ row: r, record }) => <div className="crm-contact-record-link" key={r.id + record.id}><button className="crm-agenda-row" key={r.id + record.id} onClick={() => openContact(r.id, kind)}><span><strong>{record.title || record.name}</strong><small>{r.company}</small></span><span>{record.done ? <span className="crm-pill">{t("Completado", "Completed")}</span> : record.status ? <span className="crm-pill">{statusNames[record.status]?.[en ? 1 : 0] || record.status}</span> : date(record.at)}{record.amount !== void 0 && <small>{money(record.amount, record.currency || "COP", en)}</small>}</span></button><ContactStageTooltip stage={contactData(workspace,r.id).stage} en={en} compact/></div>)}{!entries.length && <Empty t={t} />}</section>;
  }
  async function toggleRemoteTask(task) {
    setTaskBusy(task.id);
    const next = task.completed_at ? null : new Date().toISOString();
    const {data,error:taskError} = await supabase.from("sales_followup_tasks").update({completed_at:next,updated_at:new Date().toISOString()}).eq("id",task.id).select("id,completed_at").single();
    if(taskError){setError(t("No se pudo actualizar la tarea en Supabase: ","Could not update task in Supabase: ")+taskError.message);}else{setRemoteTasks(items=>items.map(item=>item.id===task.id?{...item,completed_at:data.completed_at}:item));}
    setTaskBusy(null);
  }
  function followupByContact() {
    const allFollowupRows = [...prospectRows, ...rows.filter(r => !prospectRows.some(p => p.id === r.id))];
    const grouped = allFollowupRows.map(r => {
      const data = contactData(workspace, r.id);
      const actions = data.actions || [], notes = data.notes || [], remote = remoteTasks.filter(task=>task.prospect_id===r.id);
      return { row: r, actions, notes, remote, pending: actions.filter(a => !a.done).length + remote.filter(a=>!a.completed_at).length,
        lastActivity: [...actions, ...notes].reduce((last, entry) => String(entry.at || entry.due || "") > last ? String(entry.at || entry.due || "") : last, "") };
    }).filter(group => group.actions.length || group.notes.length || group.remote.length)
      .sort((a, b) => b.pending - a.pending || b.lastActivity.localeCompare(a.lastActivity) || a.row.company.localeCompare(b.row.company));
    const search = followupSearch.trim().toLocaleLowerCase();
    const visibleGroups = search ? grouped.filter(group => [group.row.company,group.row.person,group.row.email].some(value=>String(value||"").toLocaleLowerCase().includes(search))) : grouped;
    const matchesTask = (group, entry) => [entry.title,entry.details,entry.at,entry.due,entry.due_at,entry.completed_at].some(value=>String(value||"").toLocaleLowerCase().includes((taskSearchByContact[group.row.id]||"").trim().toLocaleLowerCase()));
    return <section className="crm-followup">
      <div className="crm-followup-heading"><div><h3>{t("Seguimiento por contacto", "Follow-up by contact")}</h3><p className="crm-muted">{t("Cada contacto reúne sus tareas y notas comerciales. Abre su ficha para editar o agregar registros.", "Each contact keeps its commercial tasks and notes together. Open its profile to edit or add records.")}</p></div><span className="crm-pill">{grouped.length} {t("contactos con seguimiento", "contacts with follow-up")}</span></div>
      <label className="crm-followup-search"><Search size={18}/><input type="search" value={followupSearch} onChange={event=>setFollowupSearch(event.target.value)} placeholder={t("Buscar contacto o prospecto por nombre, empresa o correo…","Search contacts or prospects by name, company or email…")} aria-label={t("Filtrar seguimiento por contacto","Filter follow-up by contact")}/>{followupSearch&&<button type="button" onClick={()=>setFollowupSearch("")} aria-label={t("Limpiar búsqueda","Clear search")}><X size={16}/></button>}</label>
      {visibleGroups.length ? <div className="crm-followup-grid">{visibleGroups.map(group => <article className="crm-followup-card" key={group.row.id}>
        <header className="crm-followup-card-head"><span className="crm-avatar">{group.row.company.split(/\\s+/).slice(0,2).map(s=>s[0]).join("").toUpperCase()}</span><div><h4>{group.row.company}</h4><small>{group.row.person || group.row.email || t("Contacto comercial", "Commercial contact")}</small></div></header>
        <div className="crm-followup-stats"><span>{group.pending} {t("pendientes", "pending")}</span><span>{group.actions.length+group.remote.length} {t("tareas", "tasks")}</span><span>{group.notes.length} {t("notas", "notes")}</span></div>
        <label className="crm-followup-task-search"><Search size={15}/><input type="search" value={taskSearchByContact[group.row.id]||""} onChange={event=>setTaskSearchByContact(current=>({...current,[group.row.id]:event.target.value}))} placeholder={t("Buscar tareas, notas o actividades de este contacto…","Search this contact’s tasks, notes or activities…")} aria-label={t("Buscar actividades de ","Search activities for ")+group.row.company}/></label>
        {!!group.remote.filter(task=>matchesTask(group,task)).length && <div className="crm-followup-section"><strong>{t("Tareas en Supabase", "Supabase tasks")}</strong>{group.remote.filter(task=>matchesTask(group,task)).map(task=><div className={"crm-followup-item crm-followup-checkitem"+(task.completed_at?" is-complete":"")} key={task.id}><div><span>{task.title}</span>{task.details&&<small>{task.details}</small>}<small>{task.completed_at?t("Completada","Completed"):task.due_at?date(task.due_at):t("Pendiente · sin fecha límite","Pending · no due date")}</small></div><button type="button" className="crm-followup-checkbox" role="checkbox" aria-checked={!!task.completed_at} aria-label={(task.completed_at?t("Reabrir tarea: ","Reopen task: "):t("Completar tarea: ","Complete task: "))+task.title} title={task.completed_at?t("Reabrir tarea","Reopen task"):t("Marcar como completada","Mark complete")} disabled={taskBusy===task.id} onClick={()=>toggleRemoteTask(task)}>{task.completed_at&&<Check size={14} strokeWidth={3}/>}</button></div>)}</div>}
        {!!group.actions.filter(action=>matchesTask(group,action)).length && <div className="crm-followup-section"><strong>{t("Tareas de seguimiento", "Follow-up tasks")}</strong>{group.actions.filter(action=>matchesTask(group,action)).slice().sort((a,b)=>Number(!!a.done)-Number(!!b.done)||String(a.due||"9999").localeCompare(String(b.due||"9999"))).map(action=><div className="crm-followup-item" key={action.id}><span className={"crm-followup-dot"+(action.done?" is-done":"")} /><div><span>{action.title}</span><small>{action.done?t("Completada","Completed"):action.due?date(action.due):t("Sin fecha límite","No due date")}</small></div></div>)}</div>}
        {!!group.notes.filter(note=>matchesTask(group,note)).length && <div className="crm-followup-section"><strong>{t("Notas", "Notes")}</strong>{group.notes.filter(note=>matchesTask(group,note)).slice().sort((a,b)=>String(b.at||"").localeCompare(String(a.at||""))).map(note=><div className="crm-followup-item" key={note.id}><FileText size={14}/><div><span>{note.title}</span>{note.at&&<small>{date(note.at)}</small>}</div></div>)}</div>}
        
        {(taskSearchByContact[group.row.id]||"").trim() && ![...group.remote,...group.actions,...group.notes].some(entry=>matchesTask(group,entry)) && <p className="crm-muted">{t("No hay actividades que coincidan con esta búsqueda.","No matching activities for this search.")}</p>}
        <div className="crm-followup-card-actions"><ContactStageTooltip stage={contactData(workspace,group.row.id).stage} en={en} compact /><Link className="crm-icon" to={"/panel/mensajes?contact="+encodeURIComponent(group.row.id)} title={t("Conversación en OrtConnect","Conversation in OrtConnect")} aria-label={t("Abrir conversación de ","Open conversation for ")+group.row.company}><MessagesSquare size={17}/></Link></div>
      </article>)}</div>:<div className="crm-panel"><p className="crm-muted">{search?t("No encontramos contactos con seguimiento para esa búsqueda.","No contacts with follow-up match your search."):t("Todavía no hay tareas ni notas de seguimiento registradas. Puedes agregarlas desde la ficha comercial de un contacto.", "No follow-up tasks or notes yet. Add them from a contact's commercial profile.")}</p>{search?<button className="crm-secondary" onClick={()=>setFollowupSearch("")}>{t("Limpiar búsqueda","Clear search")}</button>:<button className="crm-secondary" onClick={()=>changeView("contacts")}>{t("Ver contactos", "View contacts")} <ArrowRight size={15}/></button>}</div>}
    </section>;
  }
  const summary = <div className="crm-summary"><span><b>{rows.length}</b>{t("Respuestas confirmadas", "Confirmed replies")}</span><span><b>{stats.quotes}</b>{t("Cotizaciones locales", "Local quotes")}</span><span><b>{stats.wins}</b>{t("Firmados / ejecuci\xF3n", "Signed / in progress")}</span><span><b>{alerts.filter((a) => a.overdue).length}</b>{t("Pendientes vencidos", "Overdue items")}</span></div>;
  return <div className="commercial-workspace">
<div className="crm-top"><div><span className="crm-local"><i />{t("Prototipo frontend \xB7 guardado local", "Frontend prototype \xB7 local storage")}</span><p>{t("Contactos reales de Supabase. La gesti\xF3n nueva solo se guarda en este navegador y cuenta.", "Real contacts from Supabase. New management data is saved only in this browser and account.")}</p></div><div className="crm-top-actions"><button className="crm-icon" aria-label={t("Ayuda y etapas", "Help and stages")} onClick={() => setHelp(true)}><Info size={18} /></button><button className="crm-icon" disabled={loading} title={t("Actualizar contactos", "Refresh contacts")} aria-label={t("Actualizar contactos", "Refresh contacts")} onClick={load}><RefreshCw size={18} /></button></div></div>
{error && <p className="crm-alert" role="alert">{error}</p>}{message && <p className="crm-notice" role="status">{message}<button className="crm-icon" aria-label={t("Cerrar aviso", "Dismiss notice")} onClick={() => setMessage("")}><X size={14} /></button></p>}
{summary}<nav className="crm-tabs" aria-label={t("Gesti\xF3n comercial", "Commercial management")}>{navigation.map(([id, Icon, es, english], index) => <button key={id} className={view === id || id === "contacts" && ["board", "metrics"].includes(view) ? "active" : ""} aria-current={view === id || id === "contacts" && ["board", "metrics"].includes(view) ? "page" : void 0} onClick={() => changeView(id)}><span className="crm-section-index">{index}</span>{createElement(Icon, { size: 16 })}{t(es, english)}</button>)}</nav>
{["contacts", "board", "metrics"].includes(view) && <div className="crm-subnav" aria-label={t("Vistas de contrataci\xF3n", "Contracting views")}>{[["contacts", Users, "Contactos", "Contacts"], ["board", Columns3, "Oportunidades", "Opportunities"], ["metrics", BarChart3, "M\xE9tricas", "Metrics"]].map(([id, Icon, es, english]) => <button key={id} className={view === id ? "active" : ""} aria-pressed={view === id} onClick={() => changeView(id)}>{createElement(Icon, { size: 15 })}{t(es, english)}</button>)}</div>}
{["contacts", "board", "operations"].includes(view) && <div className="crm-tools"><label className="crm-search"><Search size={17} /><input placeholder={t("Buscar nombre, empresa, correo, tel\xE9fono, notas o archivos\u2026", "Search name, company, email, phone, notes or files\u2026")} aria-label={t("B\xFAsqueda global", "Global search")} value={term} onChange={(e) => setTerm(e.target.value)} /></label><select aria-label={t("Responsable", "Owner")} value={owner} onChange={(e) => setOwner(e.target.value)}><option value="">{t("Todos los responsables", "All owners")}</option>{workspace.team.map((m) => <option value={m.id} key={m.id}>{m.title}</option>)}</select><select aria-label={t("Etapa", "Stage")} value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}><option value="">{t("Todas las etapas", "All stages")}</option>{CONTACT_STAGES.map((s, i) => <option key={i} value={i}>{i} · {s[en ? 2 : 0]}</option>)}</select><button className="crm-secondary" onClick={() => setForm({ kind: "team" })}><Plus size={15} />{t("Responsable", "Owner")}</button></div>}
<div className={"crm-section-content"+(["contacts","board","metrics"].includes(view)?" crm-section-content-sales":"")}>
{loading ? <PortalLoading compact /> : <>
{view === "contacts" && <><div className="crm-table-wrap"><table className="crm-table"><thead><tr>{[t("Contacto", "Contact"), t("Etapa", "Stage"), t("Responsable", "Owner"), t("Pr\xF3xima acci\xF3n", "Next action"), ""].map((x, i) => <th key={i}>{x}</th>)}</tr></thead><tbody>{filtered.map((r) => {
    const c = contactData(workspace, r.id), next = c.actions.filter((a) => !a.done).sort((a, b) => a.due.localeCompare(b.due))[0];
    return <tr key={r.id}><td><button className="crm-person" onClick={() => openContact(r.id)}><span className="crm-avatar">{r.company.split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase()}</span><span><strong>{r.company}</strong><small>{c.profile.email || r.email || r.person || "\u2014"}</small></span></button></td><td><Rating stage={c.stage} en={en} /></td><td>{ownerName(c.profile.owner)}</td><td>{next ? <button className="crm-text-action" onClick={() => openContact(r.id, "actions")}>{next.title}<small>{date(next.due)}</small></button> : <span className="crm-muted">—</span>}</td><td><button className="crm-icon" aria-label={t("Abrir ", "Open ") + r.company} onClick={() => openContact(r.id)}><ChevronRight size={18} /></button></td></tr>;
  })}</tbody></table>{!filtered.length && <Empty t={t} />}</div>{duplicate.length > 0 && <section className="crm-panel"><h3><AlertCircle size={16} />{t("Posibles duplicados", "Possible duplicates")}</h3>{duplicate.map((g) => <p key={g.key}>{g.key}: {g.rows.map((r) => <button key={r.id} className="crm-text-action" onClick={() => openContact(r.id)}>{r.company}</button>)}</p>)}<small>{t("Revisi\xF3n manual; no se fusionan ni eliminan registros.", "Manual review; records are not merged or deleted.")}</small></section>}</>}
{view === "board" && <div className="crm-board">{CONTACT_STAGES.map((s, i) => <section key={i} className={"crm-board-column crm-stage-" + i} onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (rows.some((r) => r.id === id)) setStage(id, i);
  }}><header><span>{i} · {s[en ? 2 : 0]}</span><ContactStageTooltip stage={i} en={en} compact/><b>{filtered.filter((r) => contactData(workspace, r.id).stage === i).length}</b></header>{filtered.filter((r) => contactData(workspace, r.id).stage === i).map((r) => <article key={r.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", r.id)}><button className="crm-text-action" onClick={() => openContact(r.id)}><strong>{r.company}</strong></button><Rating stage={contactData(workspace,r.id).stage} en={en}/><small>{ownerName(contactData(workspace, r.id).profile.owner)}</small><select aria-label={t("Mover etapa de ", "Move stage for ") + r.company} value={i} onChange={(e) => setStage(r.id, Number(e.target.value))}>{CONTACT_STAGES.map((s2, n) => <option key={n} value={n}>{n} · {s2[en ? 2 : 0]}</option>)}</select></article>)}</section>)}</div>}
{view === "operations" && <><section className="crm-panel"><h3>{t("Equipo comercial", "Commercial team")}</h3><div className="crm-team">{workspace.team.map((member) => <button className="crm-secondary" key={member.id} onClick={() => setForm({ kind: "team", record: member })}>{member.title}</button>)}{!workspace.team.length && <p className="crm-muted">{t("Agrega responsables desde el bot\xF3n superior.", "Add owners using the button above.")}</p>}</div></section><div className="crm-projects-area"><section className="crm-panel"><h3>{t("Proyectos y entregables", "Projects and deliverables")}</h3>{filtered.flatMap((r) => contactData(workspace, r.id).projects.map((p) => <div className="crm-contact-record-link" key={p.id}><button className="crm-agenda-row" onClick={() => openContact(r.id, "projects")}><span><strong>{p.title}</strong><small>{r.company} · {ownerName(p.owner)}</small></span><span className="crm-pill">{statusNames[p.status]?.[en ? 1 : 0]}</span></button><ContactStageTooltip stage={contactData(workspace,r.id).stage} en={en} compact/></div>))}{!filtered.some((r) => contactData(workspace, r.id).projects.length > 0) && <Empty t={t} />}</section></div></>}
{view === "metrics" && <><p className="crm-muted">{t("M\xE9tricas del registro local, no de cobros verificados. Respuestas: contactos confirmados importados. Cierres: etapas 4\u20135.", "Metrics from local records, not verified charges. Replies: imported confirmed contacts. Closures: stages 4\u20135.")}</p><div className="crm-operation-grid"><section className="crm-panel"><h3>{t("Embudo comercial", "Sales funnel")}</h3>{CONTACT_STAGES.map((s, i) => {
    const count = rows.filter((r) => contactData(workspace, r.id).stage === i).length;
    return <div className="crm-chart-row" key={i}><span>{i} · {s[en ? 2 : 0]}</span><div><i style={{ width: (rows.length ? count / rows.length * 100 : 0) + "%" }} /></div><b>{count}</b></div>;
  })}</section><section className="crm-panel"><h3>{t("Ingresos registrados", "Recorded revenue")}</h3>{Object.entries(stats.revenue).map(([currency, value]) => <p className="crm-revenue" key={currency}>{money(value, currency, en)}</p>)}{!Object.keys(stats.revenue).length && <Empty t={t} />}<small>{t("Las monedas se muestran separadas; no se convierten ni suman entre s\xED.", "Currencies are displayed separately; no currency conversion or cross-currency totals.")}</small></section></div><div className="crm-panel crm-table-wrap"><table className="crm-table"><thead><tr>{[t("Canal", "Channel"), t("Respuestas", "Replies"), t("Cotizaciones", "Quotes"), t("Cierres", "Closures")].map((x) => <th key={x}>{x}</th>)}</tr></thead><tbody>{Object.entries(stats.byChannel).map(([channel, values]) => <tr key={channel}><td>{channel}</td><td>{values.contacts}</td><td>{values.quotes}</td><td>{values.wins}</td></tr>)}</tbody></table></div></>}
{view === "history" && <section className="crm-panel"><h3>{t("Actividad de todos los contactos", "Activity across contacts")}</h3>{rows.flatMap((r) => contactData(workspace, r.id).history.map((h) => ({ ...h, contactId: r.id, company: r.company }))).sort((a, b) => b.at.localeCompare(a.at)).map((h) => <div className="crm-contact-record-link" key={h.id}><button className="crm-agenda-row" onClick={() => openContact(h.contactId, "history")}><span><strong>{h.title}</strong><small>{h.company}</small></span><span>{date(h.at)}</span></button><ContactStageTooltip stage={contactData(workspace,h.contactId).stage} en={en} compact/></div>)}{!rows.some((r) => contactData(workspace, r.id).history.length) && <Empty t={t} />}</section>}
{view === "legal" && <div className="crm-category-grid">{globalRecords("contracts")}{globalRecords("files")}</div>}
{view === "connections" && followupByContact()}
{view === "methods" && <>{globalRecords("payments")}<section className="crm-panel crm-methods-section"><div className="crm-section-heading"><h3>{t("M\xE9todos de pago", "Payment methods")}</h3><button onClick={() => setForm({ kind: "methods" })}><Plus size={16} />{t("Agregar m\xE9todo", "Add method")}</button></div><p className="crm-muted">{t("Cat\xE1logo local para vincular cobros y anticipos. No procesa transacciones.", "Local catalog for payments and deposits. Does not process transactions.")}</p><div className="crm-connections">{workspace.methods.map((m) => <article className="crm-panel" key={m.id}><CreditCard size={20} /><h3>{m.title}</h3><span className="crm-pill">{m.kind} · {m.currency}{m.archived ? " \xB7 " + t("Archivado", "Archived") : ""}</span><p className="crm-prewrap">{m.instructions}</p>{m.url && /^https:\/\//i.test(m.url) && <a href={m.url} target="_blank" rel="noopener noreferrer">{t("Abrir enlace de pago", "Open payment link")}</a>}<div className="crm-inline-actions"><button className="crm-secondary" onClick={() => setForm({ kind: "methods", record: m })}>{t("Editar", "Edit")}</button><button className="crm-text-action" onClick={() => commit({ ...workspace, methods: workspace.methods.map((v) => v.id === m.id ? { ...v, archived: !v.archived } : v) })}>{m.archived ? t("Restaurar", "Restore") : t("Archivar", "Archive")}</button></div></article>)}</div>{!workspace.methods.length && <Empty t={t} />}</section></>}
</>}
</div>
{row && contact && <Modal title={row.company} onClose={closeContact} wide><div className="crm-contact-bar"><Rating stage={contact.stage} en={en} /><select aria-label={t("Etapa del contacto", "Contact stage")} value={contact.stage} onChange={(e) => setStage(row.id, Number(e.target.value))}>{CONTACT_STAGES.map((s, i) => <option key={i} value={i}>{i} · {s[en ? 2 : 0]}</option>)}</select><span className="crm-pill">{t("Gesti\xF3n local", "Local management")}</span><Link to="/panel/mensajes">{t("Comunicaciones", "Communications")}</Link></div><nav className="crm-tabs crm-detail-tabs" aria-label={t("Detalle del contacto", "Contact details")}>{detailTabs.map(([id, es, english], index) => <button key={id} className={tab === id ? "active" : ""} aria-current={tab === id ? "page" : void 0} onClick={() => setTab(id)}><span className="crm-section-index">{index}</span>{t(es, english)}</button>)}</nav><div className="crm-detail-body">{error && <p className="crm-alert" role="alert">{error}</p>}
{tab === "hiring" && <><section className="crm-category-panel"><div className="crm-section-heading"><h3>{t("Ficha comercial", "Commercial profile")}</h3><button className="crm-secondary" onClick={() => setForm({ kind: "profile", record: { person: row.person || "", email: row.email || "", channel: row.channel, ...contact.profile } })}>{t("Editar ficha", "Edit profile")}</button></div><dl className="crm-profile">{schemas.profile.map((f) => <div key={f.key}><dt>{en ? f.en : f.es}</dt><dd>{f.key === "owner" ? ownerName(contact.profile.owner) : f.key === "budget" ? contact.profile.budget !== void 0 && contact.profile.budget !== "" ? money(contact.profile.budget, contact.profile.currency || "COP", en) : "\u2014" : contact.profile[f.key] || { person: row.person, email: row.email, channel: row.channel }[f.key] || "\u2014"}</dd></div>)}</dl><div className="crm-conversion"><div><h3>{t("Preparar conversi\xF3n a cliente", "Prepare client conversion")}</h3><p>{contact.conversion ? t("Solicitud local guardada para ", "Local request saved for ") + contact.conversion.accountEmail : t("Vincula el correo, proyecto y m\xF3dulos solicitados. La activaci\xF3n real vendr\xE1 con el backend.", "Link the email, project and requested modules. Actual activation requires the backend.")}</p>{contact.conversion && <small>{t("M\xF3dulos: ", "Modules: ")}{contact.conversion.modules.map((id) => moduleTitle(portalModules.find((m) => m.id === id) || { label: { es: id, en: id } }, en ? "en" : "es")).join(", ") || "\u2014"}</small>}</div><button disabled={!!contact.conversion} onClick={() => setForm({ kind: "conversion", record: { accountEmail: contact.profile.email || row.email || "" } })}>{contact.conversion ? t("Preparado", "Prepared") : t("Preparar", "Prepare")}<ArrowRight size={15} /></button></div></section><section className="crm-category-panel">{renderRecords("quotes")}{renderFiles(["Cotizaci\xF3n", "Propuesta"])}</section></>}
{tab === "history" && <div className="crm-timeline"><article><i /><div><strong>{t("Respuesta confirmada en CRM", "Confirmed CRM reply")}</strong><p>{row.status} · {t("Registro importado; el texto original se consulta en Comunicaciones.", "Imported record; the original message is available in Communications.")}</p></div></article>{contact.history.map((h) => <article key={h.id}><i /><div><strong>{h.title}</strong><small>{date(h.at)}</small></div></article>)}{contact.history.length === 0 && <p className="crm-muted">{t("Los cambios locales aparecer\xE1n aqu\xED.", "Local changes will appear here.")}</p>}</div>}

{tab === "legal" && <><section className="crm-category-panel">{renderRecords("contracts")}</section><section className="crm-category-panel"><h3>{t("Documentos legales", "Legal documents")}</h3>{renderFiles(["Contrato", "Otro"])}</section></>}
{tab === "payments" && <><section className="crm-category-panel">{renderRecords("payments")}</section><section className="crm-category-panel"><h3>{t("Comprobantes", "Receipts")}</h3>{renderFiles(["Comprobante"])}</section><button className="crm-secondary" onClick={() => {
    setSelected(null);
    setView("methods");
    const next = new URLSearchParams(params);
    next.delete("contact");
    next.delete("section");
    next.set("view", "methods");
    setParams(next, { replace: true });
  }}><CreditCard size={16} />{t("Administrar m\xE9todos de pago", "Manage payment methods")}</button></>}
{tab === "communications" && <><section className="crm-category-panel"><div className="crm-section-heading"><h3>{t("Conversaciones en OrtConnect", "Conversations in OrtConnect")}</h3><Link to={"/panel/mensajes?contact="+encodeURIComponent(row.id)}>{t("Ver este contacto", "View this contact")} <ArrowRight size={14}/></Link></div><p className="crm-muted">{t("Las conversaciones se consultan en OrtConnect; las tareas y notas del negocio permanecen aquí.", "Conversations are viewed in OrtConnect; business tasks and notes remain here.")}</p></section><div className="crm-category-grid"><section className="crm-category-panel">{renderRecords("actions")}</section><section className="crm-category-panel">{renderRecords("notes")}</section></div></>}
{tab === "projects" && <><section className="crm-category-panel">{renderRecords("projects")}</section><section className="crm-category-panel"><h3>{t("Entregables adjuntos", "Attached deliverables")}</h3>{renderFiles(["Entregable"])}</section></>}

</div></Modal>}
{form && <Modal title={titleOf(form.kind)} onClose={() => setForm(null)}><RecordForm key={form.kind + ":" + (form.record?.id || "new")} kind={form.kind} values={form.record} onSubmit={submitRecord} onClose={() => setForm(null)} en={en} workspace={workspace} contact={contact || { files: [] }} externalError={error} /></Modal>}
{help && <Modal title={t("Etapas y alcance", "Stages and scope")} onClose={() => setHelp(false)}><div className="crm-detail-body"><p>{t("Las etapas existentes se leen de Supabase al abrir el m\xF3dulo; los cambios nuevos son locales y manuales. No sobrescriben Supabase.", "Existing stages are read from Supabase when opening the module; new changes are local and manual. They do not overwrite Supabase.")}</p>{CONTACT_STAGES.map((s, i) => <div className="crm-help-stage" key={i}><Rating stage={i} en={en} /><div><strong>{s[en ? 2 : 0]}</strong><p>{s[en ? 3 : 1]}</p></div></div>)}<p className="crm-muted">{t("Sin env\xEDos autom\xE1ticos, firma electr\xF3nica, cobros, permisos ni sincronizaci\xF3n de estos cambios. Las notificaciones son recordatorios internos calculados mientras est\xE1 abierto el portal.", "No automatic sending, electronic signatures, charges, permissions or synchronization of these changes. Notifications are internal reminders calculated while the portal is open.")}</p></div></Modal>}

</div>;
}
function Empty({ t }) {
  return <div className="crm-empty"><Users size={24} /><p>{t("Sin registros para esta vista.", "No records for this view.")}</p></div>;
}
export {
  CommercialPortal as default
};
