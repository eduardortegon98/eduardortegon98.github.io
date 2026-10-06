-- Run schema.sql first. All upgrades are transactional and repeatable.
begin;
create table if not exists public.portal_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text not null, role text not null default 'client' check (role in ('client','super_admin')),
 created_at timestamptz not null default now()
);
alter table public.portal_profiles enable row level security;
revoke all on public.portal_profiles from anon, authenticated;
grant select on public.portal_profiles to authenticated;
create or replace function public.portal_is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.portal_profiles where id = auth.uid() and role = 'super_admin');
$$;
revoke all on function public.portal_is_admin() from public;
grant execute on function public.portal_is_admin() to authenticated;
drop policy if exists portal_profile_read on public.portal_profiles;
create policy portal_profile_read on public.portal_profiles for select to authenticated
 using (id = auth.uid() or public.portal_is_admin());
create or replace function public.portal_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
 insert into public.portal_profiles(id,email,role) values(new.id,coalesce(new.email,''),'client')
 on conflict(id) do update set email = excluded.email;
 return new;
end;
$$;
revoke all on function public.portal_new_user() from public;
drop trigger if exists portal_create_profile on auth.users;
create trigger portal_create_profile after insert or update of email on auth.users
 for each row execute function public.portal_new_user();
insert into public.portal_profiles(id,email) select id,coalesce(email,'') from auth.users
 on conflict(id) do update set email=excluded.email;
alter table public.contact_requests add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.quote_requests add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.customer_feedback add column if not exists user_id uuid references auth.users(id) on delete set null;
create index if not exists contact_owner_idx on public.contact_requests(user_id,created_at desc);
create index if not exists quote_owner_idx on public.quote_requests(user_id,created_at desc);
create index if not exists feedback_owner_idx on public.customer_feedback(user_id,created_at desc);
grant select on public.contact_requests, public.quote_requests, public.customer_feedback to authenticated;
drop policy if exists portal_contact_read on public.contact_requests;
create policy portal_contact_read on public.contact_requests for select to authenticated using(user_id=auth.uid() or public.portal_is_admin());
drop policy if exists portal_quote_read on public.quote_requests;
create policy portal_quote_read on public.quote_requests for select to authenticated using(user_id=auth.uid() or public.portal_is_admin());
drop policy if exists portal_feedback_read on public.customer_feedback;
create policy portal_feedback_read on public.customer_feedback for select to authenticated using(user_id=auth.uid() or public.portal_is_admin());
-- Identity comes exclusively from the JWT, never from submitted email or metadata.
create or replace function public.submit_contact(p_name text,p_email text,p_subject text,p_message text)
returns void language sql security definer set search_path='' as $$
 insert into public.contact_requests(name,email,subject,message,user_id) values(trim(p_name),lower(trim(p_email)),trim(p_subject),trim(p_message),auth.uid());
$$;
create or replace function public.submit_quote(p_name text,p_email text,p_phone text,p_service text,p_budget text,p_message text)
returns void language sql security definer set search_path='' as $$
 insert into public.quote_requests(name,email,phone,service,budget,message,user_id) values(trim(p_name),lower(trim(p_email)),trim(p_phone),p_service,p_budget,trim(p_message),auth.uid());
$$;
create or replace function public.submit_feedback(p_name text,p_email text,p_message text,p_rating integer)
returns void language sql security definer set search_path='' as $$
 insert into public.customer_feedback(name,email,message,rating,approved,user_id) values(trim(p_name),lower(trim(p_email)),trim(p_message),p_rating,false,auth.uid());
$$;
notify pgrst,'reload schema';
commit;
-- First administrator: manually run the UUID-based update described in PORTAL.md.
