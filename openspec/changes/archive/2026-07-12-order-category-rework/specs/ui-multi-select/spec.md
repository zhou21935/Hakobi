## ADDED Requirements

### Requirement: MultiSelect component supports v-model binding over multiple selected values

The system SHALL provide a `MultiSelect` component that supports two-way binding via `modelValue`/`update:modelValue` over an array of selected string values, backed by a required `options` list of `{ value, label }` pairs, with an optional `label`, `placeholder` (shown when no value is selected), `error` message, and `disabled` state.

#### Scenario: Toggling an unselected option adds it to the bound array

- **WHEN** a user selects an unselected option in the `MultiSelect` control
- **THEN** the component SHALL emit `update:modelValue` with the full array including that option's `value` appended

#### Scenario: Toggling a selected option removes it from the bound array

- **WHEN** a user selects an already-selected option in the `MultiSelect` control
- **THEN** the component SHALL emit `update:modelValue` with the full array excluding that option's `value`

#### Scenario: Selected options render as chips in the closed control

- **WHEN** the `MultiSelect` control is closed and `modelValue` contains one or more values
- **THEN** the component SHALL render each selected option's `label` as a chip inside the closed control

#### Scenario: Empty selection shows the placeholder

- **WHEN** `modelValue` is an empty array and a `placeholder` prop is provided
- **THEN** the closed control SHALL display the `placeholder` text instead of any chip

#### Scenario: Disabled control cannot be opened

- **WHEN** `disabled` is `true`
- **THEN** the control SHALL NOT open its option panel on click and SHALL NOT emit `update:modelValue`

---

### Requirement: MultiSelect dropdown panel opens and closes predictably

The system SHALL open the `MultiSelect` option panel when the closed control is clicked, and SHALL close the panel when the user clicks outside the component or presses the Escape key, without closing the panel after a single option toggle.

#### Scenario: Clicking the control opens the panel

- **WHEN** a user clicks the closed `MultiSelect` control
- **THEN** the component SHALL render its option panel with a checkbox per option

#### Scenario: Selecting an option keeps the panel open

- **WHEN** the option panel is open and a user toggles one option
- **THEN** the panel SHALL remain open, allowing further selections

#### Scenario: Clicking outside closes the panel

- **WHEN** the option panel is open and a user clicks anywhere outside the `MultiSelect` component
- **THEN** the panel SHALL close without changing `modelValue`

#### Scenario: Escape key closes the panel

- **WHEN** the option panel is open and a user presses the Escape key
- **THEN** the panel SHALL close without changing `modelValue`

---

### Requirement: MultiSelect displays a validation error message

The system SHALL render the `error` prop's text below the `MultiSelect` control and apply an error visual state when `error` is a non-empty string.

#### Scenario: Error message renders when error prop is set

- **WHEN** the `error` prop is a non-empty string
- **THEN** the component SHALL render the error text below the control and SHALL apply an error visual state to the control's border
