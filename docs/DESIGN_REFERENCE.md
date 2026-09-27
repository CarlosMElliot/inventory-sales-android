# Design reference and connection checkpoint
Updated: 2026-09-27, America/El_Salvador.

Read this checkpoint with PROJECT_HANDOFF.md and PROGRESS.md. Its connection findings supersede earlier statements that Supabase tools were unavailable. Design specifications below are consolidated from the saved handoff, not from a fresh Figma export.

## Original design backup update
The owner supplied the original `.fig` after this checkpoint. It is now preserved unchanged with its embedded preview, metadata and checksums. See [design archive and restore instructions](design/README.md). This updates the older backup statements below; screen PNG/PDF exports and the paper photograph are still missing.

## Connection verification

| Service/check | Actual result |
| --- | --- |
| GitHub | Repository documentation read/write verified |
| Supabase project lookup | Successful for xrtoinoanxbpnuurhdtq |
| Project name | inventory-sales-android |
| Project status | ACTIVE_HEALTHY |
| Region | ca-central-1 |
| Organization | Inventory-app |
| Organization plan | free / tier_free |
| Database version | PostgreSQL 17; reported version 17.6.1.166 |
| Tables in public schema | Empty list |
| Recorded database migrations | Empty list |
| Figma home-frame screenshot request | Rejected: Starter-plan MCP tool call limit reached |

The Supabase inspection was read-only. No database, plan, account, or deployment changes were made. Empty public tables do not mean every schema is empty. Auth configuration, storage configuration, GitHub integration behavior and client connectivity were not verified. Connection availability in a future chat must be checked there.

## Canonical design source
https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR

Workspace recorded as WorksPlace, Starter plan. This document is a text reference, NOT a complete editable Figma backup or a pixel-exact specification.

## Visual tokens

| Token | Value |
| --- | --- |
| Primary | #006D65 |
| Main text | #172D32 |
| Secondary text | #60757A |
| Background | #F5F8F7 |
| Surface | #FFFFFF |
| Soft primary | #E4F2EE |
| Border | #DCE6E2 |
| Warning text | #875600 |
| Warning surface | #FFF2D8 |
| Font | Roboto Regular/Bold |
| Card rounding | Approximately 16dp |
| Button rounding | Approximately 14dp |
| Reference frame | 390 x 920; actual app must adapt to screen size and system insets |

Android only; simple guided forms, clear labels, readable contrast and contextual secondary actions. Home, Customers, Products and More are the main navigation destinations. Do not add chat bubbles merely because the flow was described as conversational.

## Existing screen inventory

| Screen | Figma node | Role |
| --- | --- | --- |
| Home | 3:327 | Order, Invoice, Credit, Payment actions; daily activity |
| Choose customer | 3:328 | Customer selection for transaction |
| Build order | 3:329 | Items, quantities, editable prices and stock warning |
| Review order | 6:38 | Customer, line items and totals before saving |
| Saved order | 9:42 | Simplified preview and mock document actions |

Recorded example journey: Home → Order → Harbor Market → items → review → saved order.
Sample branding Northside Supply and user Alex are placeholders.
Sample totals: coffee 2 x USD 12 + water 3 x USD 8 = USD 48.
Price editing and save/print/email/share in the prototype do not implement real transactions.

Unfinished print frames: order 11:70, invoice 11:71, payment receipt 11:72, credit note 11:73. Do not treat them as completed templates.

## Document visual reference

The original paper form has:
1. Centered business name/contact details; support an uploaded logo.
2. Bordered document number/date/customer name/address rows.
3. Purpose checkboxes, including goods/deposit/rent/other where applicable.
4. Payment-method block beside amount due / this payment / balance due.
5. Sold-by and terms row.
6. Bordered Qty / Description / Price / Amount item grid.
7. Total at the bottom, with comments and signature/date as needed.

Generate distinct ORDER, INVOICE, CREDIT NOTE and PAYMENT RECEIPT documents. Orders must not imply payment received. Credits identify their original invoice and balance effect. Payment receipts identify method and allocations. Keep print black-and-white, readable and consistent with the generated PDF preview.

The original paper reference is described here but its image is NOT archived in GitHub.

## Asset backup manifest

| Asset | Present in GitHub? | Next action |
| --- | --- | --- |
| Written UI tokens and screen/node inventory | Yes, this document and handoff | Maintain with implementation |
| Paper-form reference image | No | Owner reattaches original for archival |
| Figma screen PNG/PDF exports | No | Owner exports available frames and uploads |
| Editable Figma .fig copy | Yes | Original preserved in design/source; reimport test pending |
| Internal canvas data | Preserved in original .fig | Not decoded or independently validated; reimport test pending |

Suggested repository destinations after files are supplied:
- docs/design/reference/paper-form.png
- docs/design/screens/ (numbered screen images or one PDF)
- docs/design/source/ (editable export)

The source backup and embedded preview now exist as linked above; reference/paper-form.png and screens/ remain proposed destinations. Do not invent or recreate missing images and call them original exports. A PNG/PDF preserves appearance; it does not preserve editable components or prototype wiring.

## Handoff procedure
1. New chat reads PROJECT_HANDOFF.md, PROGRESS.md, SETUP_GUIDE.md and this file.
2. Check its GitHub, Supabase and Figma tool access.
3. Use this recorded Supabase checkpoint as evidence of this session, not a guarantee of later state.
4. If Figma remains limited, use uploaded exports and the written reference to start implementation.
5. Record later checks and changes in PROGRESS.md.

No paid upgrade is authorized or required simply to preserve the text reference. The original design-file export is now archived. The paper photograph and full-resolution screen exports remain outstanding.
