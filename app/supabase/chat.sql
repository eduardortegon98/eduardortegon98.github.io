begin;
-- Private tables; only the server's service_role can call these functions.
create table if not exists public.chat_control (
 id integer primary key check(id=1), enabled boolean not null default true,
 paused boolean not null default false, day date not null default (now() at time zone 'UTC')::date,
 agent_reserved integer not null default 0, reserved integer not null default 0, daily_budget integer not null default 200000 check(daily_budget between 5000 and 10000000)
);
insert into public.chat_control(id) values(1) on conflict do nothing;
create table if not exists public.chat_limits (
 subject text primary key, guest_total integer not null default 0,
 day date not null default (now() at time zone 'UTC')::date, calls integer not null default 0,
 last_call timestamptz, busy_until timestamptz, lease uuid, blocked_until timestamptz,
 strikes integer not null default 0, strike_window timestamptz,
 handoffs integer not null default 0
);
create table if not exists public.chat_turns (
 id bigint generated always as identity primary key, subject text not null,
 created_at timestamptz not null default now(), question text not null check(length(question)<=500),
 answer text not null check(length(answer)<=1200), usage_tokens integer not null default 0
);
create index if not exists chat_turns_subject on public.chat_turns(subject,id desc);
create table if not exists public.chat_outbox (
 id uuid primary key default gen_random_uuid(), dedupe text unique not null,
 kind text not null check(kind in ('abuse','budget','agent')), detail text not null,
 created_at timestamptz not null default now(), attempts integer not null default 0,
 lease uuid, lease_until timestamptz, sent_at timestamptz, last_error text
);
alter table public.chat_control enable row level security;
alter table public.chat_limits enable row level security;
alter table public.chat_turns enable row level security;
alter table public.chat_outbox enable row level security;
revoke all on public.chat_control, public.chat_limits, public.chat_turns, public.chat_outbox from public, anon, authenticated;

