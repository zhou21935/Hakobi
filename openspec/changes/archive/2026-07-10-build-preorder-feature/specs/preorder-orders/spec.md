## ADDED Requirements

### Requirement: User can create a preorder order with required field validation
The system SHALL allow a user to create a new order in the preorder category via a form, and SHALL require a non-empty product name and a positive amount before the order is created.

#### Scenario: Valid submission creates an order
- **WHEN** a user submits the order form with a non-empty product name and an amount greater than zero
- **THEN** the system SHALL create a new order with status `PENDING_PAYMENT` by default and SHALL add it to the order list

#### Scenario: Empty product name blocks submission
- **WHEN** a user submits the order form with an empty product name
- **THEN** the system SHALL display a validation error on the product name field and SHALL NOT create the order

#### Scenario: Non-positive amount blocks submission
- **WHEN** a user submits the order form with an amount of zero or less
- **THEN** the system SHALL display a validation error on the amount field and SHALL NOT create the order

### Requirement: User can edit an existing order using the same form
The system SHALL allow a user to edit an existing order's fields using the same form component used for creation, pre-filled with the order's current values.

#### Scenario: Editing updates the existing order
- **WHEN** a user opens the edit form for an order, changes a field, and submits
- **THEN** the system SHALL update that order's data and SHALL NOT create a duplicate order

### Requirement: User must confirm before an order is deleted
The system SHALL require explicit confirmation before permanently deleting an order.

#### Scenario: Confirming deletion removes the order
- **WHEN** a user clicks delete on an order and confirms the deletion in the confirmation dialog
- **THEN** the system SHALL remove the order from the list and from all status counts

#### Scenario: Cancelling the confirmation keeps the order
- **WHEN** a user clicks delete on an order and then cancels the confirmation dialog
- **THEN** the system SHALL leave the order unchanged in the list

### Requirement: Orders progress through an 8-stage status lifecycle
The system SHALL support exactly 8 order statuses representing the overseas shopping and consolidation shipping flow: pending payment, deposit paid, paid, awaiting shipment, consolidating, in transit, arrived, and completed.

#### Scenario: Default status on creation
- **WHEN** a new order is created without an explicit status
- **THEN** the order SHALL be assigned the pending-payment status

#### Scenario: Status can be changed via the edit form
- **WHEN** a user edits an order and selects a different status from the 8 available statuses
- **THEN** the order SHALL be updated to the newly selected status

### Requirement: Status filter tabs show per-status counts and filter the order list
The system SHALL display a row of filter tabs (one for "all" plus one per status) each showing the count of orders in that status, and SHALL filter the visible order list to the selected status when a tab is clicked.

#### Scenario: Tab counts reflect current data
- **WHEN** the order list contains orders in various statuses
- **THEN** each status tab SHALL display the count of orders currently in that status

##### Example: three orders across three statuses
- **GIVEN** three preorder orders with statuses `PENDING_PAYMENT`, `CONSOLIDATING`, `COMPLETED` (one each)
- **WHEN** the status filter tabs are rendered
- **THEN** the "all" tab SHALL show 3, the pending-payment tab SHALL show 1, the consolidating tab SHALL show 1, the completed tab SHALL show 1, and all other status tabs SHALL show 0

#### Scenario: Selecting a status tab filters the list
- **WHEN** a user clicks the "awaiting shipment" tab
- **THEN** the order list SHALL show only orders with the awaiting-shipment status

### Requirement: Dashboard shows order count summaries
The system SHALL display, on the dashboard, the total order count and the counts of orders in the awaiting-shipment, consolidating, and completed statuses.

#### Scenario: Dashboard numbers match underlying data
- **WHEN** the dashboard is rendered
- **THEN** the displayed total count SHALL equal the number of orders in the store, and the three status counts SHALL equal the corresponding values from the status filter tabs

### Requirement: All-orders view lists orders across every category
The system SHALL provide a view that lists orders from all categories together, independent of the per-category views, and SHALL support the same status filtering as a per-category view.

#### Scenario: All-orders view includes preorder orders
- **WHEN** a user navigates to the all-orders view
- **THEN** the system SHALL display every order regardless of category, including preorder orders

### Requirement: Orders record an amount in one of four supported currencies without conversion
The system SHALL allow an order's amount to be recorded in one of TWD, USD, KRW, or JPY, and SHALL display the amount together with its currency without converting between currencies.

#### Scenario: Amount displays with its recorded currency
- **WHEN** an order with amount 320 and currency USD is displayed
- **THEN** the displayed amount SHALL show both the value 320 and an indicator of the USD currency, unconverted

### Requirement: Orders can be flagged as sent to a consolidation warehouse
The system SHALL allow a user to mark an order as sent to a consolidation warehouse via a boolean flag, defaulting to not sent.

#### Scenario: New order defaults to not consolidated
- **WHEN** a new order is created without specifying the consolidation flag
- **THEN** the order's consolidation flag SHALL default to false
