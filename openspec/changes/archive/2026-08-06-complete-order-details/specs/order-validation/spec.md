## ADDED Requirements

### Requirement: Product URLs use shared safe web validation
The shared order validator SHALL accept an empty product URL as an optional value and SHALL accept a non-empty product URL only when it is a valid absolute URL using HTTP or HTTPS. The create and edit form and direct orders store writes MUST use the same validation result and field error.

#### Scenario: Safe product URL is accepted
- **WHEN** order data contains `https://example.com/item/1` as its product URL
- **THEN** the shared validator SHALL accept the product URL and SHALL NOT report a product URL field error

#### Scenario: Empty product URL is accepted
- **WHEN** order data contains an empty string as its product URL
- **THEN** the shared validator SHALL accept the optional product URL

#### Scenario: Unsafe or malformed product URL is rejected
- **WHEN** order data contains a malformed URL or a URL using a protocol other than HTTP or HTTPS
- **THEN** the shared validator SHALL reject the data with a product URL field error, the form SHALL display that error, and neither the form nor a direct store write SHALL issue an API mutation

##### Example: product URL boundaries

| Input | Expected result |
| --- | --- |
| `` | accepted as absent |
| `https://example.com/item/1` | accepted |
| `http://example.com/item/1` | accepted |
| `javascript:alert(1)` | rejected |
| `example.com/item/1` | rejected |
