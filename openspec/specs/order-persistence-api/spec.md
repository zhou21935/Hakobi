# order-persistence-api Specification

## Purpose

TBD - created by archiving change 'add-supabase-backend'. Update Purpose after archive.

## Requirements

### Requirement: Orders are persisted with validated ownership and values

The database SHALL persist orders with a UUID primary key, owning `user_id`, constrained category, status and currency, positive amount, an optional validated product category array, and an order number of at most 200 characters defaulting to an empty string. The API MUST assign ownership from the authenticated caller and MUST NOT accept caller-selected ownership.

#### Scenario: Valid order with no product categories is created

- **WHEN** an authenticated user submits category `agent`, name `Book`, amount `120.50`, `productCategories: []`, and order number `114-2938471-0038`
- **THEN** the backend SHALL persist an owned order and return HTTP 201 with the order number and empty category array

#### Scenario: Invalid order is rejected

- **WHEN** create input has a blank name, non-positive amount, unsupported category, status, currency, unsupported product category, or order number longer than 200 characters
- **THEN** the backend SHALL return HTTP 400 with code `VALIDATION_ERROR`
- **AND** it SHALL NOT persist a row


<!-- @trace
source: persist-order-number-and-attachments
updated: 2026-08-13
code:
  - backend/package.json
  - backend/src/modules/order-attachments/order-attachments.repository.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/app.ts
  - backend/src/modules/order-attachments/order-attachments.mapper.ts
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/shared/errors.ts
  - .agents/skills/spectra-apply/SKILL.md
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/modules/orders/orders.routes.ts
  - backend/src/modules/orders/orders.schema.ts
  - src/components/ui/Input.vue
  - backend/src/modules/order-attachments/order-attachments.storage.ts
  - backend/src/modules/order-attachments/order-attachments.service.ts
  - .agents/skills/spectra-ask/SKILL.md
  - supabase/migrations/20260813000000_persist_order_number_and_attachments.sql
  - src/views/AllOrders.vue
  - render.yaml
  - src/views/OrderList.vue
  - backend/src/modules/order-attachments/order-attachments.routes.ts
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - src/services/ordersApi.js
  - supabase/.temp/start-secrets/supabase_edge_runtime_Hakobi/main/index.ts
  - .agents/skills/spectra-audit/SKILL.md
  - src/components/orders/OrderFormModal.vue
  - .agents/skills/spectra-debug/SKILL.md
  - backend/src/config.ts
  - src/domain/orderValidation.js
  - src/components/orders/OrderDetailsModal.vue
  - src/stores/orders.js
tests:
  - scripts/tests/deploymentConfig.spec.js
  - backend/tests/order-attachments/order-attachments.service.test.ts
  - backend/tests/migrations/migration.test.ts
  - backend/tests/config/config.test.ts
  - backend/tests/orders/orders.repository.test.ts
  - backend/tests/orders/orders.service.test.ts
  - tests/views/AllOrders.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - backend/tests/order-attachments/order-attachments.routes.test.ts
  - tests/stores/orders.spec.js
  - backend/tests/order-attachments/order-attachments.storage.test.ts
  - tests/domain/orderValidation.spec.js
  - backend/tests/app/app.test.ts
  - tests/views/OrderList.spec.js
-->

---
### Requirement: Order responses use the stable public shape

Every order response SHALL use camelCase and SHALL include `orderNumber: string` and `productCategories: string[]`. Existing rows SHALL map a missing order number to an empty string, and database-only ownership or storage fields MUST NOT appear in the public order shape.

#### Scenario: Order row is mapped

- **WHEN** an order row contains `order_number = '114-2938471-0038'` and an empty `product_categories` array
- **THEN** the public response SHALL contain `orderNumber: '114-2938471-0038'` and `productCategories: []`

#### Scenario: Stable shape excludes internal fields

- **WHEN** an order or attachment resource is returned
- **THEN** it SHALL NOT expose `user_id`, `storage_path`, or server credentials


