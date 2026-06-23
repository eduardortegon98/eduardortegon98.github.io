import{u as p,a as h,r as s,j as r,L as n}from"./index-CGfH34VH.js";import{c as m}from"./createLucideIcon-NaeO8xH-.js";const v=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],b=m("moon",v);const u=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],g=m("sun",u),f="/assets/Soluciones_Tecnologicas_Ortegon-B9Kg2oqi.png",d=[{label:"Login",href:"/login"},{label:"Contacto",href:"/contacto"}],j=()=>{const{theme:c,setTheme:x}=p(),{pathname:a}=h(),[l,t]=s.useState(!1);s.useEffect(()=>{const e=o=>{o.key==="Escape"&&t(!1)};return window.addEventListener("keydown",e),()=>{window.removeEventListener("keydown",e)}},[]),s.useEffect(()=>{t(!1)},[a]);const i=()=>{x(e=>e==="dark"?"corporate":"dark")};return r.jsxs("header",{className:"sticky top-0 z-50",children:[r.jsx("div",{className:"pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-r from-cyan-400/15 via-sky-400/15 to-blue-500/15 blur-3xl"}),r.jsxs("div",{className:`\r
          border-b border-[var(--color-border)]\r
          bg-[var(--color-bg)]\r
          shadow-lg backdrop-blur-xl\r
        `,children:[r.jsx("div",{className:"mx-auto max-w-7xl px-4 sm:px-6",children:r.jsxs("div",{className:"flex h-20 items-center justify-between",children:[r.jsxs(n,{to:"/",className:"flex items-center gap-3",children:[r.jsx("img",{src:f,alt:"Soluciones Tecnológicas Ortegón",className:`\r
                  h-12 w-12 rounded-xl\r
                  border-2 border-[var(--color-primary)]\r
                  object-contain shadow-md\r
                `}),r.jsxs("div",{className:"hidden sm:block text-[var(--color-text)]",children:[r.jsx("p",{className:"text-lg font-extrabold tracking-tight",children:"Soluciones Tecnológicas Ortegón"}),r.jsx("p",{className:"text-sm text-[var(--color-primary)]",children:"Ingeniería, software e IA para tu negocio."})]})]}),r.jsxs("div",{className:"hidden items-center gap-6 md:flex",children:[r.jsx("nav",{className:"flex items-center gap-4",children:d.map(e=>{const o=a===e.href;return r.jsx(n,{to:e.href,className:["relative px-3 py-2 font-medium transition-all duration-200",o?"text-[var(--color-primary)] underline decoration-[var(--color-primary)] underline-offset-4":"text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"].join(" "),children:e.label},e.href)})}),r.jsx(n,{to:"/cotizar",className:`\r
                  rounded-full\r
                  bg-[var(--color-primary)]\r
                  px-5 py-2.5\r
                  text-sm font-bold text-black\r
                  shadow-lg transition\r
                  hover:bg-[var(--color-primary-hover)]\r
                  focus:outline-none\r
                  focus-visible:ring-2\r
                  focus-visible:ring-[var(--color-primary)]\r
                `,children:"Cotizar"}),r.jsx("button",{onClick:i,className:`\r
                  inline-flex items-center gap-2\r
                  rounded-xl\r
                  bg-[var(--color-primary)]\r
                  px-4 py-2\r
                  text-sm font-semibold text-black\r
                  transition\r
                  hover:bg-[var(--color-primary-hover)]\r
                `,children:c==="dark"?r.jsx(g,{size:18}):r.jsx(b,{size:18})})]}),r.jsx("button",{type:"button",onClick:()=>t(e=>!e),className:`\r
                text-2xl\r
                text-[var(--color-text)]\r
                focus:outline-none\r
                md:hidden\r
              `,children:l?"✕":"☰"})]})}),l&&r.jsx("div",{className:`\r
              border-t border-[var(--color-border-strong)]\r
              bg-[var(--color-surface)]\r
              backdrop-blur-lg\r
              md:hidden\r
            `,children:r.jsxs("nav",{className:"flex flex-col gap-2 px-4 py-4",children:[d.map(e=>{const o=a===e.href;return r.jsx(n,{to:e.href,className:["block rounded-lg px-3 py-2 text-sm font-semibold transition",o?"bg-[var(--color-primary)]/20 text-[var(--color-primary)]":"text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-text)]"].join(" "),children:e.label},e.href)}),r.jsx(n,{to:"/cotizar",className:`\r
                  mt-2 block rounded-lg\r
                  bg-[var(--color-primary)]\r
                  px-4 py-3 text-center\r
                  text-sm font-bold text-black\r
                  transition\r
                  hover:bg-[var(--color-primary-hover)]\r
                `,children:"Cotizar"}),r.jsx("button",{onClick:()=>{i(),t(!1)},className:`\r
                  mt-2 rounded-lg\r
                  bg-[var(--color-primary)]\r
                  px-4 py-3\r
                  text-sm font-bold text-black\r
                  transition\r
                  hover:bg-[var(--color-primary-hover)]\r
                `,children:c==="dark"?"Modo corporativo":"Modo oscuro"})]})})]})]})};export{j as default};
