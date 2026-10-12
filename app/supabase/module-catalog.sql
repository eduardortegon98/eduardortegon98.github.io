-- Upgrade after portal.sql and module-assignments.sql. Repeatable; preserves existing grants.
begin;
create table if not exists public.portal_modules(
 id text primary key check(id ~ '^[a-z][a-z0-9_-]{0,79}$'),
 name_es text not null,
 name_en text not null,
 category text not null default 'general',
 enabled boolean not null default true
);
insert into public.portal_modules(id,name_es,name_en,category) values
 ('messages','Mensajes','Messages','communications'),('arturito','Arturito','Arturito','pets')
 on conflict(id) do nothing;
alter table public.portal_modules enable row level security;
revoke all on public.portal_modules from anon,authenticated;
grant select on public.portal_modules to authenticated;
drop policy if exists portal_module_catalog_read on public.portal_modules;
create policy portal_module_catalog_read on public.portal_modules for select to authenticated using(enabled or public.portal_is_admin());
alter table public.portal_module_assignments drop constraint if exists portal_module_assignments_module_check;
do $$ begin
 if not exists(select 1 from pg_constraint where conrelid='public.portal_module_assignments'::regclass and conname='portal_assignments_catalog_fk') then
  alter table public.portal_module_assignments add constraint portal_assignments_catalog_fk foreign key(module) references public.portal_modules(id);
 end if;
end $$;
drop policy if exists module_assignment_read on public.portal_module_assignments;
create policy module_assignment_read on public.portal_module_assignments for select to authenticated
 using(public.portal_is_admin() or (user_id=auth.uid() and exists(select 1 from public.portal_modules m where m.id=module and m.enabled)));
create or replace function public.assign_client_modules(p_user_id uuid,p_modules text[])
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not public.portal_is_admin() then
  raise exception 'Administrator access required' using errcode='42501';
 end if;
 perform 1 from public.portal_profiles where id=p_user_id and role='client' for update;
 if not found then raise exception 'Client not found' using errcode='P0002'; end if;
 if p_modules is null or exists(
  select 1 from unnest(p_modules) requested(id)
  where requested.id is null or not exists(select 1 from public.portal_modules catalog where catalog.id=requested.id and catalog.enabled)
 ) then raise exception 'Unknown or disabled module' using errcode='22023'; end if;
 delete from public.portal_module_assignments a where a.user_id=p_user_id
  and not(a.module=any(p_modules));
 insert into public.portal_module_assignments(user_id,module,assigned_by)
 select p_user_id,requested.id,auth.uid() from (select distinct unnest(p_modules) id) requested
 on conflict(user_id,module) do nothing;
end;
$$;
revoke all on function public.assign_client_modules(uuid,text[]) from public,anon,authenticated;
grant execute on function public.assign_client_modules(uuid,text[]) to authenticated;
notify pgrst,'reload schema';
commit;
