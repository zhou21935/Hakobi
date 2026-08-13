## MODIFIED Requirements

### Requirement: Order validation rules have a single shared source

The system SHALL define order name and positive amount validation in exactly one shared frontend module and SHALL apply that module from both the order create/edit form and orders store write operations. Product categories SHALL normalize to an array and SHALL be valid when empty or when every value belongs to `merch`, `book`, or `other`.

#### Scenario: Form and store apply identical core rules

- **WHEN** the same order data with an empty name or non-positive amount is evaluated through the form and a direct store write
- **THEN** both SHALL reject it using the same field error identification

#### Scenario: Empty product category array is valid

- **WHEN** order data contains `productCategories: []`
- **THEN** both the form and store validation SHALL accept the category field

#### Scenario: Unsupported product category is invalid

- **WHEN** order data contains `productCategories: ["unsupported"]`
- **THEN** both the form and store validation SHALL reject the category field

### Requirement: Orders store rejects invalid data on write

The orders store SHALL reject a write when the merged order has an empty name, a non-finite or non-positive amount, or an unsupported product category. It SHALL allow an empty product category array and SHALL NOT issue an API mutation for rejected data.

#### Scenario: Invalid core data is rejected

- **WHEN** add or update receives an empty name, `0`, `-6`, a non-numeric amount, or an unsupported product category
- **THEN** the store SHALL NOT issue the corresponding API request

#### Scenario: Optional categories are accepted

- **WHEN** add or update receives a non-empty name, positive amount, and `productCategories: []`
- **THEN** the store SHALL issue the API mutation

### Requirement: Order form displays field-specific errors sourced from the shared validator

The order form SHALL display shared name and amount validation errors and SHALL NOT define or display a product-category-required error. Unsupported product category values received through a non-UI path MUST still be rejected by the shared validator.

#### Scenario: Core validation fails

- **WHEN** a user submits an empty name or an amount that is empty, zero, negative, non-numeric, or non-finite
- **THEN** the form SHALL display the shared field error and SHALL NOT submit

#### Scenario: Category selection is empty

- **WHEN** a user submits an otherwise valid form with no product category selected
- **THEN** the form SHALL submit without a product category error
