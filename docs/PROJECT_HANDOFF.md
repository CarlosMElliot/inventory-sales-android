# Inventory & Sales Android — project handoff
Updated: 2026-09-27. This document preserves the planning conversation and is the starting point for subsequent implementation sessions.

## 1. Mission and working style
Build a straightforward Android mobile inventory and sales app for U.S. small businesses. One subscription covers one business and one business user, with the whole feature package. The creator operates a separate administrator interface. Keep the customer UI uncluttered through contextual actions, not by dropping required features.

Work in small, complete, tested milestones to conserve ChatGPT usage. Reuse components and keep this specification and the progress checklist current. Avoid repeated planning, unnecessary tool calls, and rebuilding existing work. No paid upgrades without the owner's authorization. Implement the app rather than spending the entire budget finishing Figma.

## 2. Resources and verified state
- GitHub: https://github.com/CarlosMElliot/inventory-sales-android
- Repository read access was verified while it was public and empty. Earlier create-file attempts returned 403 (Resource not accessible by integration). GitHub's authorization screen subsequently showed that the ChatGPT Codex Connector was authorized but not installed. The owner completed setup and authorized this retry. This committed handoff establishes successful contents-write access; workflow execution and Supabase access remain unverified.
- Supabase API URL supplied by owner: https://xrtoinoanxbpnuurhdtq.supabase.co
- Supabase project reference: xrtoinoanxbpnuurhdtq
- Dashboard: https://supabase.com/dashboard/project/xrtoinoanxbpnuurhdtq
- Owner says the project was created and connected to its corresponding GitHub repository. Project name, region, actual plan, tables, Auth configuration and integration behavior have NOT been verified by this agent.
- Supabase plugin was installed and authorized, but no callable Supabase tools appeared in the original conversation. In a separate new chat, the user successfully listed projects (initially zero, before creating this project). Continue in that new chat with GitHub and Supabase selected.
- Figma: https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR
- Figma team: WorksPlace, Starter plan, team::1346714379661626716.
- There is NO implemented Android app, APK, database schema, admin panel, deployment, or real login yet. The existing UI is a Figma prototype only.
- No secrets are included in this handoff. Never place database passwords, access tokens, service-role keys or private signing keys in this public repository.

## 3. Scope decisions and superseded requirements
The initial phone-only storage requirement was replaced by cloud-backed accounts and data with offline support and synchronization. Supabase free tier is the chosen starting constraint.
All orders, invoices, credits, payments, inventory management, signatures, printing and backup features remain first-release requirements. Building in stages does not remove them from release scope.
Earlier text that BLOCKED invoices when inventory was insufficient is superseded: users MUST be allowed to proceed with out-of-stock/insufficient-stock sales after a warning.
No final Android technology stack or package identifier has been selected. Choose and document a practical native Android approach; Kotlin/Compose is a candidate, not an already-approved implementation. Do not replace the Android deliverable with a website without agreement.

## 4. Account model and access control
- Platform creator/admin creates business accounts and their single-user logins, manages subscription payments/status, suspends and reactivates access.
- Business user creates customers and products and manages their own operations. Customer records are buyers, NOT app login accounts.
- Each business's database records and files must be isolated server-side, including offline synchronization and backup restore.
- Invitations/password setup flow should avoid sharing passwords. Actual invitation sending is a distinct action.
- Account/permission enforcement lives on the backend; do not trust client flags or user-editable metadata.
- Supabase exposed tables require RLS and business-scoped policies. Test cross-business access denial.
- Keep privileged keys and administrator-only operations off the Android client.
- Business subscription states proposed: active, grace period, expired/read-only, creator-suspended. Allow record viewing/export on expiration; do not delete data for nonpayment. Exact suspension and grace rules need finalization.
- Offline access cannot support immediate remote blocking. A three-day offline authorization window was suggested but NOT finalized. Resolve before implementing offline licensing.

## 5. Commercial direction
U.S. market; one business, one user, full package.
Suggested, not final prices: USD 39/month; USD 390/year; optional USD 99 assisted setup; 14-day trial; first 10 customers USD 29/month for first year.
Manual recording of subscription payments can precede automated billing. No billing provider selected.
Earlier backend estimate was USD 0 for development and approximately USD 25–35/month for an initial paid setup; these were estimates, not a purchase authorization. Verify current pricing before spending.
No unlimited storage or unlimited training promise.

