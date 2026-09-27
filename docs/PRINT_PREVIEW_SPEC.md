# Order and invoice print preview

Updated 2026-09-27 after the newly supplied photograph could be opened.

## Authoritative reference

[Original paper invoice photograph](design/reference/paper-form.png) · [Archive notes and checksum](design/reference/README.md)

The owner requested this layout for BOTH orders and invoices. The latest upload is a detailed BCS invoice with DISNA as the customer; it is not the earlier blank DISNA pad. Earlier descriptions based only on the blank pad are superseded for the order/invoice layout. The simplified preview in Figma screen 05 is also not the final target.

## Observed layout and intended adaptation

1. Supplier logo/name and address/contact header; document title and page numbering at the top right.
2. Separate bordered Sold To and Ship To blocks.
3. Document summary containing item/box counts, packing reference and document number.
4. Customer ID, terms, salesperson and salesperson contact; order date and ship date.
5. Bordered item grid. The photograph includes Qty, Item ID, UM, Item Description, Pack Size, List Price, Allowance, Net Price, Unit Price, suggested retail columns and Extension.
6. Totals at the lower right (reference labels Total, Credit and Sub Total).
7. Footer containing receipt/signature area, cash/check fields and reference/date fields, plus terms text.

Use this structural arrangement on a clean white page with black text and borders. Do not reproduce yellow paper, creases, shadows, background, handwriting or example transaction values. Business branding and customer details come from app records. Do not adopt the photographed company's policies, charges or legal wording automatically.

## Data mapping decisions

Required item data already planned: quantity, product SKU/name, unit price and line amount. UM means unit of measure; Extension corresponds to the line amount. Pack size, box-count rules, allowance versus discount, list/net/unit price distinctions and suggested retail columns need explicit data definitions before implementation. Do not fabricate values or add unsupported price calculations merely to fill the reference grid. Omit inapplicable optional columns while preserving the core layout.

If Sold To and Ship To are identical, populate both consistently. Packing reference and ship date should display only when known or be clearly left blank. Distinguish product-line count, units and boxes; never label a sum of units as boxes without a defined conversion.

Use correct app calculations and clear labels for subtotal, discounts, tax, total, credits, payments and balance. The photograph's wording does not override accounting rules in the handoff.

## Orders versus invoices

| Field/behavior | Order | Invoice |
| --- | --- | --- |
| Heading | ORDER / CUSTOMER ORDER | INVOICE |
| Identifier | Order number | Invoice number |
| Items | Ordered quantities and agreed prices | Invoiced quantities and prices |
| Payment | Never imply collection without a real linked payment | Show actual recorded payments, method and balance |
| Inventory | Saving does not deduct physical stock | Apply the documented invoice inventory rules |

Keep payment method separate from sales terms such as COD/on account. Include comments and signature/date areas where applicable. Capturing a signature must not automatically record a payment. Credits and payment receipts remain separate document types; this latest clarification specifically establishes the order/invoice layout.

## Preview, PDF and printing

Use the same document content/layout for preview and generated PDF. Support page fitting and zoom on phone screens; repeat relevant table headers on multipage output, show page numbers and avoid clipping. Paper size and printer support remain implementation decisions; the photo does not prove exact page dimensions or printer compatibility.

## Verification and current status

Workspace access was restored. The newly supplied photograph was visually inspected and preserved unchanged with SHA-256 metadata in the repository archive. No new Figma design, PDF renderer or app code was created in this documentation update.
