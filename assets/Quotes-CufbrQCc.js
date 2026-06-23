import{r,j as e}from"./index-CGfH34VH.js";const m="La IA es una herramienta, no un destino: el juicio, la ética y la creatividad siguen siendo tuyos.",i="— Anónimo",v=r.memo(function(){return e.jsxs("div",{className:"pointer-events-none absolute inset-0",children:[e.jsx("div",{className:`\r
          absolute -top-20 left-4\r
          h-32 w-32 rounded-full\r
          bg-[var(--color-primary)]/10\r
          blur-2xl\r
          sm:h-44 sm:w-44\r
          lg:h-56 lg:w-56\r
        `}),e.jsx("div",{className:`\r
          absolute -bottom-20 right-4\r
          h-36 w-36 rounded-full\r
          bg-[var(--color-primary)]/5\r
          blur-2xl\r
          sm:h-48 sm:w-48\r
          lg:h-60 lg:w-60\r
        `})]})});function w(){const l=r.useRef(null),[o,d]=r.useState(!1),[u,x]=r.useState(0),[a,h]=r.useState(0);r.useEffect(()=>{const t=l.current;if(!t)return;const n=new IntersectionObserver(([s])=>{s.isIntersecting&&(d(!0),n.disconnect())},{threshold:.35,rootMargin:"0px 0px -10% 0px"});return n.observe(t),()=>n.disconnect()},[]),r.useEffect(()=>{if(!o)return;let t,n;return t=setInterval(()=>{x(s=>s>=m.length?(clearInterval(t),n=setInterval(()=>{h(c=>c>=i.length?(clearInterval(n),c):c+1)},80),s):s+1)},55),()=>{clearInterval(t),clearInterval(n)}},[o]);const p=r.useMemo(()=>m.slice(0,u),[u]),f=r.useMemo(()=>i.slice(0,a),[a]),g=o&&a<i.length;return e.jsxs("section",{ref:l,id:"quotes",className:`\r
    relative flex w-full\r
    min-h-[70svh] items-center justify-center\r
    overflow-hidden\r
    bg-[var(--color-bg-secondary)]\r
    border-[10px]\r
    border-[#248f26]\r
    px-4 py-16\r
    sm:min-h-[80svh] sm:px-6 sm:py-20\r
    lg:min-h-screen lg:px-8\r
  `,children:[e.jsx(v,{}),e.jsx("div",{className:"relative z-10 mx-auto w-full max-w-4xl text-center",children:e.jsxs("div",{className:`\r
    italianno-regular\r
    text-[var(--color-surface)]\r
    drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)]\r
  `,children:[e.jsx("span",{className:"inline leading-[1.2] text-[clamp(1.45rem,4.8vw,3.4rem)] sm:text-[clamp(1.7rem,4.4vw,4rem)]",children:p}),g&&e.jsx("span",{className:"typing-cursor ml-1 inline-block align-baseline sm:ml-2"}),e.jsx("span",{className:"mt-4 block text-[clamp(1rem,2.8vw,2rem)] opacity-90 sm:mt-5",children:f})]})})]})}export{w as default};
