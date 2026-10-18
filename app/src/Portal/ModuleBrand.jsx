import {createElement} from 'react';
import { brandName, portalBrands } from './portalBrands';
import './ModuleBrand.css';
export default function ModuleBrand({id,as:Element='span',className='',dark=false}){
 const brand=portalBrands[id];
 if(!brand)return null;
 return createElement(Element,{className:'module-brand'+(dark?' module-brand-dark':'')+(className?' '+className:''),'aria-label':brandName(id)},<span className="module-brand-name" aria-hidden="true">{brand.name}</span>,<span className="module-brand-ai" aria-hidden="true">.AI</span>);
}
