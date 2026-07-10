## ADDED Requirements

### Requirement: Select component supports v-model binding over a fixed option list
The system SHALL provide a `Select` component that supports two-way binding via `modelValue`/`update:modelValue` over a required `options` list of `{ value, label }` pairs, with an optional `label` and `disabled` state.

#### Scenario: Choosing an option updates bound value
- **WHEN** a user selects a different option in the `Select` field
- **THEN** the component SHALL emit `update:modelValue` with the selected option's `value`

#### Scenario: Disabled select cannot be changed
- **WHEN** `disabled` is `true`
- **THEN** the rendered select element SHALL have the `disabled` attribute and SHALL NOT emit `update:modelValue` on interaction
