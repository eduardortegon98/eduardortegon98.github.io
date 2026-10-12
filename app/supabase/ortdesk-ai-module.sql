-- Run after module-catalog.sql to make this product assignable to clients.
insert into public.portal_modules(id,name_es,name_en,category,enabled)
values('ortdesk_ai','ORTDESK.AI','ORTDESK.AI','intelligence',true)
on conflict(id) do nothing;
notify pgrst,'reload schema';
