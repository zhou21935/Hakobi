## MODIFIED Requirements

### Requirement: User can create a preorder order with required field validation

The system SHALL allow a user to create a new order in the preorder category via a form, and SHALL require a non-empty product name and a positive amount before the order is created.

#### Scenario: Valid submission creates an order

- **WHEN** a user submits the order form with a non-empty product name and an amount greater than zero
- **THEN** the system SHALL create a new order with status `AWAITING_SHIPMENT` by default and SHALL add it to the order list

#### Scenario: Empty product name blocks submission

- **WHEN** a user submits the order form with an empty product name
- **THEN** the system SHALL display a validation error on the product name field and SHALL NOT create the order

#### Scenario: Non-positive amount blocks submission

- **WHEN** a user submits the order form with an amount of zero or less
- **THEN** the system SHALL display a validation error on the amount field and SHALL NOT create the order

### Requirement: Orders progress through a 4-stage shipment status lifecycle

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

### Requirement: Orders can be flagged as sent to a consolidation warehouse

The system SHALL allow a user to mark an order as sent to a consolidation warehouse via a boolean flag, presented as a checkbox field in the order edit form, defaulting to not sent.

#### Scenario: New order defaults to not consolidated

- **WHEN** a new order is created without specifying the consolidation flag
- **THEN** the order's consolidation flag SHALL default to false

#### Scenario: Checking the consolidation checkbox marks the order as consolidated

- **WHEN** a user checks the consolidation warehouse checkbox in the order edit form and submits
- **THEN** the order's consolidation flag SHALL be updated to `true`
