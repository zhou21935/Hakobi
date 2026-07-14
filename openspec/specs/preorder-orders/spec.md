# preorder-orders Specification

## Purpose

TBD - created by archiving change 'build-preorder-feature'. Update Purpose after archive.

## Requirements

### Requirement: User can create a preorder order with required field validation

The system SHALL allow a user to create a new order via a form, and SHALL require a non-empty product name and a positive amount before the order is created. The orders store's add operation SHALL enforce this same requirement directly, independent of the form, using the shared validation rules defined by the `order-validation` capability.

#### Scenario: Valid submission creates an order

- **WHEN** a user submits the order form with a non-empty product name and an amount greater than zero
- **THEN** the system SHALL create a new order with status `AWAITING_SHIPMENT` by default and SHALL add it to the order list

#### Scenario: Empty product name blocks submission

- **WHEN** a user submits the order form with an empty product name
- **THEN** the system SHALL display a validation error on the product name field and SHALL NOT create the order

#### Scenario: Non-positive amount blocks submission

- **WHEN** a user submits the order form with an amount of zero or less
- **THEN** the system SHALL display a validation error on the amount field and SHALL NOT create the order

#### Scenario: Store rejects an empty product name independent of the form

- **WHEN** the orders store's add operation is called directly with an empty product name, bypassing the form
- **THEN** the system SHALL NOT create the order and SHALL return a value indicating the write did not occur

#### Scenario: Store rejects a non-positive amount independent of the form

- **WHEN** the orders store's add operation is called directly with an amount of zero or less, bypassing the form
- **THEN** the system SHALL NOT create the order and SHALL return a value indicating the write did not occur


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
### Requirement: Orders progress through a 5-stage shipment status lifecycle

The system SHALL support exactly 5 order statuses representing the shipment lifecycle, in this order: awaiting shipment, consolidating, in transit, arrived, and completed. Payment status SHALL be tracked separately via a boolean `isPaid` field, not as part of this status lifecycle.

#### Scenario: Default status on creation

- **WHEN** a new order is created without an explicit status
- **THEN** the order SHALL be assigned the awaiting-shipment status

#### Scenario: Status can be changed via the edit form

- **WHEN** a user edits an order and selects a different status from the 5 available statuses
- **THEN** the order SHALL be updated to the newly selected status

#### Scenario: Payment can be marked independently of shipment status

- **WHEN** a user edits an order and toggles the "已付款" (paid) checkbox
- **THEN** the order's `isPaid` boolean field SHALL be updated accordingly, without changing the order's shipment status

#### Scenario: Status dropdown lists statuses in shipment progression order

- **WHEN** the order edit form's status dropdown is rendered
- **THEN** the options SHALL appear in this order: awaiting shipment, consolidating, in transit, arrived, completed


<!-- @trace
source: order-status-modal-layout-fix
updated: 2026-07-11
code:
  - src/components/ui/Modal.vue
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
-->

---
### Requirement: Status filter tabs show per-status counts and filter the order list

The system SHALL display a row of filter tabs (one for "all" plus one per status) each showing the count of orders in that status, and SHALL filter the visible order list to the selected status when a tab is clicked.

#### Scenario: Tab counts reflect current data

- **WHEN** the order list contains orders in various statuses
- **THEN** each status tab SHALL display the count of orders currently in that status

##### Example: four orders across four statuses

- **GIVEN** four preorder orders with statuses `AWAITING_SHIPMENT`, `CONSOLIDATING`, `IN_TRANSIT`, `COMPLETED` (one each)
- **WHEN** the status filter tabs are rendered
- **THEN** the "all" tab SHALL show 4, the awaiting-shipment tab SHALL show 1, the consolidating tab SHALL show 1, the in-transit tab SHALL show 1, the completed tab SHALL show 1, and the arrived tab SHALL show 0

#### Scenario: Selecting a status tab filters the list

- **WHEN** a user clicks the "arrived" tab
- **THEN** the order list SHALL show only orders with the arrived status


<!-- @trace
source: order-status-modal-layout-fix
updated: 2026-07-11
code:
  - src/components/ui/Modal.vue
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
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

---
### Requirement: Sidebar navigation offers exactly two order categories

The system SHALL display exactly two category links in the sidebar navigation, labeled "代購" (agent) and "集運包裹" (parcel), each linking to its own `/orders/:category` view, and SHALL NOT display a navigation entry for any other category value.

