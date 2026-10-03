# Inventory & Sales — Authoritative Web-App Specification

Version 1.0 · 2026-10-03 · Owner: Carlos Mercado · Status: approved web-first direction; detailed rules below include proposals and unresolved decisions.

## 1. Authority, purpose and scope

This is the authoritative product specification. It replaces Android-only development instructions in the previous handoff, setup notes and design descriptions. The product is now a responsive, cloud-backed web application for U.S. small businesses, usable on phones, tablets and desktop browsers. Native Android packaging is deferred. The repository name is retained; it does not determine the platform.

The product lets a business manage customers, products, inventory, orders, invoices, credit notes, payment records, printable documents and daily comparisons through a clear guided interface. One subscription covers one business and one business user with the complete package. The creator manages business accounts and subscriptions in a separate administrator area. Customer contacts are not login users.

Do not trade away required features simply to make navigation look simple. Use progressive disclosure, contextual actions and shared flows. “Conversational” means short, helpful prompts and clear next steps; an AI chatbot is not required.

### Requirement labels

- **Confirmed:** explicitly requested or accepted by the owner.
- **Required safeguard:** necessary for correct, secure operation of those features.
- **Proposed:** a recommended design or implementation default, not a claim of owner approval.
- **Decision:** unresolved; resolve at its stated gate. Do not silently implement it as a commercial or accounting policy.

Confirmed scope includes offline operation and synchronization from the previous plan. The web pivot does not itself cancel that requirement. An online foundation can be built first; full-release acceptance still requires offline support or an explicit owner-approved deferral.

Supabase free tier is the starting budget constraint. No paid upgrade is authorized. Framework, hosting provider, email provider and billing provider are not selected here. Commercial price suggestions in old notes are not approved prices.

## 2. Project references and evidence

- Repository: https://github.com/CarlosMElliot/inventory-sales-android
- Original Figma file: https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR
- Figma team: WorksPlace. This is the recorded team name, not a finalized app name.
- Editable backup: [inventory-sales-mobile-prototype.fig](design/source/inventory-sales-mobile-prototype.fig)
- [Design archive](design/README.md), [screen gallery](design/screens/README.md), [screen checksum manifest](design/screens/manifest.json).
- [Original print-reference photograph](design/reference/paper-form.png), [reference notes](design/reference/README.md).
- Supabase project reference: xrtoinoanxbpnuurhdtq
- Project URL: https://xrtoinoanxbpnuurhdtq.supabase.co
- Dashboard: https://supabase.com/dashboard/project/xrtoinoanxbpnuurhdtq
- [Current progress](PROGRESS.md), [handoff](PROJECT_HANDOFF.md), [historical setup research](SETUP_GUIDE.md).

The September 27 checkpoint recorded a healthy Supabase project in ca-central-1, organization Inventory-app, free plan, no public tables and no recorded migrations. This is dated evidence, not a fresh database audit. Auth, storage, actual integration behavior and current project state must be checked before implementation.

The assets and earlier documentation are planning evidence. They do not prove a functioning web app, authentication, database, PDF renderer, subscription service or deployment. Current Figma access and successful .fig reimport are not asserted.

## 3. Users, permissions and commercial model

| Actor | Permitted responsibilities |
| --- | --- |
| Creator administrator | Provision business and its one user; manage subscription status/dates and recorded subscription payments; suspend/reactivate; inspect operational audit evidence |
| Business user | Manage own business profile, customers, products, categories, stock, transactions, reports and backups |
| Customer contact | Buyer record owned by a business; no application login or self-service portal in this scope |
| Unauthenticated visitor | Login, invitation/password setup and password recovery only |

Every business-owned row and private file must be protected by server-side ownership checks. Knowing another record ID, modifying a URL or sending a direct API request must not bypass isolation. Administrative access must be explicit, audited and separate from ordinary business permissions.

Proposed subscription states: active, grace, expired/read-only and creator-suspended. Exact capabilities, grace duration, data retention, trial, prices and reactivation behavior are decisions. Do not delete business records for nonpayment. Recommended expired behavior permits viewing, PDF export and backup while blocking new business mutations. Suspension may have different access rules; define these deliberately.

Subscription collection and customer payment recording are separate systems. Initial admin subscription bookkeeping may be manual; automated subscription billing requires a selected provider and additional integration. No card charging is implied by a recorded payment method.

## 4. Navigation and responsive design

### Mobile navigation

Proposed bottom navigation: Home, Customers, Products, More. More contains Transactions, Inventory, Reports, Settings and Account. Home prominently offers New order, New invoice, Create credit and Record payment. Frequent actions must not require repeated trips through More.

### Desktop and tablet

Proposed desktop sidebar: Home, Transactions, Customers, Products, Inventory, Reports, Settings. Account and subscription appear in the account menu. Wide transaction screens use an item area plus a persistent totals panel. Narrow screens use stacked sections and a sticky next/review action. The admin area has its own navigation.

