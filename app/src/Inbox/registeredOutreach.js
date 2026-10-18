import { getContactChannel, getContactUrl } from '../Analytics/prospectChannels';
export function toRegisteredOutreach(rows){
 return rows.filter(row=>['Instagram','WhatsApp','Facebook'].includes(getContactChannel(row))&&row.contacted_at).map(row=>({
  id:row.id,notionId:row.notion_page_id,name:row.company,channel:getContactChannel(row),profileUrl:getContactUrl(row),
  date:row.contacted_at,status:row.status,notes:row.notes||'',subject:row.subject||''
 }));
}
export async function loadRegisteredOutreach(supabase){
 const base='id,notion_page_id,company,contacted_at,status,notes,subject,gmail_url';
 const rows=[];let legacy=false;
 for(let offset=0;;offset+=500){
  const request=columns=>supabase.from('sales_prospects').select(columns).order('contacted_at',{ascending:false,nullsFirst:false}).order('id').range(offset,offset+499);
  let result=await request(legacy?base:base+',contact_channel,contact_url');
  if(result.error&&['42703','PGRST204'].includes(result.error.code)){legacy=true;result=await request(base);}
  if(result.error)throw result.error;
  rows.push(...result.data);
  if(result.data.length<500)break;
 }
 return toRegisteredOutreach(rows);
}
