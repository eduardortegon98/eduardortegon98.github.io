-- Run AFTER schema.sql and portal.sql. Safe to run again.
begin;
alter table public.customer_feedback
  add column if not exists moderation_status text not null default 'pending'
  check (moderation_status in ('pending', 'approved', 'rejected'));
update public.customer_feedback set moderation_status = 'approved'
where approved and moderation_status <> 'approved';

-- Keep the existing public listing (approved = true) in sync with moderation.
create or replace function public.sync_feedback_approval()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.approved := new.moderation_status = 'approved';
  return new;
end;
$$;
revoke all on function public.sync_feedback_approval() from public, anon, authenticated;
drop trigger if exists sync_feedback_approval on public.customer_feedback;
create trigger sync_feedback_approval before insert or update on public.customer_feedback
for each row execute function public.sync_feedback_approval();

create or replace function public.moderate_feedback(p_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  if auth.uid() is null or not public.portal_is_admin() then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_status is null or p_status not in ('approved', 'rejected') then
    raise exception 'Invalid moderation status' using errcode = '22023';
  end if;
  update public.customer_feedback set moderation_status = p_status
    where id = p_id
    returning jsonb_build_object('id', id, 'approved', approved, 'moderation_status', moderation_status) into result;
  if result is null then
    raise exception 'Testimonial not found' using errcode = 'P0002';
  end if;
  return result;
end;
$$;
revoke all on function public.moderate_feedback(uuid, text) from public, anon, authenticated;
grant execute on function public.moderate_feedback(uuid, text) to authenticated;
notify pgrst, 'reload schema';
commit;
