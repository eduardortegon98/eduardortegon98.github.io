export const CONTACT_STAGES = [
  ['Conversando', 'Estamos en proceso de hablar.', 'In conversation', 'We are talking.'],
  ['Cotización enviada', 'Ya le enviamos una cotización.', 'Quote sent', 'We sent a quote.'],
  ['Oferta recibida', 'Nos respondió con una oferta.', 'Offer received', 'They replied with an offer.'],
  ['Oferta aceptada', 'Lo contactamos de vuelta y aceptó la oferta.', 'Offer accepted', 'We followed up and they accepted the offer.'],
  ['Firmado', 'Ya firmamos el acuerdo.', 'Signed', 'The agreement is signed.'],
  ['En ejecución', 'Ya estamos trabajando con el cliente.', 'In progress', 'We are working with the client.'],
];
export function isQualifiedContact(row) {
  return ['Respondió', 'Interesado', 'Reunión', 'Cotización', 'Ganado'].includes(row.status)
    && !/^Registro técnico:/i.test(row.company || '')
    && !['rebotado', 'bloqueado'].includes(row.delivery_status)
    && !/rebote permanente|env[ií]o bloqueado/i.test(row.notes || '');
}
export async function loadQualifiedContacts(client) {
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client.from('sales_prospects').select('id,company,person,email,status,delivery_status,notes,subject,gmail_url').order('company').order('id').range(offset, offset + 499);
    if (error) throw error;
    rows.push(...data.filter(isQualifiedContact));
    if (data.length < 500) return rows;
  }
}
