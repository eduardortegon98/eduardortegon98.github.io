const f = (key, es, en, type = "text", extra = {}) => ({ key, es, en, type, ...type === "select" ? { required: true } : {}, ...extra });
const opt = (...pairs) => pairs.map(([value, es, en]) => ({ value, es, en }));
const channels = ["Email", "Instagram", "WhatsApp", "Facebook", "LinkedIn", "Tel\xE9fono", "Formulario web"];
const currencies = ["COP", "USD", "EUR"];
const schemas = {
  profile: [f("person", "Persona de contacto", "Contact person"), f("email", "Correo", "Email", "email"), f("phone", "Tel\xE9fono", "Phone", "tel"), f("channel", "Canal preferido", "Preferred channel", "select", { options: channels }), f("service", "Servicio solicitado", "Requested service"), f("budget", "Presupuesto estimado", "Estimated budget", "number"), f("currency", "Moneda", "Currency", "select", { options: currencies }), f("owner", "Responsable", "Owner", "team"), f("needs", "Necesidades y acuerdos", "Needs and agreements", "textarea")],
  notes: [f("title", "Nota interna", "Internal note", "textarea", { required: true })],
  actions: [f("title", "Pr\xF3xima acci\xF3n", "Next action", "text", { required: true }), f("due", "Fecha y hora", "Date and time", "datetime-local", { required: true }), f("owner", "Responsable", "Owner", "team")],
  quotes: [f("title", "Nombre de la propuesta", "Proposal name", "text", { required: true }), f("amount", "Valor", "Amount", "number", { required: true }), f("currency", "Moneda", "Currency", "select", { options: currencies }), f("version", "Versi\xF3n", "Version", "text", { required: true }), f("due", "Vigencia", "Valid until", "date", { required: true }), f("status", "Estado", "Status", "select", { options: opt(["draft", "Borrador", "Draft"], ["sent", "Enviada", "Sent"], ["accepted", "Aceptada", "Accepted"], ["rejected", "Rechazada", "Rejected"]) }), f("fileId", "Archivo vinculado", "Linked file", "files")],
  contracts: [f("title", "Nombre del contrato", "Contract name", "text", { required: true }), f("version", "Versi\xF3n", "Version", "text", { required: true }), f("status", "Estado", "Status", "select", { options: opt(["draft", "Borrador", "Draft"], ["sent", "Enviado a firma", "Sent for signature"], ["signed", "Firmado", "Signed"]) }), f("signedAt", "Fecha de firma", "Signature date", "date"), f("fileId", "Archivo vinculado", "Linked file", "files")],
  payments: [f("title", "Concepto / anticipo", "Description / deposit", "text", { required: true }), f("amount", "Valor", "Amount", "number", { required: true }), f("currency", "Moneda", "Currency", "select", { options: currencies }), f("due", "Vencimiento", "Due date", "date", { required: true }), f("status", "Estado", "Status", "select", { options: opt(["pending", "Pendiente", "Pending"], ["paid", "Pagado (registro manual)", "Paid (manual record)"]) }), f("methodId", "M\xE9todo de pago", "Payment method", "methods"), f("reference", "Referencia / comprobante", "Reference / receipt"), f("fileId", "Comprobante adjunto", "Attached receipt", "files")],
  projects: [f("title", "Proyecto / entregable", "Project / deliverable", "text", { required: true }), f("due", "Fecha de entrega", "Due date", "date", { required: true }), f("owner", "Responsable", "Owner", "team"), f("status", "Estado", "Status", "select", { options: opt(["planned", "Planeado", "Planned"], ["progress", "En ejecuci\xF3n", "In progress"], ["review", "En aprobaci\xF3n", "Awaiting approval"], ["approved", "Aprobado", "Approved"]) }), f("milestones", "Hitos y tareas (uno por l\xEDnea)", "Milestones and tasks (one per line)", "textarea")],
  methods: [f("title", "Nombre del m\xE9todo", "Method name", "text", { required: true }), f("kind", "Tipo", "Type", "select", { options: ["Transferencia bancaria", "Nequi", "Daviplata", "Tarjeta", "PayPal", "Stripe", "Mercado Pago", "Efectivo", "Otro"] }), f("currency", "Moneda", "Currency", "select", { options: currencies }), f("instructions", "Instrucciones / referencia comercial", "Instructions / business reference", "textarea"), f("url", "Enlace de pago (opcional)", "Payment link (optional)", "url")],
  team: [f("title", "Nombre del responsable", "Owner name", "text", { required: true }), f("email", "Correo", "Email", "email")],
  conversion: [f("accountEmail", "Correo de la cuenta a vincular", "Account email to link", "email", { required: true }), f("projectName", "Proyecto inicial", "Initial project", "text", { required: true })]
};
function initialValues(fields) {
  return Object.fromEntries(fields.map((f2) => [f2.key, Array.isArray(f2.options) ? (typeof f2.options[0] === "string" ? f2.options[0] : f2.options[0]?.value) || "" : f2.key === "version" ? "1.0" : ""]));
}
export {
  channels,
  currencies,
  initialValues,
  schemas
};