Use responsive layouts rather than stretching a 390-pixel mockup. Tables may scroll horizontally within their region; the entire page must not require horizontal scrolling. Preserve filters and scroll position when returning from a record. Browser Back and deep links must behave predictably. Warn before discarding unsaved changes, while preserving safely autosaved drafts.

### Visual direction

| Token | Value |
| --- | --- |
| Primary teal | #006D65 |
| Main text | #172D32 |
| Secondary text | #60757A |
| Page background | #F5F8F7 |
| Surface | #FFFFFF |
| Soft teal | #E4F2EE |
| Border | #DCE6E2 |
| Warning text / surface | #875600 / #FFF2D8 |
| Typeface | Roboto Regular/Bold |
| Reference rounding | Cards approximately 16; buttons approximately 14, adapted to CSS |

Use labeled controls, readable contrast, keyboard access, visible focus, accessible dialogs, descriptive errors and touch-friendly controls. Never communicate status solely through color. Required fields must be identified before submission. Signature capture needs a clear accessible fallback policy before release.

Every data screen needs loading, empty, error, retry, permission-denied and offline states. Saving must distinguish locally saved, queued, server-confirmed and failed. A timeout must not falsely imply that nothing was saved.

## 5. Existing Figma screens and web adaptation

| Reference | Direct Figma link | Intended web use |
| --- | --- | --- |
| Home | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=3-327 | Action hierarchy, summary cards and recent activity |
| Choose customer | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=3-328 | Search/select/create customer |
| Build order | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=3-329 | Items, quantities, editable prices and stock warnings |
| Review order | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=6-38 | Review before posting |
| Saved order / preview | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=9-42 | Confirmation and document actions |

The five main frames are 390 × 920 references, not fixed website dimensions. Northside Supply, Alex and Harbor Market are sample data. Coffee 2 × $12 plus water 3 × $8 totals $48; water is the out-of-stock example.

The price overlay is a mock interaction and does not recompute the prototype. Print, email and share previews are not functioning integrations. The old demo-save overlay is historical. The saved-order PDF preview is simplified and must be replaced by the paper-reference layout.

Unfinished print frames: order 11:70, invoice 11:71, payment receipt 11:72 and credit note 11:73. Do not call them finished. Additional web screens can be implemented from this specification without first completing every Figma frame.

## 6. Screen-by-screen workflows and acceptance

Screen IDs are stable references for implementation tickets and tests. Shared controls should be reused across document types.

### S01 — Login, invitation and recovery

Display product identity, email, password, show-password control, sign-in and forgot-password actions. Business accounts are creator-provisioned; public self-signup is not required. Invitation/password-setup links have explicit expired/invalid states. Recovery responses should not expose whether arbitrary emails have accounts.

Successful login opens Home or the permitted subscription-status screen. Failed login preserves email and explains the next action without exposing sensitive details. Logout ends the application session and handles local cached business data according to the approved offline policy.

Acceptance: an invited business user can establish a password, sign in and reach only their business; a business user cannot access admin operations.

### S02 — First-use business setup

Show a brief checklist: business identity, logo/contact details, timezone, first customer, first product and opening inventory. Optional fields can be completed later. Show useful empty-state shortcuts without blocking exploration.

Acceptance: setup can resume later; completing it never creates duplicate customers or opening stock movements.

### S03 — Home

Show business name/logo, current business date and sync status. Primary actions: Order, Invoice, Credit, Payment. Summary cards distinguish invoiced sales, orders placed, payments received and outstanding customer balances. Show recent activity with document type, number, customer, amount and status. Optional low/negative-stock alerts link to affected products.

Acceptance: tapping a summary opens its filtered list; orders and collections are not added to invoiced sales. Today's numbers use the business timezone.

### S04 — Transaction hub and filters

Tabs or type filter: All, Orders, Invoices, Credits, Payments. Search by document number, customer and payment reference. Filters: customer, date range, document status, payment status where applicable and payment method for payments. Presets: Today, Yesterday, This week, This month, All time and Custom. Show applied filters and Clear filters.

Rows show type/number, customer, date, amount and meaningful status. Provide pagination or incremental loading without silently omitting older results. Opening a document retains the list state on return.

Acceptance: same-day custom filters include the whole selected business day; historical customer results can be retrieved beyond the first page.

### S05 — Customer list

Search by name, business, phone or email. Show balance and active/inactive state. Primary action Add customer. Selection mode inside a transaction returns the chosen customer to the draft. Display inactive customers only when requested, while allowing historical lookup.

Acceptance: searching or creating a customer during a sale preserves all existing line items and edits.

### S06 — Customer form

Required customer name. Optional business name, phone, email, billing address, shipping address, tax ID, payment terms and notes. “Shipping same as billing” reduces typing. Validate malformed supplied values. Warn about probable duplicates; do not block genuinely distinct customers solely because names match.

