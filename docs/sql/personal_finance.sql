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
 health_refund numeric(15,2) not null default 0,
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

-- Extra hours and their actual income (entered manually, never assumed).
create table if not exists public.personal_finance_extras(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 date date not null,
 hours numeric(9,2) not null check(hours>0),
 amount numeric(15,2) not null check(amount>=0),
 note text not null default '',
 created_at timestamptz not null default now()
);
alter table public.personal_finance_extras enable row level security;
drop policy if exists finance_own_extras on public.personal_finance_extras;
create policy finance_own_extras on public.personal_finance_extras
 for all to authenticated
 using(auth.uid()=user_id) with check(auth.uid()=user_id);
create index if not exists personal_finance_extras_user_date on public.personal_finance_extras(user_id,date);

-- Income received: date, amount and payer. This is separate from extra hours
-- because worked hours are not always paid yet.
CREATE TABLE IF NOT EXISTS public.personal_finance_income (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 date date NOT NULL,
 amount numeric(15,2) NOT NULL CHECK(amount > 0),
 source text NOT NULL DEFAULT 'Otro',
 note text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.personal_finance_income ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS finance_own_income ON public.personal_finance_income;
CREATE POLICY finance_own_income ON public.personal_finance_income
 FOR ALL TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE INDEX IF NOT EXISTS personal_finance_income_user_date
 ON public.personal_finance_income(user_id,date);
-- New accounts start with the user's current stated emergency cushion.
ALTER TABLE public.personal_finance_settings ALTER COLUMN buffer SET DEFAULT 126000;

-- Track the month already paid separately from the total bank balance.
-- A due date displayed in the portal is not a push notification.
ALTER TABLE public.personal_finance_settings
 ADD COLUMN IF NOT EXISTS nu_paid_month text NOT NULL DEFAULT '2026-10',
 ADD COLUMN IF NOT EXISTS nu_last_payment_amount numeric(15,2) NOT NULL DEFAULT 963048,
 ADD COLUMN IF NOT EXISTS nu_next_due date NOT NULL DEFAULT '2026-11-15';

-- Rollover at the start of each new month, never earlier than Oct 2026.
-- Existing missed months are already included in pila_balance and must not be added twice.
ALTER TABLE public.personal_finance_settings
 ADD COLUMN IF NOT EXISTS pila_last_processed_month date NOT NULL DEFAULT '2026-10-01';

CREATE TABLE IF NOT EXISTS public.personal_finance_pila_rollovers (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 contribution_month date NOT NULL,
 amount numeric(15,2) NOT NULL CHECK(amount >= 0),
 created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,contribution_month)
);
ALTER TABLE public.personal_finance_pila_rollovers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS finance_own_pila_rollovers ON public.personal_finance_pila_rollovers;
CREATE POLICY finance_own_pila_rollovers ON public.personal_finance_pila_rollovers
 FOR ALL TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);

CREATE OR REPLACE FUNCTION public.rollover_my_pila()
RETURNS numeric LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE
 v_user uuid := auth.uid();
 v_settings public.personal_finance_settings%ROWTYPE;
 v_month date;
 v_current date := date_trunc('month', (now() AT TIME ZONE 'America/Bogota'))::date;
 v_paid numeric;
 v_missing numeric;
BEGIN
 IF v_user IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
 INSERT INTO public.personal_finance_settings(user_id) VALUES(v_user)
 ON CONFLICT(user_id) DO NOTHING;
 SELECT * INTO v_settings FROM public.personal_finance_settings
 WHERE user_id=v_user FOR UPDATE;
 v_month := greatest(v_settings.pila_last_processed_month, date '2026-10-01');
 WHILE v_month < v_current LOOP
   SELECT coalesce(sum(amount),0) INTO v_paid
   FROM public.personal_finance_bills
   WHERE user_id=v_user AND category='Salud y pensión'
    AND status='paid' AND due_date >= v_month AND due_date < (v_month+interval '1 month');
   v_missing := greatest(0,v_settings.health-v_paid);
   INSERT INTO public.personal_finance_pila_rollovers(user_id,contribution_month,amount)
   VALUES(v_user,v_month,v_missing)
   ON CONFLICT(user_id,contribution_month) DO NOTHING;
   IF FOUND THEN
     v_settings.pila_balance:=v_settings.pila_balance+v_missing;
   END IF;
   v_month:=(v_month+interval '1 month')::date;
 END LOOP;
 UPDATE public.personal_finance_settings
 SET pila_balance=v_settings.pila_balance,pila_last_processed_month=v_current
 WHERE user_id=v_user;
 RETURN v_settings.pila_balance;
END; $$;
REVOKE ALL ON FUNCTION public.rollover_my_pila() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rollover_my_pila() TO authenticated;