## 6. Navigation and visual direction
Android mobile only. Professional, readable, one-handed, concise guided prompts. Existing sample frames are 390×920; implementation must adapt to actual Android screen sizes and system insets rather than hard-code that height.
Teal/white visual direction:
- Primary teal #006D65
- Main text #172D32
- Secondary text #60757A
- Background #F5F8F7
- White surfaces #FFFFFF
- Soft teal #E4F2EE
- Borders #DCE6E2
- Warning text #875600 and background #FFF2D8
Roboto Regular/Bold; rounded cards ~16dp, buttons ~14dp; clear typographic hierarchy. Figma uses Material 3 button instances.
Four main navigation destinations: Home, Customers, Products, More. Transactions and Reports can be reached through More and contextual shortcuts; keep core operations easy to reach.
Home has explicit Order, Invoice, Credit and Payment actions, daily totals and recent activity.
Use contextual Edit, Record payment, Create credit and View history actions. Optional comments/signatures/additional details should not overload the main form.
Home sample branding "Northside Supply" and user "Alex" are placeholders, NOT the owner's finalized brand.

## 7. Customers and history
Create/edit customers via forms, including from within a transaction without losing progress.
Fields: required customer name; optional business name, phone, email, address, tax ID, payment terms and notes. Warn on likely duplicates.
Customer profile: overview/contact, outstanding balance, full transaction history, notes with dates and optional follow-up.
History defaults to all time, newest first and includes linked orders, invoices, credits and payments.
Open a historical transaction to view detail, related records, print/download/share; return to an in-progress sale without losing state.
Deactivate customers with transaction history instead of destroying historical references.

## 8. Products and inventory
Create/edit products, photos from camera/gallery, SKU, name, category, selling price, optional cost, units, opening quantity and low-stock threshold.
Products may track inventory or have inventory tracking disabled.
Load opening stock, receive additional stock, and adjust stock with a reason and before/after quantities. Preserve movement history.
Create, assign and rename categories. Reassign products or move to Uncategorized when removing a populated category.
Deactivate products; permanent deletion only when not referenced by transaction history.
Import Excel products: sample template, column mapping, preview, validation, duplicate SKU handling, explicit update/skip choice and row error summary. Do not silently overwrite stock.

## 9. Orders, invoices and credits
Shared flow: choose customer → add/select products → edit quantity/unit price → details → review → save → document preview/actions.
Support drafts, saved-transaction editing, comments and signatures as applicable. Prevent duplicate saves.
Prices may be overridden while building orders/invoices. Override applies only to that transaction; changing the standard product price is separate and explicit.
- Orders: allow any quantity, including zero stock. Saving an order does NOT deduct physical inventory. Reservations are optional/unfinalized and must be separate if implemented.
- Invoices: tracked items deduct stock when finalized. Insufficient stock triggers a warning but user can continue; balances can become negative. Example: 3 available, sell 5 → closing -2.
- Nontracked items: no stock validation/deduction, but sales still reported.
- Convert order to invoice with linked original and prefilled data; never deduct stock twice.
- Credits: link original invoice, select eligible quantities/amounts and reason. Do not exceed remaining creditable quantity/value. Choose return to available stock or do not restock (damaged/unusable).
- Credit does not automatically mean cash refund; refund handling is a separate linked operation if supported.
- Invoice payment states: unpaid, partially paid, paid.
- Saved edits must apply net differences to stock and balances, retain audit history, and handle linked payments/credits safely.
- Voids require a reason and appropriate reversals. Reprinting/exporting does not create new transactions.
- Capture invoice/payment signatures after totals are reviewed. Material edits require a new signature and preservation of relevant history.

## 10. Payments and terms
Record payments against a customer and one or more outstanding invoices; support partial payments and allocations.
Fields: date, amount, payment method, reference number, notes, optional customer signature.
Methods: cash, credit/debit card, check, money order, bank transfer, other.
Payment purpose: goods, deposit, rent, other where appropriate.
Sale terms are separate: cash sale, C.O.D., on account (reference form also has "charge"; clarify any distinction instead of conflating labels).
Payment recording is bookkeeping, not card/bank payment processing.
Prevent unintended overpayments unless a deliberate customer-credit feature is implemented.
Show amount due, this payment, and remaining balance. Avoid double-counting payment against its linked invoice.

