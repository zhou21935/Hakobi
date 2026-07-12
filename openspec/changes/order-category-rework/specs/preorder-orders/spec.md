## MODIFIED Requirements

### Requirement: User can create a preorder order with required field validation

The system SHALL allow a user to create a new order via a form, and SHALL require a non-empty product name and a positive amount before the order is created.

#### Scenario: Valid submission creates an order

- **WHEN** a user submits the order form with a non-empty product name and an amount greater than zero
- **THEN** the system SHALL create a new order with status `AWAITING_SHIPMENT` by default and SHALL add it to the order list

#### Scenario: Empty product name blocks submission

- **WHEN** a user submits the order form with an empty product name
- **THEN** the system SHALL display a validation error on the product name field and SHALL NOT create the order

#### Scenario: Non-positive amount blocks submission

- **WHEN** a user submits the order form with an amount of zero or less
- **THEN** the system SHALL display a validation error on the amount field and SHALL NOT create the order

## REMOVED Requirements

### Requirement: Orders can be flagged as sent to a consolidation warehouse

**Reason**: The consolidation concept is merged into the sidebar's "集運包裹" (parcel) category itself; a separate per-order boolean duplicated the meaning the category already carries.
**Migration**: None. The `isConsolidated` field is dropped from the order data model. Existing persisted orders retain a stale, unused `isConsolidated` key with no runtime effect.

## ADDED Requirements

### Requirement: Sidebar navigation offers exactly two order categories

The system SHALL display exactly two category links in the sidebar navigation, labeled "代購" (agent) and "集運包裹" (parcel), each linking to its own `/orders/:category` view, and SHALL NOT display a navigation entry for any other category value.

#### Scenario: Sidebar shows only agent and parcel category links

- **WHEN** the sidebar navigation is rendered
- **THEN** the category section SHALL contain exactly two links, labeled "代購" and "集運包裹"

#### Scenario: Orders with a legacy category remain visible in the all-orders view

- **WHEN** an order's stored `category` value is not `agent` or `parcel` (a legacy value such as `preorder`, `merch`, or `manga`)
- **THEN** the order SHALL have no matching sidebar category link, and SHALL continue to appear in the 全部訂單 (all-orders) view

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

---

### Requirement: Orders can be tagged with one or more product categories

The system SHALL require a user to select at least one product category — from the fixed set 周邊 (merch), 書籍 (book), 其他 (other) — via a multi-select control in the order create/edit form before the order can be submitted, SHALL store the selection as the order's `productCategories` array field, and SHALL display one tag per selected value on the order's card.

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
