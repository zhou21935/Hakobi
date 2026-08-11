## ADDED Requirements

### Requirement: Source code has explicit frontend and backend ownership
The repository SHALL keep the frontend package at the repository root with production source under `src/`, SHALL place the backend package under `backend/` with production source under `backend/src/`, and SHALL keep Supabase migrations under `supabase/migrations/`. The repository MUST NOT retain a duplicate `server/` package after migration.

#### Scenario: Developer locates application source
- **WHEN** a developer inspects the repository after the reorganization
- **THEN** frontend production code is under `src/`, backend production code is under `backend/src/`, and database migrations are under `supabase/migrations/`

### Requirement: Frontend components are grouped by reuse boundary
The frontend SHALL place cross-feature application components under `src/components/common/`, reusable primitive UI components under `src/components/ui/`, and order-specific components under `src/components/orders/`. Imports MUST resolve the component from its canonical directory without retaining duplicate compatibility copies.

#### Scenario: Shared component is imported
- **WHEN** the application imports `AppSidebar` or `StatusBadge`
- **THEN** the import resolves from `src/components/common/` and no copy remains directly under `src/components/`

### Requirement: Tests are centralized by execution responsibility
The repository SHALL place frontend tests under `tests/`, backend tests under `backend/tests/`, and deployment or repository-tooling tests under `scripts/tests/`. Frontend production directories and backend production directories MUST NOT contain `__tests__` directories or `*.test.ts` files after migration.

#### Scenario: Test runners collect the reorganized suites
- **WHEN** the frontend and backend test commands run from their documented package roots
- **THEN** Vitest collects all expected frontend, backend, and tooling test files from their canonical test directories without collecting duplicate legacy paths

#### Scenario: Test count is preserved
- **WHEN** the reorganized full test suite is compared with the pre-migration baseline
- **THEN** every existing test case remains collected and passing unless an explicitly documented assertion path update is required by the file move

### Requirement: Development and deployment entry points remain operational
The repository SHALL preserve the frontend meanings of root `dev`, `test`, and `build` npm scripts, SHALL expose root commands for backend development, testing, type checking, and building, and SHALL expose commands for complete frontend-plus-backend verification. GitHub Actions and Render MUST reference `backend/` instead of `server/`, while the frontend Render service SHALL continue building from the repository root.

#### Scenario: Complete local verification succeeds
- **WHEN** a developer runs the documented full test and full build commands from the repository root
- **THEN** the frontend and backend suites execute, backend static type checking succeeds, and both production builds complete

#### Scenario: Continuous integration uses the reorganized paths
- **WHEN** CI runs for a pull request or a push to `main`
- **THEN** the frontend job operates from the repository root and the backend job installs, tests, type-checks, and builds from `backend/`

#### Scenario: Render deploys both services
- **WHEN** Render evaluates `render.yaml`
- **THEN** the static frontend service builds from the repository root and the API service builds and starts from `backend/` with the existing health check and environment variable contract

### Requirement: Documentation uses canonical project paths
Active developer and deployment documentation SHALL use the canonical `src/`, `tests/`, `backend/`, `backend/tests/`, and `scripts/tests/` paths. Historical Spectra archives SHALL remain unchanged as records of prior repository states.

#### Scenario: Developer follows setup documentation
- **WHEN** a developer follows the current README or Supabase setup instructions
- **THEN** every referenced active file and command resolves against the reorganized repository without requiring knowledge of the former `server/` path