Edit changes future default details; issued document snapshots remain intact. Deactivate referenced customers instead of deleting history.

Acceptance: invalid forms identify fields; cancelled edits do not mutate saved customer data; returning from successful inline creation selects the new customer.

### S07 — Customer profile and complete history

Sections: Overview, Transactions and Notes. Overview includes contact actions, addresses, balance and shortcuts to new order/invoice/payment. History defaults to All time, newest first, and includes orders, invoices, credits and payments with the same filters as S04. Open related documents and their links.

Notes contain text, author and timestamp; editing records modification time. An optional follow-up date is supported without implying an automated reminder service. Internal notes never appear on customer PDFs unless deliberately copied to document comments.

Acceptance: a customer with years of records has retrievable complete history; invoice-to-payment and invoice-to-credit navigation works in both directions.

### S08 — Product list

Search name/SKU and filter category, active state, stock tracking and low/negative stock. Show photo thumbnail, name, SKU, selling price and stock or “Not tracked.” Actions: Add product, Import products and Inventory. Avoid showing cost prominently in selling flows.

Acceptance: inactive products remain visible in historical documents but are not silently offered for new sales.

### S09 — Product form and photograph

Fields: name, SKU, category, selling price, optional cost, unit of measure, track-inventory switch, opening quantity and low-stock threshold. Product photo supports file selection and camera capture where available, preview, replace and remove. Validate uploads server-side; report failed uploads without losing typed information.

Opening quantity is a one-time movement, not an editable shortcut to rewrite stock history. Later quantity changes use Inventory adjustment. Changing inventory-tracking mode after movements exist requires a deliberate audited policy.

Acceptance: changing the standard price does not rewrite issued documents; deleting an unused product is possible, while referenced products are deactivated.

### S10 — Categories

Create, rename and assign categories. Removing a populated category requires reassignment or explicit move to Uncategorized. Preserve products and history. Duplicate-name validation is scoped to the business.

Acceptance: renaming a category updates grouping without changing product identity or transaction values.

### S11 — Excel product import

Flow: download template → upload → map columns → validate → preview → choose duplicate handling → confirm → results. Minimum mapped fields are name and selling price; require a stable SKU or explicit identity strategy for updates. Optional fields follow the product model.

Preview distinguishes new rows, updates, skipped rows and errors. Validate number formats, required fields, category mapping, duplicate SKUs and unsupported data. Existing stock must never be overwritten implicitly. Any stock import needs an explicit opening/adjustment interpretation and movement preview.

Proposed default: invalid rows block confirmation until corrected or explicitly excluded. Reimport/retry must not duplicate previously committed rows. Return counts and downloadable row errors.

Acceptance: the user can see exactly what will change before committing; imported opening inventory reconciles to the movement ledger.

### S12 — Inventory overview and product movements

Show per-product opening/current stock, unit, low-stock threshold and status. Drill into dated movements with quantity change, before/after, reason, source document and actor. Separate physical stock from any future reservation display.

Actions: Load opening stock, Receive stock and Adjust stock. Movement filters include date, product and reason. Untracked items are labeled and excluded from physical stock totals.

Acceptance: the displayed closing quantity can be reconstructed from recorded movements.

### S13 — Receive or adjust inventory

Choose product, action, quantity, effective date and reason. For an absolute count, show current stock, counted stock and calculated delta before confirmation. Receiving stock is an additive movement. Require a reason for manual corrections and preserve audit evidence.

Acceptance: retrying a confirmed adjustment does not apply it twice; negative results are explicit; invalid quantities cannot post.

### S14 — Choose customer for a new transaction

Identify transaction type in the heading. Search/select customer, open relevant balance/history and create customer inline. Return to the exact transaction draft. Credits and payments additionally guide selection of eligible invoices.

Acceptance: switching customer after adding items prompts review of customer-specific terms and addresses without silently discarding items.

### S15 — Build order or invoice

Show selected customer, searchable products, category filter and add-product action. Each line has product name/SKU, stock status, quantity, unit price and line amount. Support adding multiple items, editing quantities/prices and removing lines. Expand optional discount, tax, shipping details and comments only when needed.

Tracked out-of-stock items remain selectable. Show a warning describing available and requested quantities; provide an explicit continue action. Untracked items show no physical availability check. Do not require positive inventory to sell.

Price-edit overlay shows standard price and proposed transaction price. Applying it affects this draft only. A separate product-edit action changes the catalog.

Acceptance: stock 3 and requested quantity 5 can proceed after warning; price override recalculates totals without changing catalog price.

### S16 — Transaction details and review

Review customer, addresses, document date, terms, items, quantities, prices, discounts, tax and total. Show stock warnings and any altered price. Optional comments and signature action appear here. Order and invoice headings and save buttons must be distinct.