create or replace function public.chat_reserve(p_ip text,p_user uuid,p_action text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare
 c public.chat_control; i public.chat_limits; u public.chat_limits;
 s text; t timestamptz:=clock_timestamp(); d date:=(now() at time zone 'UTC')::date;
 denied text; l uuid:=gen_random_uuid(); history jsonb;
begin
 if p_ip !~ '^[a-f0-9]{64}$' or p_action not in ('message','local','handoff') then raise exception 'invalid'; end if;
 -- Global lock serializes reservations and budget checks, including parallel requests.
 select * into c from public.chat_control where id=1 for update;
 if c.id is null then raise exception 'missing control'; end if;
 if c.day<>d then update public.chat_control set day=d,reserved=0,agent_reserved=0 where id=1 returning * into c; end if;
 s:=case when p_user is null then 'ip:'||p_ip else 'user:'||p_user::text end;
 insert into public.chat_limits(subject) values('ip:'||p_ip) on conflict do nothing;
 update public.chat_limits set day=d,calls=0,handoffs=0 where subject='ip:'||p_ip and day<>d;
 select * into i from public.chat_limits where subject='ip:'||p_ip for update;
 if p_user is not null then
  insert into public.chat_limits(subject) values(s) on conflict do nothing;
  update public.chat_limits set day=d,calls=0,handoffs=0 where subject=s and day<>d;
  select * into u from public.chat_limits where subject=s for update;
 end if;
 if i.blocked_until>t or u.blocked_until>t then return jsonb_build_object('code','blocked'); end if;
 if i.busy_until>t or u.busy_until>t or i.last_call>t-interval '10 seconds' or u.last_call>t-interval '10 seconds' then denied:='cooldown'; end if;
 if p_action<>'handoff' and p_user is null and i.guest_total>=4 then denied:=coalesce(denied,'login_required'); end if;
 if p_action<>'handoff' and (i.calls>=40 or u.calls>=20) then denied:=coalesce(denied,'daily_limit'); end if;
 if p_action='handoff' and (i.handoffs>=2 or u.handoffs>=2) then denied:=coalesce(denied,'handoff_limit'); end if;
 if p_action='handoff' and c.agent_reserved>=20 then denied:=coalesce(denied,'handoff_limit'); end if;
 if denied is not null then
  update public.chat_limits set strikes=case when strike_window>t-interval '10 minutes' then strikes+1 else 1 end,
   strike_window=case when strike_window>t-interval '10 minutes' then strike_window else t end
   where subject='ip:'||p_ip returning * into i;
  if i.strikes>=8 then
   update public.chat_limits set blocked_until=t+interval '1 hour' where subject in ('ip:'||p_ip,s);
   if (select count(*) from public.chat_outbox where kind='abuse' and created_at>=(d::timestamp at time zone 'UTC'))<5 then
   insert into public.chat_outbox(dedupe,kind,detail) values('abuse:'||p_ip||':'||floor(extract(epoch from t)/3600)::text,'abuse','Acceso bloqueado 1 hora por 8 intentos rechazados en 10 minutos. Identificador: '||left(p_ip,12)) on conflict do nothing;
   end if;
   denied:='blocked';
  end if;
  return jsonb_build_object('code',denied);
 end if;
 if p_action='message' and (not c.enabled or c.paused) then return jsonb_build_object('code','paused'); end if;
 if p_action='message' and c.reserved+5000>c.daily_budget then
  update public.chat_control set paused=true where id=1;
  insert into public.chat_outbox(dedupe,kind,detail) values('budget:'||d::text,'budget','IA pausada: alcanzó el presupuesto diario de reservas. Revisa chat_control antes de reactivarla.') on conflict do nothing;
  return jsonb_build_object('code','paused');
 end if;
 update public.chat_limits set last_call=t,busy_until=t+interval '45 seconds',lease=l,
  guest_total=guest_total+case when p_action<>'handoff' and p_user is null then 1 else 0 end,
  calls=calls+case when p_action<>'handoff' then 1 else 0 end,
  handoffs=handoffs+case when p_action='handoff' then 1 else 0 end
  where subject='ip:'||p_ip;
 if p_user is not null then
  update public.chat_limits set last_call=t,busy_until=t+interval '45 seconds',lease=l,
   calls=calls+case when p_action<>'handoff' then 1 else 0 end,
   handoffs=handoffs+case when p_action='handoff' then 1 else 0 end where subject=s;
 end if;
 if p_action='handoff' then update public.chat_control set agent_reserved=agent_reserved+1 where id=1; end if;
 if p_action='message' then update public.chat_control set reserved=reserved+5000 where id=1; end if;
 -- Never share anonymous history between visitors behind the same IP.
 if p_user is not null then
  select coalesce(jsonb_agg(jsonb_build_object('question',question,'answer',answer) order by id),'[]'::jsonb)
  into history from (select * from public.chat_turns where subject=s order by id desc limit 4) h;
 else history:='[]'::jsonb; end if;
 return jsonb_build_object('code','ok','subject',s,'lease',l,'history',history,
 'remaining',case when p_user is null then greatest(0,3-i.guest_total) else greatest(0,19-u.calls) end);
end $$;

create or replace function public.chat_finish(p_ip text,p_subject text,p_lease uuid,p_question text,p_answer text,p_usage integer)
returns void language plpgsql security definer set search_path='' as $$
begin
 if exists(select 1 from public.chat_limits where subject=p_subject and lease=p_lease) then
  if p_answer<>'' then
   insert into public.chat_turns(subject,question,answer,usage_tokens) values(p_subject,p_question,p_answer,greatest(0,p_usage));
  end if;
  update public.chat_limits set busy_until=null,lease=null where subject in ('ip:'||p_ip,p_subject) and lease=p_lease;
 end if;
end $$;
create or replace function public.chat_handoff(p_ip text,p_subject text,p_lease uuid,p_name text,p_contact text,p_reason text)
returns uuid language plpgsql security definer set search_path='' as $$
declare n uuid;
begin
 if length(trim(p_name)) not between 1 and 120 or length(trim(p_contact)) not between 1 and 254 or length(trim(p_reason)) not between 1 and 500 then raise exception 'invalid'; end if;
 if not exists(select 1 from public.chat_limits where subject=p_subject and lease=p_lease) then raise exception 'lease'; end if;
 insert into public.chat_outbox(dedupe,kind,detail) values('agent:'||p_lease::text,'agent',
  'Nombre: '||p_name||' | Contacto: '||p_contact||' | Motivo: '||p_reason) returning id into n;
 perform public.chat_finish(p_ip,p_subject,p_lease,'','',0);
 return n;
end $$;
create or replace function public.chat_claim_alerts()
returns setof public.chat_outbox language sql security definer set search_path='' as $$
 update public.chat_outbox set lease=gen_random_uuid(),lease_until=now()+interval '2 minutes',attempts=attempts+1
 where id in (select id from public.chat_outbox where sent_at is null and attempts<3
 and (lease_until is null or lease_until<now()) order by created_at limit 5 for update skip locked) returning *;
$$;
create or replace function public.chat_ack_alert(p_id uuid,p_lease uuid,p_success boolean,p_error text)
returns void language sql security definer set search_path='' as $$
 update public.chat_outbox set sent_at=case when p_success then now() else null end,
 last_error=left(p_error,200),lease_until=case when p_success then null else now()+interval '5 minutes' end
 where id=p_id and lease=p_lease;
$$;
revoke all on function public.chat_reserve(text,uuid,text),public.chat_finish(text,text,uuid,text,text,integer),
 public.chat_handoff(text,text,uuid,text,text,text),public.chat_claim_alerts(),public.chat_ack_alert(uuid,uuid,boolean,text) from public,anon,authenticated;
grant execute on function public.chat_reserve(text,uuid,text),public.chat_finish(text,text,uuid,text,text,integer),
 public.chat_handoff(text,text,uuid,text,text,text),public.chat_claim_alerts(),public.chat_ack_alert(uuid,uuid,boolean,text) to service_role;
commit;
