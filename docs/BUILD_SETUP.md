# Run the first web implementation

This branch adds a runnable React/TypeScript/Vite interface and an Express/Supabase account API. It is a foundation, not the completed inventory product. Source: src/, server/, supabase/migrations/, scripts/ and tests/.

## Preview without credentials

Prerequisites: Node.js 24 (tested 24.19.0), npm and a modern browser. From repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:5173/demo/admin for the interactive creator-dashboard preview, /demo/order for the sample order journey, or /admin/login for the login interface. Demo routes use only synthetic data; they never call the account API or send email. The sample order draft is stored in browser local storage; this is not production offline synchronization. Demo admin changes reset when the page reloads.

The login page explicitly reports missing configuration; there is no default username/password.

## Configure real authentication privately

1. Review the account migration and the target Supabase environment. Live access was inspected read-only; this branch has NOT applied its migration.
2. Copy .env.example to .env and populate values privately. Never paste privileged keys into a public issue, commit or chat. Variables prefixed VITE_ are public browser configuration; the service-role key must never use that prefix.
3. Set SUPABASE_URL and VITE_SUPABASE_URL to the same project URL. Set VITE_SUPABASE_PUBLISHABLE_KEY to its publishable key. Put the server-only credential in SUPABASE_SERVICE_ROLE_KEY. Set APP_ORIGIN to the actual allowed application origin.
4. Apply the versioned migration using an authorized, reviewed deployment process. CLI syntax was checked with `npx supabase db push --help`; use `--dry-run` first for the selected linked environment. Do not apply to unrelated databases. Run the project's security advisors after live application.
5. In Auth configuration, allow the exact application `/auth/set-password` redirect, configure the site URL and email sender, and disable public signup for the provisioned-account model. These settings have not been changed in this branch.
6. In a second terminal run `npm run dev:api`. Vite forwards /api requests to the local API on port 3001. Check /api/health for configured state; that flag alone does not prove the schema or email delivery works.
7. Set BOOTSTRAP_ADMIN_EMAIL privately to the creator email already supplied by the owner. The public repository deliberately does not store that address. Run `npm run bootstrap:admin -- --confirm` only after checking the target and email. It creates an Auth identity plus creator role; it sends no email and exposes no password.
8. Use Forgot password from the app login with the intended email to request password setup. Verify actual delivery, set a private password, sign in and exercise administrator authorization. Sender restrictions may require configured SMTP or an authorized recipient. MFA/recovery policy remains a release decision.
9. Create a test business/user from the admin dashboard, then explicitly select Send password-setup email for the reviewed recipient. Confirm actual activation, isolation, disable/reactivate and session revocation before calling account setup ready.

For a built local server: `npm run build`, then `npm start`; open http://localhost:3001. APP_ORIGIN must match that origin for authenticated mutation requests. The server binds to loopback intentionally. Hosting/TLS/process management must be configured before any production release; no host has been deployed.

## Account provisioning and recovery

New business accounts receive an unexposed random initial password. They choose their password through the configured recovery flow. No password is returned from the API. Creation and email delivery are separate actions.

The operation UUID/email reservation prevents duplicate business creation. Auth and Postgres cannot form a single transaction: if the provider creates an identity but the following operation update fails, an authorized operator must reconcile the pending record. Verify the operation actor/email, provider identity, creation timing and absence of an existing membership before assigning its auth_user_id; then retry the original operation. Never attach an unrelated preexisting identity. This rare recovery is not yet automated and is a launch gate.

The first-admin command refuses to replace an existing administrator. If its Auth step succeeds and role creation fails, inspect/reconcile the intended identity through the same trusted process. Do not rerun repeatedly or delete unknown users.

Session revocation records existing Auth session IDs, so refreshing an old session remains blocked. A new sign-in gets a new session. User/business disabled checks run at the API and RLS boundaries. No live Auth session tests are claimed yet.

## Verification commands

```sh
npm run build
npm test
npx playwright install chromium
npm run test:e2e
npm run docs:check
```

The lockfile pins dependencies. Playwright 1.56.1 is paired with the validated Chromium build. Unit/API/database tests use synthetic data and PGlite PostgreSQL with Auth roles/claims modeled locally. They do not contact real email or create real users.

18 automated tests cover money, price override, API role checks, origin restrictions, schema idempotency, RLS and revocation. Six browser tests cover desktop/phone login, sample admin creation/access and sample order flow. See [screenshots](implementation/README.md).

## Remaining work

- Apply migration in the selected environment; configure private credentials, Auth redirects/sender and actual creator setup.
- Live provider verification of create/setup/reset/refresh/revocation; pending-operation reconciliation tooling.
- Pagination beyond the latest 200 accounts and 50 audit events; full subscription date/payment management; MFA policy and production host.
- Full customer/product CRUD, invoice/credit/payment transactions, real PDFs, backups, reports and offline synchronization.

No paid service, live email, production deployment or public credential is introduced by running the preview.
