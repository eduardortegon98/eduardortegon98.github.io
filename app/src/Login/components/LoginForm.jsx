import { useEffect, useRef, useState } from "react";
import { requireSupabase, supabase, isPasswordRecovery, finishPasswordRecovery } from "../../lib/supabase";
import FormStatus from "../../components/FormStatus";
const css = "w-full rounded-xl border border-white/10 bg-black/40 p-3 text-white";
export default function LoginForm() {
 const lock = useRef(false);
 const [pending,setPending] = useState(false), [status,setStatus] = useState(null), [user,setUser] = useState(null), [recovery,setRecovery] = useState(isPasswordRecovery);
 useEffect(() => {
  if (!supabase) return;
  let active = true;
  const {data:{subscription}} = supabase.auth.onAuthStateChange((event,session) => { if(active){setUser(session?.user ?? null); if(event === "PASSWORD_RECOVERY") setRecovery(true);} });
  supabase.auth.getSession().then(({data}) => {if(active) setUser(data.session?.user ?? null);});
  return () => {active=false;subscription.unsubscribe();};
 },[]);
 async function run(action) {
  if(lock.current) return;
  lock.current=true;setPending(true);setStatus(null);
  try {await action(requireSupabase());} catch(error){setStatus({success:false,message:error.message});}
  finally{lock.current=false;setPending(false);}
 }
 function submit(event){
  event.preventDefault(); const form=event.currentTarget, fields=new FormData(form);
  if(recovery && fields.get("password") !== fields.get("confirmation")){setStatus({success:false,message:"Las contraseñas no coinciden."});return;}
  run(async client => {
   const {error} = recovery ? await client.auth.updateUser({password:fields.get("password")}) : await client.auth.signInWithPassword({email:fields.get("email").trim(),password:fields.get("password")});
   if(error) throw new Error(recovery ? "No pudimos actualizar la contraseña. Solicita un nuevo enlace." : "No se pudo iniciar sesión. Revisa tus credenciales.");
   setStatus({success:true,message:recovery ? "Contraseña actualizada." : "Sesión iniciada correctamente."});finishPasswordRecovery();setRecovery(false);form.reset();
  });
 }
 function reset(event){
  const email=event.currentTarget.form.elements.email;
  if(!email.reportValidity())return;
  run(async client => {const {error}=await client.auth.resetPasswordForEmail(email.value.trim(),{redirectTo:new URL("/login",window.location.origin).href});if(error)throw new Error("No pudimos solicitar la recuperación. Inténtalo nuevamente.");setStatus({success:true,message:"Si el correo está registrado, recibirás un enlace para cambiar tu contraseña."});});
 }
 if(user && !recovery) return <div className="space-y-5"><p role="status">Sesión activa: {user.email}</p><button disabled={pending} className="rounded-lg bg-[#C0FDB9] p-3 text-black" onClick={()=>run(async client=>{const {error}=await client.auth.signOut();if(error)throw new Error("No pudimos cerrar sesión.");setUser(null);})}>Cerrar sesión</button><FormStatus status={status}/></div>;
 return <form onSubmit={submit} className="mt-10 space-y-5" aria-busy={pending}>
 {!recovery && <label className="block">Correo electrónico<input name="email" type="email" required maxLength={254} autoComplete="username" className={css}/></label>}
 <label className="block">{recovery ? "Nueva contraseña" : "Contraseña"}<input name="password" type="password" required minLength={recovery ? 8 : undefined} maxLength={128} autoComplete={recovery ? "new-password" : "current-password"} className={css}/></label>
 {recovery ? <label className="block">Confirmar contraseña<input name="confirmation" type="password" required minLength={8} maxLength={128} autoComplete="new-password" className={css}/></label> : <button type="button" disabled={pending} onClick={reset} className="text-[#C0FDB9] hover:underline">¿Olvidaste tu contraseña?</button>}
 <button disabled={pending} className="w-full rounded-lg bg-[#C0FDB9] p-3 font-semibold text-black">{pending ? "Procesando..." : recovery ? "Guardar contraseña" : "Iniciar sesión"}</button><FormStatus status={status}/>
 </form>;
}