<!-- @trace
source: persist-order-number-and-attachments
updated: 2026-08-13
code:
  - backend/package.json
  - backend/src/modules/order-attachments/order-attachments.repository.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/app.ts
  - backend/src/modules/order-attachments/order-attachments.mapper.ts
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/shared/errors.ts
  - .agents/skills/spectra-apply/SKILL.md
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/modules/orders/orders.routes.ts
  - backend/src/modules/orders/orders.schema.ts
  - src/components/ui/Input.vue
  - backend/src/modules/order-attachments/order-attachments.storage.ts
  - backend/src/modules/order-attachments/order-attachments.service.ts
  - .agents/skills/spectra-ask/SKILL.md
  - supabase/migrations/20260813000000_persist_order_number_and_attachments.sql
  - src/views/AllOrders.vue
  - render.yaml
  - src/views/OrderList.vue
  - backend/src/modules/order-attachments/order-attachments.routes.ts
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - src/services/ordersApi.js
  - supabase/.temp/start-secrets/supabase_edge_runtime_Hakobi/main/index.ts
  - .agents/skills/spectra-audit/SKILL.md
  - src/components/orders/OrderFormModal.vue
  - .agents/skills/spectra-debug/SKILL.md
  - backend/src/config.ts
  - src/domain/orderValidation.js
  - src/components/orders/OrderDetailsModal.vue
  - src/stores/orders.js
tests:
  - scripts/tests/deploymentConfig.spec.js
  - backend/tests/order-attachments/order-attachments.service.test.ts
  - backend/tests/migrations/migration.test.ts
  - backend/tests/config/config.test.ts
  - backend/tests/orders/orders.repository.test.ts
  - backend/tests/orders/orders.service.test.ts
  - tests/views/AllOrders.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - backend/tests/order-attachments/order-attachments.routes.test.ts
  - tests/stores/orders.spec.js
  - backend/tests/order-attachments/order-attachments.storage.test.ts
  - tests/domain/orderValidation.spec.js
  - backend/tests/app/app.test.ts
  - tests/views/OrderList.spec.js
-->

---
### Requirement: Users can list only their own orders
`GET /api/orders` SHALL return only rows whose `user_id` equals the authenticated JWT subject and SHALL include a count matching the returned array.

#### Scenario: Two users have orders
- **WHEN** user A owns two orders and user B owns one order and user A calls `GET /api/orders`
- **THEN** the backend SHALL return HTTP 200 with user A's two orders and `meta.count` equal to 2, without user B's order

#### Scenario: User has no orders
- **WHEN** an authenticated user with no orders calls `GET /api/orders`
- **THEN** the backend SHALL return HTTP 200 with `{ "data": [], "meta": { "count": 0 } }`


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
### Requirement: Users can read one owned order without resource disclosure
`GET /api/orders/:id` SHALL return the requested order only when its ID and `user_id` match the authenticated caller. A missing order, another user's order, and a well-formed unknown UUID MUST produce the same not-found response.

#### Scenario: Owner reads an order
- **WHEN** the authenticated owner requests an existing order UUID
- **THEN** the backend SHALL return HTTP 200 with `{ "data": Order }`

#### Scenario: Non-owner requests an order
- **WHEN** an authenticated user requests an order UUID owned by another user
- **THEN** the backend SHALL return HTTP 404 with error code `ORDER_NOT_FOUND`


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
### Requirement: Users can partially update an owned order

An authenticated user SHALL be able to patch any supported editable order field, including `orderNumber` and an empty `productCategories` array, for an order they own. The backend SHALL reject an empty patch and invalid values, and SHALL return the same not-found response for absent and non-owned orders.

#### Scenario: Order number and categories are updated

- **WHEN** an owner patches `{ "orderNumber": "A-100", "productCategories": [] }`
- **THEN** the backend SHALL return the updated order with those confirmed values

#### Scenario: Non-owner update is concealed

- **WHEN** a user patches another user's order
- **THEN** the backend SHALL return HTTP 404 with code `RESOURCE_NOT_FOUND`


