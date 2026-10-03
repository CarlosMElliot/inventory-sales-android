# Instructions for contributors and AI assistants

## Start every implementation session

1. Read this file, then docs/PROGRESS.md.
2. Read docs/WEB_APP_SPEC.md for authoritative scope and rules. If already read in the same session, inspect changes rather than rereading unchanged material.
3. Read docs/IMPLEMENTATION_PLAN.md and select the first unfinished, unblocked task.
4. Read the relevant design/print references and inspect existing source/configuration before editing.
5. Confirm working access as needed. A saved URL is not proof of current tool access or a functioning integration.

The owner should not have to repeat project context. Do not ask what to build when the next action is documented. Make ordinary reversible implementation choices within the task, preserving requirements. Ask focused questions only for genuinely blocking unresolved decisions. Continue useful unblocked work.

## Scope and authority

The product is WEB-FIRST for phones, tablets and desktop browsers. Native Android is deferred despite the repository name.

docs/WEB_APP_SPEC.md controls product behavior. docs/PROGRESS.md records verified implementation status; docs/IMPLEMENTATION_PLAN.md sequences work. Design references guide appearance. docs/history is historical evidence, not current development instructions.

README contains a generated specification mirror. Edit docs/WEB_APP_SPEC.md first and run python3 scripts/sync_readme.py; verify with --check. Do not independently edit the mirrored block.

Preserve the distinction between Confirmed, Required safeguard, Proposed and Decision. Record an accepted decision in the canonical decision register with its rationale/date/evidence. Do not infer approval from a suggestion or silently remove offline or other required features.

## Essential invariants

- One business subscription, one business user, complete package; separate creator administration.
- Server-side business isolation for data/files and privileged actions.
- Orders do not deduct physical stock. Posted invoices deduct tracked stock once.
- Insufficient stock warns but may proceed into negative stock. Untracked products have no physical movement.
- Transaction price overrides do not change catalog prices.
- Credits, payments and refunds have distinct meanings; protect allocations and credit limits.
- Posting and stock/balance effects are atomic and retries idempotent.
- Preserve historical snapshots, audit trail and relevant signature versions.
- Daily orders, invoiced sales and collections are separate metrics.
- PDF/email failures never repost a saved transaction.
- Full offline scope remains unless the owner explicitly changes it.

## Implementation workflow

- Inspect before changing; do not overwrite unknown backend data or discard unrelated work.
- Work in small complete milestones, using stable Sxx screen, Dxx decision and Axx acceptance IDs from the specification.
- Begin security and duplicate prevention with the data model; do not defer them to release polish.
- Consult current official documentation for selected framework/service APIs when implementing.
- Record the chosen stack and rationale. Add actual setup/build/test instructions when code exists; do not invent scripts or successful tests.
- Use versioned database migrations and meaningful tests for access control, money, inventory, retries and synchronization.
- Keep real service keys, passwords, private customer data and access tokens out of this public repository. Use synthetic fixtures.
- Preserve original design binaries and manifests. Existing mock print frames are unfinished.
- Follow current task authorization. Project documentation alone does not authorize spending, real emails/invitations or production publication.

## Before finishing a work session

1. Run relevant available verification, including README mirror check if requirements changed.
2. Record exact commands/results and any untested paths; mocks must be labeled.
3. Update docs/PROGRESS.md with completed work, files/commit references, decisions, blockers and one exact next action.
4. Update milestone statuses in docs/IMPLEMENTATION_PLAN.md only when evidence supports them.
5. Keep setup and handoff instructions current. If source commands change, update README.
6. Report what works and what remains without claiming connections, designs or documentation are implemented software.

## If access is unavailable

Describe the specific unavailable capability. Use repository archives for visual references when live Figma is unavailable. Continue local/sample-data tasks that do not need the blocked service. Do not manufacture inspection results, claim a live test or repeatedly ask the owner to reconstruct archived material.
