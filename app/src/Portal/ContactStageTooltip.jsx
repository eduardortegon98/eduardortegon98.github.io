import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Info, Star } from 'lucide-react';
import { CONTACT_STAGES } from './contactStages';
import './ContactStageTooltip.css';

export default function ContactStageTooltip({ stage, en = false, children, compact = false }) {
  const id = useId(), trigger = useRef(null), bubble = useRef(null), root = useRef(null), timer = useRef(null);
  const [open, setOpen] = useState(false);
  const current = Number.isInteger(stage) && stage >= 0 && stage <= 5 ? stage : null;
  const label = en ? 'Contact stages and meanings' : 'Etapas del contacto y sus significados';
  function cancelClose() { clearTimeout(timer.current); }
  function reveal() { cancelClose(); setOpen(true); }
  function deferClose() { cancelClose(); timer.current = setTimeout(() => setOpen(false), 180); }
  useEffect(() => () => clearTimeout(timer.current), []);
  useLayoutEffect(() => {
    if (!open) return;
    const panel = bubble.current;
    const native = typeof panel.showPopover === 'function';
    if (native) panel.showPopover();
    function place() {
      const anchor = trigger.current.getBoundingClientRect();
      const box = panel.getBoundingClientRect();
      const viewport = window.visualViewport;
      const width = viewport?.width || window.innerWidth, height = viewport?.height || window.innerHeight;
      const offsetX = viewport?.offsetLeft || 0, offsetY = viewport?.offsetTop || 0;
      const left = Math.max(offsetX + 12, Math.min(anchor.left, offsetX + width - box.width - 12));
      const above = anchor.bottom + box.height + 16 > offsetY + height && anchor.top - offsetY > offsetY + height - anchor.bottom;
      const top = Math.max(offsetY + 12, Math.min(above ? anchor.top - box.height - 12 : anchor.bottom + 12, offsetY + height - box.height - 12));
      panel.style.left = left + 'px'; panel.style.top = top + 'px';
      panel.style.setProperty('--stage-arrow-x', Math.max(18, Math.min(anchor.left + anchor.width / 2 - left, box.width - 24)) + 'px');
      panel.dataset.side = above ? 'above' : 'below';
    }
    place();
    function outside(event) { if (!root.current?.contains(event.target)) setOpen(false); }
    function escape(event) { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false); } }
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    window.visualViewport?.addEventListener('resize', place);
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', escape, true);
    return () => {
      if (native && panel.matches(':popover-open')) panel.hidePopover();
      window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true);
      window.visualViewport?.removeEventListener('resize', place);
      document.removeEventListener('pointerdown', outside, true); document.removeEventListener('keydown', escape, true);
    };
  }, [open]);
  return <span ref={root} className="stage-hint-root">
    <button ref={trigger} type="button" className={'stage-hint-trigger' + (compact ? ' stage-hint-icon' : '')} aria-label={(current === null ? '' : (en ? 'Contact ' : 'Contacto ') + current + '. ') + label} aria-describedby={open ? id : undefined} onPointerEnter={event => { if (event.pointerType !== 'touch') reveal(); }} onPointerLeave={deferClose} onFocus={reveal} onBlur={deferClose} onClick={event => { event.stopPropagation(); reveal(); }}>
      {children || <Info size={15} aria-hidden="true"/>}
    </button>
    {open && <span ref={bubble} id={id} popover="manual" role="tooltip" className="stage-hint-bubble" onPointerEnter={cancelClose} onPointerLeave={deferClose}>
      <span className="stage-hint-title">{en ? 'Contact stages' : 'Etapas del contacto'}</span>
      <span className="stage-hint-list">{CONTACT_STAGES.map((item, index) => <span key={index} className={'stage-hint-row stage-color-' + index + (current === index ? ' is-current' : '')}>
        <span className="stage-hint-number">{index}</span><span><strong>{item[en ? 2 : 0]}{current === index && <em>{en ? 'Current' : 'Actual'}</em>}</strong><small>{item[en ? 3 : 1]}</small></span>
      </span>)}</span>
    </span>}
  </span>;
}
export function ContactStageBadge({ stage, en = false }) {
  return <ContactStageTooltip stage={stage} en={en}><span className={'stage-badge stage-color-' + stage}><span className="stage-badge-stars" aria-hidden="true">{[1,2,3,4,5].map(value => <Star key={value} size={12} fill={value <= stage ? 'currentColor' : 'none'}/>)}</span><span>{en ? 'Contact' : 'Contacto'} {stage}<Info size={12} aria-hidden="true"/></span></span></ContactStageTooltip>;
}
