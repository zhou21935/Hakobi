# order-list-category-sync Specification

## Purpose

TBD - created by archiving change 'order-list-category-route-sync'. Update Purpose after archive.

## Requirements

### Requirement: OrderList page title reflects the current route category

The system SHALL display the `OrderList` page title using the category from the current route's `category` param, and SHALL update the title immediately when the user navigates between category routes without a full page reload.

#### Scenario: Title updates after navigating from one category page to another
- **WHEN** the user is viewing `/orders/agent` and navigates via an in-app link to `/orders/parcel`
- **THEN** the page title SHALL display the label for `parcel` and SHALL NOT continue displaying the label for `agent`


<!-- @trace
source: order-list-category-route-sync
updated: 2026-07-15
code:
  - src/views/OrderList.vue
tests:
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: OrderList order list and counts reflect the current route category

The system SHALL filter the displayed order list and compute status counts using the category from the current route's `category` param, and SHALL recompute both immediately when the user navigates between category routes without a full page reload.

#### Scenario: Order list updates after navigating from one category page to another
- **WHEN** the user is viewing `/orders/agent` and navigates via an in-app link to `/orders/parcel`
- **THEN** the displayed order list SHALL contain only orders belonging to the `parcel` category and SHALL NOT contain orders belonging to the `agent` category

#### Scenario: Status counts update after navigating from one category page to another
- **WHEN** the user is viewing `/orders/agent` and navigates via an in-app link to `/orders/parcel`
- **THEN** the status filter tab counts SHALL reflect only `parcel` category orders and SHALL NOT reflect counts computed from `agent` category orders

##### Example: counts recompute across categories
| Category shown before navigation | Category navigated to | Expected counts source |
| --- | --- | --- |
| agent (3 orders) | parcel (5 orders) | counts computed from the 5 parcel orders, not the 3 agent orders |


<!-- @trace
source: order-list-category-route-sync
updated: 2026-07-15
code:
  - src/views/OrderList.vue
tests:
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: New order created from OrderList is written to the current route category

The system SHALL assign the category from the current route's `category` param to any order created via the `OrderList` page's create-order form, using the category active at the moment of submission rather than the category active when the page component was first mounted.

#### Scenario: Order created after switching categories is saved under the new category
- **WHEN** the user is viewing `/orders/agent`, navigates via an in-app link to `/orders/parcel` without reloading the page, and submits the create-order form
- **THEN** the newly created order SHALL be saved with category `parcel`, not `agent`

<!-- @trace
source: order-list-category-route-sync
updated: 2026-07-15
code:
  - src/views/OrderList.vue
tests:
  - src/views/__tests__/OrderList.spec.js
-->