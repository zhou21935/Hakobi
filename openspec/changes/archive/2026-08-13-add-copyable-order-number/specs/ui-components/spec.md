## ADDED Requirements

### Requirement: Copyable detail values provide reusable isolated feedback
The frontend SHALL provide a reusable copyable-detail component that renders a labeled value, copies the exact value through the Clipboard API, and owns feedback state independently for each mounted instance.

#### Scenario: One of two values is copied
- **WHEN** a page renders two copyable-detail components and the user successfully copies the first value
- **THEN** only the first component SHALL display `已複製 ✓`
- **AND** the second component SHALL remain in its default state

#### Scenario: Copyable value is empty
- **WHEN** the component receives an empty, null, or undefined value
- **THEN** it SHALL display `尚未填寫` and SHALL NOT render a copy control

#### Scenario: Clipboard API is unavailable
- **WHEN** the component's copy control is activated without an available Clipboard API
- **THEN** it SHALL display `複製失敗，請手動選取`, retain the selectable value, and SHALL NOT throw an unhandled error
