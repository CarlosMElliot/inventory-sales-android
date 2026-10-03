# Web project handoff

Updated 2026-10-03.

## Authoritative instructions

Start at [the root README](../README.md). Assistants and developers read [AGENTS.md](../AGENTS.md), then [PROGRESS.md](PROGRESS.md), [WEB_APP_SPEC.md](WEB_APP_SPEC.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). It replaces the Android-only handoff. The owner has selected a responsive web application for now; native Android is deferred. The repository name does not override this direction.

The complete specification includes original Figma links, archived image references, 29 screen workflows, inventory/financial invariants, logical architecture, offline and subscription requirements, a decision register and 34 acceptance scenarios.

Then read [PROGRESS.md](PROGRESS.md), [DESIGN_REFERENCE.md](DESIGN_REFERENCE.md) and [PRINT_PREVIEW_SPEC.md](PRINT_PREVIEW_SPEC.md).

## Resources

- Repository: https://github.com/CarlosMElliot/inventory-sales-android
- Figma: https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR
- Supabase project reference: xrtoinoanxbpnuurhdtq
- [Screen gallery](design/screens/README.md)
- [Editable design archive](design/README.md)
- [Paper print reference](design/reference/paper-form.png)

## Continuation instructions

Inspect current source and Supabase configuration read-only before implementing. Do not assume documentation or service connections mean the application exists. Select a web stack, document the choice and implement the next unfinished milestone in small complete steps. Keep the simple guided Figma direction while adapting layouts for phone, tablet and desktop.

Preserve the full required feature set. Offline was not silently removed. Resolve decisions at their stated gates; proposed commercial/accounting rules are not approved policy. Verify actual behavior and update progress. Do not commit secrets, purchase upgrades or publish production automatically.

## Historical record

The previous handoff is preserved in [history/ANDROID_PROJECT_HANDOFF_2026-09-27.md](history/ANDROID_PROJECT_HANDOFF_2026-09-27.md) and Git history for research. Its Android-only direction, missing-asset notes and old continuation instructions are superseded. Historical relative links may refer to its original docs directory.

## Copy into a new chat

Continue the web-first project at https://github.com/CarlosMElliot/inventory-sales-android. Read AGENTS.md and docs/PROGRESS.md, then docs/WEB_APP_SPEC.md and docs/IMPLEMENTATION_PLAN.md. Inspect available source and connections, follow the first unfinished milestone, verify actual behavior and record the exact next action. Use the archived Figma/screens/print reference. Do not assume prior chat attachments or current service access transfer automatically.
