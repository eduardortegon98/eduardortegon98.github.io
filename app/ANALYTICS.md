# Google Analytics 4

Dashboard: https://analytics.google.com/

Create a web data stream for https://solucionesortegon.com/ in the
Soluciones Ortegón — Web property (Colombia time zone, COP).
Add the public `G-...` measurement ID as GitHub Actions repository variable
`VITE_GA_MEASUREMENT_ID`, then deploy main.

In the stream's Enhanced measurement settings, turn off automatic pageviews
(including history changes), form interactions, site search and other automatic
measurements. The application sends its own sanitized pageviews and successful
`generate_lead` events. Mark `generate_lead` as a key event in Analytics.

Visitors can accept or reject analytics and reopen preferences with Cookies.
The tag does not load before acceptance. Private/login routes are excluded;
names, emails, phones, messages, auth fragments and arbitrary query parameters
are never included in application events. Only safe campaign labels from
`utm_source`, `utm_medium` and `utm_campaign` are permitted.

Reports → Realtime: verify initial visits after accepting cookies.
Traffic acquisition: inspect LinkedIn/referral and campaign sources.
Events: inspect `generate_lead`, broken down by `form_name` (`contact`, `quote`).
A lead is counted only after the database confirms the submission succeeded.

Tracking starts after deployment, consent and measurement ID configuration;
there is no historical backfill. Local builds without an ID leave analytics off.