Allow Edit links back to the relevant step without losing data. Final save is guarded against double taps. Draft preview must visibly say Draft. A signature confirms the reviewed document version; material edits invalidate its applicability to the new version.

Acceptance: review totals equal saved totals; invalid or stale data produces an actionable response rather than a false success.

### S17 — Saved document and preview

Show document type/number, status, customer and total. Render a zoomable, paginated preview. Actions: Print, Download PDF, Email PDF, Share PDF and appropriate contextual actions such as Record payment, Create invoice, Create credit, Edit or Void.

Successful save must mean server confirmation, or explicitly say “Saved offline — awaiting sync.” If PDF generation fails after a successful transaction, keep the transaction and offer Regenerate; never post it again.

Acceptance: refreshing the page loads the same document; reprinting creates no stock or financial movements.

### S18 — Order detail and conversion

Orders record customer demand and agreed prices. Confirming an order does not deduct physical stock. Show linked invoices and order status. Create invoice copies eligible lines and creates a traceable link, with a review step before invoice posting.

Proposed initial conversion: full-order conversion, preventing duplicate conversion. Partial invoicing, backorders, fulfillment and reservations require a decision before implementing those branches. Do not fake partial fulfillment by altering totals without links.

Acceptance: an order leaves stock unchanged; the corresponding invoice deducts once; repeated conversion requests cannot create duplicates.

### S19 — Invoice detail, edits and voids

Show invoice content, payment status, due amount and linked payments/credits/order. Actions depend on state and dependencies. Draft edits are unrestricted within validation. Posted edits require a reason, version history and atomic net adjustments to stock and balances.

If payments/credits make an edit invalid, explain the conflict and offer the supported correction path; do not silently detach dependent records. Voids retain the number, reason, original content and reversing entries. Posted records are not hard-deleted.

Acceptance: changing posted quantity from 5 to 6 deducts one additional unit, not six; conflicting simultaneous edits cannot silently overwrite each other.

### S20 — Credit creation and detail

Choose customer and original invoice. Show remaining creditable quantities/amounts after previous credits. Choose items, quantity/value, reason and disposition per relevant line: Return to stock or Do not restock. Review tax/discount reversal and resulting balance.

Post one linked credit note. Record return movements only when elected. Credit does not automatically pay cash back. Credits on paid invoices need an explicit unapplied-credit/refund policy; unsupported outcomes must be explained and blocked safely until that policy is implemented.

Acceptance: crediting one restockable unit adds one unit exactly once; cumulative credits cannot exceed eligible quantity/value.

### S21 — Record payment and allocate

Choose customer → choose one or more outstanding invoices → enter date, amount, method, reference and optional notes → allocate amounts → review → optional signature → save receipt.

Methods: cash, credit/debit card, check, money order, bank transfer, other. Terms such as Cash sale, COD and On account are separate from method. Purpose such as Goods, Deposit, Rent or Other is separate again. Standalone deposits require the approved unapplied-payment model.

Show amount due before payment, this payment and remaining balance. Allocations must equal the applied amount and belong to the same customer/business. Support multiple payments on an invoice and partial payments. Block accidental overpayments unless an explicit credit-balance model exists.

Acceptance: a $100 invoice and $40 payment yield $60 due; recording the method “Card” does not call a payment processor.

### S22 — Payment receipt and reversal

Receipt includes customer, amount, date, method, reference, allocated invoices, notes and signature if present. Offer print/PDF/email/share. Correct financial mistakes through a reasoned reversal and replacement flow, preserving links and evidence. Refunds are separately modeled money-out events, not renamed credit notes.

Acceptance: reversing a payment restores the appropriate invoice balances once; reports show the reversal without erasing the original receipt.

### S23 — Signature capture

Capture using touch, stylus or mouse. Show signer name, document type/number or draft reference, total and capture date. Actions: Clear, Cancel and Apply. Store signature with the exact document version and actor metadata.

Acceptance: signing does not itself save a payment; an edited total requires renewed signature approval. Never claim a particular legal signature standard without a separate requirement and validation.

### S24 — Daily reports and comparisons

Select business date and comparison date, defaulting to the previous day. Sections: invoiced sales, orders, credits, payments and inventory. Each summary has a drilldown into supporting records. Export/print/email the report as PDF with logo, business, date range, timezone and generation time.

Show current day as “Today so far.” Display absolute and percentage changes; when the comparison value is zero, use an explicit “No prior value” treatment rather than divide by zero.

Acceptance: payments today for old invoices appear in today's payments, not as new sales. Inventory closing reconciles to opening and movements.

### S25 — Settings, branding and account

Business profile: upload/replace/remove logo; rename display name; edit contact/address; set timezone and document defaults. Show document-branding preview. Account: password/session actions and subscription status. Internal business identity stays stable after rename.

Historical issued documents retain their issued branding/customer/line snapshots under the proposed version policy. A newly generated current balance statement can show current state, but must not masquerade as the original issued invoice.

