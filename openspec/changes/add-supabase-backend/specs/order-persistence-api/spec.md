## ADDED Requirements

### Requirement: Orders are persisted with validated ownership and values
The database SHALL persist orders with a UUID primary key, an owning `user_id` referencing `auth.users`, constrained category, status, currency, positive amount, non-empty allowed product categories, timestamps, and documented defaults. The API MUST assign ownership from the authenticated caller and MUST NOT accept caller-selected ownership.

#### Scenario: Valid order is created
- **WHEN** an authenticated user submits category `agent`, name `Book`, amount `120.50`, and product categories `["book"]`
- **THEN** the backend SHALL persist an order owned by that user's JWT subject and return HTTP 201 with the created camelCase order

#### Scenario: Invalid order is rejected
- **WHEN** create input has a blank name, non-positive amount, unsupported category, status, currency, or an empty or unsupported product category list
- **THEN** the backend SHALL return HTTP 400 with error code `VALIDATION_ERROR` and SHALL NOT persist a row

### Requirement: Order responses use the stable public shape
The API SHALL map PostgreSQL snake_case rows to camelCase JSON and SHALL return every documented order field while excluding `userId`. Date-only values SHALL be `YYYY-MM-DD` or null, timestamps SHALL be ISO 8601 strings, and numeric amounts SHALL be JSON numbers.

#### Scenario: Database row is mapped to API JSON
- **WHEN** a stored row contains `product_url`, `is_paid`, `product_categories`, `created_at`, and `user_id`
- **THEN** the response SHALL contain `productUrl`, `isPaid`, `productCategories`, and `createdAt`, SHALL omit `userId`, and SHALL not expose snake_case keys

### Requirement: Users can list only their own orders
`GET /api/orders` SHALL return only rows whose `user_id` equals the authenticated JWT subject and SHALL include a count matching the returned array.

#### Scenario: Two users have orders
- **WHEN** user A owns two orders and user B owns one order and user A calls `GET /api/orders`
- **THEN** the backend SHALL return HTTP 200 with user A's two orders and `meta.count` equal to 2, without user B's order

#### Scenario: User has no orders
- **WHEN** an authenticated user with no orders calls `GET /api/orders`
- **THEN** the backend SHALL return HTTP 200 with `{ "data": [], "meta": { "count": 0 } }`

### Requirement: Users can read one owned order without resource disclosure
`GET /api/orders/:id` SHALL return the requested order only when its ID and `user_id` match the authenticated caller. A missing order, another user's order, and a well-formed unknown UUID MUST produce the same not-found response.

#### Scenario: Owner reads an order
- **WHEN** the authenticated owner requests an existing order UUID
- **THEN** the backend SHALL return HTTP 200 with `{ "data": Order }`

#### Scenario: Non-owner requests an order
- **WHEN** an authenticated user requests an order UUID owned by another user
- **THEN** the backend SHALL return HTTP 404 with error code `ORDER_NOT_FOUND`

### Requirement: Users can partially update an owned order
`PATCH /api/orders/:id` SHALL accept at least one editable order field, reject unknown and immutable fields, validate the complete resulting order, and update only a row whose ID and `user_id` match the authenticated caller.

#### Scenario: Owner updates one field
- **WHEN** an owner patches an existing order with `{ "isPaid": true }`
- **THEN** the backend SHALL retain all other values, update the timestamp, and return HTTP 200 with the updated order

#### Scenario: Empty or immutable patch
- **WHEN** a caller submits an empty patch or includes `id`, `userId`, `createdAt`, or `updatedAt`
- **THEN** the backend SHALL return HTTP 400 with error code `VALIDATION_ERROR` and SHALL NOT change the order

#### Scenario: Update targets another user's order
- **WHEN** an authenticated user patches an order owned by another user
- **THEN** the backend SHALL return HTTP 404 with error code `ORDER_NOT_FOUND` and SHALL NOT change the row

### Requirement: Users can delete an owned order
`DELETE /api/orders/:id` SHALL delete only a row whose ID and `user_id` match the authenticated caller and SHALL not reveal whether a non-owned row exists.

#### Scenario: Owner deletes an order
- **WHEN** an owner deletes an existing order UUID
- **THEN** the backend SHALL delete the row and return HTTP 204 with no response body

#### Scenario: Delete targets missing or non-owned order
- **WHEN** a caller deletes an unknown UUID or another user's order UUID
- **THEN** the backend SHALL return HTTP 404 with error code `ORDER_NOT_FOUND`

### Requirement: Invalid request structure uses a consistent error contract
Invalid path parameters and request bodies MUST return HTTP 400 with `{ "error": { "code": "VALIDATION_ERROR", "message": string, "details"?: unknown } }`. Unexpected server or database failures MUST return HTTP 500 with code `INTERNAL_ERROR` and MUST NOT expose SQL, stack traces, credentials, or internal hostnames.

#### Scenario: Malformed order identifier
- **WHEN** a caller uses a non-UUID `id` path parameter
- **THEN** the backend SHALL return HTTP 400 with error code `VALIDATION_ERROR`

#### Scenario: Database operation fails unexpectedly
- **WHEN** the database returns an unexpected operational error
- **THEN** the backend SHALL return HTTP 500 with error code `INTERNAL_ERROR` and a generic message

### Requirement: Database schema enforces ownership and query performance
The migration MUST create `public.orders`, its constraints, owner-oriented indexes, automatic `updated_at` maintenance, enabled Row Level Security, and authenticated owner policies for select, insert, update, and delete.

#### Scenario: Migration contract is inspected
- **WHEN** the migration is validated
- **THEN** it SHALL contain a `user_id` foreign key with cascade deletion, an index beginning with `user_id`, data checks, an updated timestamp trigger, enabled RLS, and four policies comparing the authenticated user to row ownership

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

