# project-structure Specification

## Purpose

TBD - created by archiving change 'reorganize-project-structure'. Update Purpose after archive.

## Requirements

### Requirement: Source code has explicit frontend and backend ownership
The repository SHALL keep the frontend package at the repository root with production source under `src/`, SHALL place the backend package under `backend/` with production source under `backend/src/`, and SHALL keep Supabase migrations under `supabase/migrations/`. The repository MUST NOT retain a duplicate `server/` package after migration.

#### Scenario: Developer locates application source
- **WHEN** a developer inspects the repository after the reorganization
- **THEN** frontend production code is under `src/`, backend production code is under `backend/src/`, and database migrations are under `supabase/migrations/`


<!-- @trace
source: reorganize-project-structure
updated: 2026-08-11
code:
  - server/tsconfig.build.json
  - server/src/plugins/database.ts
  - server/package.json
  - server/src/shared/errors.ts
  - src/views/UiShowcase.vue
  - server/src/modules/orders/orders.repository.ts
  - backend/src/modules/orders/orders.routes.ts
  - .agents/skills/spectra-debug/SKILL.md
  - server/src/modules/orders/orders.service.ts
  - server/src/app.ts
  - backend/package.json
  - server/src/modules/orders/orders.routes.ts
  - vite.config.js
  - docs/supabase-setup.md
  - backend/src/plugins/database.ts
  - src/components/StatusBadge.vue
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/app.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/config.ts
  - backend/vitest.config.ts
  - server/src/index.ts
  - backend/.env.example
  - server/vitest.config.ts
  - backend/src/index.ts
  - server/tsconfig.json
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - backend/src/modules/orders/orders.repository.ts
  - .github/workflows/ci.yml
  - server/src/plugins/auth.ts
  - backend/src/plugins/auth.ts
  - src/components/orders/OrderCard.vue
  - README.md
  - backend/tsconfig.json
  - backend/src/shared/errors.ts
  - src/components/common/AppSidebar.vue
  - src/components/common/StatusBadge.vue
  - src/components/AppSidebar.vue
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/modules/orders/orders.schema.ts
  - render.yaml
  - server/src/modules/orders/orders.schema.ts
  - server/.env.example
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - server/src/config.ts
  - server/src/modules/orders/orders.mapper.ts
  - backend/tsconfig.build.json
  - .agents/skills/spectra-drift/SKILL.md
  - src/App.vue
  - package.json
tests:
  - tests/stores/orders.spec.js
  - tests/components/common/AppSidebar.spec.js
  - src/services/__tests__/ordersApi.spec.js
  - tests/views/Login.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/domain/__tests__/accountValidation.spec.js
  - tests/views/ForgotPassword.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/views/__tests__/AllOrders.spec.js
  - src/views/__tests__/OrderList.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderCard.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - tests/domain/accountValidation.spec.js
  - tests/components/ui/MultiSelect.spec.js
  - tests/router/authGuard.spec.js
  - src/views/__tests__/ResetPassword.spec.js
  - src/router/__tests__/authGuard.spec.js
  - server/src/config.test.ts
  - server/src/modules/orders/orders.repository.test.ts
  - src/views/__tests__/Login.spec.js
  - tests/components/orders/DeleteUndoToast.spec.js
  - src/lib/__tests__/supabase.spec.js
  - src/components/orders/__tests__/DeleteUndoToast.spec.js
  - tests/components/orders/SearchSortControls.spec.js
  - backend/tests/orders/orders.repository.test.ts
  - tests/views/AllOrders.spec.js
  - tests/stores/auth.spec.js
  - src/views/__tests__/ForgotPassword.spec.js
  - tests/lib/supabase.spec.js
  - src/views/__tests__/VerifyEmail.spec.js
  - src/stores/__tests__/orders.spec.js
  - scripts/__tests__/verify-supabase-deployment.spec.js
  - tests/views/OrderList.spec.js
  - server/src/modules/orders/orders.mapper.test.ts
  - src/components/orders/__tests__/OrderCard.spec.js
  - backend/tests/config/config.test.ts
  - src/components/ui/__tests__/Modal.spec.js
  - tests/views/Profile.spec.js
  - tests/views/Register.spec.js
  - src/views/__tests__/Profile.spec.js
  - tests/app/App.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/views/ResetPassword.spec.js
  - scripts/tests/deployment-docs.spec.js
  - src/views/__tests__/Register.spec.js
  - backend/tests/migrations/migration.test.ts
  - src/__tests__/App.spec.js
  - scripts/tests/deploymentConfig.spec.js
  - scripts/deploymentConfig.spec.js
  - server/src/app.test.ts
  - server/src/migration.test.ts
  - src/components/orders/__tests__/OrderDetailsModal.spec.js
  - tests/components/ui/Modal.spec.js
  - tests/views/VerifyEmail.spec.js
  - scripts/__tests__/deployment-docs.spec.js
  - src/components/ui/__tests__/MultiSelect.spec.js
  - tests/domain/orderValidation.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/stores/__tests__/auth.spec.js
  - scripts/tests/verify-supabase-deployment.spec.js
  - backend/tests/app/app.test.ts