Acceptance: business rename changes future documents and app header without changing record ownership.

### S26 — Backup export and restore

Export a versioned package of business data and permitted assets. Show preparation progress, generated date, counts and download status. Import flow: select package → validate version/integrity/ownership → show summary/conflicts → choose supported restore behavior → confirm → result.

Backup includes customers, categories, products, documents/lines/links, payment allocations, stock movements, notes, signatures and photos. It excludes passwords, privileged credentials and user-editable subscription/admin entitlements. PDFs alone are not restorable backup.

Acceptance: invalid or cross-business packages cannot modify data; failed restore does not leave a partly replaced business. Merge versus replacement must be decided and tested.

### S27 — Offline and synchronization center

Show online/offline state, last successful sync, queued operations, failed operations and conflicts. Detail the reason and next action per failure. Use stable operation IDs, retries and resumable synchronization. Distinguish local temporary document identifiers from official numbers under the chosen numbering policy.

The exact offline feature matrix—viewing, new customers/products, documents, payments, signatures, PDF and printing—must be agreed and tested. Cloud-dependent email and subscription checks need honest queued/unavailable states. Show known cached stock as potentially stale.

Acceptance: reconnecting and replaying operations never duplicates a document, allocation or movement. Conflicts are visible and never silently resolved by losing financial data.

### S28 — Creator admin: businesses and users

List businesses with status, owner/user email, subscription dates and operational flags. Create business and its one user through an invitation/password-setup workflow. View/edit subscription dates, record subscription payment evidence, suspend/reactivate with reason and inspect admin audit history.

Invitation sending is a real external message and must be performed deliberately. No default shared passwords. Cross-business support access must be explicit and logged.

Acceptance: a normal business login cannot invoke these operations through either UI or API; creation retries do not duplicate a business.

### S29 — Subscription blocked/read-only state

Explain current state, what remains accessible and how to contact the creator or renew through the selected process. Avoid trapping users away from exports if the approved expiration policy allows them. Apply restrictions server-side and to sync validation.

Acceptance: manipulating browser state cannot reactivate a subscription. Offline revocation limits are documented; instant blocking of a disconnected device is never promised.

## 7. Transaction states and accounting invariants

Keep document state separate from payment state and sync state.

| Entity | Proposed states | Important distinction |
| --- | --- | --- |
| Order | Draft, Confirmed, Invoiced, Cancelled | Partial statuses only if partial conversion is implemented |
| Invoice | Draft, Posted, Void | Payment state separately Unpaid / Partially paid / Paid / Settled by credit or mixed settlement |
| Credit | Draft, Posted, Void | Restock state belongs to movements, not a cash-refund assumption |
| Payment | Recorded, Reversed | Allocations and reversals are explicit |
| Sync | Local draft, Queued, Confirmed, Conflict, Failed | Queued is not server-confirmed |

Required invariants:

1. Posting document, inventory movements and balance effects must succeed atomically or not at all.
2. The server validates amounts, ownership, subscription permissions and transitions; frontend totals are a preview.
3. Each save/conversion/payment/import operation has an idempotency key scoped to the business.
4. Final document numbers are unique per business/type and allocated atomically; voided numbers are never reused.
5. Catalog/customer changes do not rewrite historical issued line or contact snapshots.
6. Posted corrections preserve original versions, reasons, actor and timestamps.
7. Payment allocations cannot refer to another customer's or business's invoice.
8. Quantity/value credited cannot exceed the remaining eligible amount.
9. Physical movements and financial allocations must remain linked to their source records.
10. Concurrent editing uses version checks; the later editor reviews changes rather than overwriting unknowingly.

Proposed calculation order: quantity × unit price → line discount → taxable base → tax → document total. Document-level discounts, tax inclusion/exclusion, exemptions, rounding and per-line versus document tax calculation require final decisions. Use decimal arithmetic or scaled integers for money; do not rely on binary floating-point accumulation. Store the values used at issue time.

Under the simple applied-payment model: invoice balance = posted invoice total − applied credits − active payment allocations. Refunds, overpayments and unapplied balances need their own ledger rules before use. Never hide an unsupported negative balance by forcing it to zero.

Allow nonnegative prices, positive sale quantities and valid discount limits by default; negative sale lines are not a shortcut around credit-note rules. Fractional quantities depend on the product unit policy.

## 8. Inventory rules

| Event | Physical stock effect |
| --- | --- |
| Draft or confirmed order | None |
| Posted tracked-product invoice | Decrease invoiced quantity |
| Untracked-product invoice | None |
| Order converted to posted invoice | Invoice decrease once |
| Credit with return to stock | Increase accepted returned quantity once |
| Credit without restocking | None |
| Receive stock | Increase received quantity |
| Manual count adjustment | Apply confirmed delta |
| Valid posted edit | Apply net difference through traceable correction movements |
| Void | Apply required reversals once, subject to dependency checks |

