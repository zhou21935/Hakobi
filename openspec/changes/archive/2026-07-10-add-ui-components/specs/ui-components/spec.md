## ADDED Requirements

### Requirement: Button component renders with variant and size options
The system SHALL provide a `Button` component that accepts `variant` (`'primary' | 'secondary' | 'danger' | 'ghost'`, default `'primary'`) and `size` (`'sm' | 'md' | 'lg'`, default `'md'`) props to control its visual style.

#### Scenario: Default button renders as primary
- **WHEN** a `Button` is used without a `variant` prop
- **THEN** it SHALL render with the `primary` variant style

#### Scenario: Button forwards click events
- **WHEN** a user clicks a non-disabled `Button`
- **THEN** the component SHALL emit a native `click` event to the parent

#### Scenario: Disabled button does not emit click
- **WHEN** `disabled` is `true`
- **THEN** the rendered `<button>` element SHALL have the `disabled` attribute and SHALL NOT emit `click` events

### Requirement: Card component provides structured content slots
The system SHALL provide a `Card` component with a default content slot and optional `header` and `footer` slots, and a `padding` prop (default `true`) controlling default internal spacing.

#### Scenario: Card renders only default slot content
- **WHEN** a `Card` is used with only default slot content
- **THEN** the component SHALL render the content without header or footer regions

#### Scenario: Card renders header and footer when provided
- **WHEN** a `Card` is used with `header` and `footer` slot content
- **THEN** the component SHALL render the header above and footer below the default content

### Requirement: Input component supports v-model binding and validation error display
The system SHALL provide an `Input` component that supports two-way binding via `modelValue`/`update:modelValue` and can display a validation error message via an `error` prop.

#### Scenario: Typing updates bound value
- **WHEN** a user types into the `Input` field
- **THEN** the component SHALL emit `update:modelValue` with the new value

#### Scenario: Error message renders when error prop is set
- **WHEN** the `error` prop is a non-empty string
- **THEN** the component SHALL render the error text below the field and SHALL apply an error visual state to the field border

### Requirement: Table component renders rows from column definitions with custom cell override
The system SHALL provide a `Table` component that renders `rows` (required `Array<Object>`) according to `columns` (required `Array<{ key, label }>`) definitions, allowing per-column custom rendering via scoped slots, and SHALL show `emptyText` (default `'尚無資料'`) when `rows` is empty.

#### Scenario: Table renders each row's cell using the column key by default
- **WHEN** a `Table` is given `columns` and `rows` without a matching scoped slot
- **THEN** each cell SHALL display the value of `row[column.key]`

#### Scenario: Table renders custom content when a matching scoped slot is provided
- **WHEN** a `Table` is given a scoped slot named `cell-<key>` matching a column's `key`
- **THEN** the component SHALL render that slot's content for the column instead of the raw value, passing the row as a slot prop

##### Example: status column rendered via StatusBadge
- **GIVEN** columns `[{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }]` and a scoped slot `#cell-status="{ row }"` rendering `<StatusBadge :status="row.status" />`
- **WHEN** a row `{ name: 'Order A', status: 'PENDING' }` is rendered
- **THEN** the status cell SHALL display the `StatusBadge` component instead of the literal text `PENDING`

#### Scenario: Table shows empty state text when rows is empty
- **WHEN** `rows` is an empty array
- **THEN** the component SHALL render the `emptyText` message instead of a row

### Requirement: Modal component supports v-model visibility control and dismiss interactions
The system SHALL provide a `Modal` component whose visibility is controlled via `modelValue`/`update:modelValue`, with an optional `title` prop, a default content slot, and an optional `footer` slot. The component SHALL close on overlay click or Escape key press.

#### Scenario: Modal opens when modelValue becomes true
- **WHEN** the parent sets `modelValue` to `true`
- **THEN** the `Modal` SHALL become visible and SHALL display the given `title`

#### Scenario: Clicking the overlay closes the modal
- **WHEN** a user clicks outside the modal content area while it is open
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Pressing Escape closes the modal
- **WHEN** the `Modal` is open and the user presses the Escape key
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

### Requirement: UI component showcase page is reachable from navigation
The system SHALL provide a showcase page at route `/ui-showcase` that renders at least one example of each of the five base components, and SHALL expose a navigation entry to it in the sidebar.

#### Scenario: Navigating to the showcase route renders all components
- **WHEN** a user navigates to the `/ui-showcase` route
- **THEN** the page SHALL render at least one example of `Button`, `Card`, `Input`, `Table`, and `Modal`

#### Scenario: Sidebar link navigates to the showcase page
- **WHEN** a user clicks the showcase navigation item in the sidebar
- **THEN** the router SHALL navigate to the `/ui-showcase` route
