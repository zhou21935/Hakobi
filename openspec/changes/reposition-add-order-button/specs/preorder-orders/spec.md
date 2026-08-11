## ADDED Requirements

### Requirement: Order list create action follows the filtering controls

The system SHALL display the "+ 新增訂單" action on both the category order list and the all-orders list after the status filter tabs and before the order content, SHALL align the action to the right at all supported viewport sizes, and SHALL size the action to its content rather than stretching it across the available width.

#### Scenario: Desktop order list places a compact create action after status filters

- **WHEN** a user views either order list at a desktop viewport
- **THEN** the "+ 新增訂單" action SHALL appear after the status filter tabs and before the order content, aligned to the right with content-based width

#### Scenario: Mobile order list places a compact create action after status filters

- **WHEN** a user views either order list at a mobile viewport
- **THEN** the "+ 新增訂單" action SHALL appear after the status filter tabs and before the order content, aligned to the right without occupying the full row width

#### Scenario: Repositioned action opens the existing create form

- **WHEN** a user activates the repositioned "+ 新增訂單" action
- **THEN** the system SHALL open the existing new-order form with the same behavior as before the layout change