Overselling is confirmed scope. Stock 3 minus invoice quantity 5 equals −2 after an explicit warning. Negative stock is visible in products, inventory and reports. A reservation feature, if selected, maintains reserved/available separately from physical on-hand stock.

Deleting movements to “fix” stock is prohibited. Backdated adjustments retain both effective business date and actual recorded timestamp. Business-day boundary and historical report treatment must be consistent.

## 9. Reports and comparison definitions

### Sales

Report posted invoice count, gross merchandise value, discounts, tax, invoice total, posted credit amount and net invoiced value. Label whether a metric includes tax. Cancelled/draft/void documents are excluded from active sales and available separately for audit.

Orders placed are a demand metric, not additional revenue. Customer collections are cash/payment activity, not additional invoiced sales. Never total orders + invoices + payments as sales.

### Payments and customer balances

Break down active payments by method, customer and allocated invoice. Show reversals separately and net receipts according to their effective dates. Payments on prior-day invoices belong to today's payment activity if received today.

For the supported applied-payment model:
opening receivable + posted invoices − applied credits − active payments = closing receivable.
If deposits/unapplied balances/refunds are added, show them separately and extend the reconciliation explicitly.

### Inventory comparison

For each tracked product:
opening stock + receipts − invoiced quantity + restocked returns + signed adjustments/reversals = closing stock.

Show product/SKU/unit, opening, received, sold, returned, adjusted, closing, net change and negative/low-stock flag. Optional valuation needs a separately approved costing method; do not imply inventory profit/cost accounting merely because optional product cost exists.

### Date and revision policy

Business timezone controls day boundaries, including daylight-saving changes. Store actual timestamps and effective business dates distinctly. Inclusive UI dates map to a start-inclusive/end-exclusive backend range.

Proposed historical behavior: rerun reports using the current corrected ledger, display generation timestamp and indicate revisions/backdated changes. Locked end-of-day snapshots versus restated reports remains a decision before reports release.

## 10. Documents, PDF, email, sharing and printing

### Authoritative visual reference

Use [the archived BCS invoice photograph](design/reference/paper-form.png) for BOTH orders and invoices. DISNA is the customer in that photograph. The earlier blank DISNA pad and simplified Figma preview are superseded for this layout.

Required structure:

1. Supplier logo/name/address/contact header; document title and page number at upper right.
2. Separate bordered Sold To and Ship To boxes.
3. Summary with document number, item/box counts when defined and packing reference when applicable.
4. Customer ID, terms, salesperson/contact, order date and ship date where known.
5. Bordered item table.
6. Clear totals at lower right.
7. Comments, received-by/signature/date and relevant payment references in the footer.

Core item fields: quantity, SKU, description, unit, unit price and line amount. The photographed grid also has pack size, list price, allowance, net price, suggested retail and extension. Extension means line amount. Extra columns require explicit definitions and real data; omit unsupported columns. Do not label total units as boxes without a conversion.

Use clean white paper with black text/borders. Do not copy yellowing, shadows, handwriting, sample customer details, legal clauses or charges from the photograph. Business terms are configurable and intentional.

### Differences by document

| Type | Required meaning |
| --- | --- |
| Order | Ordered items/prices; does not imply payment or physical stock deduction |
| Invoice | Billed items, total, applicable recorded payments/credits and balance with clear as-of/version semantics |
| Credit note | Original invoice, reason, credited items/amount and stock-return choice |
| Payment receipt | Payment date/amount/method/reference, allocations and resulting balances |

Payment method, payment purpose and sales terms must not be conflated. A signature does not prove collection. Reprinting never generates a new transaction.

### Output behavior

Preview, download, email attachment and print must use the same document renderer/version. Support zoom, multipage content, repeated table headers, page numbers and unclipped totals/signatures. Paper size is a decision; US Letter is a proposal, not inferred from photo dimensions.

Browser Print opens the browser/OS print workflow. Do not promise silent printing, raw Bluetooth support or universal printer compatibility. A specific printer/paper/browser combination must be tested before advertised support.

Email flow: recipient defaults from customer, editable subject/message, visible attachment name and explicit Send. Use an actual PDF attachment through the selected delivery approach; a text-only mailto link does not meet the requirement. Save transaction first and handle email failure independently. Track queued/sent/failed status truthfully; provider acceptance is not proof the recipient read it.

Share uses supported browser/device file sharing where available, with Download PDF and manual attachment fallback. Gmail and WhatsApp sharing must be tested on supported environments; no guarantee that every browser offers them as direct targets.

## 11. Data model and proposed architecture

This is a logical model, not an implemented schema.

