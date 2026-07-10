# preorder-orders Specification

## Purpose

TBD - created by archiving change 'build-preorder-feature'. Update Purpose after archive.

## Requirements

### Requirement: User can create a preorder order with required field validation

The system SHALL allow a user to create a new order in the preorder category via a form, and SHALL require a non-empty product name and a positive amount before the order is created.

#### Scenario: Valid submission creates an order

- **WHEN** a user submits the order form with a non-empty product name and an amount greater than zero
- **THEN** the system SHALL create a new order with status `CONSOLIDATING` by default and SHALL add it to the order list

#### Scenario: Empty product name blocks submission

- **WHEN** a user submits the order form with an empty product name
- **THEN** the system SHALL display a validation error on the product name field and SHALL NOT create the order

#### Scenario: Non-positive amount blocks submission

- **WHEN** a user submits the order form with an amount of zero or less
- **THEN** the system SHALL display a validation error on the amount field and SHALL NOT create the order


<!-- @trace
source: narrow-order-status-add-paid-checkbox
updated: 2026-07-11
code:
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
  - src/components/ui/Checkbox.vue
  - src/views/Dashboard.vue
-->

---
### Requirement: User can edit an existing order using the same form
The system SHALL allow a user to edit an existing order's fields using the same form component used for creation, pre-filled with the order's current values.

#### Scenario: Editing updates the existing order
- **WHEN** a user opens the edit form for an order, changes a field, and submits
- **THEN** the system SHALL update that order's data and SHALL NOT create a duplicate order


<!-- @trace
source: build-preorder-feature
updated: 2026-07-10
code:
  - src/components/AppSidebar.vue
  - src/views/AllOrders.vue
  - src/components/orders/OrderFormModal.vue
  - src/components/orders/OrderCard.vue
  - src/main.js
  - src/views/OrderList.vue
  - src/router/index.js
  - src/components/ui/Select.vue
  - src/views/UiShowcase.vue
  - src/views/Dashboard.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/stores/orders.js
-->

---
### Requirement: User must confirm before an order is deleted
The system SHALL require explicit confirmation before permanently deleting an order.

#### Scenario: Confirming deletion removes the order
- **WHEN** a user clicks delete on an order and confirms the deletion in the confirmation dialog
- **THEN** the system SHALL remove the order from the list and from all status counts

#### Scenario: Cancelling the confirmation keeps the order
- **WHEN** a user clicks delete on an order and then cancels the confirmation dialog
- **THEN** the system SHALL leave the order unchanged in the list


<!-- @trace
source: build-preorder-feature
updated: 2026-07-10
code:
  - src/components/AppSidebar.vue
  - src/views/AllOrders.vue
  - src/components/orders/OrderFormModal.vue
  - src/components/orders/OrderCard.vue
  - src/main.js
  - src/views/OrderList.vue
  - src/router/index.js
  - src/components/ui/Select.vue
  - src/views/UiShowcase.vue
  - src/views/Dashboard.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/stores/orders.js
-->

---
### Requirement: Orders progress through a 4-stage shipment status lifecycle

The system SHALL support exactly 4 order statuses representing the shipment lifecycle: consolidating, in transit, arrived, and completed. Payment status SHALL be tracked separately via a boolean `isPaid` field, not as part of this status lifecycle.

#### Scenario: Default status on creation

- **WHEN** a new order is created without an explicit status
- **THEN** the order SHALL be assigned the consolidating status

#### Scenario: Status can be changed via the edit form

- **WHEN** a user edits an order and selects a different status from the 4 available statuses
- **THEN** the order SHALL be updated to the newly selected status

#### Scenario: Payment can be marked independently of shipment status

- **WHEN** a user edits an order and toggles the "已付款" (paid) checkbox
- **THEN** the order's `isPaid` boolean field SHALL be updated accordingly, without changing the order's shipment status


<!-- @trace
source: narrow-order-status-add-paid-checkbox
updated: 2026-07-11
code:
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
  - src/components/ui/Checkbox.vue
  - src/views/Dashboard.vue
-->

---
### Requirement: Status filter tabs show per-status counts and filter the order list

The system SHALL display a row of filter tabs (one for "all" plus one per status) each showing the count of orders in that status, and SHALL filter the visible order list to the selected status when a tab is clicked.

#### Scenario: Tab counts reflect current data

- **WHEN** the order list contains orders in various statuses
- **THEN** each status tab SHALL display the count of orders currently in that status

##### Example: three orders across three statuses