<!-- @trace
source: persist-order-number-and-attachments
updated: 2026-08-13
code:
  - backend/package.json
  - backend/src/modules/order-attachments/order-attachments.repository.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/app.ts
  - backend/src/modules/order-attachments/order-attachments.mapper.ts
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/shared/errors.ts
  - .agents/skills/spectra-apply/SKILL.md
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/modules/orders/orders.routes.ts
  - backend/src/modules/orders/orders.schema.ts
  - src/components/ui/Input.vue
  - backend/src/modules/order-attachments/order-attachments.storage.ts
  - backend/src/modules/order-attachments/order-attachments.service.ts
  - .agents/skills/spectra-ask/SKILL.md
  - supabase/migrations/20260813000000_persist_order_number_and_attachments.sql
  - src/views/AllOrders.vue
  - render.yaml
  - src/views/OrderList.vue
  - backend/src/modules/order-attachments/order-attachments.routes.ts
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - src/services/ordersApi.js
  - supabase/.temp/start-secrets/supabase_edge_runtime_Hakobi/main/index.ts
  - .agents/skills/spectra-audit/SKILL.md
  - src/components/orders/OrderFormModal.vue
  - .agents/skills/spectra-debug/SKILL.md
  - backend/src/config.ts
  - src/domain/orderValidation.js
  - src/components/orders/OrderDetailsModal.vue
  - src/stores/orders.js
tests:
  - scripts/tests/deploymentConfig.spec.js
  - backend/tests/order-attachments/order-attachments.service.test.ts
  - backend/tests/migrations/migration.test.ts
  - backend/tests/config/config.test.ts
  - backend/tests/orders/orders.repository.test.ts
  - backend/tests/orders/orders.service.test.ts
  - tests/views/AllOrders.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - backend/tests/order-attachments/order-attachments.routes.test.ts
  - tests/stores/orders.spec.js
  - backend/tests/order-attachments/order-attachments.storage.test.ts
  - tests/domain/orderValidation.spec.js
  - backend/tests/app/app.test.ts
  - tests/views/OrderList.spec.js
-->

---
### Requirement: Users can delete an owned order
`DELETE /api/orders/:id` SHALL delete only a row whose ID and `user_id` match the authenticated caller and SHALL not reveal whether a non-owned row exists.

#### Scenario: Owner deletes an order
- **WHEN** an owner deletes an existing order UUID
- **THEN** the backend SHALL delete the row and return HTTP 204 with no response body

#### Scenario: Delete targets missing or non-owned order
- **WHEN** a caller deletes an unknown UUID or another user's order UUID
- **THEN** the backend SHALL return HTTP 404 with error code `ORDER_NOT_FOUND`


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
### Requirement: Invalid request structure uses a consistent error contract
Invalid path parameters and request bodies MUST return HTTP 400 with `{ "error": { "code": "VALIDATION_ERROR", "message": string, "details"?: unknown } }`. Unexpected server or database failures MUST return HTTP 500 with code `INTERNAL_ERROR` and MUST NOT expose SQL, stack traces, credentials, or internal hostnames.

#### Scenario: Malformed order identifier
- **WHEN** a caller uses a non-UUID `id` path parameter
- **THEN** the backend SHALL return HTTP 400 with error code `VALIDATION_ERROR`

#### Scenario: Database operation fails unexpectedly
- **WHEN** the database returns an unexpected operational error
- **THEN** the backend SHALL return HTTP 500 with error code `INTERNAL_ERROR` and a generic message


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
### Requirement: Database schema enforces ownership and query performance

The database SHALL keep orders protected by row-level ownership policies and indexed owner queries. It SHALL store `order_number` as non-null text defaulting to empty, SHALL allow an empty `product_categories` array, and SHALL constrain every non-empty category value to `merch`, `book`, or `other`.

#### Scenario: Empty categories satisfy database constraints

- **WHEN** an owned order row is inserted with `product_categories = '{}'`
- **THEN** the database SHALL accept the row

#### Scenario: Unsupported category violates constraints

- **WHEN** a row includes a product category outside the supported set
- **THEN** the database SHALL reject the row


<!-- @trace
source: persist-order-number-and-attachments
updated: 2026-08-13
code:
  - backend/package.json
  - backend/src/modules/order-attachments/order-attachments.repository.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/app.ts
  - backend/src/modules/order-attachments/order-attachments.mapper.ts
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/shared/errors.ts
  - .agents/skills/spectra-apply/SKILL.md
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/modules/orders/orders.routes.ts
  - backend/src/modules/orders/orders.schema.ts
  - src/components/ui/Input.vue
  - backend/src/modules/order-attachments/order-attachments.storage.ts
  - backend/src/modules/order-attachments/order-attachments.service.ts
  - .agents/skills/spectra-ask/SKILL.md
  - supabase/migrations/20260813000000_persist_order_number_and_attachments.sql
  - src/views/AllOrders.vue
  - render.yaml
  - src/views/OrderList.vue
  - backend/src/modules/order-attachments/order-attachments.routes.ts
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - src/services/ordersApi.js
  - supabase/.temp/start-secrets/supabase_edge_runtime_Hakobi/main/index.ts
  - .agents/skills/spectra-audit/SKILL.md
  - src/components/orders/OrderFormModal.vue
  - .agents/skills/spectra-debug/SKILL.md
  - backend/src/config.ts
  - src/domain/orderValidation.js
  - src/components/orders/OrderDetailsModal.vue
  - src/stores/orders.js
