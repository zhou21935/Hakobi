## ADDED Requirements

### Requirement: Checkbox component supports v-model binding with a label

The system SHALL provide a `Checkbox` component that supports two-way binding via `modelValue`/`update:modelValue` over a boolean value, with an optional `label` prop displayed next to the checkbox, and an optional `disabled` prop (default `false`).

#### Scenario: Clicking the checkbox toggles the bound value

- **WHEN** a user clicks an enabled `Checkbox` whose `modelValue` is `false`
- **THEN** the component SHALL emit `update:modelValue` with `true`

#### Scenario: Disabled checkbox does not emit updates

- **WHEN** `disabled` is `true` and a user clicks the `Checkbox`
- **THEN** the rendered checkbox input SHALL have the `disabled` attribute and SHALL NOT emit `update:modelValue`

#### Scenario: Label renders next to the checkbox

- **WHEN** a `Checkbox` is used with a non-empty `label` prop
- **THEN** the component SHALL render the label text adjacent to the checkbox input
