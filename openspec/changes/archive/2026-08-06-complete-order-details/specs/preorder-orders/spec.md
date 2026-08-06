## ADDED Requirements

### Requirement: Order forms capture optional logistics information
The shared create and edit order form SHALL provide optional free-text fields for `shippingMethod` and `trackingNumber`, SHALL submit their current values through the existing order mutation flow, and SHALL pre-fill both fields when editing an order.

#### Scenario: Logistics information is created
- **WHEN** a user creates an order with shipping method `日本郵便 EMS` and tracking number `EN123456789JP`
- **THEN** the created order SHALL contain those exact logistics values

#### Scenario: Existing logistics information is edited
- **WHEN** a user opens an order whose logistics fields are populated, changes either value, and submits the edit form
- **THEN** the form SHALL start with the confirmed values and the updated order SHALL contain the submitted values without creating a duplicate

#### Scenario: Logistics information is cleared
- **WHEN** a user clears both logistics fields while editing and submits
- **THEN** the updated order SHALL store both fields as empty strings

### Requirement: Order cards expose a separate details action
Each order card SHALL render a details action separate from its edit and delete actions, and each action MUST have an accessible name and a touch-operable target on narrow viewports.

#### Scenario: Card actions remain distinct
- **WHEN** a user views an order card
- **THEN** the card SHALL expose separate controls for details, edit, and delete without making the entire card activate details
