## ADDED Requirements

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