tests:
  - scripts/tests/deploymentConfig.spec.js
  - backend/tests/order-attachments/order-attachments.service.test.ts
  - backend/tests/migrations/migration.test.ts
  - backend/tests/config/config.test.ts
  - backend/tests/orders/orders.repository.test.ts
  - backend/tests/orders/orders.service.test.ts
  - tests/views/AllOrders.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - backend/tests/order-attachments/order-attachments.routes.test.ts
  - tests/stores/orders.spec.js
  - backend/tests/order-attachments/order-attachments.storage.test.ts
  - tests/domain/orderValidation.spec.js
  - backend/tests/app/app.test.ts
  - tests/views/OrderList.spec.js
-->

---
### Requirement: Backend lifecycle and configuration are deterministic
The backend MUST validate required environment settings before listening, MUST close its HTTP server and PostgreSQL pool during shutdown, and MUST provide build, typecheck, test, development, and production start scripts under the server package.

#### Scenario: Required configuration is missing
- **WHEN** the backend starts without `SUPABASE_URL`, `SUPABASE_DB_URL`, or `CORS_ORIGIN`
- **THEN** startup SHALL fail with a non-zero status and SHALL not print database credentials

#### Scenario: Backend receives a shutdown signal
- **WHEN** the running backend receives SIGINT or SIGTERM
- **THEN** it SHALL stop accepting requests and close the PostgreSQL pool before process exit

##### Example: SIGTERM is handled
- **GIVEN** the HTTP server and PostgreSQL pool are running
- **WHEN** the process receives `SIGTERM`
- **THEN** Fastify SHALL close and the pool `end` method SHALL complete before exit

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
### Requirement: Logistics fields persist through the stable order API
The order API SHALL accept optional `shippingMethod` and `trackingNumber` strings on create and patch, SHALL default omitted create values to empty strings, SHALL allow existing values to be cleared to empty strings, and SHALL return both camelCase fields in every order response.

#### Scenario: Logistics values round-trip through create
- **WHEN** an authenticated user creates an order with `shippingMethod` equal to `日本郵便 EMS` and `trackingNumber` equal to `EN123456789JP`
- **THEN** the database SHALL persist the corresponding snake_case values and the HTTP 201 response SHALL return the exact camelCase values

#### Scenario: Omitted logistics values use empty defaults
- **WHEN** an authenticated user creates an order without either logistics field
- **THEN** the stored and returned `shippingMethod` and `trackingNumber` values SHALL both be empty strings

#### Scenario: Logistics values are cleared by patch
- **WHEN** an owner patches both logistics fields to empty strings
- **THEN** the HTTP 200 response and subsequent reads SHALL return empty strings for both fields

---
### Requirement: Payment persistence is binary
The database and public order API SHALL represent payment only with `amount`, `currency`, and boolean `isPaid`. The database MUST NOT retain `balance_due` or `payment_due_date`, and create or patch bodies containing `balanceDue` or `paymentDueDate` MUST be rejected as unknown fields.

#### Scenario: Forward migration removes legacy payment detail columns
- **WHEN** repository migrations are applied to a database containing `balance_due` and `payment_due_date`
- **THEN** both columns SHALL be removed while `amount`, `currency`, and `is_paid` remain available

#### Scenario: Legacy payment detail request is rejected
- **WHEN** an authenticated caller submits create or patch input containing `balanceDue` or `paymentDueDate`
- **THEN** the backend SHALL return HTTP 400 with error code `VALIDATION_ERROR` and SHALL NOT change an order

#### Scenario: Order response excludes legacy payment detail fields
- **WHEN** the API returns an order after the removal migration
- **THEN** the response SHALL contain `amount`, `currency`, and `isPaid` and SHALL omit `balanceDue` and `paymentDueDate`