-->

---
### Requirement: Frontend components are grouped by reuse boundary
The frontend SHALL place cross-feature application components under `src/components/common/`, reusable primitive UI components under `src/components/ui/`, and order-specific components under `src/components/orders/`. Imports MUST resolve the component from its canonical directory without retaining duplicate compatibility copies.

#### Scenario: Shared component is imported
- **WHEN** the application imports `AppSidebar` or `StatusBadge`
- **THEN** the import resolves from `src/components/common/` and no copy remains directly under `src/components/`


<!-- @trace
source: reorganize-project-structure
updated: 2026-08-11
code:
  - server/tsconfig.build.json
  - server/src/plugins/database.ts
  - server/package.json
  - server/src/shared/errors.ts
  - src/views/UiShowcase.vue
  - server/src/modules/orders/orders.repository.ts
  - backend/src/modules/orders/orders.routes.ts
  - .agents/skills/spectra-debug/SKILL.md
  - server/src/modules/orders/orders.service.ts
  - server/src/app.ts
  - backend/package.json
  - server/src/modules/orders/orders.routes.ts
  - vite.config.js
  - docs/supabase-setup.md
  - backend/src/plugins/database.ts
  - src/components/StatusBadge.vue
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/app.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/config.ts
  - backend/vitest.config.ts
  - server/src/index.ts
  - backend/.env.example
  - server/vitest.config.ts
  - backend/src/index.ts
  - server/tsconfig.json
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - backend/src/modules/orders/orders.repository.ts
  - .github/workflows/ci.yml
  - server/src/plugins/auth.ts
  - backend/src/plugins/auth.ts
  - src/components/orders/OrderCard.vue
  - README.md
  - backend/tsconfig.json
  - backend/src/shared/errors.ts
  - src/components/common/AppSidebar.vue
  - src/components/common/StatusBadge.vue
  - src/components/AppSidebar.vue
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/modules/orders/orders.schema.ts
  - render.yaml
  - server/src/modules/orders/orders.schema.ts
  - server/.env.example
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - server/src/config.ts
  - server/src/modules/orders/orders.mapper.ts
  - backend/tsconfig.build.json
  - .agents/skills/spectra-drift/SKILL.md
  - src/App.vue
  - package.json
