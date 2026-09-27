# Implementation progress

Updated: 2026-09-27

## Completed
- Restored file access and archived the original paper photograph unchanged with its checksum. Visually confirmed it is a detailed BCS invoice (DISNA is the customer), not the earlier blank pad. Updated [print specification](PRINT_PREVIEW_SPEC.md) for both orders/invoices. All supplied design assets are now archived; previous missing-photo entries are historical.
- Owner reattached the paper-form photograph and confirmed it as the reference for BOTH order and invoice print previews. See [print-preview specification](PRINT_PREVIEW_SPEC.md). The photo is supplied in chat but not archived in GitHub: file download is blocked by an unavailable execution workspace. Prior 'missing' notes refer to the repository copy.
- Archived and visually inspected all ten owner-supplied PNG exports: five main screens and five overlays/action previews. See [screen gallery](design/screens/README.md) and its checksum manifest. Static design backup now includes the original .fig and readable exports; the original paper-form photograph is still missing.
- Archived the owner-supplied original `.fig`, its embedded preview PNG, original export metadata and SHA-256 manifest. See [design archive](design/README.md). Container integrity and byte preservation checked; Figma reimport not tested. Screen exports were subsequently supplied and archived; the original paper-form photograph remains missing.
- Added [design reference and connection checkpoint](DESIGN_REFERENCE.md). Supabase read-only access now verified: inventory-sales-android, ACTIVE_HEALTHY, ca-central-1, organization Inventory-app on free plan; public tables and recorded migrations both empty. Earlier documentation saying project access is unverified is superseded by this checkpoint.
- Retested Figma screenshot access; Starter-plan tool limit still blocks export. The original `.fig` has since been archived; original paper image remains missing; screen exports are now archived.
- Added [setup guide and research log](SETUP_GUIDE.md), documenting setup steps, authorization versus installation, failed attempts, successful commits, Supabase verification gaps and study questions.
- Consolidated requirements, design references, print reference description and acceptance scenarios in PROJECT_HANDOFF.md.
- Verified GitHub contents-write access with successful handoff commit b05db86c6933aea7cf4fbdefbd9f6ac60b081805 after connector installation/setup.

## Milestone 1 implementation started (2026-09-27)

Branch: `milestone-1-app-foundation`

Implemented:
- Native Android project foundation using Kotlin + Jetpack Compose + Material 3.
- Preserved documented teal/white design tokens and simple four-destination bottom navigation.
- Local sample order journey: Home → Choose customer → Build order → Review → Saved order preview.
- Transaction-only unit-price overrides.
- Order quantities may exceed stock with a warning; creating an order does not deduct stock.
- Saved-order preview distinguishes payment as not recorded and points future PDF/print/share work to the current BCS invoice specification.
- Unit tests added for transaction-price total calculation and the order/no-stock-deduction rule.
- Added `.github/workflows/android-ci.yml` to supply a reproducible build-capable environment with JDK 17 + Gradle 8.9 and run `testDebugUnitTest` followed by `assembleDebug`.

Verification in this session:
- GitHub branch contents were read back successfully after creation.
- Supabase project `xrtoinoanxbpnuurhdtq` is ACTIVE_HEALTHY on the free plan in ca-central-1.
- Supabase public tables: none.
- Supabase migrations: none.
- Supabase security and performance advisor findings: none at this clean-slate checkpoint.
- No Supabase schema changes were made in Milestone 1.
- Android CI workflow committed at `1e7524877fb003dd4e5fcca73b2570a5f75f3d94`.
- Immediately after the workflow commit, GitHub reported no workflow runs for `milestone-1-app-foundation`. Therefore a passing compile/test result is not yet claimed.

Build/test status:
- The repository still has no committed Gradle wrapper binary/scripts. CI intentionally uses `gradle/actions/setup-gradle@v4` with Gradle 8.9 so the project can be compiled without checking wrapper artifacts into GitHub first.
- Required CI commands are `gradle testDebugUnitTest --stacktrace` and `gradle assembleDebug --stacktrace`.
- A successful GitHub Actions run remains required before Milestone 1 is considered tested and ready to merge.

## Remaining project scope
- Real Supabase authentication/database/RLS, synchronization, invoices, credits, payments, inventory mutations, reports, admin, subscriptions, final BCS-based PDF generation, Android printing, email/share attachments and production deployment remain later milestones.

## Next
1. Observe the first Android CI run; if GitHub Actions does not trigger automatically, enable/run Actions for the repository and rerun the branch workflow.
2. Fix any compile/test errors reported by CI and repeat until both unit tests and `assembleDebug` pass.
3. Only after the green build, complete Milestone 1 QA/documentation and merge it to `main`.
4. Keep Supabase unchanged until the backend/account-isolation milestone is explicitly implemented with RLS.

## Constraints
- Start on free services; no paid upgrades or publishing automatically.
- Do not commit secrets.
- Separate verified implementation from mockups and proposed behavior.
