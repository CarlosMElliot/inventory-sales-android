# Inventory & Sales Android

Native Android implementation of the documented Inventory & Sales product.

## Current milestone
Milestone 1 creates the Android foundation and a local sample journey:

Home → Order → Choose customer → Build order → Review → Saved order preview.

The implementation intentionally uses local sample data only. Supabase authentication, persistence, synchronization, PDF generation, printing, email/share attachments, invoices, credits, payments, inventory mutations, reports, admin and subscriptions remain later milestones.

## Stack
- Kotlin
- Jetpack Compose + Material 3
- Native Android
- minSdk 26 / targetSdk 35

See docs/PROJECT_HANDOFF.md, docs/DESIGN_REFERENCE.md, and docs/PRINT_PREVIEW_SPEC.md for the preserved full scope and design references.
