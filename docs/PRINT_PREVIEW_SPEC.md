# Order and invoice print preview

Owner clarification: 2026-09-27, America/El_Salvador.

The owner reattached image(7).png and explicitly requested this paper-form design for BOTH invoice and order print previews. This supersedes the simplified document layout in prototype screen 05 as the target print layout. The image is a visual reference, not a background to print with filled-in text.

## Layout requirements

Based on the previously supplied and documented DISNA paper-form reference:
- Centered configurable business logo/name and contact details. DISNA is reference branding, not the app's fixed business identity.
- Bordered document number/date and customer name/address rows.
- Relevant payment purpose, method and sales terms fields, with clear labels.
- Amount due / this payment / balance due summary for invoices where applicable.
- Sold-by field.
- Bordered QTY, DESCRIPTION, PRICE and AMOUNT grid.
- Totals at the bottom; comments and signature/date areas as applicable.
- Clean black-and-white document on a white page; reproduce the form structure, not the photograph's lap/background, shadows, wrinkles or printed example number.
- Preview, PDF and printed output must show consistent document content, totals and pagination.

## Document-specific behavior

| Area | Order | Invoice |
| --- | --- | --- |
| Heading | ORDER / CUSTOMER ORDER | INVOICE |
| Number | Order number | Invoice number |
| Items | Ordered quantities and agreed prices | Invoiced quantities and prices |
| Payment meaning | Does not imply payment has been received | Show recorded payments and remaining balance |
| Inventory | Saving order does not deduct physical stock | Apply invoice stock rules in handoff |
| Payment fields | Omit or mark unrecorded/inapplicable unless a real linked payment exists | Display actual recorded method/payment amounts; never fabricate |

Sale terms such as on account are separate from a payment method such as cash or check. An invoice does not become a payment receipt simply because it includes a payment summary.

## Archive and implementation status

The newly attached image could not be opened or copied: the execution workspace was unavailable and download_file returned 'requires a ready execution workspace'. No claim is made that the new attachment was visually inspected or uploaded to GitHub. Its intended role is confirmed by the owner's message and the prior documented reference.

The photo still needs to be archived at docs/design/reference/paper-form.png when file access is restored. Existing Figma source and ten screen exports remain archived. No new Figma frame, PDF template or app code was created in this update.
