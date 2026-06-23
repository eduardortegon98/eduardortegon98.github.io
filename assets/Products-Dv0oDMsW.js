import{j as e,r as p}from"./index-CGfH34VH.js";import{c as i}from"./createLucideIcon-NaeO8xH-.js";import{G as j}from"./globe-3otkywkr.js";import{M as k,A as w}from"./message-circle-RKC3sfaT.js";import{A as N,m as C}from"./proxy-B9kN5haa.js";import{C as _}from"./chevron-down-DUq3aSQ8.js";import{a as I}from"./index-CHG840i8.js";import"./single-value-1kpiN9ei.js";const z=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],M=i("arrow-left",z);const A=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],b=i("chart-column",A);const D=[["circle",{cx:"18",cy:"18",r:"3",key:"1xkwt0"}],["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M6 21V9a9 9 0 0 0 9 9",key:"7kw0sc"}]],P=i("git-merge",D);const R=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],u=i("shield-check",R);const T=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],h=i("users",T),d=[{key:"ortcrm",eyebrow:"ORTCRM",title:"Gestiona tus clientes y ventas en un solo lugar",description:"Centraliza contactos y el seguimiento comercial.",image:"/src/assets/crm_bot.png",features:[{label:"Gestión clientes",Icon:h},{label:"Embudo de ventas",Icon:P},{label:"Reportes y métricas",Icon:b}]},{key:"ortweb",eyebrow:"ORTWEB",title:"Sitios web que impulsan tu negocio",description:"Diseñamos páginas rápidas y adaptadas a todos los dispositivos.",image:"/src/assets/web_bot.png",features:[{label:"Diseño responsive",Icon:j},{label:"Rápido y seguro",Icon:u},{label:"Optimizado SEO",Icon:b}]},{key:"ortdesk",eyebrow:"ORTDESK AI",title:"Asistente inteligente para WhatsApp y Web",description:"Atiende, responde y convierte 24/7 con Inteligencia Artificial.",image:"/src/assets/ortdesk-bot.png",features:[{label:"Atención 24/7",Icon:k},{label:"Respuestas automáticas",Icon:u},{label:"Captura leads",Icon:h}]}],S=()=>e.jsxs("div",{className:"pointer-events-none absolute inset-0 overflow-hidden",children:[e.jsx("div",{className:"absolute left-[-10%] top-[-10%] h-[420px] w-[420px] rounded-full bg-[#C0FDB9]/10 blur-3xl"}),e.jsx("div",{className:"absolute bottom-[-10%] right-[-10%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl"}),e.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]"})]}),B=({features:r})=>r?e.jsx("div",{className:"mt-8 flex flex-wrap gap-3",children:r.map(({label:a,Icon:s})=>e.jsxs("div",{className:"flex items-center gap-2 rounded-full border border-white/10 bg-[#C0FDB9] px-4 py-2 backdrop-blur-xl",children:[e.jsx(s,{className:"size-4 text-black"}),e.jsx("span",{className:"text-sm font-medium text-black",children:a})]},a))}):null,O=({product:r})=>e.jsxs("div",{className:"relative z-10",children:[e.jsx("div",{className:`\r
          inline-flex items-center rounded-full\r
          border border-[var(--color-primary)]\r
          bg-[var(--color-primary)]\r
          px-4 py-1.5\r
          text-[11px] font-semibold\r
          tracking-[0.2em]\r
          text-[var(--color-text-on-secondary)]\r
          backdrop-blur-xl\r
        `,children:r.eyebrow}),e.jsx("h2",{className:`\r
          mt-6 max-w-xl\r
          text-3xl font-black\r
          leading-[1.05] tracking-tight\r
          text-[var(--color-text-on-secondary)]\r
          sm:text-4xl lg:text-5xl\r
        `,children:r.title}),e.jsx("p",{className:`\r
          mt-6 max-w-lg\r
          text-sm leading-relaxed\r
          \r
          sm:text-base\r
        `,children:r.description}),e.jsx(B,{features:r.features}),e.jsxs("div",{className:"mt-10 flex flex-col gap-4 sm:flex-row",children:[e.jsx("button",{className:`\r
            inline-flex items-center justify-center\r
            rounded-2xl\r
            bg-[var(--color-primary)]\r
            px-6 py-4\r
            text-sm font-bold\r
            text-[var(--color-text-on-secondary)]\r
            transition-all duration-200\r
            hover:scale-[1.02]\r
            hover:bg-[var(--color-primary-hover)]\r
          `,children:"Solicitar demo"}),e.jsx("button",{className:`\r
            inline-flex items-center justify-center\r
            rounded-2xl\r
            border border-[var(--color-border)]\r
            bg-[var(--color-primary)]/40\r
            px-6 py-4\r
            text-sm font-bold\r
            text-[var(--color-text-on-secondary)]\r
            backdrop-blur-xl\r
            transition-all duration-200\r
            hover:bg-[var(--color-primary)]/20\r
          `,children:"Ver producto"})]})]}),E=({image:r,altText:a})=>e.jsxs("div",{className:"relative flex items-center justify-center",children:[e.jsx("div",{className:"absolute h-[420px] w-[420px] rounded-full bg-[#C0FDB9]/15 blur-3xl"}),e.jsxs("div",{className:"absolute left-0 top-12 hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl lg:block",children:[e.jsx("p",{className:"text-xs text-white/45",children:"Disponibilidad"}),e.jsx("p",{className:"mt-1 text-xl font-bold text-[#C0FDB9]",children:"24/7"})]}),e.jsxs("div",{className:"absolute bottom-16 right-0 hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl lg:block",children:[e.jsx("p",{className:"text-xs text-white/45",children:"Tiempo de respuesta"}),e.jsx("p",{className:"mt-1 text-xl font-bold text-cyan-300",children:"~3s"})]}),e.jsx("img",{src:r,alt:a,draggable:"false",className:"relative z-10 rounded-2xl w-full max-w-[680px] object-contain drop-shadow-[0_0_60px_rgba(192,253,185,0.22)] animate-float"})]}),F=({products:r,activeIndex:a,onChange:s})=>e.jsx("div",{className:"mt-12 mb-20 flex justify-center",children:e.jsx("div",{className:"inline-flex items-center gap-2 border border-black/10 bg-white/50 rounded-md backdrop-blur-sm p-1",children:r.map((o,n)=>{const l=a===n;return e.jsx("button",{onClick:()=>s(n),className:`
            px-5 py-2 text-sm font-semibold rounded-md tracking-wider transition-all
            ${l?"bg-black text-white":"text-black/60 hover:text-black"}
          `,children:o.eyebrow},o.key)})})}),K=()=>{const[r,a]=p.useState(0),[s,o]=p.useState(0),n=d[r],l=r===0,c=r===d.length-1,g=()=>{c||(o(1),a(t=>t+1))},y=()=>{l||(o(-1),a(t=>t-1))},v=t=>{const m=document.getElementById(t);m&&I(window.scrollY,m.offsetTop,{duration:1.2,ease:"easeInOut",onUpdate:f=>{window.scrollTo(0,f)}})},x=t=>["rounded-full p-3 transition-all",t?`
          cursor-not-allowed
          opacity-25
          bg-[var(--color-disabled)]
          text-[var(--color-text)]
        `:`
          bg-[var(--color-primary)]
          text-black
          animate-pulse
          hover:scale-110
          hover:bg-[var(--color-primary-hover)]
        `].join(" ");return e.jsxs("section",{className:`\r
    relative flex min-h-screen w-full flex-col\r
    items-center justify-center overflow-hidden\r
    bg-[var(--color-bg-secondary)]\r
    py-20\r
  `,children:[e.jsx(S,{}),e.jsx(F,{products:d,activeIndex:r,onChange:a}),e.jsxs("div",{className:"relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16",children:[e.jsx("div",{className:`\r
              absolute -left-4 top-1/2 z-20 hidden\r
              -translate-y-1/2 xl:block \r
            `,children:e.jsx("button",{onClick:y,disabled:l,className:x(l),"aria-label":"Producto anterior",children:e.jsx(M,{className:"size-6"})})}),e.jsx("div",{className:`\r
              absolute -right-4 top-1/2 z-20 hidden\r
              -translate-y-1/2 xl:block\r
            `,children:e.jsx("button",{onClick:g,disabled:c,className:x(c),"aria-label":"Siguiente producto",children:e.jsx(w,{className:"size-6"})})}),e.jsx(N,{mode:"wait",custom:s,children:e.jsx(C.div,{custom:s,variants:{enter:t=>({x:t>0?100:-100,opacity:0}),center:{x:0,opacity:1},exit:t=>({x:t>0?-100:100,opacity:0})},initial:"enter",animate:"center",exit:"exit",transition:{duration:.45,ease:"easeInOut"},children:e.jsxs("div",{className:"grid w-full items-center gap-16 lg:grid-cols-2",children:[e.jsx(O,{product:n}),e.jsx(E,{image:n.image,altText:n.title})]})},r)}),e.jsx("div",{className:"mt-16 flex justify-center",children:e.jsx("button",{type:"button",onClick:()=>v("stack"),className:`\r
      rounded-full\r
      bg-[var(--color-primary)]\r
      p-4\r
      text-black\r
      shadow-lg\r
      transition-all duration-300\r
      hover:scale-110\r
      hover:bg-[var(--color-primary-hover)]\r
      hover:shadow-[0_0_25px_rgba(192,253,185,0.45)]\r
      animate-bounce\r
    `,"aria-label":"Ir a tecnologías",children:e.jsx(_,{className:"h-5 w-5"})})})]})]})};export{K as default};
