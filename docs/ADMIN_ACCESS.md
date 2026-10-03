# Creator admin dashboard, accounts and login setup

Updated 2026-10-03. Product authority: [WEB_APP_SPEC.md](WEB_APP_SPEC.md), screens S28–S34, decision D20 and acceptance A35–A42.

## What the owner receives

A real web admin dashboard where the creator can create businesses and their login users, see subscription/account state, manage access, initiate recovery and inspect audit history. This is part of the product, not a substitute set of instructions for using the Supabase console.

The creator has a distinct administrator account. Each subscribing business has one business-user account. Customer contacts never become app login accounts automatically.

## Login entry points

Proposed routes:

| Entry | User | After successful sign-in |
| --- | --- | --- |
| /admin/login | Creator administrator | /admin dashboard |
| /login | Business user | Business home or permitted subscription-status screen |
| Setup/recovery link | Explicit recipient | Secure password setup/recovery, then correct role destination |

Use authenticated server authorization on every privileged operation. A separate URL alone is not security. There is no public admin signup or user-editable role switch.

## Dashboard workflow

1. Creator signs in.
2. Dashboard displays businesses, users, subscription states and recent administrative activity.
3. Select Create business and user, or Create user for an eligible existing business.
4. Enter business/user information and review the email and subscription/access settings.
5. Create the account through a trusted server operation with duplicate/seat checks.
6. Deliberately send the reviewed recipient a password-setup invitation.
7. User chooses a private password and activates their account.
8. Creator sees invitation/activation status and can later disable/reactivate or request recovery.

Creating an account record is not the same as sending an invitation, activating it or successfully logging in. Report each state accurately.

## Credentials: current status

The first web branch now implements login/password setup, protected creator account operations and bootstrap tooling. See [BUILD_SETUP.md](BUILD_SETUP.md). Live credentials are not yet activated: the migration, private server environment, Auth sender/redirects and hosted origin still require setup and actual provider testing.

The owner supplied the creator email privately. Do not publish the address or a default password. The initial read-only inspection found zero Auth users and an empty public schema; no user was created in this work.

## First creator account bootstrap — implementation procedure

1. Complete M0/M1 and implement M2 authentication, administrator authorization, protected admin routes, provisioning and audit records.
2. Owner identifies the exact creator login email and approved environment. Record no password in repository documentation.
3. Inspect the authentication provider for an existing matching identity through a trusted server/admin interface. Never overwrite an unrelated identity or promote an arbitrary existing user.
4. Use a narrowly authorized bootstrap operation to create/link that identity and grant creator role in server-controlled authorization data. Browser input, public signup and editable metadata cannot grant this role.
5. Deliver a private password-setup/recovery flow to the reviewed recipient once the environment and sender are configured. Never put action links or tokens in public logs or issues.
6. Creator sets their password through the authentication interface; complete the agreed MFA/recovery setup.
7. Test actual creator sign-in, ordinary-user denial, user creation, seat limits, audit evidence and current access enforcement.
8. Restrict/disable general bootstrap access after initialization. Preserve a deliberate recovery path and protection against accidental removal of the last active administrator.
9. Record non-secret outcome and verification in PROGRESS.md. Say credentials are ready only after the implemented flow works.

This sequence describes future implementation; none of these mutations is claimed completed by updating this document.

## User creation and recovery rules

- Business user role is fixed in normal provisioning. Additional platform admins require a separate controlled process.
- Enforce one active user seat per business; replacement preserves business data and history.
- Duplicate emails, repeated invitations and partial provider/database failures have recoverable states.
- The admin never sees an existing user's password.
- Reset/resend actions require explicit intent, rate limiting and accurate queued/sent/failed status.
- Disabling access does not delete business data. User status and subscription status remain distinguishable.
- Check current authorization server-side rather than trusting a stale UI flag.
- Record all privileged changes without secret values.
- No real email is sent merely to test the UI; use synthetic data/test delivery until a real recipient and send action are authorized.

## Completion gate

M2 must deliver creator login, dashboard, business/user directory, create-user workflow, protected provisioning, trusted initial-admin bootstrap and audit foundations. M6 extends subscription automation/offline handling; it does not postpone the owner dashboard.

Use A01/A02 and A35–A42 plus actual sign-in/provisioning checks. Include failures and unavailable tests in the progress record.
