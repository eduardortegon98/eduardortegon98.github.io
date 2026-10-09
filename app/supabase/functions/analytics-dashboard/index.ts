// Deploy with JWT verification enabled. Google credentials stay in Edge secrets.
const cache = new Map<number, { expires: number; data: unknown }>();
let token: { value: string; expires: number } | undefined;
const encoder = new TextEncoder();
const base64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
const encode = (value: unknown) => base64url(encoder.encode(JSON.stringify(value)));

async function googleToken() {
  if (token && token.expires > Date.now() + 60000) return token.value;
  const account = JSON.parse(Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON') || '{}');
  if (!account.client_email || !account.private_key) throw new Error('configuration');
  const pem = account.private_key.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({ iss: account.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(unsigned));
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', signal: AbortSignal.timeout(15000),
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${base64url(new Uint8Array(signature))}` }),
  });
  if (!response.ok) throw new Error('google_auth');
  const result = await response.json();
  if (!result.access_token) throw new Error('google_auth');
  token = { value: result.access_token, expires: Date.now() + Number(result.expires_in || 3600) * 1000 };
  return token.value;
}

async function report(method: string, body: unknown, accessToken: string) {
  const property = Deno.env.get('GA_PROPERTY_ID') || '';
  if (!/^\d+$/.test(property)) throw new Error('configuration');
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:${method}`, {
    method: 'POST', signal: AbortSignal.timeout(20000),
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('google_report');
  return response.json();
}
type Row = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
const numberAt = (row: Row | undefined, index: number) => Number(row?.metricValues?.[index]?.value || 0);
const ranked = (result: { rows?: Row[] }) => (result.rows || []).map(row => ({ label: row.dimensionValues?.[0]?.value || '(not set)', value: numberAt(row, 0) }));

Deno.serve(async request => {
  const origin = request.headers.get('origin');
  const permitted = (Deno.env.get('ANALYTICS_ALLOWED_ORIGINS') || 'https://solucionesortegon.com,https://www.solucionesortegon.com').split(',').map(value => value.trim());
  const cors = { 'Access-Control-Allow-Origin': origin && permitted.includes(origin) ? origin : permitted[0], 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin', 'Cache-Control': 'no-store' };
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
  if (origin && !permitted.includes(origin)) return json(403, { error: 'origin_denied' });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  const authorization = request.headers.get('authorization') || '';
  if (!/^Bearer \S+$/.test(authorization)) return json(401, { error: 'unauthorized' });
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_ANON_KEY');
    if (!url || !key) throw new Error('configuration');
    const headers = { Authorization: authorization, apikey: key };
    // Verify the current user with Auth, then read their server-controlled role.
    const userResponse = await fetch(`${url}/auth/v1/user`, { headers, signal: AbortSignal.timeout(10000) });
    if (!userResponse.ok) return json(401, { error: 'unauthorized' });
    const user = await userResponse.json();
    if (!user.id) return json(401, { error: 'unauthorized' });
    const roleResponse = await fetch(`${url}/rest/v1/portal_profiles?select=role&id=eq.${encodeURIComponent(user.id)}`, { headers, signal: AbortSignal.timeout(10000) });
    if (!roleResponse.ok) return json(403, { error: 'forbidden' });
    const roles = await roleResponse.json();
    if (roles?.[0]?.role !== 'super_admin') return json(403, { error: 'forbidden' });
    const text = await request.text();
    if (text.length > 1000) return json(400, { error: 'invalid_request' });
    let body;
    try { body = JSON.parse(text); } catch { return json(400, { error: 'invalid_request' }); }
    const days = body.days;
    if (![7, 30, 90].includes(days)) return json(400, { error: 'invalid_range' });
    const cached = cache.get(days);
    if (cached && cached.expires > Date.now()) return json(200, cached.data);
    const accessToken = await googleToken();
    const dateRanges = [{ startDate: `${days - 1}daysAgo`, endDate: 'today' }];
    const metricNames = ['activeUsers', 'sessions', 'screenPageViews'];
    const summaryQuery = { dateRanges, metrics: metricNames.map(name => ({ name })) };
    const rankingQuery = (dimension: string, metric: string) => ({ dateRanges, dimensions: [{ name: dimension }], metrics: [{ name: metric }], orderBys: [{ metric: { metricName: metric }, desc: true }], limit: 10 });
    const [summary, daily, sources, pages, devices, leads, realtime] = await Promise.all([
      report('runReport', summaryQuery, accessToken),
      report('runReport', { ...summaryQuery, dimensions: [{ name: 'date' }], orderBys: [{ dimension: { dimensionName: 'date' } }], limit: 90 }, accessToken),
      report('runReport', rankingQuery('sessionSourceMedium', 'sessions'), accessToken),
      report('runReport', rankingQuery('pagePath', 'screenPageViews'), accessToken),
      report('runReport', rankingQuery('deviceCategory', 'sessions'), accessToken),
      report('runReport', { dateRanges, metrics: [{ name: 'eventCount' }], dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: 'generate_lead' } } } }, accessToken),
      report('runRealtimeReport', { metrics: [{ name: 'activeUsers' }] }, accessToken),
    ]);
    const rawDaily = new Map((daily.rows || []).map((row: Row) => [row.dimensionValues?.[0]?.value, row]));
    // Fill quiet dates so the chart does not jump across missing days (Bogotá).
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    const timeline = Array.from({ length: days }, (_, i) => {
      const date = new Date(today + 'T12:00:00Z'); date.setUTCDate(date.getUTCDate() - days + 1 + i);
      const iso = date.toISOString().slice(0, 10);
      const row = rawDaily.get(iso.replace(/-/g, '')) as Row | undefined;
      return { date: iso, activeUsers: numberAt(row, 0), sessions: numberAt(row, 1), screenPageViews: numberAt(row, 2) };
    });
    const data = { days, updatedAt: new Date().toISOString(), summary: Object.fromEntries(metricNames.map((name, i) => [name, numberAt(summary.rows?.[0], i)])), daily: timeline, sources: ranked(sources), pages: ranked(pages), devices: ranked(devices), leads: numberAt(leads.rows?.[0], 0), realtime: { activeUsers: numberAt(realtime.rows?.[0], 0) } };
    cache.set(days, { expires: Date.now() + 60000, data });
    return json(200, data);
  } catch {
    // Never return credentials, tokens or raw upstream responses.
    return json(503, { error: 'analytics_unavailable' });
  }
});
