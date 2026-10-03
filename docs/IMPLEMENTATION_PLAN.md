# Web implementation plan

Updated 2026-10-03. Product authority: [WEB_APP_SPEC.md](WEB_APP_SPEC.md). Execution evidence: [PROGRESS.md](PROGRESS.md).

M0 stack/tool inspection is complete (hosting unresolved). M1 sample flow/admin UI implemented in part. M2 account API/schema/bootstrap are locally tested; live configuration and broader CRUD are pending. M3–M7 remain unstarted. See PROGRESS.md for evidence; milestone scope is not reduced.

## First actionable task: live integration setup

Read AGENTS.md, PROGRESS.md and BUILD_SETUP.md. The first branch contains runnable frontend/account API code and a locally tested migration. Configure the private target, review/apply the migration, establish Auth redirects/sender and bootstrap the intended creator identity; verify real account flows before marking M2 complete.

If backend tools are unavailable, record the limit and continue the reversible sample-data UI foundation. Do not claim backend connection or wait for decisions unrelated to that first flow.

## Ordered milestones

| Milestone | Work and dependencies | Exit evidence |
| --- | --- | --- |
| M0 — Environment and stack | Inspect source, tools and service access; select D02; define actual setup commands and planned source layout | Non-secret environment/stack record, reproducible setup instructions, exact next task |
| M1 — Responsive sample order journey | Home → choose/create customer → build → price edit → review → saved preview; use Figma styles and synthetic data | Runs at mobile and desktop widths; $48 sample calculation, working price override, stock warning and preserved draft; mocks labeled; relevant A03/A04/A09/A31/A32 checks |
| M2 — Secure data foundation | Auth, tenancy, creator login/dashboard, business/user directory and creation, trusted first-admin bootstrap, audit foundation, customers/products/categories/photos/import; inventory ledger/adjustments | Migrations, actual creator login/provisioning and ownership tests; A01/A02/A35–A42, applicable A03/A07/A20/A24; private files protected; recorded setup steps |
| M3 — Transaction engine | Orders/invoices, numbering, conversion, credits/payments, allocations, signatures, corrections/reversals; resolve D06–D11/D17–D19 as relevant | A04–A18/A23/A28/A30; atomic posting/retry tests, money and stock reconciliation; correct linked records |
| M4 — Documents and recovery | Reference-matching PDFs, browser print, email/share and backup/restore; resolve D12–D14 | A21/A22/A25/A26/A34; actual supported printer/browser test; real PDF attachment and delivery error behavior |
| M5 — History and comparisons | Global/customer filters, full history, daily sales/orders/payments and stock comparison; resolve D15/D18 | A11/A19/A20/A33 with seeded date boundaries and report reconciliation; PDF report checks |
| M6 — Offline and subscriptions | Approved offline matrix, queue/conflicts, subscription lifecycle and advanced subscription operations; resolve D03–D05 | A01/A02/A06/A27–A30; reconnect replay without duplicates; server restrictions and honest offline-expiry behavior |
| M7 — Release validation | Supported environments, accessibility, capacity, recovery, migration rehearsal; resolve remaining launch decisions | Applicable A01–A42 passed with evidence; unresolved items explicitly approved/deferred; owner reviews concrete release candidate before deployment |

M2 must deliver the creator admin dashboard and working user creation, not just an invisible provisioning endpoint. See ADMIN_ACCESS.md. M6 extends subscription/offline lifecycle behavior rather than postponing admin login, account creation or security. Offline IDs, document numbering and conflict strategy must influence M2/M3 design before M6 implementation.

## Scope mapping

| Area | Screens | Main milestone |
| --- | --- | --- |
| Authentication and onboarding | S01–S02 | M2 |
| Home and transactions | S03–S04 | M1/M3/M5 |
| Customers and history | S05–S07 | M2/M5 |
| Products/categories/import | S08–S11 | M2 |
| Inventory | S12–S13 | M2/M3 |
| Order/invoice flows | S14–S19 | M1/M3/M4 |
| Credits/payments/signatures | S20–S23 | M3/M4 |
| Reports | S24 | M5 |
| Branding/account | S25 | M2/M4/M6 |
| Backups | S26 | M4 |
| Offline/sync | S27 | M6, designed earlier |
| Creator business/subscription management | S28–S29 | M2/M6 |
| Creator login, dashboard, users, create-user form and audit | S30–S34 | M2 |

## How to execute a task

1. Name the outcome, associated screen/acceptance IDs and any blocking decision IDs.
2. Inspect existing implementation; reuse it rather than creating duplicate foundations.
3. Implement a complete useful slice with required data permissions and failure states.
4. Verify the concrete risk: calculation, isolation, retry, responsive behavior or relevant integration.
5. Record exact result, limitations and changed files in progress.
6. Choose the next smallest useful task; avoid asking the owner to restate what is already documented.

## Decision handling

The decision register in WEB_APP_SPEC.md is the only authoritative list. Resolve a decision before its dependent production behavior, not by silently choosing a commercial rule. Document the outcome and rationale there and regenerate the README mirror.

Ordinary reversible coding choices may proceed within authorization. If offline, a feature or supported environment is deferred by the owner, record the explicit scope change and its consequences rather than marking an unimplemented feature complete.

## Future source organization

Choose the actual layout at M0 based on the stack. Keep application code, tests, database migrations and documentation clearly separated. Add root commands and environment-variable names once verified. There are deliberately no placeholder app/migration directories claiming an implementation today.

## Session checkpoint template

Copy into PROGRESS.md after meaningful work:

- Date and milestone/task:
- Outcome and files/commit:
- Screen/acceptance IDs covered:
- Commands/checks actually run and result:
- Decisions resolved with evidence:
- Remaining risks or unavailable tests:
- Exact next action:
