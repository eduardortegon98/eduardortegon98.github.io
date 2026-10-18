-- Private personal-finance module. Run once in Supabase SQL Editor.
create table if not exists public.personal_finance_settings(
 user_id uuid primary key references auth.users(id) on delete cascade,
 nu_balance numeric(15,2) not null default 10974592.35,
 pila_balance numeric(15,2) not null default 2643800,
 buffer numeric(15,2) not null default 100000,
 monthly_salary numeric(15,2) not null default 3000000,
 extra_monthly numeric(15,2) not null default 0,
 house numeric(15,2) not null default 1500000,
 study numeric(15,2) not null default 900000,
 nu_target numeric(15,2) not null default 1043400,
 pila_target numeric(15,2) not null default 220400,
 health numeric(15,2) not null default 500000,
 health_refund numeric(15,2) not null default 500000,
 personal_budget numeric(15,2) not null default 0,
 goal_date date not null default '2027-10-18'
);
create table if not exists public.personal_finance_expenses(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 date date not null, amount numeric(15,2) not null check(amount>0),
 category text not null default 'Otro',note text not null default '',
 created_at timestamptz not null default now()
);
create table if not exists public.personal_finance_bills(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 title text not null,amount numeric(15,2) not null check(amount>0),
 due_date date not null,status text not null default 'pending' check(status in('pending','paid')),
 category text not null default 'Otro',created_at timestamptz not null default now()
);
alter table public.personal_finance_settings enable row level security;
alter table public.personal_finance_expenses enable row level security;
alter table public.personal_finance_bills enable row level security;
-- Only allow user to access their own data. Admin dashboard visibility is separate from database policy.
drop policy if exists finance_own_settings on public.personal_finance_settings;
create policy finance_own_settings on public.personal_finance_settings for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
drop policy if exists finance_own_expenses on public.personal_finance_expenses;
create policy finance_own_expenses on public.personal_finance_expenses for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
drop policy if exists finance_own_bills on public.personal_finance_bills;
create policy finance_own_bills on public.personal_finance_bills for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create index if not exists personal_finance_expenses_user_date on public.personal_finance_expenses(user_id,date);
create index if not exists personal_finance_bills_user_due on public.personal_finance_bills(user_id,due_date);
