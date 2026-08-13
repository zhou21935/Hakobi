## MODIFIED Requirements

### Requirement: Orders are persisted with validated ownership and values

The database SHALL persist orders with a UUID primary key, owning `user_id`, constrained category, status and currency, positive amount, an optional validated product category array, and an order number of at most 200 characters defaulting to an empty string. The API MUST assign ownership from the authenticated caller and MUST NOT accept caller-selected ownership.

#### Scenario: Valid order with no product categories is created

- **WHEN** an authenticated user submits category `agent`, name `Book`, amount `120.50`, `productCategories: []`, and order number `114-2938471-0038`
- **THEN** the backend SHALL persist an owned order and return HTTP 201 with the order number and empty category array

#### Scenario: Invalid order is rejected

- **WHEN** create input has a blank name, non-positive amount, unsupported category, status, currency, unsupported product category, or order number longer than 200 characters
- **THEN** the backend SHALL return HTTP 400 with code `VALIDATION_ERROR`
- **AND** it SHALL NOT persist a row

### Requirement: Order responses use the stable public shape

Every order response SHALL use camelCase and SHALL include `orderNumber: string` and `productCategories: string[]`. Existing rows SHALL map a missing order number to an empty string, and database-only ownership or storage fields MUST NOT appear in the public order shape.

#### Scenario: Order row is mapped

- **WHEN** an order row contains `order_number = '114-2938471-0038'` and an empty `product_categories` array
- **THEN** the public response SHALL contain `orderNumber: '114-2938471-0038'` and `productCategories: []`

#### Scenario: Stable shape excludes internal fields

- **WHEN** an order or attachment resource is returned
- **THEN** it SHALL NOT expose `user_id`, `storage_path`, or server credentials

### Requirement: Users can partially update an owned order

An authenticated user SHALL be able to patch any supported editable order field, including `orderNumber` and an empty `productCategories` array, for an order they own. The backend SHALL reject an empty patch and invalid values, and SHALL return the same not-found response for absent and non-owned orders.

#### Scenario: Order number and categories are updated

- **WHEN** an owner patches `{ "orderNumber": "A-100", "productCategories": [] }`
- **THEN** the backend SHALL return the updated order with those confirmed values

#### Scenario: Non-owner update is concealed

- **WHEN** a user patches another user's order
- **THEN** the backend SHALL return HTTP 404 with code `RESOURCE_NOT_FOUND`

### Requirement: Database schema enforces ownership and query performance

The database SHALL keep orders protected by row-level ownership policies and indexed owner queries. It SHALL store `order_number` as non-null text defaulting to empty, SHALL allow an empty `product_categories` array, and SHALL constrain every non-empty category value to `merch`, `book`, or `other`.

#### Scenario: Empty categories satisfy database constraints

- **WHEN** an owned order row is inserted with `product_categories = '{}'`
- **THEN** the database SHALL accept the row

#### Scenario: Unsupported category violates constraints

- **WHEN** a row includes a product category outside the supported set
- **THEN** the database SHALL reject the row
