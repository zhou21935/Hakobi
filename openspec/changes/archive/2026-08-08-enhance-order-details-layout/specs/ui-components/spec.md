## MODIFIED Requirements

### Requirement: Modal component supports v-model visibility control and dismiss interactions
The system SHALL provide a `Modal` component whose visibility is controlled via `modelValue`/`update:modelValue`, with an optional `title` prop, a default content slot, and an optional `footer` slot. The component SHALL close on overlay click or Escape key press. While open, the component SHALL lock background document scrolling on both the root element and body, and SHALL restore each element's pre-existing overflow state after close or component unmount. The component SHALL constrain its panel height, keep its header and footer fixed, and use the content area as the only vertical scroll region when content overflows. The component SHALL NOT render a divider line between the header and content area, nor between the content area and footer.

#### Scenario: Modal opens when modelValue becomes true

- **WHEN** the parent sets `modelValue` to `true`
- **THEN** the `Modal` SHALL become visible and SHALL display the given `title`
- **AND** background document scrolling on both the root element and body SHALL be locked

#### Scenario: Clicking the overlay closes the modal

- **WHEN** a user clicks outside the modal content area while it is open
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Pressing Escape closes the modal

- **WHEN** the `Modal` is open and the user presses the Escape key
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Overflowing content scrolls while header and footer stay fixed

- **WHEN** the default slot content is taller than the modal's maximum height
- **THEN** the content area SHALL become independently scrollable, and the header and footer SHALL remain visible and fixed in place
- **AND** the background document SHALL remain non-scrollable

#### Scenario: Modal never touches the top or bottom edge of the viewport

- **WHEN** the `Modal` is open, regardless of content length
- **THEN** there SHALL be visible spacing between the modal and the top and bottom edges of the viewport

#### Scenario: Closing restores the previous background overflow state

- **WHEN** an open `Modal` closes after the document body had a pre-existing overflow style
- **THEN** the component SHALL restore the exact pre-existing overflow styles of both the root element and body

#### Scenario: Unmounting an open modal restores background scrolling

- **WHEN** an open `Modal` is unmounted
- **THEN** the component SHALL restore the pre-existing overflow styles of both the root element and body