tests:
  - tests/stores/orders.spec.js
  - tests/components/common/AppSidebar.spec.js
  - src/services/__tests__/ordersApi.spec.js
  - tests/views/Login.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/domain/__tests__/accountValidation.spec.js
  - tests/views/ForgotPassword.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/views/__tests__/AllOrders.spec.js
  - src/views/__tests__/OrderList.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderCard.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - tests/domain/accountValidation.spec.js
  - tests/components/ui/MultiSelect.spec.js
  - tests/router/authGuard.spec.js
  - src/views/__tests__/ResetPassword.spec.js
  - src/router/__tests__/authGuard.spec.js
  - server/src/config.test.ts
  - server/src/modules/orders/orders.repository.test.ts
  - src/views/__tests__/Login.spec.js
  - tests/components/orders/DeleteUndoToast.spec.js
  - src/lib/__tests__/supabase.spec.js
  - src/components/orders/__tests__/DeleteUndoToast.spec.js
  - tests/components/orders/SearchSortControls.spec.js
  - backend/tests/orders/orders.repository.test.ts
  - tests/views/AllOrders.spec.js
  - tests/stores/auth.spec.js
  - src/views/__tests__/ForgotPassword.spec.js
  - tests/lib/supabase.spec.js
  - src/views/__tests__/VerifyEmail.spec.js
  - src/stores/__tests__/orders.spec.js
  - scripts/__tests__/verify-supabase-deployment.spec.js
  - tests/views/OrderList.spec.js
  - server/src/modules/orders/orders.mapper.test.ts
  - src/components/orders/__tests__/OrderCard.spec.js
  - backend/tests/config/config.test.ts
  - src/components/ui/__tests__/Modal.spec.js
  - tests/views/Profile.spec.js
  - tests/views/Register.spec.js
  - src/views/__tests__/Profile.spec.js
  - tests/app/App.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/views/ResetPassword.spec.js
  - scripts/tests/deployment-docs.spec.js
  - src/views/__tests__/Register.spec.js
  - backend/tests/migrations/migration.test.ts
  - src/__tests__/App.spec.js
  - scripts/tests/deploymentConfig.spec.js
  - scripts/deploymentConfig.spec.js
  - server/src/app.test.ts
  - server/src/migration.test.ts
  - src/components/orders/__tests__/OrderDetailsModal.spec.js
  - tests/components/ui/Modal.spec.js
  - tests/views/VerifyEmail.spec.js
  - scripts/__tests__/deployment-docs.spec.js
  - src/components/ui/__tests__/MultiSelect.spec.js
  - tests/domain/orderValidation.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/stores/__tests__/auth.spec.js
  - scripts/tests/verify-supabase-deployment.spec.js
  - backend/tests/app/app.test.ts
-->

---
### Requirement: Tests are centralized by execution responsibility
The repository SHALL place frontend tests under `tests/`, backend tests under `backend/tests/`, and deployment or repository-tooling tests under `scripts/tests/`. Frontend production directories and backend production directories MUST NOT contain `__tests__` directories or `*.test.ts` files after migration.

#### Scenario: Test runners collect the reorganized suites
- **WHEN** the frontend and backend test commands run from their documented package roots
- **THEN** Vitest collects all expected frontend, backend, and tooling test files from their canonical test directories without collecting duplicate legacy paths

#### Scenario: Test count is preserved
- **WHEN** the reorganized full test suite is compared with the pre-migration baseline
- **THEN** every existing test case remains collected and passing unless an explicitly documented assertion path update is required by the file move


<!-- @trace
source: reorganize-project-structure
updated: 2026-08-11
code:
  - server/tsconfig.build.json
  - server/src/plugins/database.ts
  - server/package.json
  - server/src/shared/errors.ts
  - src/views/UiShowcase.vue
  - server/src/modules/orders/orders.repository.ts
  - backend/src/modules/orders/orders.routes.ts
  - .agents/skills/spectra-debug/SKILL.md
  - server/src/modules/orders/orders.service.ts
  - server/src/app.ts
  - backend/package.json
  - server/src/modules/orders/orders.routes.ts
  - vite.config.js
  - docs/supabase-setup.md
  - backend/src/plugins/database.ts
  - src/components/StatusBadge.vue
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/app.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/config.ts
  - backend/vitest.config.ts
  - server/src/index.ts
  - backend/.env.example
  - server/vitest.config.ts
  - backend/src/index.ts
  - server/tsconfig.json
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - backend/src/modules/orders/orders.repository.ts
  - .github/workflows/ci.yml
  - server/src/plugins/auth.ts
  - backend/src/plugins/auth.ts
  - src/components/orders/OrderCard.vue
  - README.md
  - backend/tsconfig.json
  - backend/src/shared/errors.ts
  - src/components/common/AppSidebar.vue
  - src/components/common/StatusBadge.vue
  - src/components/AppSidebar.vue
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/modules/orders/orders.schema.ts
  - render.yaml
  - server/src/modules/orders/orders.schema.ts
  - server/.env.example
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - server/src/config.ts
  - server/src/modules/orders/orders.mapper.ts
  - backend/tsconfig.build.json
  - .agents/skills/spectra-drift/SKILL.md
  - src/App.vue
  - package.json