#### Scenario: Sidebar shows only agent and parcel category links

- **WHEN** the sidebar navigation is rendered
- **THEN** the category section SHALL contain exactly two links, labeled "代購" and "集運包裹"

#### Scenario: Orders with a legacy category remain visible in the all-orders view

- **WHEN** an order's stored `category` value is not `agent` or `parcel` (a legacy value such as `preorder`, `merch`, or `manga`)
- **THEN** the order SHALL have no matching sidebar category link, and SHALL continue to appear in the 全部訂單 (all-orders) view


<!-- @trace
source: order-category-rework
updated: 2026-07-12
code:
  - src/stores/orders.js
  - src/components/AppSidebar.vue
  - vite.config.js
  - package.json
  - src/components/ui/MultiSelect.vue
  - src/components/orders/OrderCard.vue
  - src/components/orders/OrderFormModal.vue
tests:
  - src/components/ui/__tests__/MultiSelect.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/stores/__tests__/orders.spec.js
-->

---
### Requirement: Orders can be flagged as a preorder item

The system SHALL allow a user to mark an order as a preorder item via a boolean `isPreorder` field, presented as a checkbox labeled "預購商品" in the order edit form, defaulting to not a preorder, and SHALL display a "預購" tag next to the order's status badge on its order card when `isPreorder` is `true`.

#### Scenario: New order defaults to not a preorder

- **WHEN** a new order is created without specifying the preorder flag
- **THEN** the order's `isPreorder` field SHALL default to `false`

#### Scenario: Checking the preorder checkbox marks the order and shows a tag

- **WHEN** a user checks the "預購商品" checkbox in the order edit form and submits
- **THEN** the order's `isPreorder` field SHALL be updated to `true`, and the order's card SHALL display a "預購" tag next to its status badge

#### Scenario: Unchecked preorder flag shows no tag

- **WHEN** an order's `isPreorder` field is `false`
- **THEN** the order's card SHALL NOT display a "預購" tag


<!-- @trace
source: order-category-rework
updated: 2026-07-12
code:
  - src/stores/orders.js
  - src/components/AppSidebar.vue
  - vite.config.js
  - package.json
  - src/components/ui/MultiSelect.vue
  - src/components/orders/OrderCard.vue
  - src/components/orders/OrderFormModal.vue
tests:
  - src/components/ui/__tests__/MultiSelect.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/stores/__tests__/orders.spec.js
-->

---
### Requirement: Orders can be tagged with one or more product categories

The system SHALL require a user to select at least one product category — from the fixed set 周邊 (merch), 書籍 (book), 其他 (other) — via a multi-select control in the order create/edit form before the order can be submitted, SHALL store the selection as the order's `productCategories` array field, and SHALL display one tag per selected value on the order's card. The orders store's add and update operations SHALL enforce the at-least-one-category requirement directly, independent of the form, using the shared validation rules defined by the `order-validation` capability.

#### Scenario: Submitting without any product category blocks submission

- **WHEN** a user submits the order form with zero product categories selected
- **THEN** the system SHALL display a validation error on the product category field and SHALL NOT create or update the order

#### Scenario: Selecting multiple product categories persists all of them

- **WHEN** a user selects both "周邊" and "書籍" in the product category control and submits
- **THEN** the order's `productCategories` field SHALL contain both `merch` and `book`

##### Example: three orders with different selections

| Selected labels | Stored `productCategories` | Tags shown on card |
| --- | --- | --- |
| 周邊 | `['merch']` | 周邊 |
| 書籍, 其他 | `['book', 'other']` | 書籍, 其他 |
| 周邊, 書籍, 其他 | `['merch', 'book', 'other']` | 周邊, 書籍, 其他 |

#### Scenario: Tags render in a fixed order regardless of selection order

- **WHEN** a user selects "其他" before "周邊"
- **THEN** the order's card SHALL display the "周邊" tag before the "其他" tag, following the fixed option order 周邊, 書籍, 其他

#### Scenario: Store rejects an empty product category list independent of the form

- **WHEN** the orders store's add operation is called directly with an empty `productCategories` array, bypassing the form
- **THEN** the system SHALL NOT create the order and SHALL return a value indicating the write did not occur

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