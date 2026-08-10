## MODIFIED Requirements

### Requirement: UI component showcase page is reachable from navigation
The system SHALL retain the showcase page at route `/ui-showcase` with examples of `Button`, `Card`, `Input`, `Table`, and `Modal`, and the production sidebar SHALL NOT expose a navigation entry to it.

#### Scenario: Direct showcase route remains available
- **WHEN** an authenticated developer navigates directly to `/ui-showcase`
- **THEN** the showcase page SHALL render the five base component examples

#### Scenario: Product navigation omits showcase
- **WHEN** the product sidebar is rendered
- **THEN** it SHALL NOT contain a link targeting `/ui-showcase`

### Requirement: Top-level sidebar navigation items render with consistent styling and adjacency
The system SHALL render Overview and All Orders as adjacent top-level product destinations using the same navigation interaction and active-state treatment, and no development-only destination SHALL appear among them.

#### Scenario: Product destinations render in order
- **WHEN** the sidebar navigation is rendered
- **THEN** Overview SHALL be followed immediately by All Orders before the category section
