-- Supabase > SQL Editor > New query > Run.
-- Requires PROSPECTS.sql and the existing portal_is_admin() helper.
begin;
create table if not exists public.sales_contact_stages (
  prospect_id uuid primary key references public.sales_prospects(id) on delete cascade,
  stage smallint not null check (stage between 0 and 5),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
alter table public.sales_contact_stages enable row level security;
revoke all on public.sales_contact_stages from anon, authenticated;
grant select on public.sales_contact_stages to authenticated;
drop policy if exists sales_contact_stages_admin_read on public.sales_contact_stages;
create policy sales_contact_stages_admin_read on public.sales_contact_stages
for select to authenticated using ((select public.portal_is_admin()));

create or replace function public.set_sales_contact_stage(p_prospect_id uuid, p_stage integer)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not coalesce(public.portal_is_admin(),false) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_stage is null or p_stage < 0 or p_stage > 5 then
    raise exception 'Stage must be between 0 and 5' using errcode = '22023';
  end if;
  perform 1 from public.sales_prospects
  where id=p_prospect_id
    and status in ('Respondió','Interesado','Reunión','Cotización','Ganado')
    and company !~* '^Registro técnico:'
    and coalesce(delivery_status,'') not in ('rebotado','bloqueado')
    and coalesce(notes,'') !~* 'rebote permanente|env[ií]o bloqueado'
  for update;
  if not found then
    raise exception 'Contact must have a confirmed reply' using errcode = '22023';
  end if;
  insert into public.sales_contact_stages(prospect_id,stage,updated_at,updated_by)
  values(p_prospect_id,p_stage,now(),auth.uid())
  on conflict(prospect_id) do update
  set stage=excluded.stage,updated_at=excluded.updated_at,updated_by=excluded.updated_by;
end;
$$;
revoke all on function public.set_sales_contact_stage(uuid,integer) from public, anon;
grant execute on function public.set_sales_contact_stage(uuid,integer) to authenticated;
notify pgrst, 'reload schema';
commit;
