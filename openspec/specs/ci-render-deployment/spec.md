# ci-render-deployment Specification

## Purpose

TBD - created by archiving change 'add-ci-and-render-deployment'. Update Purpose after archive.

## Requirements

### Requirement: Continuous integration validates both applications
The repository SHALL run separate frontend and backend CI checks for every pull request and every push to `main`. The frontend check SHALL install locked dependencies, run tests, and produce a production build. The backend check SHALL install locked dependencies, run tests, run static type checking, and produce a production build.

#### Scenario: Pull request passes all application checks
- **WHEN** a pull request commit allows every required frontend and backend command to exit successfully
- **THEN** GitHub Actions reports successful frontend and backend checks for that commit

#### Scenario: Main push contains a failing application check
- **WHEN** a commit pushed to `main` causes any required frontend or backend command to exit with a non-zero status
- **THEN** GitHub Actions reports the corresponding job as failed


<!-- @trace
source: add-ci-and-render-deployment
updated: 2026-08-09
code:
  - .env.example
  - .agents/skills/spectra-archive/SKILL.md
  - render.yaml
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - server/.env.example
  - .agents/skills/spectra-debug/SKILL.md
  - README.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .github/workflows/ci.yml
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - scripts/deploymentConfig.spec.js
-->

---
### Requirement: Render Blueprint defines the production topology
The repository SHALL provide a Render Blueprint that defines one frontend static site and one backend Node web service. Both services SHALL deploy from `main` and SHALL automatically deploy only after the linked commit's GitHub checks pass.

#### Scenario: Operator creates services from the Blueprint
- **WHEN** an operator applies the repository Blueprint in Render
- **THEN** Render receives definitions for a frontend static site and a backend web service sourced from `main`
- **THEN** each service uses the checks-passed automatic deployment trigger


<!-- @trace
source: add-ci-and-render-deployment
updated: 2026-08-09
code:
  - .env.example
  - .agents/skills/spectra-archive/SKILL.md
  - render.yaml
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - server/.env.example
  - .agents/skills/spectra-debug/SKILL.md
  - README.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .github/workflows/ci.yml
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - scripts/deploymentConfig.spec.js
-->

---
### Requirement: Render services expose deployable application behavior
The frontend service SHALL publish the Vite `dist` output and SHALL rewrite all client-side routes to `/index.html`. The backend service SHALL build and start from the `server` project and SHALL use `/health` as its health check path.

#### Scenario: User directly loads a client-side route
- **WHEN** a user requests a frontend path that is not a physical static asset
- **THEN** Render rewrites the request to `/index.html` for client-side routing

#### Scenario: Render evaluates backend health
- **WHEN** Render requests `/health` from a running backend deployment
- **THEN** the Fastify service returns a successful health response usable by Render


<!-- @trace
source: add-ci-and-render-deployment
updated: 2026-08-09
code:
  - .env.example
  - .agents/skills/spectra-archive/SKILL.md
  - render.yaml
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - server/.env.example
  - .agents/skills/spectra-debug/SKILL.md
  - README.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .github/workflows/ci.yml
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - scripts/deploymentConfig.spec.js
-->

---
### Requirement: Deployment configuration remains externalized
The Blueprint SHALL declare required frontend and backend environment variable names without storing secret values in the repository. The deployment documentation SHALL identify each variable, the initial service setup sequence, verification steps, and rollback procedure.

#### Scenario: Operator configures a new production environment
- **WHEN** an operator follows the deployment documentation and creates the Blueprint services
- **THEN** the operator is instructed to provide `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`, `SUPABASE_URL`, `SUPABASE_DB_URL`, and `CORS_ORIGIN` through Render
- **THEN** no real credential is required in a tracked repository file

#### Scenario: Operator recovers from an unhealthy release
- **WHEN** a newly deployed commit fails health or application verification
- **THEN** the deployment documentation directs the operator to inspect the failure and redeploy the previous CI-passing commit

<!-- @trace
source: add-ci-and-render-deployment
updated: 2026-08-09
code:
  - .env.example
  - .agents/skills/spectra-archive/SKILL.md
  - render.yaml
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - server/.env.example
  - .agents/skills/spectra-debug/SKILL.md
  - README.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .github/workflows/ci.yml
  - .agents/skills/spectra-apply/SKILL.md
tests:
  - scripts/deploymentConfig.spec.js
-->