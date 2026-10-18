-- Run once in Supabase SQL Editor. No Notion API credentials belong in the frontend.
create table if not exists public.sales_prospects (
  id uuid primary key default gen_random_uuid(),
  notion_page_id text unique,
  company text not null,
  person text,
  email text,
  country text,
  sector text,
  status text,
  delivery_status text,
  contact_channel text,
  contact_url text,
  contacted_at timestamptz,
  subject text,
  gmail_url text,
  notes text,
  updated_at timestamptz not null default now()
);
create index if not exists sales_prospects_country_status_idx on public.sales_prospects(country,status);
alter table public.sales_prospects enable row level security;
revoke all on public.sales_prospects from anon;
grant select on public.sales_prospects to authenticated;
drop policy if exists "sales_prospects_admin_read" on public.sales_prospects;
create policy "sales_prospects_admin_read" on public.sales_prospects for select to authenticated
using ((select public.portal_is_admin()));
-- Ingest Notion rows with a server-side job using the Supabase service role;
-- never expose a Notion token or service-role key through Vite/GitHub Pages.

-- Existing installations: add channel fields too.
alter table public.sales_prospects add column if not exists contact_channel text;
alter table public.sales_prospects add column if not exists contact_url text;
