const uid = () => globalThis.crypto.randomUUID();
const now = () => (/* @__PURE__ */ new Date()).toISOString();
const emptyWorkspace = () => ({ version: 1, contacts: {}, methods: [], team: [], read: [], events: [] });
function storageKey(userId) {
  return `ortdesk:commercial:v1:${userId}`;
}
function loadWorkspace(userId) {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(userId)) || "null");
    return parsed?.version === 1 ? { ...emptyWorkspace(), ...parsed } : emptyWorkspace();
  } catch {
    return emptyWorkspace();
  }
}
function saveWorkspace(userId, data) {
  localStorage.setItem(storageKey(userId), JSON.stringify(data));
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('ortdesk:commercial-change',{detail:{userId}}));
}
function contactData(workspace, id) {
  return { profile: {}, stage: 0, notes: [], actions: [], files: [], quotes: [], contracts: [], payments: [], projects: [], history: [], ...workspace.contacts[id] };
}
function money(value, currency = "COP", en = false) {
  return new Intl.NumberFormat(en ? "en-US" : "es-CO", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(value) || 0);
}
function balance(contact, currency) {
  return contact.payments.filter((p) => p.currency === currency).reduce((a, p) => a + Number(p.amount || 0) - (p.status === "paid" ? Number(p.amount || 0) : 0), 0);
}
function duplicateGroups(rows, workspace) {
  const groups = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const p = contactData(workspace, row.id).profile;
    for (const [type, value] of [["email", p.email || row.email], ["phone", p.phone], ["company", row.company]]) {
      const normalized = String(value || "").toLowerCase().replace(type === "phone" ? /\D/g : /\s+/g, "").trim();
      if (!normalized) continue;
      const key = type + ":" + normalized;
      groups.set(key, [...groups.get(key) || [], row]);
    }
  }
  return [...groups.entries()].filter(([, rows2]) => rows2.length > 1).map(([key, rows2]) => ({ key, rows: rows2 }));
}
function reminders(rows, workspace, at = /* @__PURE__ */ new Date()) {
  const list = [];
  for (const row of rows) {
    const c = contactData(workspace, row.id);
    for (const a of c.actions.filter((a2) => !a2.done && a2.due)) {
      list.push({ id: "action:" + a.id, contactId: row.id, title: a.title, company: row.company, due: a.due, kind: "action", overdue: new Date(a.due) < at });
    }
    for (const p of c.payments.filter((p2) => p2.status !== "paid" && p2.due)) {
      list.push({ id: "payment:" + p.id, contactId: row.id, title: p.title, company: row.company, due: p.due, kind: "payment", overdue: /* @__PURE__ */ new Date(p.due + "T23:59:59") < at });
    }
    for (const p of c.contracts.filter((p2) => p2.status === "sent")) list.push({ id: "contract:" + p.id, contactId: row.id, title: p.title, company: row.company, kind: "contract" });
  }
  return list.sort((a, b) => String(a.due || "9999").localeCompare(String(b.due || "9999")));
}
function metrics(rows, workspace) {
  const byChannel = {};
  let quotes = 0, wins = 0;
  const revenue = {};
  for (const row of rows) {
    const c = contactData(workspace, row.id), channel = c.profile.channel || row.channel || "Por verificar";
    const group = byChannel[channel] ??= { contacts: 0, quotes: 0, wins: 0 };
    group.contacts++;
    group.quotes += c.quotes.length;
    quotes += c.quotes.length;
    if (c.stage >= 4) {
      group.wins++;
      wins++;
    }
    for (const p of c.payments.filter((p2) => p2.status === "paid")) revenue[p.currency] = (revenue[p.currency] || 0) + Number(p.amount || 0);
  }
  return { contacts: rows.length, quotes, wins, revenue, byChannel };
}
let database;
function openFiles() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open("ortdesk-commercial-files", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return database;
}
async function putFile(key, file) {
  const db = await openFiles();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(file, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error("File transaction aborted"));
  });
}
async function getFile(key) {
  const db = await openFiles();
  return new Promise((resolve, reject) => {
    const request = db.transaction("files").objectStore("files").get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function deleteFile(key) {
  const db = await openFiles();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").delete(key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
export {
  balance,
  contactData,
  deleteFile,
  duplicateGroups,
  emptyWorkspace,
  getFile,
  loadWorkspace,
  metrics,
  money,
  now,
  putFile,
  reminders,
  saveWorkspace,
  storageKey,
  uid
};
