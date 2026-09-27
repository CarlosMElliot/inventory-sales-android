# Setup guide and research log

Recorded: 2026-09-27 (America/El_Salvador, UTC-06:00).
Scope: setup completed during the planning and connector troubleshooting sessions, through the first documentation commits. This is a historical record, not a claim that the Android app or backend has been implemented.

## Reading map
- [Project handoff](PROJECT_HANDOFF.md): complete product requirements, design references and acceptance scenarios.
- [Progress](PROGRESS.md): current implementation checkpoint.
- This guide: setup sequence, evidence, troubleshooting and lessons.

## 1. Components and their roles

| Component | Intended role | Evidence at this checkpoint |
| --- | --- | --- |
| GitHub | Source code, version history and project documentation | Repository read and documentation write verified |
| ChatGPT Codex Connector | Authorized access from ChatGPT to GitHub | Successful create-file calls and readback |
| Supabase | Future authentication, database and business files | Project creation/linking reported by owner; project not inspected here |
| Figma | Visual reference and prototype | Prior prototype work documented in handoff; not re-inspected for this guide |
| Android app | Customer-facing inventory and sales software | Not implemented |
| Creator admin interface | Business accounts and subscriptions | Planned only |

Connecting these services does not automatically build the app, deploy a database schema, or connect an Android client.

## 2. Product decisions before setup

1. Defined an Android phone app for orders, invoices, credits, payment records, customers, products and inventory.
2. Added document printing/PDF sharing, signatures, transaction history, daily comparison reports and restorable data backups.
3. Chose one business subscription covering one business user and the full feature package.
4. Replaced the original phone-only storage idea with a cloud-backed system with planned offline operation and synchronization.
5. Selected the Supabase free tier as the starting budget constraint. Actual project plan remains to be checked.
6. Chose a simple guided interface and incremental implementation. Stages organize the work; they do not remove required features.

Consult the handoff for detailed behavior. Pricing suggestions, Android stack, printer compatibility and offline license duration are not final decisions.

## 3. Figma design preparation

The owner connected Figma and chose the WorksPlace team. The project record identifies a Starter workspace and this design file:
https://www.figma.com/design/0LSTfSMM2jz9CMfxQnSvwR

The prior design work produced a five-screen sample order journey:

| Screen | Node |
| --- | --- |
| Home | 3:327 |
| Choose customer | 3:328 |
| Build order | 3:329 |
| Review order | 6:38 |
| Saved order / document preview | 9:42 |

The recorded direction uses teal, white, Roboto and rounded cards. Colors and prototype limitations are in the handoff.

The owner supplied a paper form as the document-layout reference. Its structure is described in the handoff; the original image has not been committed to this repository. A future session should receive the image again if exact visual comparison is needed.

Four print frames were created but remain unfinished: order 11:70, invoice 11:71, payment 11:72, credit 11:73. Reported Figma tool limits interrupted that work. Mock print/email/share controls do not perform real operations.

Learning point: a clickable design demonstrates navigation and appearance, not working calculations, persistence, printing or backend integration.

## 4. GitHub repository preparation

Repository:
https://github.com/CarlosMElliot/inventory-sales-android

Recorded sequence:
1. The owner created/shared the repository.
2. The owner made it public during connection troubleshooting.
3. Read access worked. A file-read attempt returned “This repository is empty.”
4. An initial attempt to create docs/PROJECT_HANDOFF.md failed with HTTP 403.
5. The handoff was preserved as a downloadable Markdown file while access was fixed.
6. The owner completed connector setup; documentation writes then succeeded.

Public visibility was part of this session's sequence, not a requirement established for the final project. A public repository still requires authorized write access.

## 5. GitHub permission problem: evidence and resolution

### Initial symptom

The contents API returned:

```text
403: Resource not accessible by integration
```

Repository metadata reported permissions such as push/admin, but actual writes failed. Reading a public repository and seeing account permission metadata did not prove the connector could write to it.

### Attempt that did not resolve it

The owner enabled repository workflow read/write permissions and requested a retry. The next create-file attempt returned the same 403.

Learning point: repository workflow permissions concern GitHub Actions. They do not establish that the ChatGPT connector is installed with access to that repository.

### Screens inspected with the owner

Under GitHub Settings → Applications:

| Screen | Observed result | Interpretation |
| --- | --- | --- |
| Installed GitHub Apps | Google AI Studio, lovable.dev, Supabase and Vercel; no ChatGPT entry | No ChatGPT installation appeared in that account's list |
| Authorized GitHub Apps | ChatGPT Codex Connector, owned by openai | Account authorization existed |
| ChatGPT Codex Connector detail | “ChatGPT Codex Connector has not been installed on any accounts you have access to.” | Authorization and installation were separate; installation was missing at that point |
| Reconnection authorization | ChatGPT Codex Connector by OpenAI requested read-only access to email addresses | This screen alone did not demonstrate repository write access |

The owner was guided to return to the GitHub connection in ChatGPT, configure/manage access or reconnect, and complete installation for CarlosMElliot with inventory-sales-android selected.

The owner subsequently reported “It is set up.” The final installation/repository-selection screen was not captured in this record, so its precise selected scope should not be invented. The subsequent successful write is the functional evidence.

### Verification after setup

1. Read docs/PROJECT_HANDOFF.md to check whether it already existed; GitHub still reported an empty repository.
2. Created docs/PROJECT_HANDOFF.md through the connector.
3. Created docs/PROGRESS.md through the connector.
4. Read back the beginning of docs/PROJECT_HANDOFF.md from GitHub and confirmed its content and repository URL.

