import { useEffect, useRef, useState } from 'react';
import { GripVertical, Globe2, Settings2, Check, ArrowUp, ArrowDown, RotateCcw, X } from 'lucide-react';
import './EditableBoard.css';
export default function EditableBoard({ widgets, storageKey, en, editing = false }) {
  const groups = [
    {id:'summary',title:en?'Overview':'Resumen',note:en?'Key figures for the selected period':'Cifras clave del periodo seleccionado',ids:['activeUsers','sessions','screenPageViews','leads']},
    {id:'audience',title:en?'Audience & trends':'Audiencia y tendencias',note:en?'Where visitors are and how traffic changes':'Dónde están los visitantes y cómo evoluciona el tráfico',ids:['map','detail']},
    {id:'acquisition',title:en?'Acquisition & activity':'Adquisición y actividad',note:en?'Channels, devices, pages and realtime':'Canales, dispositivos, páginas y tiempo real',ids:['sources','devices','pages','realtime']},
    {id:'management',title:en?'Business management':'Gestión del negocio',note:en?'Requests and conversations':'Solicitudes y conversaciones',ids:['management']}
  ];
  const detailWidget = widgets.find(widget => widget.id === 'detail');
  const groupFor = id => groups.find(group => group.ids.includes(id))?.id;
  const ids = widgets.map(widget => widget.id);
  const [layout, setLayout] = useState(() => {
    try { const saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); if(saved && Array.isArray(saved.order) && Array.isArray(saved.hidden)) return {order:[...saved.order.filter(id => ids.includes(id)),...ids.filter(id => !saved.order.includes(id))],hidden:saved.hidden.filter(id => ids.includes(id))}; } catch {}
    return {order:ids,hidden:[]};
  });
  const [dragged, setDragged] = useState(null), [notice, setNotice] = useState('');
  const dragId = useRef(null);
  useEffect(() => {try {localStorage.setItem(storageKey,JSON.stringify(layout));}catch {setNotice(en ? 'Layout could not be saved in this browser.' : 'No pudimos guardar la distribución en este navegador.');}},[layout,storageKey,en]);
  function move(id, target) {
    if(!id || id === target) return;
    if(groupFor(id)!==groupFor(target)){setNotice(en?'Move cards within the same section.':'Mueve las tarjetas dentro de su misma sección.');return;}
    setLayout(current => {const order=current.order.filter(key => key !== id);order.splice(order.indexOf(target),0,id);return {...current,order};});
  }
  function step(id, delta) {
    setLayout(current => {
      const groupIds=current.order.filter(key=>groupFor(key)===groupFor(id));
      const index=groupIds.indexOf(id),next=index+delta;if(next<0 || next>=groupIds.length)return current;
      const target=groupIds[next],order=[...current.order],from=order.indexOf(id),to=order.indexOf(target);
      [order[from],order[to]]=[order[to],order[from]];
      return {...current,order};
    });
  }
  const titles = Object.fromEntries(widgets.map(widget => [widget.id,widget.title]));
  return <section className="editable-dashboard">

    {editing && <div className="editable-board-settings" id="dashboard-personalization"><p>{en ? 'Move cards within each section. Uncheck a card to hide it.' : 'Reordena tarjetas dentro de cada sección. Desmarca una tarjeta para ocultarla.'}</p><ul>{layout.order.map((id,index) => <li key={id}><label><input type="checkbox" checked={!layout.hidden.includes(id)} onChange={event => setLayout(current => ({...current,hidden:event.target.checked?current.hidden.filter(key=>key!==id):[...current.hidden,id]}))}/>{titles[id]}</label><button aria-label={(en?'Move up: ':'Subir: ')+titles[id]} disabled={layout.order.filter(key=>groupFor(key)===groupFor(id)).indexOf(id)===0} onClick={()=>step(id,-1)}><ArrowUp size={14}/></button><button aria-label={(en?'Move down: ':'Bajar: ')+titles[id]} disabled={layout.order.filter(key=>groupFor(key)===groupFor(id)).at(-1)===id} onClick={()=>step(id,1)}><ArrowDown size={14}/></button></li>)}</ul><button className="compact-action" aria-label={en?'Restore layout':'Restaurar distribución'} title={en?'Restore layout':'Restaurar distribución'} onClick={()=>setLayout({order:ids,hidden:[]})}><RotateCcw size={17} aria-hidden="true"/></button></div>}
    {notice && <p role="status">{notice}</p>}
    <div className={'sectioned-board ' + (detailWidget?.content && !layout.hidden.includes('detail') ? 'has-detail-column' : '')}>{groups.map(group=>{
      const visible=layout.order.filter(id=>group.ids.includes(id)&&id!=='detail'&&!layout.hidden.includes(id)).filter(id=>editing||widgets.find(widget=>widget.id===id)?.content);
      if(!visible.length)return null;
      return <section key={group.id} className={'analytics-section section-'+group.id} aria-labelledby={'section-'+group.id}><header className="analytics-section-heading"><h2 id={'section-'+group.id}>{group.title}</h2>{group.id === 'audience' && <Globe2 size={18} aria-hidden="true"/>}<p>{group.note}</p></header><div className={'editable-board '+(editing?'is-editing':'')}>{layout.order.filter(id=>group.ids.includes(id)&&id!=='detail'&&!layout.hidden.includes(id)).map(id=>{const widget=widgets.find(widget=>widget.id===id);if(!widget || ((!widget.content) && !editing))return null;return <div key={id} className={'editable-widget '+(widget.className||'')+(dragged===id?' is-dragging':'')} onDragOver={event=>{if(dragId.current){event.preventDefault();event.dataTransfer.dropEffect='move';}}} onDrop={event=>{event.preventDefault();move(dragId.current,id);dragId.current=null;setDragged(null);}}>{editing && <div className="editable-widget-tools"><button draggable onDragStart={event=>{dragId.current=id;setDragged(id);event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',id);}} onDragEnd={()=>{dragId.current=null;setDragged(null);}} aria-label={(en?'Drag card: ':'Arrastrar tarjeta: ')+widget.title}><GripVertical size={16}/></button><span>{widget.title}</span><button aria-label={(en?'Hide card: ':'Ocultar tarjeta: ')+widget.title} onClick={()=>setLayout(current=>({...current,hidden:[...current.hidden,id]}))}><X size={14}/></button></div>}{widget.content}</div>;})}</div></section>;
    })}{detailWidget?.content && !layout.hidden.includes('detail') && <section className="analytics-section section-detail" aria-label={en?'Expanded metric':'Métrica ampliada'}>{detailWidget.content}</section>}</div>
    {layout.hidden.length===ids.length && <p className="editable-empty">{en?'All cards are hidden. Customize the panel to restore them.':'Todas las tarjetas están ocultas. Personaliza el panel para restaurarlas.'}</p>}
  </section>;
}