## 11. Document reference and print requirements
User supplied a paper business form; use its structure, adapted per document type:
- Centered business header with logo/name/address/phone.
- Customer order/document number, date, customer name and address in bordered rows.
- Payment purpose checkboxes: rent/deposit/goods/other.
- Payment method block: card/check/money order/cash, extended for transfer/other.
- Adjacent amount-due / this-payment / balance-due box.
- Sold-by and sale terms row: cash/C.O.D./charge/on account.
- Bordered item grid with QTY, DESCRIPTION, PRICE, AMOUNT and total at bottom.
- Add comments and signature/date areas where relevant.
Reference is a combined order/payment form; always distinguish ORDER, INVOICE, PAYMENT RECEIPT, CREDIT NOTE.
Order must not imply payment was received. Use not recorded/not applicable or omit inapplicable payment fields.
Invoice shows due/payment/balance; payment receipt shows allocations and method; credit shows original invoice, reason, amount, restocking and effect on balance.
Black-and-white print design, adequate margins, readable type, multipage continuation with headers/page numbers. Preview should match generated PDF.
Each saved transaction: preview, print, download PDF, email PDF and share. Reprint from history.
Native Android share sheet should support installed Gmail/WhatsApp. Email must include PDF attachment, not merely a text-only mail link.
Printer selection, supported paper size, copies, print progress/failure/retry. Confirm target printer/model/protocol before promising broad Bluetooth printer support.
No real email, printing or backend save exists in current prototype.

## 12. Business profile, backups, offline
Business user uploads/replaces/removes logo and renames business/display name; edits address, phone, email. Preview profile on documents.
Rename must not change internal business identity/subscription/record ownership. Define historical document snapshot behavior.
Backup means restorable business data (customers/products/transactions/stock movements/photos/signatures), not an APK copy. PDFs are not a backup.
Export and restore with version validation, business ownership checks, summary and clear replacement/conflict semantics. Exclude account secrets and subscription/admin entitlements from customer-controlled restore.
Cloud data with local offline cache/operations; show pending/failed sync and last sync. Use stable IDs/idempotency so retries never duplicate payments, invoices or stock movements.
Exact offline strategy and conflict handling are unimplemented. Resolve before release, even with only one user per business.

## 13. Reports and filters
Global transaction filters: type (all/orders/invoices/credits/payments), customer, status, date (today/yesterday/week/month/all time/custom From-To); search document number, customer name, payment reference.
Same-day From/To must work; include full date boundaries in business timezone.
End-of-day comparison:
- Sales invoiced: count, subtotal, discounts, tax, credits and net invoiced amount.
- Orders: count, value and status; not counted as sales invoiced.
- Payments: received amounts by method/customer/invoice, including collections for older invoices.
- Customer balances: opening + invoices - applicable credits - payments = closing, with allocation rules preventing double application.
- Inventory: opening + stock added - invoiced units + restocked returns ± adjustments = closing.
Tracked negative stock highlighted. Nontracked items show "Not tracked"; their sales still count.
Daily comparison against previous day. Tap totals for underlying transactions.
Current day labeled "Today so far" with generation time; use business-configured timezone.
Reports support PDF preview/download, print, email and share, with business logo/name.
Drafts/voids identified and excluded or separately shown as appropriate. Historical corrections must remain traceable.

## 14. Figma implementation evidence and limitations
Completed main frames:
1. Home: 3:327
2. Choose customer: 3:328
3. Build order: 3:329
4. Review order: 6:38
5. Saved order/document preview: 9:42

Links use https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=9-42 etc.
Connected sample path: Home Order → Harbor Market → Build order → Review order → Save order → saved-order preview.
Frame 3 includes out-of-stock messaging and editable-price overlay; this is visual prototyping, not a functioning price calculator. Applying the mock price does not actually recompute totals.
Many other actions are placeholders: customer search/create, quantity controls, other transaction types, product creation, etc.
Sample: coffee 2×$12=$24; water 3×$8=$24; order total $48, tax/discount zero.
Frame 5 currently has SIMPLIFIED order PDF preview. The requested reference-matching replacement did NOT complete.
Created empty print frames (may show placeholder shimmer):
- Order: 11:70
- Invoice: 11:71
- Payment receipt: 11:72
- Credit note: 11:73
These must NOT be reported as finished templates.
Supporting overlays: price 4:180; obsolete save/demo 4:194; print 10:125; email 10:142; share 10:159.
Figma Starter MCP limit blocked work repeatedly. A trivial read later succeeded, but the next inspection was blocked again. Do not claim full access restored based on one minimal read.
No requirement to finish Figma before code. Existing colors/screens plus this specification are sufficient to begin.

## 15. Implementation milestones and acceptance
All stages are unstarted in code:
1. Android foundation and local sample order workflow matching Figma.
2. Supabase Auth, business isolation, customer/product management and stock adjustments.
3. Orders/invoices/credits/payments, linked conversions, signatures, price edits and auditing.
4. Reference-matching PDFs, sharing/email, printing and backup/restore.
5. Complete history/filters/comparison reports and reliable offline synchronization.
6. Creator-admin interface and subscription enforcement; production hardening.

