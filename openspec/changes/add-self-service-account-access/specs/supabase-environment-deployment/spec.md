## MODIFIED Requirements

### Requirement: The target Supabase database receives repository migrations
The deployment workflow MUST link an explicitly selected Supabase project and apply all pending files from `supabase/migrations` without resetting remote data. Re-running the workflow with no new migrations SHALL make no schema changes. The deployed schema SHALL include the orders model and the member profile table, normalized username uniqueness, profile creation trigger, availability RPC, and Row Level Security policies required by repository migrations.

#### Scenario: Pending member profile migration is deployed
- **WHEN** an operator selects the intended project and pushes the repository migrations
- **THEN** the target database SHALL contain the member profile table, username constraints, normalized unique index, Auth user trigger, availability RPC, cascade ownership, and Row Level Security policies defined by the migration

#### Scenario: Deployment is repeated
- **WHEN** the operator runs the migration push again with no new migration files
- **THEN** the command SHALL report no pending migrations and SHALL preserve existing Auth users, profiles, and orders

#### Scenario: Existing Auth users are backfilled
- **WHEN** the member profile migration finds an existing Auth user without a profile
- **THEN** it SHALL create a valid unique display username derived from the email local-part plus a deterministic short user-ID suffix and SHALL report no orphan Auth users after migration

## ADDED Requirements

### Requirement: Supabase Auth requires verified email and baseline password strength
The target Supabase project MUST enable public email-password signup, Confirm Email, a minimum password length of 8, and a password character policy requiring letters and digits. Existing confirmed users SHALL retain access after the settings change.

#### Scenario: New production user signs up
- **WHEN** the deployed frontend submits a new valid email-password signup
- **THEN** Supabase SHALL create an unconfirmed user, send a confirmation email, and SHALL NOT issue a protected-use session before confirmation

### Requirement: Authentication redirects are explicitly allowlisted
Deployment configuration MUST set the production Site URL and MUST allowlist the exact local-development and production callback URLs used for email confirmation and password recovery. Email templates SHALL direct recipients to the configured callback destination rather than an uncontrolled URL.

#### Scenario: Production confirmation link is opened
- **WHEN** a recipient clicks a production confirmation email link
- **THEN** Supabase SHALL redirect only to the allowlisted Hakobi verification callback

#### Scenario: Unlisted callback is requested
- **WHEN** a signup or recovery request supplies a redirect URL outside the allowlist
- **THEN** Supabase SHALL reject or replace the destination according to the configured Site URL and SHALL NOT redirect to the unlisted origin

### Requirement: Production authentication email uses configured SMTP
Production deployment documentation MUST require a custom SMTP provider and MUST identify sender identity, confirmation and recovery templates, rate limits, and a delivery verification procedure. Supabase's best-effort default sender SHALL be limited to development and manual testing.

#### Scenario: Production email delivery is verified
- **WHEN** an operator completes deployment verification
- **THEN** one dedicated test account SHALL receive a confirmation email and a recovery email through the configured SMTP sender, both links SHALL return to the production Hakobi origin, and the test account SHALL be removed after verification

#### Scenario: SMTP delivery fails
- **WHEN** the provider rejects or does not deliver a test authentication email
- **THEN** deployment verification SHALL fail without exposing SMTP credentials or authentication tokens
