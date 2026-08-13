# order-attachments Specification

## Purpose

TBD - created by archiving change 'persist-order-number-and-attachments'. Update Purpose after archive.

## Requirements

### Requirement: Owned orders support private attachments

The system SHALL store order attachments in a private Supabase Storage bucket and SHALL persist attachment metadata separately from order rows. Every attachment operation MUST derive the caller identity from authentication and MUST verify ownership of the parent order before accessing Storage.

#### Scenario: Owner uploads an allowed attachment

- **GIVEN** an authenticated user owns an order with fewer than 10 attachments
- **WHEN** the user uploads one PDF, JPEG, or PNG file between 1 byte and 10,485,760 bytes
- **THEN** the backend SHALL store the object under a server-generated path
- **AND** it SHALL return HTTP 201 with public attachment metadata that excludes the storage path

#### Scenario: Another user targets an attachment

- **WHEN** an authenticated user attempts to list, download, or delete an attachment belonging to another user's order
- **THEN** the backend SHALL return HTTP 404 with code `RESOURCE_NOT_FOUND`
- **AND** it SHALL NOT reveal whether the order, attachment, or object exists


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
### Requirement: Attachment limits are enforced at trusted boundaries

The backend and database SHALL allow only `application/pdf`, `image/jpeg`, and `image/png`, SHALL reject empty files and files larger than 10,485,760 bytes, and SHALL prevent an order from owning more than 10 attachment metadata rows even under concurrent requests.

#### Scenario: Invalid file type is rejected

- **WHEN** a user uploads `notes.txt` with MIME type `text/plain`
- **THEN** the backend SHALL return HTTP 400 with code `ATTACHMENT_TYPE_NOT_ALLOWED`
- **AND** it SHALL create neither a Storage object nor metadata

#### Scenario: Oversized file is rejected

- **WHEN** a file exceeds 10,485,760 bytes
- **THEN** the backend SHALL terminate the upload and return HTTP 413 with code `ATTACHMENT_TOO_LARGE`

#### Scenario: Concurrent requests exceed the count limit

- **GIVEN** an order has nine attachment metadata rows
- **WHEN** two valid uploads race to insert metadata
- **THEN** exactly one insert SHALL succeed
- **AND** the other SHALL return HTTP 409 with code `ATTACHMENT_LIMIT_REACHED`


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
### Requirement: Attachment lifecycle failures remain recoverable

The attachment service SHALL compensate for a metadata failure after Storage upload and SHALL retain metadata when Storage deletion fails. Creating an order MUST NOT be rolled back because one or more subsequent attachment uploads fail.

#### Scenario: Metadata insert fails after upload

- **WHEN** Storage upload succeeds and metadata insert fails
- **THEN** the service SHALL attempt to remove the newly uploaded object
- **AND** it SHALL return a server error without reporting the attachment as created

#### Scenario: Storage deletion fails

- **WHEN** an owner deletes an attachment and Storage removal fails
- **THEN** the backend SHALL retain the attachment metadata
- **AND** it SHALL return an error that permits a later retry

#### Scenario: Some create-form uploads fail

- **GIVEN** the order create request succeeds
- **WHEN** at least one selected attachment upload succeeds and at least one fails
- **THEN** the created order SHALL remain in the confirmed order collection
- **AND** the UI SHALL show successful attachments and identify each failed filename with a retry action


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
### Requirement: Owners can list download and delete attachment resources

The API SHALL expose owned attachment list, upload, short-lived signed download, and delete operations without exposing permanent public URLs or trusted storage paths.

#### Scenario: Owner downloads an attachment

- **WHEN** an owner requests an attachment download
- **THEN** the backend SHALL redirect to a short-lived signed URL for that private object

#### Scenario: Owner deletes an attachment

- **WHEN** Storage removal and metadata deletion both succeed
- **THEN** the backend SHALL return HTTP 204
- **AND** a subsequent owned list SHALL omit the attachment

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