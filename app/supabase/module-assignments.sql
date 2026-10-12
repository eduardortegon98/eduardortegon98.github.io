-- Run after portal.sql in Supabase SQL Editor.
begin;
create table if not exists public.portal_module_assignments (
 user_id uuid not null references public.portal_profiles(id) on delete cascade,
 module text not null check (module in ('messages','arturito')),
 assigned_by uuid references auth.users(id) on delete set null,
 updated_at timestamptz not null default now(),
 primary key(user_id,module)
);
alter table public.portal_module_assignments enable row level security;
revoke all on public.portal_module_assignments from anon,authenticated;
grant select on public.portal_module_assignments to authenticated;
drop policy if exists module_assignment_read on public.portal_module_assignments;
create policy module_assignment_read on public.portal_module_assignments for select to authenticated
 using(user_id=auth.uid() or public.portal_is_admin());
create or replace function public.assign_client_modules(p_user_id uuid,p_modules text[])
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not public.portal_is_admin() then
  raise exception 'Administrator access required' using errcode='42501';
 end if;
 perform 1 from public.portal_profiles where id=p_user_id and role='client' for update;
 if not found then
  raise exception 'Client not found' using errcode='P0002';
 end if;
 if p_modules is null or cardinality(p_modules)>2 or exists(select 1 from unnest(p_modules) m where m is null or m not in ('messages','arturito')) then
  raise exception 'Invalid modules' using errcode='22023';
 end if;
 delete from public.portal_module_assignments where user_id=p_user_id;
 insert into public.portal_module_assignments(user_id,module,assigned_by)
 select p_user_id,m,auth.uid() from (select distinct unnest(p_modules) m) requested;
end;
$$;
revoke all on function public.assign_client_modules(uuid,text[]) from public,anon,authenticated;
grant execute on function public.assign_client_modules(uuid,text[]) to authenticated;
notify pgrst,'reload schema';
commit;