- **GIVEN** three preorder orders with statuses `CONSOLIDATING`, `IN_TRANSIT`, `COMPLETED` (one each)
- **WHEN** the status filter tabs are rendered
- **THEN** the "all" tab SHALL show 3, the consolidating tab SHALL show 1, the in-transit tab SHALL show 1, the completed tab SHALL show 1, and the arrived tab SHALL show 0

#### Scenario: Selecting a status tab filters the list

- **WHEN** a user clicks the "arrived" tab
- **THEN** the order list SHALL show only orders with the arrived status


<!-- @trace
source: narrow-order-status-add-paid-checkbox
updated: 2026-07-11
code:
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
  - src/components/ui/Checkbox.vue
  - src/views/Dashboard.vue
-->

---
### Requirement: Dashboard shows order count summaries

The system SHALL display, on the dashboard, the total order count and the counts of orders in the consolidating, in-transit, and completed statuses.

#### Scenario: Dashboard numbers match underlying data

- **WHEN** the dashboard is rendered
- **THEN** the displayed total count SHALL equal the number of orders in the store, and the three status counts SHALL equal the corresponding values from the status filter tabs


<!-- @trace
source: narrow-order-status-add-paid-checkbox
updated: 2026-07-11
code:
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
  - src/components/ui/Checkbox.vue
  - src/views/Dashboard.vue
-->

---
### Requirement: All-orders view lists orders across every category
The system SHALL provide a view that lists orders from all categories together, independent of the per-category views, and SHALL support the same status filtering as a per-category view.

#### Scenario: All-orders view includes preorder orders
- **WHEN** a user navigates to the all-orders view
- **THEN** the system SHALL display every order regardless of category, including preorder orders


<!-- @trace
source: build-preorder-feature
updated: 2026-07-10
code:
  - src/components/AppSidebar.vue
  - src/views/AllOrders.vue
  - src/components/orders/OrderFormModal.vue
  - src/components/orders/OrderCard.vue
  - src/main.js
  - src/views/OrderList.vue
  - src/router/index.js
  - src/components/ui/Select.vue
  - src/views/UiShowcase.vue
  - src/views/Dashboard.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/stores/orders.js
-->

---
### Requirement: Orders record an amount in one of four supported currencies without conversion
The system SHALL allow an order's amount to be recorded in one of TWD, USD, KRW, or JPY, and SHALL display the amount together with its currency without converting between currencies.

#### Scenario: Amount displays with its recorded currency
- **WHEN** an order with amount 320 and currency USD is displayed
- **THEN** the displayed amount SHALL show both the value 320 and an indicator of the USD currency, unconverted


<!-- @trace
source: build-preorder-feature
updated: 2026-07-10
code:
  - src/components/AppSidebar.vue
  - src/views/AllOrders.vue
  - src/components/orders/OrderFormModal.vue
  - src/components/orders/OrderCard.vue
  - src/main.js
  - src/views/OrderList.vue
  - src/router/index.js
  - src/components/ui/Select.vue
  - src/views/UiShowcase.vue
  - src/views/Dashboard.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/stores/orders.js
-->

---
### Requirement: Orders can be flagged as sent to a consolidation warehouse
The system SHALL allow a user to mark an order as sent to a consolidation warehouse via a boolean flag, defaulting to not sent.

#### Scenario: New order defaults to not consolidated
- **WHEN** a new order is created without specifying the consolidation flag
- **THEN** the order's consolidation flag SHALL default to false

<!-- @trace
source: build-preorder-feature
updated: 2026-07-10
code:
  - src/components/AppSidebar.vue
  - src/views/AllOrders.vue
  - src/components/orders/OrderFormModal.vue
  - src/components/orders/OrderCard.vue
  - src/main.js
  - src/views/OrderList.vue
  - src/router/index.js
  - src/components/ui/Select.vue
  - src/views/UiShowcase.vue
  - src/views/Dashboard.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/stores/orders.js
-->

---
### Requirement: Order payment status is tracked as an independent boolean field

The system SHALL track whether an order has been paid via a boolean `isPaid` field, independent of the order's shipment status, defaulting to `false` for new orders.

#### Scenario: New order defaults to unpaid

- **WHEN** a new order is created without specifying `isPaid`
- **THEN** the order's `isPaid` field SHALL default to `false`

#### Scenario: Marking an order as paid via the edit form

- **WHEN** a user edits an order, checks the "已付款" checkbox, and submits
- **THEN** the order's `isPaid` field SHALL be updated to `true`

<!-- @trace
source: narrow-order-status-add-paid-checkbox
updated: 2026-07-11
code:
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
  - src/components/ui/Checkbox.vue
  - src/views/Dashboard.vue
-->