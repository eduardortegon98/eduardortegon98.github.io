-- Run after portal.sql and module-catalog.sql.
begin;
insert into public.portal_modules(id,name_es,name_en,category,enabled)
values('websites','Websites','Websites','web',true) on conflict(id) do nothing;
create table if not exists public.portal_websites(
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references public.portal_profiles(id),
 name text not null check(char_length(name) between 1 and 150),
 domain text not null default '' check(char_length(domain)<=253),
 repo_url text not null default '' check(char_length(repo_url)<=300),
 design_status text not null default 'draft' check(design_status in ('draft','review','approved')),
 requested_action text not null default 'none' check(requested_action in ('none','publish','pause','resume')),
 archived boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 updated_by uuid references auth.users(id) on delete set null
);
create index if not exists portal_websites_owner_idx on public.portal_websites(owner_id,created_at desc);
alter table public.portal_websites enable row level security;
revoke all on public.portal_websites from anon,authenticated;
grant select on public.portal_websites to authenticated;
drop policy if exists portal_websites_read on public.portal_websites;
create policy portal_websites_read on public.portal_websites for select to authenticated
using(public.portal_is_admin() or (owner_id=auth.uid() and not archived and exists(
 select 1 from public.portal_module_assignments a join public.portal_modules m on m.id=a.module
 where a.user_id=auth.uid() and a.module='websites' and m.enabled
)));
create or replace function public.save_portal_website(
 p_id uuid,p_owner_id uuid,p_name text,p_domain text,p_repo_url text,p_design_status text,p_requested_action text
) returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if auth.uid() is null or not public.portal_is_admin() then raise exception 'Administrator required' using errcode='42501'; end if;
 if not exists(select 1 from public.portal_profiles where id=p_owner_id and role='client') then raise exception 'Client not found' using errcode='22023'; end if;
 if p_name is null or char_length(trim(p_name)) not between 1 and 150
 or p_domain is null or char_length(p_domain)>253
 or (p_domain<>'' and lower(trim(p_domain)) !~ '^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$')
 or p_repo_url is null or (p_repo_url<>'' and p_repo_url !~ '^https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/?$')
 or p_design_status is null or p_design_status not in ('draft','review','approved')
 or p_requested_action is null or p_requested_action not in ('none','publish','pause','resume')
 then raise exception 'Invalid website fields' using errcode='22023'; end if;
 if p_requested_action='publish' and p_design_status<>'approved' then raise exception 'Approve design before requesting publication' using errcode='22023'; end if;
 if p_id is null then
  insert into public.portal_websites(owner_id,name,domain,repo_url,design_status,requested_action,updated_by)
  values(p_owner_id,trim(p_name),lower(trim(p_domain)),p_repo_url,p_design_status,p_requested_action,auth.uid()) returning id into result;
 else
  update public.portal_websites set owner_id=p_owner_id,name=trim(p_name),domain=lower(trim(p_domain)),
   repo_url=p_repo_url,design_status=p_design_status,requested_action=p_requested_action,updated_at=now(),updated_by=auth.uid()
   where id=p_id and not archived returning id into result;
  if result is null then raise exception 'Website not found' using errcode='P0002'; end if;
 end if;
 return result;
end;
$$;
revoke all on function public.save_portal_website(uuid,uuid,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.save_portal_website(uuid,uuid,text,text,text,text,text) to authenticated;
create or replace function public.archive_portal_website(p_id uuid,p_archived boolean)
returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not public.portal_is_admin() then raise exception 'Administrator required' using errcode='42501'; end if;
 if p_archived is null then raise exception 'Invalid archive state' using errcode='22023'; end if;
 update public.portal_websites set archived=p_archived,updated_at=now(),updated_by=auth.uid() where id=p_id;
 if not found then raise exception 'Website not found' using errcode='P0002'; end if;
end;
$$;
revoke all on function public.archive_portal_website(uuid,boolean) from public,anon,authenticated;
grant execute on function public.archive_portal_website(uuid,boolean) to authenticated;
notify pgrst,'reload schema';
commit;
