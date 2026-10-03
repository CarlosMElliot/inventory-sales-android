# Web design reference

Updated 2026-10-03. [WEB_APP_SPEC.md](WEB_APP_SPEC.md) is authoritative. This file indexes visual sources; it does not introduce separate product rules.

## Original Figma file

https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR

Recorded team: WorksPlace, Starter. WorksPlace is not a confirmed public product name.

| Screen | Direct link |
| --- | --- |
| Home | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=3-327 |
| Choose customer | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=3-328 |
| Build order | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=3-329 |
| Review order | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=6-38 |
| Saved order / preview | https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR?node-id=9-42 |

## Archived images and editable source

- [Editable source and archive instructions](design/README.md)
- [Original .fig](design/source/inventory-sales-mobile-prototype.fig)
- [Ten exported screens and previews](design/screens/README.md)
- [Screen manifest](design/screens/manifest.json)
- [Latest original paper photograph](design/reference/paper-form.png)
- [Paper archive notes](design/reference/README.md)

All these asset types were archived in the September checkpoint. Older notes saying exports or paper photograph are missing are historical. Successful .fig reimport and current live Figma tool access are not asserted.

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
| Warning text / surface | #875600 / #FFF2D8 |
| Font | Roboto Regular/Bold |
| Approximate rounding | Cards 16; buttons 14, adapted to CSS |

## Responsive interpretation

The five main frames are 390 × 920 mobile references. Reuse their hierarchy, typography, colors and guided flow, adapting to phone, tablet and desktop browsers. Do not hard-code the frame height or constrain the deliverable to Android.

Proposed mobile navigation: Home, Customers, Products, More. Desktop uses a sidebar and wider working areas with persistent summaries. “Conversational” means helpful step prompts, not mandatory chat bubbles.

Northside Supply, Alex and Harbor Market are samples. Coffee 2 × $12 + water 3 × $8 = $48. Prototype price editing does not calculate totals; print/email/share actions are mocks.

## Print reference

The archived photograph shows a detailed BCS invoice with DISNA as customer. Use its structure for BOTH order and invoice output, as specified in [PRINT_PREVIEW_SPEC.md](PRINT_PREVIEW_SPEC.md) and the authoritative web specification.

The simplified Figma saved-order preview is not the final print target. Print frames 11:70, 11:71, 11:72 and 11:73 remain unfinished. The old blank-pad description is superseded for order/invoice layout.

Live Figma tool access was limited in the prior session; implementation can use these archived assets without claiming the unfinished frames are complete.

## Required creator admin screens

The full product also requires S30 creator login/recovery, S31 admin dashboard, S32 user directory/detail, S33 create business/user and S34 audit log, alongside S28 business/subscription management. These screens are specified in WEB_APP_SPEC.md and [ADMIN_ACCESS.md](ADMIN_ACCESS.md); they are not present in the archived five-screen Figma journey.

Use the same teal/white typography direction with a distinct Admin label and navigation: Overview, Businesses, Users, Subscriptions, Audit and Account. Dashboard cards show actionable counts; business/user forms and statuses must work on mobile and desktop. Do not use a login mockup or a displayed sample password as evidence of working credentials.
