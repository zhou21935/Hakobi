## MODIFIED Requirements

### Requirement: The order store loads the authenticated user's remote orders
The frontend application SHALL fetch `GET /api/orders` once per authenticated session before any protected view relies on order projections, SHALL replace its in-memory active order collection with the returned `data` array, and SHALL NOT use persisted localStorage orders as an authoritative source. Logging out or receiving HTTP 401 MUST reset initialization so a later authenticated session performs a new initial load.

#### Scenario: Dashboard is the first protected view
- **WHEN** an authenticated application starts at `/` and the backend returns two owned active orders
- **THEN** the store SHALL expose those two orders, mark initial loading complete, and the dashboard SHALL compute its totals from them

#### Scenario: Navigation does not duplicate a completed initial load
- **WHEN** initial loading succeeded and the user navigates among the dashboard, all-orders view, and category views
- **THEN** the frontend SHALL NOT issue another initial `GET /api/orders` request during that authenticated session

#### Scenario: Initial load fails
- **WHEN** the initial orders request fails with a non-authentication error
- **THEN** the store SHALL expose an actionable load error, preserve an empty or previously confirmed collection, and allow the user to retry

#### Scenario: A new session reloads owner data
- **WHEN** the user signs out and a user subsequently signs in
- **THEN** the frontend SHALL clear the previous active collection and SHALL perform a new initial orders request

### Requirement: Order mutations are confirmed by the backend
Create and update operations MUST validate input locally, send the existing order API JSON shape, and change the confirmed in-memory collection only from a successful backend response. A delayed delete SHALL temporarily remove the order during its undo window, SHALL finalize through the existing delete API after the deadline, and SHALL restore confirmed state if that request fails.

#### Scenario: Create succeeds
- **WHEN** valid order input receives HTTP 201 with a created order containing UUID `2b4df07c-4738-4f2e-8f11-8e67687e1057`
- **THEN** the store SHALL add exactly that returned order to its active collection

#### Scenario: Update fails
- **WHEN** an update request receives an error response
- **THEN** the store SHALL retain the previously confirmed order and expose the mutation error

#### Scenario: Delete succeeds
- **WHEN** deletion of an existing active order receives HTTP 204
- **THEN** the store SHALL keep that order absent from its active collection

#### Scenario: Delete fails
- **WHEN** deletion receives an error response
- **THEN** the store SHALL retain the active order and expose the mutation error
