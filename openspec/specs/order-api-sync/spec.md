# order-api-sync Specification

## Purpose

TBD - created by archiving change 'order-supabase-integration'. Update Purpose after archive.

## Requirements

### Requirement: The order store loads the authenticated user's remote orders
The order store SHALL fetch `GET /api/orders` after authentication, SHALL replace its in-memory order collection with the returned `data` array, and SHALL NOT use persisted localStorage orders as an authoritative source.

#### Scenario: Initial load succeeds
- **WHEN** an authenticated application starts and the backend returns two owned orders
- **THEN** the store SHALL expose those two orders and mark initial loading complete

#### Scenario: Initial load fails
- **WHEN** the initial orders request fails with a non-authentication error
- **THEN** the store SHALL expose an actionable load error, preserve an empty or previously confirmed collection, and allow the user to retry

---
### Requirement: Order mutations are confirmed by the backend
Create and update operations MUST validate input locally, send the existing order API JSON shape, and change the confirmed in-memory collection only from a successful backend response. Delete MUST remove an order only after the backend returns HTTP 204.

#### Scenario: Create succeeds
- **WHEN** valid order input receives HTTP 201 with a created order containing UUID `2b4df07c-4738-4f2e-8f11-8e67687e1057`
- **THEN** the store SHALL add exactly that returned order to its collection

#### Scenario: Update fails
- **WHEN** an update request receives an error response
- **THEN** the store SHALL retain the previously confirmed order and expose the mutation error

#### Scenario: Delete succeeds
- **WHEN** deletion of an existing order receives HTTP 204
- **THEN** the store SHALL remove that order from its collection

#### Scenario: Delete fails
- **WHEN** deletion receives an error response
- **THEN** the store SHALL retain the order and expose the mutation error

---
### Requirement: Order views expose asynchronous operation state
Order views MUST distinguish initial loading, empty success, mutation-in-progress, and request failure states. Controls that would duplicate an active mutation SHALL be disabled until that mutation settles.

#### Scenario: Initial request is pending
- **WHEN** the order store is loading its initial collection
- **THEN** the view SHALL display a loading state and SHALL NOT display the empty-orders message

#### Scenario: Mutation is pending
- **WHEN** a create, update, or delete request is in progress
- **THEN** the relevant submit or confirmation control SHALL be disabled and repeated submission SHALL NOT issue another request

#### Scenario: Request fails
- **WHEN** an order request fails after authentication
- **THEN** the view SHALL display a user-readable error and provide retry for initial-load failures

---
### Requirement: Existing order projections remain client-side
Category filtering, status filtering, keyword search, sorting, counts, and aggregate statistics SHALL operate over the remotely confirmed in-memory collection and SHALL retain their current observable results.

#### Scenario: Remote collection is filtered and sorted
- **WHEN** the loaded collection contains matching and non-matching categories, statuses, names, notes, dates, and amounts
- **THEN** existing filter, search, sort, count, and statistics selectors SHALL compute from the loaded collection without additional API requests

---
### Requirement: API errors use one frontend contract
The API client SHALL normalize non-success responses, invalid success payloads, and network failures into an error containing a stable frontend code and user-safe message. An HTTP 401 response MUST invalidate the current authenticated flow and direct the user to sign in again.

#### Scenario: Backend returns a structured validation error
- **WHEN** the backend responds with HTTP 400 and `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid order" } }`
- **THEN** the client SHALL expose code `VALIDATION_ERROR` and message `Invalid order` without discarding the confirmed collection

#### Scenario: Backend returns unauthorized
- **WHEN** an orders request responds with HTTP 401
- **THEN** the frontend SHALL clear user-scoped order state and navigate to the login view
