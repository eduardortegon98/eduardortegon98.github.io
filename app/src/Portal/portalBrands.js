// Display names only. Product IDs, routes, assignments and stored data stay stable.
export const portalBrands={
 finance:{name:'OrtBalance',description:{es:'Finanzas personales',en:'Personal finances'}},
 analytics:{name:'OrtLens',description:{es:'Analítica',en:'Analytics'}},
 commercial:{name:'OrtFlow',description:{es:'Gestión comercial',en:'Commercial management'}},
 messages:{name:'OrtConnect',description:{es:'Mensajes',en:'Messages'}},
 arturito:{name:'Arturito',description:{es:'Cuidado de mascotas',en:'Pet care'}},
 websites:{name:'OrtSites',description:{es:'Sitios web',en:'Websites'}},
 assignments:{name:'OrtAccess',description:{es:'Asignación de módulos',en:'Module assignments'}},
 ortdesk_ai:{name:'OrtDesk',description:{es:'Conocimiento del negocio',en:'Business knowledge'}}
};
export const brandName=id=>portalBrands[id]?portalBrands[id].name+'.AI':'';
