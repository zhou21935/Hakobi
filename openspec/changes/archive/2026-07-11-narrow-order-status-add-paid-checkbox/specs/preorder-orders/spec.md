## MODIFIED Requirements

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

### Requirement: Orders progress through an 8-stage status lifecycle

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

### Requirement: Dashboard shows order count summaries

The system SHALL display, on the dashboard, the total order count and the counts of orders in the consolidating, in-transit, and completed statuses.

#### Scenario: Dashboard numbers match underlying data

- **WHEN** the dashboard is rendered
- **THEN** the displayed total count SHALL equal the number of orders in the store, and the three status counts SHALL equal the corresponding values from the status filter tabs

## ADDED Requirements

### Requirement: Order payment status is tracked as an independent boolean field

The system SHALL track whether an order has been paid via a boolean `isPaid` field, independent of the order's shipment status, defaulting to `false` for new orders.

#### Scenario: New order defaults to unpaid

- **WHEN** a new order is created without specifying `isPaid`
- **THEN** the order's `isPaid` field SHALL default to `false`

#### Scenario: Marking an order as paid via the edit form

- **WHEN** a user edits an order, checks the "已付款" checkbox, and submits
- **THEN** the order's `isPaid` field SHALL be updated to `true`
