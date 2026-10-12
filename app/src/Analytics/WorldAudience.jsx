import { useState } from 'react';
import shapes from './worldShapes.json';
const aliases = { 'United States of America': 'United States', 'England': 'United Kingdom', 'Russia': 'Russia', 'Democratic Republic of the Congo': 'Congo - Kinshasa', 'Republic of the Congo': 'Congo - Brazzaville', 'United Republic of Tanzania': 'Tanzania', 'Republic of Serbia': 'Serbia', 'South Korea': 'South Korea' };
export default function WorldAudience({ rows, status, en, compact = false, onCountrySelect }) {
  const [selected, setSelected] = useState(null);
  const counts = new Map((rows || []).map(row => [row.label, row.value]));
  const max = Math.max(1, ...(rows || []).map(row => row.value));
  const ready = Array.isArray(rows) && status !== 'unavailable';
  const format = number => new Intl.NumberFormat(en ? 'en-US' : 'es-CO').format(number);
  return <section className={'world-audience' + (compact ? ' compact' : '')}>
    <div className="world-map-title"><span>{en ? 'GLOBAL AUDIENCE' : 'AUDIENCIA GLOBAL'}</span><small>{en ? 'Sessions by country' : 'Sesiones por país'}</small></div>
    <svg viewBox="0 0 720 330" role="group" aria-label={en ? 'Audience world map' : 'Mapa mundial de audiencia'}>
    {shapes.map(shape => { const label = aliases[shape.name] || shape.name; const value = counts.get(label); const active = selected?.label === label; return <path key={shape.name} d={shape.path} fill={value > 0 ? `hsl(166 65% ${73 - value / max * 35}%)` : '#e1ebe8'} stroke="#ffffff" strokeWidth=".65" className={active ? 'is-active' : ''} tabIndex={!compact && value > 0 ? 0 : undefined} role={!compact && value > 0 ? 'button' : undefined} aria-label={value > 0 ? label + ': ' + format(value) : undefined} onMouseEnter={() => setSelected({label,value})} onMouseLeave={() => setSelected(null)} onFocus={() => setSelected({label,value})} onBlur={() => setSelected(null)} onClick={() => { setSelected({label,value}); if(value > 0) onCountrySelect?.(label); }} onKeyDown={event => { if(event.key === 'Enter' || event.key === ' ') {event.preventDefault();setSelected({label,value});if(value > 0) onCountrySelect?.(label);} }}><title>{label}{value !== undefined ? ': ' + format(value) : ''}</title></path>; })}
    </svg>
    {!compact && <><p className="world-map-status" role="status">{!ready ? (en ? 'Geography connection pending. Deploy the updated Supabase function.' : 'Conexión geográfica pendiente. Despliega la función actualizada de Supabase.') : selected ? selected.label + ' · ' + (selected.value !== undefined ? format(selected.value) + (en ? ' sessions' : ' sesiones') : (en ? 'No reported data' : 'Sin datos reportados')) : rows.length ? (en ? 'Select a country to explore its traffic.' : 'Selecciona un país para explorar su tráfico.') : (en ? 'No geographic data in this period.' : 'No hay datos geográficos en este periodo.')}</p>{ready && rows.length > 0 && <ul className="world-country-list">{rows.slice(0, 10).map(row => <li key={row.label}><span>{row.label}</span><strong>{format(row.value)}</strong></li>)}</ul>}<small className="world-map-note">{en ? 'Approximate aggregate country data. This is not a live visitor locator. Low-resolution map: Natural Earth / world.geo.json.' : 'Datos agregados aproximados por país. No indica la ubicación de visitantes en vivo. Mapa simplificado: Natural Earth / world.geo.json.'}</small></>}
  </section>;
}
