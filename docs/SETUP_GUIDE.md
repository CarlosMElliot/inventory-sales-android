# Setup guide and research record

Updated 2026-10-03. Current platform: WEB application. Read [WEB_APP_SPEC.md](WEB_APP_SPEC.md) for authoritative requirements and [PROGRESS.md](PROGRESS.md) for the current checkpoint.

## Historical setup log

The detailed September 27 setup sequence, authorization failures, successful GitHub commits, research questions and study answers are preserved in [history/SETUP_LOG_2026-09-27.md](history/SETUP_LOG_2026-09-27.md).

That log is historical evidence, not current implementation instructions. Its Android-only continuation prompt and earlier missing-asset/unverified-backend notes are superseded by the current documents.

## Setup completed in the recorded work

- Owner created the repository and Supabase project.
- GitHub read access worked; initial writes returned 403.
- Enabling Actions workflow permissions did not resolve connector contents access.
- Connector installation/setup was completed; useful documentation writes and readback verified access.
- Figma prototype references were recorded; original .fig, ten PNG exports and paper reference were archived.
- A later September 27 read-only checkpoint found the Supabase project healthy on the free plan, with empty public tables and migrations.
- October 3: consolidated web-first scope and replaced active Android directions.

Service links do not implement a client, schema, authentication or deployment. Auth/storage configuration, current live backend state, working email, printing and offline behavior still require implementation/verification.

## Next setup sequence

1. Read WEB_APP_SPEC.md and PROGRESS.md.
2. Inspect existing repository and accessible Supabase project without modifications.
3. Verify current plan/configuration and document relevant non-secret evidence.
4. Select a web stack and development workflow.
5. Build the next unfinished milestone; use versioned migrations and isolated testing.
6. Record exact changes, verification results and remaining limits.

## Research and study

For each later setup step, append date, goal, affected service, actions, non-secret configuration/version, actual errors, resolution, verification and commit reference. Distinguish authorization from installation, connectivity from implementation, and mockups from running software.

Never store passwords, access tokens or privileged keys in screenshots or documents in this public repository.

## Creator login and admin setup checkpoint — 2026-10-03

Read [ADMIN_ACCESS.md](ADMIN_ACCESS.md) for the controlled first-admin bootstrap and user-creation flow. The application includes an owner dashboard; the owner should not need to operate backend tables to create routine users.

At the earlier documentation-only checkpoint, the project was healthy with no public tables and no app source. The later implementation checkpoint below supersedes that source status: app/account code is now prepared, zero Auth users were verified read-only, and live setup is still pending. The creator email was supplied privately; never publish a password in setup research.

## First implementation branch — 2026-10-03

React/TypeScript/Vite and Express selected; account API/migration/bootstrap implemented and locally tested. See BUILD_SETUP.md for commands and PROGRESS.md for evidence. Older statements below/above about absent source describe prior checkpoints. The creator email has been supplied privately. The live database was inspected only; no accounts, schema, email or deployment were changed.