tests:
  - tests/stores/orders.spec.js
  - tests/components/common/AppSidebar.spec.js
  - src/services/__tests__/ordersApi.spec.js
  - tests/views/Login.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/domain/__tests__/accountValidation.spec.js
  - tests/views/ForgotPassword.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/views/__tests__/AllOrders.spec.js
  - src/views/__tests__/OrderList.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderCard.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - tests/domain/accountValidation.spec.js
  - tests/components/ui/MultiSelect.spec.js
  - tests/router/authGuard.spec.js
  - src/views/__tests__/ResetPassword.spec.js
  - src/router/__tests__/authGuard.spec.js
  - server/src/config.test.ts
  - server/src/modules/orders/orders.repository.test.ts
  - src/views/__tests__/Login.spec.js
  - tests/components/orders/DeleteUndoToast.spec.js
  - src/lib/__tests__/supabase.spec.js
  - src/components/orders/__tests__/DeleteUndoToast.spec.js
  - tests/components/orders/SearchSortControls.spec.js
  - backend/tests/orders/orders.repository.test.ts
  - tests/views/AllOrders.spec.js
  - tests/stores/auth.spec.js
  - src/views/__tests__/ForgotPassword.spec.js
  - tests/lib/supabase.spec.js
  - src/views/__tests__/VerifyEmail.spec.js
  - src/stores/__tests__/orders.spec.js
  - scripts/__tests__/verify-supabase-deployment.spec.js
  - tests/views/OrderList.spec.js
  - server/src/modules/orders/orders.mapper.test.ts
  - src/components/orders/__tests__/OrderCard.spec.js
  - backend/tests/config/config.test.ts
  - src/components/ui/__tests__/Modal.spec.js
  - tests/views/Profile.spec.js
  - tests/views/Register.spec.js
  - src/views/__tests__/Profile.spec.js
  - tests/app/App.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/views/ResetPassword.spec.js
  - scripts/tests/deployment-docs.spec.js
  - src/views/__tests__/Register.spec.js
  - backend/tests/migrations/migration.test.ts
  - src/__tests__/App.spec.js
  - scripts/tests/deploymentConfig.spec.js
  - scripts/deploymentConfig.spec.js
  - server/src/app.test.ts
  - server/src/migration.test.ts
  - src/components/orders/__tests__/OrderDetailsModal.spec.js
  - tests/components/ui/Modal.spec.js
  - tests/views/VerifyEmail.spec.js
  - scripts/__tests__/deployment-docs.spec.js
  - src/components/ui/__tests__/MultiSelect.spec.js
  - tests/domain/orderValidation.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/stores/__tests__/auth.spec.js
  - scripts/tests/verify-supabase-deployment.spec.js
  - backend/tests/app/app.test.ts
-->

---
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


<!-- @trace
source: reorganize-project-structure
updated: 2026-08-11
code:
  - server/tsconfig.build.json
  - server/src/plugins/database.ts
  - server/package.json
  - server/src/shared/errors.ts
  - src/views/UiShowcase.vue
  - server/src/modules/orders/orders.repository.ts
  - backend/src/modules/orders/orders.routes.ts
  - .agents/skills/spectra-debug/SKILL.md
  - server/src/modules/orders/orders.service.ts
  - server/src/app.ts
  - backend/package.json
  - server/src/modules/orders/orders.routes.ts
  - vite.config.js
  - docs/supabase-setup.md
  - backend/src/plugins/database.ts
  - src/components/StatusBadge.vue
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/app.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/config.ts
  - backend/vitest.config.ts
  - server/src/index.ts
  - backend/.env.example
  - server/vitest.config.ts
  - backend/src/index.ts
  - server/tsconfig.json
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - backend/src/modules/orders/orders.repository.ts
  - .github/workflows/ci.yml
  - server/src/plugins/auth.ts
  - backend/src/plugins/auth.ts
  - src/components/orders/OrderCard.vue
  - README.md
  - backend/tsconfig.json
  - backend/src/shared/errors.ts
  - src/components/common/AppSidebar.vue
  - src/components/common/StatusBadge.vue
  - src/components/AppSidebar.vue
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/modules/orders/orders.schema.ts
  - render.yaml
  - server/src/modules/orders/orders.schema.ts
  - server/.env.example
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - server/src/config.ts
  - server/src/modules/orders/orders.mapper.ts
  - backend/tsconfig.build.json
  - .agents/skills/spectra-drift/SKILL.md
  - src/App.vue
  - package.json