Meaningful acceptance scenarios:
- Create customer/product from transaction without losing draft.
- Order out-of-stock product without stock deduction.
- Invoice tracked stock 3 with quantity 5 produces -2 once, even on retry.
- Untracked product invoice does not create physical stock movement.
- Order-to-invoice conversion deducts once and preserves links.
- $100 invoice + $40 payment shows $60 due; old invoice payments appear in today's receipts.
- Restocked credit increases stock once and correctly adjusts eligible balance.
- Editing posted quantity applies only delta; invalid linked edits rejected.
- Business A cannot read/write Business B records/files or restore B backup.
- PDF contains correct document type, totals, method/terms and signature.
- Date filters include full selected business days; closing inventory reconciles.
- Offline retries cannot duplicate transactions; subscription rules apply server-side.
- Phone/printer tests required before declaring printing supported.

## 16. Immediate next session
1. Read this repository handoff, including its progress checklist, and docs/SETUP_GUIDE.md; inspect current repository state. The repository copy is docs/PROJECT_HANDOFF.md. See docs/PROGRESS.md for current status.
2. Verify GitHub access and inspect Supabase project xrtoinoanxbpnuurhdtq via working plugin, read-only first. Confirm plan and existing objects; do not overwrite unrelated data.
3. Select and document Android stack/build environment using current official documentation and available build tools.
4. Initialize a focused first milestone in a branch: app foundation and sample customer-to-order journey.
5. Run actual available build/tests. State clearly if no emulator/SDK/build access exists; do not claim an APK or hardware test without evidence.
6. Commit work and update progress with exact files, commands/results and next steps.
7. Add backend schema through versioned migrations and tested business-isolation policies once foundation is ready.
Stay within free services. Do not enable paid add-ons, send invitations, publish to an app store or deploy production automatically.

## 17. Questions to resolve at the relevant stage
- Final product name/package ID; native Android stack and minimum supported Android version.
- Target printer(s), paper format and connection protocols.
- U.S. tax behavior (manual tax configuration vs provider; no assumption of tax compliance).
- Single user's allowed devices and concurrent sessions.
- Subscription dates/grace period/offline authorization duration.
- Historical edit/void constraints and document numbering.
- Backup restore replacement/merge model; storage retention.
These do not block initial sample-data UI implementation.


## 18. Progress checkpoint
- [x] Consolidated product requirements and existing Figma references.
- [x] User supplied repository and Supabase project URL.
- [x] GitHub read access checked.
- [x] Save this handoff through GitHub contents-write access after connector setup.
- [ ] Verify Supabase project via callable tools; no project inspection completed here.
- [x] Commit this specification to the repository.
- [ ] Maintain docs/PROGRESS.md as implementation proceeds.
- [ ] Select Android stack, package ID and build environment.
- [ ] Implement and verify milestone 1.
- [ ] Complete remaining milestones and acceptance scenarios from section 15.

Treat reported external setup as user-reported until inspected. Figma evidence describes prior prototype work, not a fresh verification of the file. Do not infer working integrations or deployed software from resource URLs alone.

## 19. Copy into the new chat
Read docs/PROJECT_HANDOFF.md, docs/PROGRESS.md and docs/SETUP_GUIDE.md directly from repository CarlosMElliot/inventory-sales-android. Preserve the full feature scope, simple Android UI, business isolation and free-tier constraint. Use the connected GitHub and Supabase tools. First inspect repository CarlosMElliot/inventory-sales-android and Supabase project xrtoinoanxbpnuurhdtq read-only. Earlier GitHub writes failed with 403; the owner completed connector setup for this handoff commit. Inspect current access and repository state. Confirm what exists, then begin milestone 1 using the existing Figma direction. Keep requirements and progress in the repository once writing works. Work in small complete milestones, verify builds/tests where available, and distinguish implemented features from prototypes and plans. Do not request or commit secrets, enable paid services, or publish the app automatically.


## 20. Chat migration readiness audit — 2026-09-27
All three repository documents were fetched and reviewed before handoff to a new chat. Requirements, design identifiers, setup history, open decisions and implementation milestones are preserved. GitHub writes have succeeded. No Android source or APK has been produced in this work.

Remaining portability limits:
- The original paper-form reference image is described in text but not archived in this repository. Reattach it in the new chat for faithful visual matching.
- Figma remains the external design source; links, node IDs and colors are documented, but a full design export is not backed up in GitHub. Current Figma access was not retested in this audit.
- Supabase project access, plan and existing configuration still require a read-only check in a session with callable tools.
- A new chat must read these documents and verify its available connections; do not assume conversation attachments or tool availability transfer automatically.

These limits do not block moving the planning/implementation discussion. Begin by verifying access, then select the Android build stack and implement the sample order journey. Resolve tax, numbering, printer and offline-license decisions when their respective implementation stages require them.
