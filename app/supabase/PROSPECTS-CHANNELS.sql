-- Add contact channel without changing existing commercial/delivery statuses.
begin;
alter table public.sales_prospects add column if not exists contact_channel text;
alter table public.sales_prospects add column if not exists contact_url text;
update public.sales_prospects set contact_channel=case
 when subject ilike 'Contacto por Instagram%' then 'Instagram'
 when gmail_url like 'https://mail.google.com/%' then 'Correo electrónico'
 else 'Por verificar' end
where contact_channel is null or trim(contact_channel)='';
create index if not exists sales_prospects_channel_status_idx on public.sales_prospects(contact_channel,status);
notify pgrst,'reload schema';
commit;
