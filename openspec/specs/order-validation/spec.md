# order-validation Specification

## Purpose

TBD - created by archiving change 'centralize-order-validation'. Update Purpose after archive.

## Requirements

### Requirement: Order validation rules have a single shared source

The system SHALL define the order name, amount, and product category validation rules in exactly one shared module, and SHALL apply that same module from both the order create/edit form and the orders store's write operations, so that no entry point defines its own copy of these rules.

#### Scenario: Form and store apply identical rules
- **WHEN** the same invalid order data (empty name, non-positive amount, or empty product category list) is evaluated once through the order create/edit form and once through a direct call to the orders store's write operation
- **THEN** both SHALL reject the data using the same validation outcome and the same error identification per field


<!-- @trace
source: centralize-order-validation
updated: 2026-07-15
code:
  - src/domain/orderValidation.js
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: Orders store rejects invalid data on write

The system SHALL validate order data against the shared validation rules before writing it into the orders store, and SHALL NOT persist the write when validation fails.

#### Scenario: Adding an order with invalid data is rejected
- **WHEN** the orders store's add operation is called with data that has an empty name, a non-positive amount, or an empty product category list
- **THEN** the system SHALL NOT add a new order to the store's order list, and SHALL return a value indicating the write did not occur

#### Scenario: Updating an order with invalid data is rejected
- **WHEN** the orders store's update operation is called with data that, once merged with the existing order, has an empty name, a non-positive amount, or an empty product category list
- **THEN** the system SHALL NOT modify the existing order's stored data, and SHALL return a value indicating the write did not occur

#### Scenario: Adding an order with valid data succeeds
- **WHEN** the orders store's add operation is called with a non-empty name, a positive amount, and at least one product category
- **THEN** the system SHALL add the new order to the store's order list and SHALL return the created order


<!-- @trace
source: centralize-order-validation
updated: 2026-07-15
code:
  - src/domain/orderValidation.js
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: Order name and amount are normalized before validation and storage

The system SHALL trim leading and trailing whitespace from the order name and SHALL coerce the order amount to a number before validating and storing order data, regardless of which entry point supplied the data.

#### Scenario: Name with surrounding whitespace is trimmed before storage
- **WHEN** order data is submitted with a name containing leading or trailing whitespace, such as `"  Widget  "`
- **THEN** the stored order's name SHALL be `"Widget"`, with the surrounding whitespace removed

##### Example: normalization applied consistently
| Input name | Input amount | Stored name | Stored amount |
| --- | --- | --- | --- |
| `"  Widget  "` | `"10"` | `"Widget"` | `10` |
| `"Gadget"` | `10` | `"Gadget"` | `10` |


<!-- @trace
source: centralize-order-validation
updated: 2026-07-15
code:
  - src/domain/orderValidation.js
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: Order form displays field-specific errors sourced from the shared validator

The system SHALL derive the order create/edit form's field-level error messages (for name, amount, and product category) from the shared validation module's output, rather than from validation logic defined inside the form component.

#### Scenario: Invalid submission shows the shared validator's error messages
- **WHEN** a user submits the order create/edit form with an empty name, a non-positive amount, or no product category selected
- **THEN** the form SHALL display the error message produced by the shared validation module for each invalid field, and SHALL NOT submit the order

<!-- @trace
source: centralize-order-validation
updated: 2026-07-15
code:
  - src/domain/orderValidation.js
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/views/__tests__/OrderList.spec.js
-->