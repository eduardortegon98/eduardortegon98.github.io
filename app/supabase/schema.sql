begin;
create table if not exists public.contact_requests (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 name text not null check (length(trim(name)) between 1 and 120),
 email text not null check (length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 subject text not null check (length(trim(subject)) between 1 and 200),
 message text not null check (length(trim(message)) between 1 and 5000)
);
create table if not exists public.quote_requests (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 name text not null check (length(trim(name)) between 1 and 120),
 email text not null check (length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 phone text not null default '' check (length(phone) <= 40),
 service text not null check (service in ('Desarrollo Web','Automatización de Procesos','Asistentes con IA','Integraciones con WhatsApp','Aplicaciones a la Medida','Otro')),
 budget text not null check (budget in ('Menos de $1.000.000 COP','$1.000.000 - $5.000.000 COP','$5.000.000 - $10.000.000 COP','Más de $10.000.000 COP','No estoy seguro')),
 message text not null check (length(trim(message)) between 1 and 5000)
);
-- Independent table: does not modify a pre-existing legacy "FeedBack" table.
create table if not exists public.customer_feedback (
 id uuid primary key default gen_random_uuid(), created_at timestamptz not null default now(),
 name text not null check (length(trim(name)) between 1 and 120),
 email text not null default '' check (length(email) <= 254 and (email = '' or email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')),
 message text not null check (length(trim(message)) between 1 and 5000),
 rating integer not null check (rating between 1 and 5), approved boolean not null default false
);
alter table public.contact_requests enable row level security;
alter table public.quote_requests enable row level security;
alter table public.customer_feedback enable row level security;
revoke all on public.contact_requests, public.quote_requests, public.customer_feedback from anon, authenticated;
-- No public SELECT/UPDATE/DELETE policies; access by visitors is only through these bounded functions.
create or replace function public.submit_contact(p_name text, p_email text, p_subject text, p_message text)
returns void language sql security definer set search_path = '' as $$
 insert into public.contact_requests(name,email,subject,message) values(trim(p_name),lower(trim(p_email)),trim(p_subject),trim(p_message));
$$;
create or replace function public.submit_quote(p_name text, p_email text, p_phone text, p_service text, p_budget text, p_message text)
returns void language sql security definer set search_path = '' as $$
 insert into public.quote_requests(name,email,phone,service,budget,message) values(trim(p_name),lower(trim(p_email)),trim(p_phone),p_service,p_budget,trim(p_message));
$$;
create or replace function public.submit_feedback(p_name text, p_email text, p_message text, p_rating integer)
returns void language sql security definer set search_path = '' as $$
 insert into public.customer_feedback(name,email,message,rating,approved) values(trim(p_name),lower(trim(p_email)),trim(p_message),p_rating,false);
$$;
create or replace function public.list_approved_feedback()
returns table(id uuid,name text,message text,rating integer,created_at timestamptz)
language sql security definer set search_path = '' as $$
 select id,name,message,rating,created_at from public.customer_feedback where approved = true order by created_at desc limit 6;
$$;
revoke all on function public.submit_contact(text,text,text,text), public.submit_quote(text,text,text,text,text,text), public.submit_feedback(text,text,text,integer), public.list_approved_feedback() from public;
grant execute on function public.submit_contact(text,text,text,text), public.submit_quote(text,text,text,text,text,text), public.submit_feedback(text,text,text,integer), public.list_approved_feedback() to anon, authenticated;
commit;
