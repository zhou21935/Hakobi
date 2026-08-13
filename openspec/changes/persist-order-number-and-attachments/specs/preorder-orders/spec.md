## MODIFIED Requirements

### Requirement: Orders can be tagged with one or more product categories

Orders SHALL support zero or more product categories selected from Merchandise, Books, and Other. The create/edit form SHALL present the categories as an optional multiple selection, SHALL submit an empty array when none are selected, and SHALL reject unsupported category values.

#### Scenario: No product category is selected

- **WHEN** a user submits an otherwise valid order without selecting a product category
- **THEN** the order SHALL be created or updated with `productCategories: []`
- **AND** the form SHALL NOT display a product category required error

#### Scenario: Supported categories are selected

- **WHEN** a user selects Merchandise and Books
- **THEN** the order SHALL store `productCategories: ["merch", "book"]`

#### Scenario: Unsupported category is submitted

- **WHEN** an order mutation includes a product category outside `merch`, `book`, and `other`
- **THEN** the mutation SHALL be rejected with a validation error

## ADDED Requirements

### Requirement: Order number is persisted through create and edit

The create/edit form SHALL accept an optional order number of at most 200 characters, and successful create and edit operations SHALL return and display the backend-confirmed value.

#### Scenario: Order number round trip

- **GIVEN** the user enters `114-2938471-0038`
- **WHEN** an otherwise valid order is created and later reopened for editing
- **THEN** the order number field SHALL contain `114-2938471-0038`

#### Scenario: Empty order number

- **WHEN** the order number is left empty
- **THEN** the order SHALL persist an empty string without a validation error

### Requirement: Amount input prevents negative entry without a spinner

The amount control SHALL use a text control with decimal input mode, SHALL NOT expose native number spinner controls, and SHALL prevent a negative value from remaining in the control. Shared frontend, backend, and database validation MUST continue to require a finite amount greater than zero.

#### Scenario: Positive decimal is entered

- **WHEN** a user enters `35.29`
- **THEN** the control SHALL retain `35.29`
- **AND** an otherwise valid order SHALL submit amount `35.29`

#### Scenario: Negative input is attempted

- **WHEN** a user types or pastes `-6`
- **THEN** the control SHALL NOT contain a negative value
- **AND** no submitted request SHALL contain a negative amount

#### Scenario: Non-positive or invalid amount reaches validation

- **WHEN** amount is empty, zero, non-numeric, non-finite, or negative
- **THEN** the order SHALL NOT be submitted or persisted
- **AND** the form SHALL display the shared positive-amount validation error
