## MODIFIED Requirements

### Requirement: User can create a preorder order with required field validation
The system SHALL allow a user to create a new order from either a supported category view or the all-orders view. A category view SHALL supply its route category, while the all-orders form SHALL require the user to select exactly one supported category. Every creation path SHALL require a non-empty product name and a positive amount, and the orders store's add operation SHALL enforce these rules directly using the shared validation capability.

#### Scenario: Category-view submission creates an order
- **WHEN** a user submits valid input from `/orders/agent`
- **THEN** the system SHALL create an `agent` order with status `AWAITING_SHIPMENT` by default and SHALL add it to the active order list

#### Scenario: All-orders submission creates an explicitly categorized order
- **WHEN** a user opens the create form from `/orders`, selects `parcel`, and submits otherwise valid input
- **THEN** the system SHALL create a `parcel` order and SHALL add it to the active order list

#### Scenario: All-orders submission without category is blocked
- **WHEN** a user submits the all-orders create form without selecting a category
- **THEN** the system SHALL display a category validation error and SHALL NOT create an order

#### Scenario: Invalid core fields are blocked
- **WHEN** a user submits an empty product name or an amount of zero or less
- **THEN** the system SHALL display the corresponding field validation error and SHALL NOT create an order

#### Scenario: Store rejects invalid input independent of the form
- **WHEN** the orders store's add operation receives an empty name, non-positive amount, or unsupported category
- **THEN** the system SHALL NOT issue a create request and SHALL return a validation error

### Requirement: User must confirm before an order is deleted
The system SHALL require explicit confirmation before starting a permanent order deletion, and after confirmation SHALL provide an undo opportunity for the lifetime of the current order view before submitting the delete API request on view exit.

#### Scenario: Confirming deletion starts temporary removal
- **WHEN** a user clicks delete on an active order and confirms the deletion
- **THEN** the system SHALL remove the order from active lists and status counts and SHALL display an undo action without a countdown

#### Scenario: Cancelling the confirmation keeps the order
- **WHEN** a user clicks delete on an active order and then cancels the confirmation dialog
- **THEN** the system SHALL leave the order unchanged in the active list and SHALL issue no delete request
