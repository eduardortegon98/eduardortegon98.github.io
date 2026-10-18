import { useState } from 'react';
import ModuleBrand from './ModuleBrand';
import { NavLink } from 'react-router-dom';
import { Search } from 'lucide-react';
import { availableModules, moduleTitle } from './modules';
export default function ModuleNavigation({role,modules,language,onNavigate}){
 const en=language==='en',all=availableModules(role,modules);
 const [query,setQuery]=useState(''),[category,setCategory]=useState(''),[limit,setLimit]=useState(20);
 const categories=[...new Map(all.map(module=>[module.category,module.categoryLabel])).entries()];
 const filtered=all.filter(module=>(!category||module.category===category)&&moduleTitle(module,language).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 return <>{all.length>8&&<div className="module-nav-search"><label><Search size={14}/><input aria-label={en?'Find module':'Buscar módulo'} placeholder={en?'Find module':'Buscar módulo'} value={query} onChange={event=>{setQuery(event.target.value);setLimit(20);}}/></label><select aria-label={en?'Module category':'Categoría de módulos'} value={category} onChange={event=>{setCategory(event.target.value);setLimit(20);}}><option value="">{en?'All categories':'Todas las categorías'}</option>{categories.map(([id,label])=><option key={id} value={id}>{label[language]||label.es}</option>)}</select></div>}
 {filtered.slice(0,limit).map(module=><NavLink key={module.id} to={module.path} onClick={onNavigate} title={module.categoryLabel[language]||module.categoryLabel.es}><module.icon size={19}/><ModuleBrand id={module.id}/>{module.tag&&<small>{module.tag}</small>}</NavLink>)}
 {filtered.length>limit&&<button className="module-nav-more" onClick={()=>setLimit(value=>value+20)}>{en?'Show more':'Ver más'} ({filtered.length-limit})</button>}
 {all.length>8&&!filtered.length&&<p className="module-nav-empty">{en?'No matching modules':'Sin coincidencias'}</p>}</>;
}