tests:
  - tests/stores/orders.spec.js
  - tests/components/common/AppSidebar.spec.js
  - src/services/__tests__/ordersApi.spec.js
  - tests/views/Login.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/domain/__tests__/accountValidation.spec.js
  - tests/views/ForgotPassword.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/views/__tests__/AllOrders.spec.js
  - src/views/__tests__/OrderList.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderCard.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - tests/domain/accountValidation.spec.js
  - tests/components/ui/MultiSelect.spec.js
  - tests/router/authGuard.spec.js
  - src/views/__tests__/ResetPassword.spec.js
  - src/router/__tests__/authGuard.spec.js
  - server/src/config.test.ts
  - server/src/modules/orders/orders.repository.test.ts
  - src/views/__tests__/Login.spec.js
  - tests/components/orders/DeleteUndoToast.spec.js
  - src/lib/__tests__/supabase.spec.js
  - src/components/orders/__tests__/DeleteUndoToast.spec.js
  - tests/components/orders/SearchSortControls.spec.js
  - backend/tests/orders/orders.repository.test.ts
  - tests/views/AllOrders.spec.js
  - tests/stores/auth.spec.js
  - src/views/__tests__/ForgotPassword.spec.js
  - tests/lib/supabase.spec.js
  - src/views/__tests__/VerifyEmail.spec.js
  - src/stores/__tests__/orders.spec.js
  - scripts/__tests__/verify-supabase-deployment.spec.js
  - tests/views/OrderList.spec.js
  - server/src/modules/orders/orders.mapper.test.ts
  - src/components/orders/__tests__/OrderCard.spec.js
  - backend/tests/config/config.test.ts
  - src/components/ui/__tests__/Modal.spec.js
  - tests/views/Profile.spec.js
  - tests/views/Register.spec.js
  - src/views/__tests__/Profile.spec.js
  - tests/app/App.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/views/ResetPassword.spec.js
  - scripts/tests/deployment-docs.spec.js
  - src/views/__tests__/Register.spec.js
  - backend/tests/migrations/migration.test.ts
  - src/__tests__/App.spec.js
  - scripts/tests/deploymentConfig.spec.js
  - scripts/deploymentConfig.spec.js
  - server/src/app.test.ts
  - server/src/migration.test.ts
  - src/components/orders/__tests__/OrderDetailsModal.spec.js
  - tests/components/ui/Modal.spec.js
  - tests/views/VerifyEmail.spec.js
  - scripts/__tests__/deployment-docs.spec.js
  - src/components/ui/__tests__/MultiSelect.spec.js
  - tests/domain/orderValidation.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/stores/__tests__/auth.spec.js
  - scripts/tests/verify-supabase-deployment.spec.js
  - backend/tests/app/app.test.ts
-->

---
### Requirement: Documentation uses canonical project paths
Active developer and deployment documentation SHALL use the canonical `src/`, `tests/`, `backend/`, `backend/tests/`, and `scripts/tests/` paths. Historical Spectra archives SHALL remain unchanged as records of prior repository states.

#### Scenario: Developer follows setup documentation
- **WHEN** a developer follows the current README or Supabase setup instructions
- **THEN** every referenced active file and command resolves against the reorganized repository without requiring knowledge of the former `server/` path

