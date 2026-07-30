# api-authentication Specification

## Purpose

TBD - created by archiving change 'add-supabase-backend'. Update Purpose after archive.

## Requirements

### Requirement: Supabase access tokens establish caller identity
The backend MUST authenticate protected requests by cryptographically verifying a Supabase Auth access JWT against the project JWKS and MUST validate its signature, issuer, audience, expiration, authenticated role, and UUID subject before establishing caller identity.

#### Scenario: Valid authenticated token
- **WHEN** a request presents a non-expired JWT with a trusted signature, the configured Supabase issuer, audience `authenticated`, role `authenticated`, and a UUID `sub`
- **THEN** the backend SHALL establish the caller user ID from `sub` and continue to the protected handler

#### Scenario: Token has an invalid security property
- **WHEN** a token has an untrusted signature, wrong issuer, wrong audience, expired timestamp, role other than `authenticated`, or non-UUID subject
- **THEN** the backend SHALL reject the request with HTTP 401 and error code `AUTH_UNAUTHORIZED`


<!-- @trace
source: add-supabase-backend
updated: 2026-07-30
code:
  - server/src/plugins/database.ts
  - server/src/config.ts
  - server/.env.example
  - supabase/migrations/20260730000000_create_orders.sql
  - server/src/modules/orders/orders.schema.ts
  - vite.config.js
  - server/src/modules/orders/orders.routes.ts
  - server/tsconfig.json
  - docs/supabase-setup.md
  - server/src/modules/orders/orders.mapper.ts
  - server/package.json
  - server/src/modules/orders/orders.repository.ts
  - server/src/modules/orders/orders.service.ts
  - server/src/index.ts
  - server/tsconfig.build.json
  - server/vitest.config.ts
  - server/src/app.ts
  - server/src/plugins/auth.ts
  - README.md
  - server/src/shared/errors.ts
tests:
  - server/src/config.test.ts
  - server/src/migration.test.ts
  - server/src/modules/orders/orders.mapper.test.ts
  - server/src/app.test.ts
  - server/src/modules/orders/orders.repository.test.ts
-->

---
### Requirement: Protected routes require a bearer token
Every `/api/orders` route MUST require an `Authorization` header containing exactly one Bearer access token, while the health route SHALL remain public.

#### Scenario: Missing bearer token
- **WHEN** a client calls any `/api/orders` route without an Authorization Bearer token
- **THEN** the backend SHALL return HTTP 401 with error code `AUTH_UNAUTHORIZED`

#### Scenario: Public health check
- **WHEN** a client calls `GET /health` without authentication
- **THEN** the backend SHALL return HTTP 200 with `{ "status": "ok" }`


<!-- @trace
source: add-supabase-backend
updated: 2026-07-30
code:
  - server/src/plugins/database.ts
  - server/src/config.ts
  - server/.env.example
  - supabase/migrations/20260730000000_create_orders.sql
  - server/src/modules/orders/orders.schema.ts
  - vite.config.js
  - server/src/modules/orders/orders.routes.ts
  - server/tsconfig.json
  - docs/supabase-setup.md
  - server/src/modules/orders/orders.mapper.ts
  - server/package.json
  - server/src/modules/orders/orders.repository.ts
  - server/src/modules/orders/orders.service.ts
  - server/src/index.ts
  - server/tsconfig.build.json
  - server/vitest.config.ts
  - server/src/app.ts
  - server/src/plugins/auth.ts
  - README.md
  - server/src/shared/errors.ts
tests:
  - server/src/config.test.ts
  - server/src/migration.test.ts
  - server/src/modules/orders/orders.mapper.test.ts
  - server/src/app.test.ts
  - server/src/modules/orders/orders.repository.test.ts
-->

---
### Requirement: Authentication failures fail closed without leaking details
Authentication lookup or verification failures MUST deny access and MUST NOT expose signature diagnostics, claims, stack traces, keys, tokens, or upstream error details in the response.

#### Scenario: JWKS verification cannot complete
- **WHEN** the backend cannot obtain a matching trusted key or JWT verification throws an unexpected error
- **THEN** the backend SHALL return the same HTTP 401 `AUTH_UNAUTHORIZED` response shape used for other invalid tokens


<!-- @trace
source: add-supabase-backend
updated: 2026-07-30
code:
  - server/src/plugins/database.ts
  - server/src/config.ts
  - server/.env.example
  - supabase/migrations/20260730000000_create_orders.sql
  - server/src/modules/orders/orders.schema.ts
  - vite.config.js
  - server/src/modules/orders/orders.routes.ts
  - server/tsconfig.json
  - docs/supabase-setup.md
  - server/src/modules/orders/orders.mapper.ts
  - server/package.json
  - server/src/modules/orders/orders.repository.ts
  - server/src/modules/orders/orders.service.ts
  - server/src/index.ts
  - server/tsconfig.build.json
  - server/vitest.config.ts
  - server/src/app.ts
  - server/src/plugins/auth.ts
  - README.md
  - server/src/shared/errors.ts
tests:
  - server/src/config.test.ts
  - server/src/migration.test.ts
  - server/src/modules/orders/orders.mapper.test.ts
  - server/src/app.test.ts
  - server/src/modules/orders/orders.repository.test.ts
-->

---
### Requirement: Client input cannot override authenticated identity
The backend MUST derive authorization identity only from the verified JWT subject and MUST reject identity values supplied through request bodies, query parameters, paths, or non-standard headers.

#### Scenario: Create body attempts to set another user
- **WHEN** an authenticated caller submits an order body containing `userId`
- **THEN** the backend SHALL reject the body as invalid and SHALL NOT create an order for either identity

#### Scenario: Authenticated identity reaches the order service
- **WHEN** a verified user calls an orders endpoint
- **THEN** the route SHALL pass the verified JWT subject to the order service without accepting a caller-selected replacement

##### Example: Verified subject is forwarded
- **GIVEN** a valid token whose `sub` is `00000000-0000-4000-8000-000000000001`
- **WHEN** the caller requests `GET /api/orders`
- **THEN** the route SHALL call the order service with user ID `00000000-0000-4000-8000-000000000001`

<!-- @trace
source: add-supabase-backend
updated: 2026-07-30
code:
  - server/src/plugins/database.ts
  - server/src/config.ts
  - server/.env.example
  - supabase/migrations/20260730000000_create_orders.sql
  - server/src/modules/orders/orders.schema.ts
  - vite.config.js
  - server/src/modules/orders/orders.routes.ts
  - server/tsconfig.json
  - docs/supabase-setup.md
  - server/src/modules/orders/orders.mapper.ts
  - server/package.json
  - server/src/modules/orders/orders.repository.ts
  - server/src/modules/orders/orders.service.ts
  - server/src/index.ts
  - server/tsconfig.build.json
  - server/vitest.config.ts
  - server/src/app.ts
  - server/src/plugins/auth.ts
  - README.md
  - server/src/shared/errors.ts
tests:
  - server/src/config.test.ts
  - server/src/migration.test.ts
  - server/src/modules/orders/orders.mapper.test.ts
  - server/src/app.test.ts
  - server/src/modules/orders/orders.repository.test.ts
-->