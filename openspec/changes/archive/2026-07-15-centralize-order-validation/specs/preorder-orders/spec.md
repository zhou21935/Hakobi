## MODIFIED Requirements

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
