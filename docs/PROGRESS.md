# Implementation progress

Updated: 2026-09-27

## Completed
- Restored file access and archived the original paper photograph unchanged with its checksum. Visually confirmed it is a detailed BCS invoice (DISNA is the customer), not the earlier blank pad. Updated [print specification](PRINT_PREVIEW_SPEC.md) for both orders/invoices. All supplied design assets are now archived; previous missing-photo entries are historical.
- Owner reattached the paper-form photograph and confirmed it as the reference for BOTH order and invoice print previews. See [print-preview specification](PRINT_PREVIEW_SPEC.md).
- Archived and visually inspected all ten owner-supplied PNG exports: five main screens and five overlays/action previews. See [screen gallery](design/screens/README.md) and its checksum manifest.
- Archived the owner-supplied original `.fig`, its embedded preview PNG, original export metadata and SHA-256 manifest. See [design archive](design/README.md).
- Added [design reference and connection checkpoint](DESIGN_REFERENCE.md). Supabase read-only access verified: inventory-sales-android, ACTIVE_HEALTHY, ca-central-1, organization Inventory-app on free plan; public tables and recorded migrations both empty.
- Added [setup guide and research log](SETUP_GUIDE.md).
- Consolidated requirements, design references, print reference description and acceptance scenarios in PROJECT_HANDOFF.md.

## Milestone 1 — Android app foundation

Branch: `milestone-1-app-foundation`

Implemented:
- Native Android project foundation using Kotlin + Jetpack Compose + Material 3.
- Documented teal/white design tokens and simple four-destination bottom navigation.
- Local sample order journey: Home → Choose customer → Build order → Review → Saved order preview.
- Transaction-only unit-price overrides.
- Order quantities may exceed stock with a warning; creating an order does not deduct stock.
- Saved-order preview distinguishes payment as not recorded and keeps final PDF/print/share work tied to the BCS invoice specification.
- Unit tests cover transaction-price total calculation and the order/no-stock-deduction rule.
- Android CI uses JDK 17 + Gradle 8.9. Java and Kotlin JVM targets are both 17.

### Milestone 1 verification checklist
- [x] Repository branch is cleanly ahead of `main` with no branch divergence at verification time (`ahead_by: 18`, `behind_by: 0` before this documentation commit).
- [x] GitHub Actions Android CI run #3 completed successfully for commit `1da40ef1579745ad08d51557613c92da1a62c19a`.
- [x] Checkout passed.
- [x] JDK 17 setup passed.
- [x] Gradle setup passed.
- [x] `testDebugUnitTest` passed.
- [x] `assembleDebug` passed.
- [x] Build job completed successfully.
- [ ] Physical-device/emulator interaction QA has not been performed in this connector session.
- [ ] APK artifact retention/download is not configured in CI yet; the APK was built successfully inside the runner but no workflow artifact was uploaded.

Supabase checkpoint:
- Project `xrtoinoanxbpnuurhdtq` remains ACTIVE_HEALTHY on the free plan in ca-central-1.
- Public tables: none.
- Recorded migrations: none.
- No Supabase schema changes were made in Milestone 1.

## Remaining project scope
- Real Supabase authentication/database/RLS, synchronization, invoices, credits, payments, inventory mutations, reports, admin, subscriptions, final BCS-based PDF generation, Android printing, email/share attachments and production deployment remain later milestones.

## Next
1. Open and merge the Milestone 1 pull request into `main` after the documentation-only CI run is green.
2. Optionally add APK artifact upload to CI so debug builds can be downloaded for emulator/device QA.
3. Perform interaction/visual QA against the archived screen exports before treating UI fidelity as final.
4. Begin Milestone 2 from updated `main`, keeping Supabase changes isolated and protected by RLS/account isolation.

## Constraints
- Start on free services; no paid upgrades or publishing automatically.
- Do not commit secrets.
- Separate verified implementation from mockups and proposed behavior.