| Domain | Main records and relationships |
| --- | --- |
| Tenancy | Business, business-user membership, admin authorization, subscription and status history |
| Customer | Contact/address snapshots, notes, terms |
| Catalog | Product, category, image, unit and inventory-tracking configuration |
| Transactions | Document header, lines, revisions, document links, signatures, numbering sequence |
| Payments | Payment, allocation, reversal; refunds/unapplied balances if approved |
| Inventory | Immutable movements linked to product and source/version |
| Operations | Audit events, idempotency records, sync queue/conflicts, exports/restores, email delivery status |

Every business-owned record has stable identity and ownership. Foreign-key relationships must prevent cross-business linking. Important fields include created/updated timestamps, effective business date, revision, actor and source-operation identifier.

Proposed boundaries: responsive web frontend; Supabase authentication, database and private file storage; trusted server operations for posting, numbering, privileged admin work and external service integration. Client framework and hosting remain choices.

Row-level security is required for exposed business tables, with policies enforcing business membership on reads and writes. Private files must have equivalent authorization. Do not use editable user metadata as authority. Privileged keys stay server-side; customer-controlled backup imports cannot grant admin rights or alter subscription entitlements.

Production work requires versioned migrations, reviewed permissions, secrets outside source control, dependency lockfiles and reproducible configuration. Inspect existing services before making changes. No production schema, billing or hosting change is authorized merely by approving this document.

## 12. Offline, backups and operational reliability

Offline is a separate engineering capability, not a consequence of making the site installable. A PWA installation experience is proposed; installation alone does not prove offline financial workflows work.

Define cache scope, storage limits, device logout behavior, authorization expiry, conflict resolution, provisional numbering and dependent operation ordering. Queue a new customer before its invoice; retain references during synchronization. Cached stock and balances must be visibly dated.

A disconnected device cannot be blocked instantly from the server. The offline authorization period is an explicit business decision; a three-day suggestion from old notes was never approved. On reconnect, validate business state and present rejected/conflicting operations without losing evidence.

Restorable business backups are distinct from provider-managed backups. Do not promise a free-tier platform backup feature without verification. Restore must include data integrity checks, dependency ordering, audit and rollback/recovery. Downloaded backups contain private business data; links must require authorization and obey a defined expiry/retention policy.

Reliability requirements: never lose a confirmed transaction; recover a pending-save result after timeout; preserve posted records when PDF/email jobs fail; log technical failures without secrets; present actionable user messages. Define measured performance and data-volume targets before launch instead of claiming unlimited capacity.

## 13. Decision register and implementation gates

| ID | Decision | Proposed direction / unresolved point | Gate |
| --- | --- | --- | --- |
| D01 | Product name | WorksPlace is team name; final public name needed | Branding/release |
| D02 | Web stack and hosting | Select maintained responsive stack after environment inspection; free services first | Foundation |
| D03 | Offline release sequencing | Remains in scope; approve feature matrix and any explicit deferral | Release planning |
| D04 | Offline license/device policy | Define grace duration, allowed devices and concurrency; no instant offline revocation claim | Offline/auth |
| D05 | Subscription commercial rules | Price/trial/grace/renewal/suspension/retention; prior price suggestions not approved | Billing/release |
| D06 | Sales tax | Manual configuration vs provider, tax basis, exemptions and rounding | Invoice posting |
| D07 | Document numbering | Separate business/type series; decide prefixes, resets and offline allocation | Posting/offline |
| D08 | Posted edits | Audited revisions/net deltas; define conflicts requiring reversal/reissue | Financial edits |
| D09 | Partial orders | Full conversion proposed initially; decide partial invoices, backorders and reservations | Conversion |
| D10 | Credits/refunds/deposits | Decide paid-invoice credits, unapplied balances, overpayments and cash refunds | Credit/payment completion |
| D11 | Units and pack pricing | Fractional units, case conversions, allowances and optional print columns | Catalog/import/PDF |
| D12 | Print support | Paper size, printer/browser/device matrix; US Letter proposed | Print acceptance |
| D13 | Email delivery | Sender identity/provider, attachment limits, retry and delivery status | Email |
| D14 | Restore and retention | Merge vs replace, asset handling, export expiry and recovery | Backup/restore |
| D15 | Historical reporting | Restated ledger reports vs locked daily snapshots | Reports |
| D16 | Browser/performance targets | Supported browsers/devices, data volumes, offline storage and response targets | Release validation |
| D17 | Signature policy | Required vs optional by type, accessible alternative, document revision rules | Signatures |
| D18 | Business timezone/currency | USD first; select per-business timezone/default and timezone-change rules | Onboarding/reports |
| D19 | Payment purpose and terms | Clarify Charge vs On account; standalone deposits/rent need ledger rules | Payment completion |

These decisions do not block reversible sample-data UI work. They do block declaring their dependent production features complete.

## 14. Release acceptance scenarios

