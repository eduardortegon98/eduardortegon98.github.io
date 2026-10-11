# Private analytics dashboard

Route: `/panel/analitica`, available only to `super_admin`.
The frontend calls the `analytics-dashboard` Supabase Edge Function. The function
verifies the current user and their `portal_profiles.role` before accessing any
report or cached result. No Google credential is sent to the browser.

## One-time Google setup

1. Enable Google Analytics Data API in your Google Cloud project.
2. Create a dedicated service account. No project-wide IAM role is needed for
   Analytics reporting. In Google Analytics → Admin → Property access management,
   grant its email **Viewer** access to **Soluciones Ortegón — Web** only.
3. Create its JSON key and store it directly in Supabase Edge Function secrets as
   `GOOGLE_SERVICE_ACCOUNT_JSON`. Never commit the key or paste it into chat.
4. Add `GA_PROPERTY_ID` with the property's numeric ID (not the `G-...` measurement
   ID and not the stream ID). Find it in Admin → Property details.
5. Optional secret `ANALYTICS_ALLOWED_ORIGINS`: comma-separated exact origins.
   Defaults to `https://solucionesortegon.com,https://www.solucionesortegon.com`.

## Deploy

From `app`, link the existing Supabase project, then run:

```sh
supabase functions deploy analytics-dashboard --no-verify-jwt --project-ref gocnygelxokbnuxlfrtg
```

In the dashboard editor, turn OFF **Verify JWT with legacy secret** and save.
The handler still verifies the session through Supabase Auth and checks the
server-controlled super_admin role before accessing Google or cached reports.
Legacy gateway validation can reject sessions signed with newer signing keys.

After changing the function source in GitHub, deploy it again in Supabase.
GitHub Pages deploys the frontend only, not this Edge Function.

Supabase provides `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Edge Functions. This
function does not need the service-role key. Google API access is read-only.
Reports are cached for 60 seconds per period, after authorization; refresh does
not bypass the cache. Allowed periods: 7, 30 and 90 days including today.

## Verification

- Logged out: frontend redirects to login; API responds 401 without a user JWT.
- Client role: frontend returns to the client portal; API responds 403.
- Super admin: sees period totals, daily sessions, top sources, pages, devices,
  `generate_lead` counts and active users in the last 30 minutes.
- Missing credentials / unavailable Google API: honest unavailable state,
  no fabricated statistics and no secrets in errors.
- Compare selected dates with GA4. Historical reports may take 24–48 hours and
  may be affected by privacy thresholds. Only consented visits are measured.

The frontend can be deployed before the connection: it shows a connection-pending
message until the function and secrets are installed. A successful GitHub Pages
deployment does **not** deploy the Supabase Edge Function.