| Result | Commit |
| --- | --- |
| Project handoff created | [b05db86](https://github.com/CarlosMElliot/inventory-sales-android/commit/b05db86c6933aea7cf4fbdefbd9f6ac60b081805) |
| Progress checklist created | [eb4cb4e](https://github.com/CarlosMElliot/inventory-sales-android/commit/eb4cb4e407431686f16f3f52e540a24d746bd020) |

Conclusion supported by the test: GitHub repository contents-write access worked after setup. This did not test workflow execution, releases, app builds, or Supabase permissions.

### Reusable troubleshooting checklist

Use this as a checklist based on this session; interface labels may change.

1. Confirm the GitHub account and exact repository.
2. Distinguish a missing file/empty repository response from denied access.
3. Check Installed GitHub Apps separately from Authorized GitHub Apps.
4. Inspect the connector's installation and repository selection.
5. Reconnect through ChatGPT if installation has not been completed.
6. Verify with an intended, useful documentation change and read it back.
7. Record the error or commit SHA; do not infer success from a “connected” badge.
8. If the same denial persists, investigate installation access rather than repeatedly changing workflow settings.

Do not revoke unrelated integrations or broaden access to all repositories merely to test a single project.

## 6. Supabase setup record

The owner installed/authorized the Supabase connection. A separate chat reported:
- Connection/tool access working.
- Zero accessible projects.
- Nothing created or modified by that check.

The owner then reported creating a project and connecting it to the corresponding GitHub repository.

| Item | Recorded value |
| --- | --- |
| Project reference | xrtoinoanxbpnuurhdtq |
| Project API URL | https://xrtoinoanxbpnuurhdtq.supabase.co |
| Dashboard | https://supabase.com/dashboard/project/xrtoinoanxbpnuurhdtq |
| Planned budget | Free tier initially |
| Project name, organization, region and actual plan | Not verified |
| Schema, Auth settings, storage and security policies | Not inspected here |
| GitHub integration behavior | Owner-reported connection; not tested |

In the original setup session, callable Supabase project tools were unavailable despite the plugin being described as installed. The separate chat could list projects before project creation. We have not confirmed whether that authorization can now see this project.

A zero-project response established that no projects were visible to that authorization at that time. It did not by itself prove whether the cause was an empty account, the wrong account, or missing project/organization access.

### Next verification, not completed setup

1. Use a session with working Supabase tools.
2. List accessible projects and find the exact reference above.
3. Inspect the existing project read-only: organization, region, plan and current database/Auth/storage setup.
4. Record what already exists before proposing migrations.
5. Check the claimed GitHub link and describe what it actually does.
6. Only then implement the backend according to the app requirements.

No database migrations, business accounts, subscription enforcement, Android client connection or data-isolation tests were completed during this setup work.

## 7. Documentation and continuity

The initial handoff was prepared so a new chat would receive the full scope, including unfinished work. GitHub writes were blocked at first; once access worked, the handoff and progress file were committed.

For future sessions:
1. Connect/select GitHub and Supabase where available.
2. Read PROJECT_HANDOFF.md, PROGRESS.md and this guide.
3. Inspect the repository and backend's current state.
4. Continue from the next unfinished milestone.
5. Update progress after meaningful work with exact evidence.

The repository documents preserve project context explicitly. Do not assume another chat has the entire conversation, original attachments or functioning tools solely because it has the repository URL.

Suggested continuation prompt:

> Continue the Android inventory app in CarlosMElliot/inventory-sales-android. Read docs/PROJECT_HANDOFF.md, docs/PROGRESS.md and docs/SETUP_GUIDE.md. Inspect current repository state and verify Supabase access read-only. Then begin the next unfinished milestone. Preserve the full requirements, simple interface and free-tier constraint. Record changes and actual verification results in the repository.

## 8. What is ready and what is not

| Area | Status at this setup checkpoint |
| --- | --- |
| Product scope | Documented |
| Visual reference | Existing Figma prototype recorded |
| GitHub read/write | Verified for documentation |
| Setup study notes | This guide |
| Supabase project creation | Owner-reported |
| Supabase project access from implementation session | Pending verification |
| Android stack, SDK, emulator and build setup | Not selected/verified |
| Database schema and business isolation | Not implemented |
| Real transactions, stock changes and payments | Not implemented |
| PDF generation, printing, backup and synchronization | Not implemented |
| Admin and subscription billing | Not implemented |
| APK, deployment, production release | Not produced |

## 9. Study questions

1. Why could the connector read a public repository but fail to create a file?
2. What did the Authorized GitHub Apps screen prove, and what did it not prove?
3. Why did enabling workflow read/write permissions fail to resolve this case?
4. Which observation directly exposed the missing installation?
5. Which evidence confirmed successful contents-write access?
6. Why does “zero accessible projects” require more investigation?
7. Why does connecting Supabase to GitHub not prove that the Android app uses the database?
8. Which requirements are implemented software, and which remain specifications or mockups?

Answer guide: reading public data differs from writing; authorization differs from installation and repository access; Actions settings did not establish connector installation; the connector detail explicitly reported no installation; successful commits plus readback confirmed the write; project visibility depends on the authorized account and its access; a service link does not implement the client/schema; only documentation and prototype work are recorded so far.

## 10. How to extend this log

For each future setup change, record:
- Local date/time and timezone.
- Goal and affected service/repository.
- Steps actually performed.
- Relevant non-secret configuration and versions.
- Exact error, if any, and the attempted fix.
- Verification method and actual result.
- Commit/reference, remaining limitations and next step.

Keep passwords, access tokens, privileged keys and signing secrets out of documentation and screenshots committed to this public repository. This record deliberately includes only public resource identifiers and operational evidence.