<!-- @trace
source: reorganize-project-structure
updated: 2026-08-11
code:
  - server/tsconfig.build.json
  - server/src/plugins/database.ts
  - server/package.json
  - server/src/shared/errors.ts
  - src/views/UiShowcase.vue
  - server/src/modules/orders/orders.repository.ts
  - backend/src/modules/orders/orders.routes.ts
  - .agents/skills/spectra-debug/SKILL.md
  - server/src/modules/orders/orders.service.ts
  - server/src/app.ts
  - backend/package.json
  - server/src/modules/orders/orders.routes.ts
  - vite.config.js
  - docs/supabase-setup.md
  - backend/src/plugins/database.ts
  - src/components/StatusBadge.vue
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/app.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/config.ts
  - backend/vitest.config.ts
  - server/src/index.ts
  - backend/.env.example
  - server/vitest.config.ts
  - backend/src/index.ts
  - server/tsconfig.json
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - backend/src/modules/orders/orders.repository.ts
  - .github/workflows/ci.yml
  - server/src/plugins/auth.ts
  - backend/src/plugins/auth.ts
  - src/components/orders/OrderCard.vue
  - README.md
  - backend/tsconfig.json
  - backend/src/shared/errors.ts
  - src/components/common/AppSidebar.vue
  - src/components/common/StatusBadge.vue
  - src/components/AppSidebar.vue
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/modules/orders/orders.schema.ts
  - render.yaml
  - server/src/modules/orders/orders.schema.ts
  - server/.env.example
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - server/src/config.ts
  - server/src/modules/orders/orders.mapper.ts
  - backend/tsconfig.build.json
  - .agents/skills/spectra-drift/SKILL.md
  - src/App.vue
  - package.json
tests:
  - tests/stores/orders.spec.js
  - tests/components/common/AppSidebar.spec.js
  - src/services/__tests__/ordersApi.spec.js
  - tests/views/Login.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/domain/__tests__/accountValidation.spec.js
  - tests/views/ForgotPassword.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/views/__tests__/AllOrders.spec.js
  - src/views/__tests__/OrderList.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderCard.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - tests/domain/accountValidation.spec.js
  - tests/components/ui/MultiSelect.spec.js
  - tests/router/authGuard.spec.js
  - src/views/__tests__/ResetPassword.spec.js
  - src/router/__tests__/authGuard.spec.js
  - server/src/config.test.ts
  - server/src/modules/orders/orders.repository.test.ts
  - src/views/__tests__/Login.spec.js
  - tests/components/orders/DeleteUndoToast.spec.js
  - src/lib/__tests__/supabase.spec.js
  - src/components/orders/__tests__/DeleteUndoToast.spec.js
  - tests/components/orders/SearchSortControls.spec.js
  - backend/tests/orders/orders.repository.test.ts
  - tests/views/AllOrders.spec.js
  - tests/stores/auth.spec.js
  - src/views/__tests__/ForgotPassword.spec.js
  - tests/lib/supabase.spec.js
  - src/views/__tests__/VerifyEmail.spec.js
  - src/stores/__tests__/orders.spec.js
  - scripts/__tests__/verify-supabase-deployment.spec.js
  - tests/views/OrderList.spec.js
  - server/src/modules/orders/orders.mapper.test.ts
  - src/components/orders/__tests__/OrderCard.spec.js
  - backend/tests/config/config.test.ts
  - src/components/ui/__tests__/Modal.spec.js
  - tests/views/Profile.spec.js
  - tests/views/Register.spec.js
  - src/views/__tests__/Profile.spec.js
  - tests/app/App.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/views/ResetPassword.spec.js
  - scripts/tests/deployment-docs.spec.js
  - src/views/__tests__/Register.spec.js
  - backend/tests/migrations/migration.test.ts
  - src/__tests__/App.spec.js
  - scripts/tests/deploymentConfig.spec.js
  - scripts/deploymentConfig.spec.js
  - server/src/app.test.ts
  - server/src/migration.test.ts
  - src/components/orders/__tests__/OrderDetailsModal.spec.js
  - tests/components/ui/Modal.spec.js
  - tests/views/VerifyEmail.spec.js
  - scripts/__tests__/deployment-docs.spec.js
  - src/components/ui/__tests__/MultiSelect.spec.js
  - tests/domain/orderValidation.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/stores/__tests__/auth.spec.js
  - scripts/tests/verify-supabase-deployment.spec.js
  - backend/tests/app/app.test.ts
-->