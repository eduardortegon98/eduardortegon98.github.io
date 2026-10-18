import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: cors });

function textProperty(property: any): string {
  if (!property) return '';
  if (property.type === 'title' || property.type === 'rich_text') return (property[property.type] || []).map((v: any) => v.plain_text || v.text?.content || '').join('');
  if (property.type === 'select' || property.type === 'status') return property[property.type]?.name || '';
  if (property.type === 'email' || property.type === 'url' || property.type === 'phone_number') return property[property.type] || '';
  if (property.type === 'date') return property.date?.start || '';
  return '';
}
function deliveryFromNotes(notes: string): string {
  const s = notes.toLowerCase();
  if (s.includes('rebote permanente') || s.includes('dirección inexistente')) return 'rebotado';
  if (s.includes('envío bloqueado') || s.includes('envio bloqueado')) return 'bloqueado';
  if (s.includes('entrega retrasada') || s.includes('reintentando')) return 'retrasado';
  return 'sin confirmar';
}
function toRow(page: any) {
  const p = page.properties || {};
  const read = (name: string) => textProperty(p[name]).trim();
  const sector = read('Sector');
  const selectedCountry = read('País');
  const knownCountries = ['Colombia','México','Chile','España','Estados Unidos'];
  const inferred = knownCountries.find(c => sector.toLowerCase().includes(c.toLowerCase()));
  const date = read('Fecha de contacto');
  const notes = read('Próxima acción');
  const knownChannels=['Correo electrónico','Instagram','WhatsApp','LinkedIn','Facebook','Teléfono','Formulario web','Otro','Por verificar'];
  const configuredChannel=read('Canal de contacto');
  const subject=read('Asunto'),gmail=read('Enlace Gmail');
  const contactChannel=knownChannels.includes(configuredChannel)?configuredChannel:/^Contacto por Instagram\b/i.test(subject)?'Instagram':/^https:\/\/mail\.google\.com\//i.test(gmail)?'Correo electrónico':'Por verificar';
  const handle=contactChannel==='Instagram'?subject.match(/@([a-zA-Z0-9._]{1,30})\b/):null;
  const contactUrl=handle?'https://www.instagram.com/'+handle[1]+'/':contactChannel==='Correo electrónico'&&/^https:\/\/mail\.google\.com\//i.test(gmail)?gmail:null;
  return {
    contact_channel:contactChannel,
    contact_url:contactUrl,
    notion_page_id: page.id,
    company: read('Empresa') || 'Sin nombre',
    person: read('Persona') || null,
    email: read('Email') || null,
    country: selectedCountry && selectedCountry !== 'Por verificar' ? selectedCountry : inferred || null,
    sector: sector || null,
    status: read('Estado') || null,
    delivery_status: deliveryFromNotes(notes),
    contacted_at: date || null,
    subject: read('Asunto') || null,
    gmail_url: read('Enlace Gmail') || null,
    notes: notes || null,
    updated_at: new Date().toISOString(),
  };
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'POST') return reply(405, { error: 'method_not_allowed' });
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const notionToken = Deno.env.get('NOTION_API_KEY');
    const sourceId = Deno.env.get('NOTION_DATA_SOURCE_ID');
    if (!url || !anon || !service || !notionToken || !sourceId) return reply(503, { error: 'configuration_missing' });
    const bearer = req.headers.get('Authorization')?.match(/^Bearer (.+)$/i)?.[1];
    if (!bearer) return reply(401, { error: 'unauthorized' });
    const authClient = createClient(url, anon, { auth: { persistSession: false } });
    const { data: { user }, error: authError } = await authClient.auth.getUser(bearer);
    if (authError || !user) return reply(401, { error: 'unauthorized' });
    const admin = createClient(url, service, { auth: { persistSession: false } });
    const { data: profile, error: profileError } = await admin.from('portal_profiles').select('role').eq('id', user.id).single();
    if (profileError || profile?.role !== 'super_admin') return reply(403, { error: 'forbidden' });

    let cursor: string | undefined;
    let count = 0;
    let pagesRead = 0;
    do {
      const response = await fetch('https://api.notion.com/v1/data_sources/' + encodeURIComponent(sourceId) + '/query', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + notionToken, 'Notion-Version': '2025-09-03', 'Content-Type': 'application/json' },
        body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
      });
      if (!response.ok) {
        console.error('notion_sync_upstream', response.status);
        return reply(502, { error: 'notion_query_failed', synced: count, upstream_status: response.status });
      }
      const page = await response.json();
      if (!Array.isArray(page.results)) return reply(502, { error: 'notion_invalid_response' });
      const rows = page.results.filter((p: any) => p.object === 'page' && !p.archived && !p.in_trash).map(toRow);
      if (rows.length) {
        const { error } = await admin.from('sales_prospects').upsert(rows, { onConflict: 'notion_page_id' });
        if (error) {
          console.error('prospects_upsert_failed', error.code);
          return reply(500, { error: 'database_upsert_failed', synced: count });
        }
        count += rows.length;
      }
      cursor = page.has_more ? page.next_cursor : undefined;
      pagesRead++;
      if (pagesRead >= 100) return reply(409, { error: 'pagination_limit', synced: count });
    } while (cursor);
    return reply(200, { success: true, synced: count, pages: pagesRead });
  } catch (error) {
    console.error('prospects_sync_unexpected', error instanceof Error ? error.name : 'unknown');
    return reply(500, { error: 'sync_failed' });
  }
});
