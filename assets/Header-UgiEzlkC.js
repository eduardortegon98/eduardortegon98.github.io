import{u as b,a as u,r,j as e,L as o}from"./index-uc9U90eV.js";import{L as f}from"./Soluciones_Tecnologicas_Ortegon-BE8Dubus.js";import{c as x}from"./createLucideIcon-B5Og810q.js";const g=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],k=x("moon",g);const v=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],j=x("sun",v),h=[{label:"Log In",href:"/login"},{label:"Contacto",href:"/contacto"}],C=()=>{const{theme:a,setTheme:m}=b(),c=u(),[i,p]=r.useState(c.pathname),[l,n]=r.useState(!1);r.useEffect(()=>{p(c.pathname)},[c]),r.useEffect(()=>{const t=s=>{s.key==="Escape"&&n(!1)};return window.addEventListener("keydown",t),()=>{window.removeEventListener("keydown",t)}},[]);const d=()=>{m(t=>t==="dark"?"corporate":"dark")};return e.jsxs("header",{className:"sticky top-0 z-50",children:[e.jsx("div",{className:"pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-r from-cyan-400/15 via-sky-400/15 to-blue-500/15 blur-3xl"}),e.jsxs("div",{className:`
    border-b border-white/10 shadow-lg backdrop-blur-xl
    ${a==="dark"?"bg-black/80":"bg-[#474B4E]/80"}
  `,children:[e.jsx("div",{className:"mx-auto max-w-7xl px-4 sm:px-6",children:e.jsxs("div",{className:"flex h-20 items-center justify-between",children:[e.jsxs(o,{to:"/",onClick:()=>n(!1),className:"flex items-center gap-3",children:[e.jsx("img",{src:f,alt:"Soluciones Tecnológicas Ortegón",className:"h-12 w-12 rounded-xl border-2 border-[#C0FDB9] object-contain shadow-md"}),e.jsxs("div",{className:"text-white",children:[e.jsx("p",{className:"text-lg font-extrabold tracking-tight",children:"Soluciones Tecnológicas Ortegón"}),e.jsx("p",{className:"text-sm text-[#C0FDB9]/90",children:"Ingeniería, software e IA para tu negocio."})]})]}),e.jsxs("div",{className:"hidden items-center gap-6 md:flex",children:[e.jsx("nav",{className:"flex items-center gap-4",children:h.map(t=>{const s=i===t.href;return e.jsx(o,{to:t.href,className:["relative px-3 py-2 font-medium transition-all duration-200",s?"text-[#C0FDB9] underline decoration-[#C0FDB9]/70 underline-offset-4":"text-white/70 hover:text-[#C0FDB9] hover:underline hover:decoration-cyan-300"].join(" "),children:t.label},t.href)})}),e.jsx(o,{to:"/cotizar",className:`\r
                  rounded-full bg-[#C0FDB9]\r
                  px-5 py-2.5 text-sm font-bold text-black\r
                  shadow-lg transition\r
                  hover:brightness-110\r
                  focus:outline-none\r
                  focus-visible:ring-2\r
                  focus-visible:ring-[#C0FDB9]/50\r
                `,children:"Cotizar"}),e.jsx("button",{onClick:d,className:`\r
    inline-flex items-center gap-2\r
    rounded-xl bg-[#C0FDB9]\r
    px-4 py-2 text-sm font-semibold text-black\r
    transition hover:brightness-110\r
  `,children:a==="dark"?e.jsx(e.Fragment,{children:e.jsx(j,{size:18})}):e.jsx(e.Fragment,{children:e.jsx(k,{size:18})})})]}),e.jsx("button",{type:"button",onClick:()=>n(t=>!t),className:"text-2xl text-white focus:outline-none md:hidden",children:l?"✕":"☰"})]})}),l&&e.jsx("div",{className:"border-t border-white/20 bg-black/90 backdrop-blur-lg md:hidden",children:e.jsxs("nav",{className:"flex flex-col gap-2 px-4 py-4",children:[h.map(t=>{const s=i===t.href;return e.jsx(o,{to:t.href,onClick:()=>n(!1),className:["block rounded-lg px-3 py-2 text-sm font-semibold transition",s?"bg-[#C0FDB9]/30 text-[#C0FDB9]":"text-white/80 hover:bg-white/10 hover:text-white"].join(" "),children:t.label},t.href)}),e.jsx(o,{to:"/cotizar",onClick:()=>n(!1),className:`\r
                  mt-2 block rounded-lg\r
                  bg-[#C0FDB9]\r
                  px-4 py-3 text-center\r
                  text-sm font-bold text-black\r
                  transition hover:brightness-110\r
                `,children:"Cotizar"}),e.jsx("button",{onClick:()=>{d(),n(!1)},className:`\r
                  mt-2 rounded-lg\r
                  bg-[#C0FDB9]\r
                  px-4 py-3 text-sm font-bold text-black\r
                  transition hover:brightness-110\r
                `,children:a==="dark"?"Modo corporativo":"Modo oscuro"})]})})]})]})};export{C as default};
