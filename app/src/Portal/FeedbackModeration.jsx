import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/Language';
import './Moderation.css';
export const feedbackStatus = row => row.approved ? 'approved' : row.moderation_status === 'rejected' ? 'rejected' : 'pending';
export const feedbackLabel = (row, language) => ({ approved: language === 'en' ? 'Approved' : 'Aprobado', rejected: language === 'en' ? 'Rejected' : 'Rechazado', pending: language === 'en' ? 'Pending approval' : 'Pendiente de aprobación' })[feedbackStatus(row)];
export default function FeedbackModeration({ row, onSaved }) {
  const { language } = useLanguage();
  const en = language === 'en';
  const [pending, setPending] = useState(false), [notice, setNotice] = useState(null);
  async function moderate(status) {
    if (pending) return;
    setPending(true); setNotice(null);
    try {
      const { data, error } = await supabase.rpc('moderate_feedback', { p_id: row.id, p_status: status });
      if (error) throw error;
      if (!data || data.id !== row.id || data.moderation_status !== status) throw new Error('Invalid response');
      onSaved(data);
      setNotice({ text: en ? 'Decision saved.' : 'Decisión guardada.' });
    } catch (error) {
      const missing = ['PGRST202', '42883'].includes(error.code);
      setNotice({ error: true, text: missing ? (en ? 'Run feedback-moderation.sql in Supabase SQL Editor to enable moderation.' : 'Ejecuta feedback-moderation.sql en SQL Editor de Supabase para activar la moderación.') : (en ? 'Could not save the decision. Try again.' : 'No pudimos guardar la decisión. Inténtalo nuevamente.') });
    } finally { setPending(false); }
  }
  return <div className="portal-moderation" aria-busy={pending}>
    <span className={'portal-status ' + feedbackStatus(row)}>{feedbackLabel(row, language)}</span>
    <p>{en ? 'Approved testimonials appear on the public website. Rejected testimonials stay here for your records.' : 'Los testimonios aprobados aparecen en la página pública. Los rechazados se conservan en este panel.'}</p>
    <div className="portal-moderation-actions">
      <button className="approve" disabled={pending || feedbackStatus(row) === 'approved'} onClick={() => moderate('approved')}><Check size={17} />{en ? 'Approve testimonial' : 'Aprobar testimonio'}</button>
      <button className="reject" disabled={pending || feedbackStatus(row) === 'rejected'} onClick={() => moderate('rejected')}><X size={17} />{en ? 'Reject testimonial' : 'Rechazar testimonio'}</button>
    </div>
    {pending && <p role="status">{en ? 'Saving decision…' : 'Guardando decisión…'}</p>}
    {notice && <p role={notice.error ? 'alert' : 'status'}>{notice.text}</p>}
  </div>;
}
