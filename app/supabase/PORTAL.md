# Portal: installation and administrator access

The `/panel` route resolves the signed-in user's role from Supabase. Only `super_admin` sees real leads. Clients receive a separate placeholder portal. `/panel/mensajes` remains an administrator-only social-message demo.

## Install

1. Run `schema.sql` if the initial form tables/functions are not installed. Do not rerun it after `portal.sql`: the base schema intentionally revokes table access and replaces submission functions.
2. Run the entire `portal.sql` in Supabase SQL Editor.
3. In Authentication → Users, confirm the intended administrator's email and copy that user's UUID. Run this manually in SQL Editor, replacing the placeholder:

```sql
update public.portal_profiles
set role = 'super_admin'
where id = 'REPLACE_WITH_VERIFIED_AUTH_USER_UUID'::uuid
returning id, email, role;
```

Verify the returned email before continuing. If no row is returned, the migration or UUID is incorrect. The application never promotes an account automatically, by email match, user metadata, or a client-side setting. Existing accounts and newly registered accounts default to `client`. Re-running the migration preserves assigned roles.

4. Sign out, sign back in, and visit `/panel`.

## Scope

- Real contact requests, quote requests and testimonials, newest first, 25 per page.
- Totals per source, name search, full message and request details. Read only; no edits or deletion.
- All historical and anonymous records remain visible to the administrator.
- Anonymous records are not assigned to a client merely because their email matches. New submissions record the authenticated UUID when available.
- Client functionality and social integrations are deferred. Social conversations are clearly marked demo.
- RLS also prevents client users from reading another user's records directly via REST. There are no application permissions to modify roles or records.
- No service-role credential belongs in the browser.

## Verification on the real project

Use two separate client test accounts and an administrator. Check that direct table reads return all records for the admin, only rows with the caller's `user_id` for clients, and no rows for anonymous callers. Verify clients cannot update `portal_profiles.role` or insert profiles, including through modified requests. Submit an anonymous contact, quote and testimonial; each must appear for the admin after Refresh. Confirm login, logout, password recovery and both ES/EN views. Do not claim these live checks passed based only on local mocks.
