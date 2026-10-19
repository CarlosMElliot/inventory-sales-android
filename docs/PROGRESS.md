# Current implementation progress

> Implementation review: [PR #2](https://github.com/CarlosMElliot/inventory-sales-android/pull/2). This branch contains the code described below; it has not been deployed.

Updated 2026-10-19. Branch: feat/web-foundation-admin. Product authority: WEB_APP_SPEC.md.

## Creator provisioned — 2026-10-19

- Owner completed private password entry and Auth identity creation in the dashboard.
- Verified the matching identity was newly created and email-confirmed; confirmed zero preexisting creator administrators.
- Invoked the existing bootstrap_creator function under service_role for that exact identity. No Auth-system records or passwords were edited directly.
- Verified the creator profile and a single creator_bootstrapped audit event. This is provisioning evidence, not a successful application sign-in.
- Next: select local versus hosted runtime, configure its private server credential and matching origin, then verify creator sign-in. For hosted use, replace the development Site URL and add the exact hosted password redirect before requesting recovery email. Custom SMTP/business-user activation remains pending.
- Do not rerun the account-creation script or bootstrap after this checkpoint.

## Auth dashboard configuration — 2026-10-19

- Saved public signup disabled; email confirmation remains enabled and anonymous sign-in remains disabled.
- Saved development Site URL `http://localhost:5173` and exact password-setup redirect `http://localhost:5173/auth/set-password`. These are local development settings, not a hosted deployment.
- Dashboard shows default email templates and no custom SMTP configured. Email delivery is untested.
- Opened the first creator identity form with the previously supplied email privately prefilled. Password entry/submission is handed to the owner; no identity creation or administrator role assignment is claimed at this checkpoint.
- After owner creates the intended identity: inspect it through the trusted connector and invoke the restricted bootstrap function for that exact identity. Do not rerun the create-user bootstrap script against an existing identity.
- Private Express server credential/configuration and a runnable app origin still remain before login can be tested.

## Live database activation — 2026-10-19

- Owner resumed the documented Supabase project; confirmed ACTIVE_HEALTHY.
- Initial migration returned success during COMING_UP but disappeared when startup completed. Re-inspected the empty schema/history, then applied again after ACTIVE_HEALTHY. Final recorded version: `20261019062929_account_foundation`.
- Renamed the unchanged migration file and updated its schema-test reference to match the actual remote version, preventing duplicate application under the original timestamp.
- Verified five application tables, all with RLS enabled; anon has no SELECT and authenticated has no INSERT/UPDATE/DELETE grants.
- Verified all four account RPCs are SECURITY INVOKER, denied to anon/authenticated and executable by service_role.
- Security advisor: two informational RLS-without-policy findings on account_operations/admin_events. These are intentionally server-only tables with no browser grants; adding client policies would weaken the intended boundary. See https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy.
- Final counts: zero Auth users, profiles and businesses. No account, password-setup email or application deployment created.
- Current Supabase connector exposes database operations but no Auth-settings update, Auth-admin user creation or private server-key retrieval. Complete those through an authorized dashboard/private server setup; never fabricate Auth records directly in SQL.
- Verification this session: live catalog/privilege/count queries, migration history and security advisor. Prior local build/18 tests/six browser checks below are historical and were not rerun; SQL contents are unchanged and only the test fixture path moved.

## Built in this first implementation

- React 19 / TypeScript / Vite frontend; Express account API; pinned dependencies and lockfile.
- Responsive creator/business login, password visibility/recovery/setup UI, role-aware app entry.
- Creator dashboard, businesses/users search and filters, create-account form, disable/reactivate, session revocation, explicit setup-email action and recent audit events.
- Protected server API validates tokens with Auth and current database role/status. Browser requests cannot set admin role. Missing server configuration fails closed.
- Account migration with RLS, unique business seat/email, idempotent creation completion, audit records and revoked-session tracking. Minimal service-role Auth-column grants were identified from an actual read-only privilege check.
- Trusted first-admin bootstrap script; no committed email/password/key. The owner already supplied the intended admin email privately.
- Sample customer/order flow with inline customer creation, editable quantities/prices, out-of-stock ordering, review/comments and local browser draft persistence. This is not production sales persistence or full offline sync.
- Labeled admin preview mode never calls real account APIs or sends email.
- [Actual screenshots](implementation/README.md) and [run/setup instructions](BUILD_SETUP.md).

## Verified

- `npm run build`: TypeScript and production bundle passed.
- `npm test`: 18 tests passed: money, request validation/role denial, database isolation, idempotency, disabled access and refreshed-session revocation. Database tests execute with a modeled service-role/anonymous/authenticated permission setup in local PGlite.
- `npm run test:e2e`: 6 Chromium checks passed across desktop 1440×1050 and phone 390×844, covering admin preview creation/access, price override/order review/draft recovery, honest unconfigured login and no page-level horizontal overflow.
- `npm audit --omit=dev`: zero reported vulnerabilities at this check.
- `npm run docs:check`: README mirror synchronized.
- Figma Home and Build Order context/screenshots were successfully retrieved this session. Admin screens adapt the same tokens; no matching admin Figma screen exists yet.
- Live Supabase inspection only: no public application tables, zero Auth users at the start. No schema/account/email mutation or deployment was performed.

## Milestone status

M0 stack/tool inspection completed; hosting is unresolved. M1 sample order slice and responsive admin/login UI implemented, with business home/customer/product persistence still pending. M2 account schema applied and live permissions checked; real Auth integration, private server configuration and broader CRUD remain pending. M3–M7 not completed.

## Exact next action

Creator identity and administrator role are provisioned. Select local or hosted application runtime, configure the server-only credential and matching origin, then test actual creator sign-in. Hosted deployment additionally needs hosted Auth URLs. Configure custom SMTP before business-user activation testing. Never publish keys or passwords.

## Remaining limits and release gates

The live account migration is verified. Creator identity and role exist. No hosted URL, custom sender, actual application sign-in or invitation delivery is claimed. No production key is available in this workspace. MFA/recovery and hosting policy remain unresolved. The rare Auth-created/database-update-failed path requires trusted operator reconciliation, documented in BUILD_SETUP.md. The initial admin lists cap at 200 accounts/50 events and need pagination before scale. Full subscription dates/billing actions, customer/product CRUD, financial transactions, reference-matching PDFs, backups, reports and offline sync remain to build.

All confirmed scope remains in WEB_APP_SPEC.md. Preview screenshots and locally passing tests do not establish production readiness.
