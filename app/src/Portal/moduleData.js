import { supabase } from '../lib/supabase';
export async function readAll(buildQuery){
 const rows=[];
 for(let offset=0;;offset+=500){
  const result=await buildQuery().range(offset,offset+499);
  if(result.error)throw result.error;
  rows.push(...result.data);
  if(result.data.length<500)return rows;
 }
}
export const readClientModules=userId=>readAll(()=>supabase.from('portal_module_assignments').select('module').eq('user_id',userId).order('module'));
export const readModuleCatalog=()=>readAll(()=>supabase.from('portal_modules').select('id,name_es,name_en,category,enabled').eq('enabled',true).order('id'));
