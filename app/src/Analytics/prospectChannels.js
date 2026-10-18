export const CONTACT_CHANNELS=['Correo electrónico','Instagram','WhatsApp','LinkedIn','Facebook','Teléfono','Formulario web','Otro','Por verificar'];
export function getContactChannel(item){
 if(CONTACT_CHANNELS.includes(item.contact_channel))return item.contact_channel;
 if(/^Contacto por Instagram\b/i.test(item.subject||''))return 'Instagram';
 if(/^https:\/\/mail\.google\.com\//i.test(item.gmail_url||''))return 'Correo electrónico';
 return 'Por verificar';
}
export function getContactUrl(item){
 const channel=getContactChannel(item);
 if(item.contact_url){try{const url=new URL(item.contact_url);if(url.protocol==='https:')return url.href;}catch{}}
 if(channel==='Instagram'){
  const handle=(item.subject||'').match(/@([a-zA-Z0-9._]{1,30})\b/);
  if(handle)return 'https://www.instagram.com/'+handle[1]+'/';
 }
 if(channel==='Correo electrónico'&&/^https:\/\/mail\.google\.com\//i.test(item.gmail_url||''))return item.gmail_url;
 return '';
}
export const channelClass=channel=>({'Correo electrónico':'email',Instagram:'instagram',WhatsApp:'whatsapp',LinkedIn:'linkedin',Facebook:'facebook','Teléfono':'phone','Formulario web':'web',Otro:'other','Por verificar':'unknown'}[channel]||'unknown');
