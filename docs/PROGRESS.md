# Current implementation progress

Updated 2026-10-03.

## Current direction

Responsive WEB application for phones, tablets and desktops. Native Android deferred. [WEB_APP_SPEC.md](WEB_APP_SPEC.md) is the authoritative specification; historical Android instructions are superseded.

## Repository onboarding checkpoint — 2026-10-03

The full repository tree was inspected: documentation and design assets were present; application source was not present. Added a root AI working guide, documentation/history indexes, an ordered M0–M7 implementation plan and a full specification mirror in README with a synchronization script. Cleaned obsolete missing-asset claims in the design archive index. Existing asset paths are retained.

**First next task: M0 in IMPLEMENTATION_PLAN.md.** Inspect available development tools and current service configuration, document/select the web stack, then proceed to the responsive sample order journey. No install/run commands are claimed before that implementation exists.

## Completed documentation and design work

- Consolidated full scope into WEB_APP_SPEC.md: 29 screen workflows, transaction/inventory rules, reports, security and logical data model, offline/backup requirements, 19 open decisions and 34 acceptance scenarios.
- Added root README and replaced the active Android handoff with a web-first continuation guide. Preserved the former handoff/setup research under docs/history.
- Updated design reference and print guidance for responsive browser use.
- Previously archived original Figma .fig, metadata/checksums, ten screen PNGs and the original paper photograph. See [design archive](design/README.md), [screen gallery](design/screens/README.md) and [paper reference](design/reference/README.md).
- The latest paper photograph is a detailed BCS invoice with DISNA as customer; it is the reference for BOTH order and invoice output. Older missing-image/blank-pad-only descriptions are superseded.
- GitHub documentation read/write has succeeded. This does not prove CI, app deployment or service integration.

## Historical backend checkpoint

On 2026-09-27, the recorded read-only check found Supabase project xrtoinoanxbpnuurhdtq healthy, ca-central-1, organization Inventory-app, free plan, public tables empty and migrations empty. Auth/storage settings and claimed GitHub integration behavior were not verified. This documentation update does not retest the live project.

## Not established as implemented

No working web app, production schema, real login, creator admin, transaction engine, offline sync, PDF renderer or deployed service is established by these documents. Existing Figma interactions are prototypes, with unfinished print frames and simplified saved-order preview. A future implementation session must inspect the repository for any additional source before assuming absence or completion.

## Next milestone

1. Inspect current repository and Supabase state read-only.
2. Select/document web stack and development/hosting approach within the free-tier constraint.
3. Build responsive foundation and sample customer → order → review → saved-preview journey.
4. Add authenticated business isolation and persisted customer/product data through reviewed migrations.
5. Continue all milestones in WEB_APP_SPEC.md; record actual build/test results and unresolved decisions here.

## Verification of this documentation update

Read back all nine created/updated specification, entry and historical documents from GitHub; contents matched the intended versions. Also read the three archive manifests and confirmed the documented paths for the original .fig, ten exported PNG screens and paper photograph. The specification commit is 9b5da0c2342a67a505deec5641d1d84427a3e997. No application tests, database migration, live Figma reinspection, printer test, paid upgrade or production deployment is claimed.

## Constraints

One business subscription / one user / full package. Cloud-backed with offline requirement retained. No secrets in this public repository. No paid upgrades or production publishing without owner authorization. Distinguish confirmed features, proposals, decisions and implemented behavior.

## Onboarding verification

Ran `python3 scripts/sync_readme.py --check` against a local copy of the actual README/specification/script: passed. Checked relative Markdown file targets in all updated onboarding documents against the inspected repository tree plus new files: no missing targets. This is documentation verification, not an app build or service test.
