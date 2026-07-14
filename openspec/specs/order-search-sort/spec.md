# order-search-sort Specification

## Purpose

TBD - created by archiving change 'order-search-and-sort'. Update Purpose after archive.

## Requirements

### Requirement: Order list pages support keyword search by name or notes

The system SHALL provide a search input on the All Orders page and on each category's Order List page that filters the displayed orders to those whose name or notes field contains the entered keyword, case-insensitively, and SHALL update the displayed list immediately as the user types without requiring a separate submit action.

#### Scenario: Searching by a keyword in the order name
- **WHEN** a user types a keyword into the search input and that keyword is a case-insensitive substring of an order's name
- **THEN** that order SHALL remain visible in the list

#### Scenario: Searching by a keyword in the order notes
- **WHEN** a user types a keyword into the search input and that keyword is a case-insensitive substring of an order's notes but not its name
- **THEN** that order SHALL remain visible in the list

#### Scenario: Orders not matching the keyword are hidden
- **WHEN** a user types a keyword that matches neither an order's name nor its notes
- **THEN** that order SHALL NOT be visible in the list


<!-- @trace
source: order-search-and-sort
updated: 2026-07-15
code:
  - src/stores/orders.js
  - README.md
  - src/views/AllOrders.vue
  - src/views/OrderList.vue
  - src/components/orders/SearchSortControls.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: Order list pages support sorting by date or amount

The system SHALL provide a sort control on the All Orders page and on each category's Order List page offering exactly four sort options — date ascending, date descending, amount ascending, amount descending — plus a default (unsorted) option, and SHALL reorder the displayed orders according to the selected option.

#### Scenario: Sorting by amount descending
- **WHEN** a user selects the amount-descending sort option
- **THEN** the displayed orders SHALL appear ordered from the highest amount to the lowest amount

#### Scenario: Sorting by date ascending
- **WHEN** a user selects the date-ascending sort option
- **THEN** the displayed orders SHALL appear ordered from the earliest order date to the latest order date

#### Scenario: Orders missing an order date sort to the end regardless of direction
- **WHEN** a user selects either date sort option and at least one displayed order has no order date set
- **THEN** every order with no order date SHALL appear after every order that has an order date, regardless of whether ascending or descending was selected

##### Example: mixed orders with and without a date
| Order | orderDate | Sort selected | Resulting position |
| --- | --- | --- | --- |
| A | `2026-01-05` | date-desc | before B, before C |
| B | `2026-02-10` | date-desc | before A |
| C | (empty) | date-desc | after A and B |

#### Scenario: Default sort option preserves the unsorted order
- **WHEN** a user has not selected a sort option, or selects the default option
- **THEN** the displayed orders SHALL appear in their original (unsorted) order


<!-- @trace
source: order-search-and-sort
updated: 2026-07-15
code:
  - src/stores/orders.js
  - README.md
  - src/views/AllOrders.vue
  - src/views/OrderList.vue
  - src/components/orders/SearchSortControls.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: Search, sort, category, and status filters combine as an intersection

The system SHALL apply keyword search, sort selection, category filtering, and status filtering together such that the displayed list reflects the intersection of the active search, category, and status conditions, sorted per the active sort selection.

#### Scenario: Search and status filter combine
- **WHEN** a user has selected a status filter tab and also enters a search keyword
- **THEN** the displayed list SHALL contain only orders that match both the selected status and the search keyword

#### Scenario: Search, sort, and category filter combine on a category page
- **WHEN** a user is viewing a specific category's Order List page, enters a search keyword, and selects a sort option
- **THEN** the displayed list SHALL contain only orders belonging to that category and matching the search keyword, ordered per the selected sort option


<!-- @trace
source: order-search-and-sort
updated: 2026-07-15
code:
  - src/stores/orders.js
  - README.md
  - src/views/AllOrders.vue
  - src/views/OrderList.vue
  - src/components/orders/SearchSortControls.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: All Orders page and category Order List pages share identical search and sort behavior

The system SHALL present the same search input and sort control, with the same available options and the same filtering/sorting behavior, on both the All Orders page and every category's Order List page.

#### Scenario: Identical sort options on both page types
- **WHEN** the sort control is rendered on the All Orders page and on a category Order List page
- **THEN** both SHALL offer the same set of sort options in the same order

#### Scenario: Search and sort reset when navigating between category pages
- **WHEN** a user has an active search keyword or sort selection on one category's Order List page and navigates to a different category's Order List page
- **THEN** the search keyword SHALL reset to empty and the sort selection SHALL reset to the default option on the newly displayed page

<!-- @trace
source: order-search-and-sort
updated: 2026-07-15
code:
  - src/stores/orders.js
  - README.md
  - src/views/AllOrders.vue
  - src/views/OrderList.vue
  - src/components/orders/SearchSortControls.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/SearchSortControls.spec.js
  - src/views/__tests__/OrderList.spec.js
-->