| ID | Scenario | Required result |
| --- | --- | --- |
| A01 | Business A requests B's record/file by known ID | Server denies read/write/download |
| A02 | Business user calls admin endpoint directly | Denied, no state change |
| A03 | Create customer/product within draft | Return selected record; preserve all existing draft work |
| A04 | Save order with zero-stock product | Order saved; no physical stock reduction |
| A05 | Invoice 5 units with stock 3 | Warning acknowledged; closing stock −2 |
| A06 | Retry A05 after timeout or double tap | One invoice and one net stock effect |
| A07 | Invoice untracked product | Sales recorded; no physical stock movement |
| A08 | Convert order and retry conversion | Linked invoice; no duplicate deduction or document |
| A09 | Override price in order/invoice | Draft and issued totals use override; catalog unchanged |
| A10 | $100 invoice, $40 payment | $60 due; allocation and receipt agree |
| A11 | Pay yesterday's invoice today | Today's collections increase; today's invoiced sales do not |
| A12 | Restock one credited unit and retry | One credit and one-unit stock increase |
| A13 | Credit without restocking | Balance effect correct; physical stock unchanged |
| A14 | Credit more than eligible quantity/value | Rejected with actionable explanation |
| A15 | Edit posted quantity 5→6 | One additional unit deducted, revision preserved |
| A16 | Edit invoice below already settled amount | Supported correction required; no corrupted allocations |
| A17 | Reverse a payment | Appropriate balance restored once; original receipt remains |
| A18 | Change signed total | Previous signature retained with old version; new signature required per policy |
| A19 | Search customer history by same-day range | All records within that business day, including boundary cases |
| A20 | Compare inventory day opening and closing | All movements reconcile; negative stock visible |
| A21 | PDF across multiple pages | No clipped rows/totals; repeated headers; correct title and page numbers |
| A22 | Print/email/PDF same issued version | Same content and correct attachment; no extra transaction |
| A23 | Rename business or customer | Historical snapshots intact; future defaults updated |
| A24 | Excel errors and duplicate rows | Visible validation; explicit choices; no silent stock overwrite |
| A25 | Restore wrong-business/corrupt backup | No mutation; clear rejection |
| A26 | Restore known valid backup in test environment | Record links/assets/counts and financial/stock totals reconcile |
| A27 | Offline create then repeated reconnect/replay | No duplicate documents, payments or movements |
| A28 | Two browser sessions edit same posted record | Conflict detected; no silent lost update |
| A29 | Expired subscription manipulation in browser | Server enforces approved state and export permissions |
| A30 | Refresh after ambiguous save timeout | Recover actual saved state using operation identity |
| A31 | Keyboard and narrow-screen workflows | Complete core flow without inaccessible controls/page overflow |
| A32 | New business with no data | Useful empty states; no fabricated activity |
| A33 | Prior comparison value zero | No invalid percentage/division error |
| A34 | PDF/email job fails after posting | Transaction remains; retry document delivery only |

## 15. Implementation sequence and definition of done

1. **Foundation:** inspect repository/backend; select web stack; establish responsive layout, shared components and a sample customer-to-order journey using existing Figma direction.
2. **Secure data foundation:** authentication, business isolation, creator provisioning, customer/product/category CRUD, uploads, import and inventory ledger.
3. **Transaction engine:** posting, numbering, idempotency, orders, invoices, conversion, price overrides, payments, credits, signatures, revisions and reversals.
4. **Documents and recovery:** reference-matching PDFs, browser printing, email/sharing and tested backup/restore.
5. **History and reports:** full filters, linked customer history, daily financial and stock reconciliation/comparisons.
6. **Offline and subscriptions:** implement approved offline matrix/conflicts and server-enforced subscription lifecycle; integrate earlier where needed.
7. **Release hardening:** supported-browser/printer checks, accessibility, recovery, security, migration rehearsal, measured capacity and owner review before production deployment.

Stages organize delivery; they do not remove confirmed scope. Start security and idempotency early, not as a final cosmetic step.

A feature is done only when its UI, authorized backend behavior, failure states, relevant acceptance scenarios and documentation are complete. Mocks are labeled. Passing a screenshot review is not proof of transactions or printer support. Record actual tests and limitations in PROGRESS.md. Do not spend on upgrades or publish production automatically.

## 16. Continuation prompt

Continue the web-first inventory and sales project in CarlosMElliot/inventory-sales-android. Read docs/WEB_APP_SPEC.md as the authority, then docs/PROGRESS.md, docs/DESIGN_REFERENCE.md and docs/PRINT_PREVIEW_SPEC.md. Use the linked Figma file and archived screens/photograph. Inspect current repository and Supabase state read-only before implementation. Preserve the full scope and distinguish confirmed requirements, proposed defaults and unresolved decisions. Android-only instructions in historical notes are superseded. Work in small complete milestones, verify real behavior, update progress and keep secrets out of the public repository. Begin with the next unfinished web milestone; do not assume a deployed app or working integrations already exist.
