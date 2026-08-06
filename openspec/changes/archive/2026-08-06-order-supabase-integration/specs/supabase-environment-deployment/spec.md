## ADDED Requirements

### Requirement: The target Supabase database receives repository migrations
The deployment workflow MUST link an explicitly selected Supabase project and apply all pending files from `supabase/migrations` without resetting remote data. Re-running the workflow with no new migrations SHALL make no schema changes.

#### Scenario: Pending orders migration is deployed
- **WHEN** an operator selects the intended project and pushes the repository migrations
- **THEN** the target database SHALL contain the orders table, constraints, indexes, updated-at trigger, enabled Row Level Security, and owner policies defined by the migration

#### Scenario: Deployment is repeated
- **WHEN** the operator runs the migration push again with no new migration files
- **THEN** the command SHALL report no pending migrations and SHALL preserve existing rows

### Requirement: Runtime configuration separates public and secret values
Deployment documentation MUST identify the frontend Supabase URL and anonymous publishable key as client configuration, and MUST keep database connection strings, passwords, and privileged keys out of frontend bundles and version control.

#### Scenario: Frontend is built for deployment
- **WHEN** the production frontend build is generated
- **THEN** it SHALL contain only the configured Supabase URL, anonymous publishable key, and API base URL required by browser code

#### Scenario: Server starts with production configuration
- **WHEN** the backend starts with the Supabase URL, database connection string, CORS origin, and port supplied by its deployment environment
- **THEN** it SHALL validate required configuration without logging secret values

### Requirement: Deployment verification proves availability and owner isolation
A documented verification command MUST check backend health, authenticated order CRUD, and cross-user isolation against the selected environment. Verification data MUST use dedicated test users and MUST be removed when the verification completes successfully or fails after creation.

#### Scenario: Deployment passes verification
- **WHEN** the target API and Supabase project are correctly configured for two test users
- **THEN** verification SHALL confirm health returns HTTP 200, user A can create/read/update/delete its order, and user B receives HTTP 404 for user A's order

#### Scenario: Verification detects an unsafe deployment
- **WHEN** user B can read, update, or delete user A's verification order
- **THEN** verification SHALL exit unsuccessfully, identify the failed isolation check without printing tokens, and attempt cleanup as user A

### Requirement: Deployment instructions include rollback boundaries
The deployment guide MUST identify the exact target before migration, require a backup for destructive future migrations, and describe rollback as a reviewed forward migration rather than a remote database reset.

#### Scenario: Operator prepares a production migration
- **WHEN** an operator follows the deployment guide for a production project
- **THEN** the operator SHALL verify the project reference and migration plan before push and SHALL NOT run a database reset against the remote project
