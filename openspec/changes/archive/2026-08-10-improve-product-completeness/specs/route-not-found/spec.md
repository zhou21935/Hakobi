## ADDED Requirements

### Requirement: Unknown application locations render a recoverable Not Found view
The router SHALL render one Not Found view for unregistered paths and unsupported order category values. The view SHALL identify that the page does not exist and SHALL provide an action that navigates to `/orders`.

#### Scenario: Unknown top-level path
- **WHEN** an authenticated user navigates to `/does-not-exist`
- **THEN** the Not Found view SHALL render and SHALL offer navigation to `/orders`

#### Scenario: Unsupported order category
- **WHEN** an authenticated user navigates to `/orders/unknown`
- **THEN** the Not Found view SHALL render and the order create form SHALL NOT be available for the unsupported category

#### Scenario: Supported order categories remain valid
- **WHEN** an authenticated user navigates to `/orders/agent` or `/orders/parcel`
- **THEN** the corresponding category order view SHALL render normally
