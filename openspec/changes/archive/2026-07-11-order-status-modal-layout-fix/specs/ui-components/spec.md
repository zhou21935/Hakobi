## MODIFIED Requirements

### Requirement: Modal component supports v-model visibility control and dismiss interactions

The system SHALL provide a `Modal` component whose visibility is controlled via `modelValue`/`update:modelValue`, with an optional `title` prop, a default content slot, and an optional `footer` slot. The component SHALL close on overlay click or Escape key press. The component SHALL constrain its own height so it never exceeds the viewport, keeping its header and footer fixed in place while its content area scrolls independently when content overflows. The component SHALL NOT render a divider line between the header and content area, nor between the content area and footer.

#### Scenario: Modal opens when modelValue becomes true

- **WHEN** the parent sets `modelValue` to `true`
- **THEN** the `Modal` SHALL become visible and SHALL display the given `title`

#### Scenario: Clicking the overlay closes the modal

- **WHEN** a user clicks outside the modal content area while it is open
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Pressing Escape closes the modal

- **WHEN** the `Modal` is open and the user presses the Escape key
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Overflowing content scrolls while header and footer stay fixed

- **WHEN** the default slot content is taller than the modal's maximum height
- **THEN** the content area SHALL become independently scrollable, and the header and footer SHALL remain visible and fixed in place

#### Scenario: Modal never touches the top or bottom edge of the viewport

- **WHEN** the `Modal` is open, regardless of content length
- **THEN** there SHALL be visible spacing between the modal and the top and bottom edges of the viewport
