## MODIFIED Requirements

### Requirement: Order mutations are confirmed by the backend

The frontend store SHALL update its confirmed collection only from successful backend order responses. Create and update payloads SHALL include `orderNumber` and SHALL allow `productCategories: []`. Attachment mutations SHALL update attachment state only from successful attachment responses and SHALL NOT roll back a confirmed order when a later attachment upload fails.

#### Scenario: Order create confirms number and optional categories

- **WHEN** create succeeds with `orderNumber: 'A-100'` and `productCategories: []`
- **THEN** the store SHALL add the returned order with those exact values

#### Scenario: Order mutation fails

- **WHEN** an order create or update request fails
- **THEN** the store SHALL preserve its previously confirmed order collection

#### Scenario: Attachment upload partially fails after create

- **WHEN** order creation succeeds and a later attachment request fails
- **THEN** the store SHALL retain the created order
- **AND** the UI SHALL retain successful attachment metadata and expose the failed filename for retry

### Requirement: API errors use one frontend contract

The API client SHALL normalize order and attachment failures into an error containing a stable frontend code, user-safe message, and HTTP status. It SHALL preserve attachment limit/type/size codes and MUST treat HTTP 401 as an invalid authenticated flow.

#### Scenario: Attachment limit is returned

- **WHEN** the backend responds HTTP 409 with code `ATTACHMENT_LIMIT_REACHED`
- **THEN** the client SHALL expose that code and the backend's user-safe message

#### Scenario: Backend returns unauthorized

- **WHEN** any order or attachment request responds with HTTP 401
- **THEN** the frontend SHALL clear user-scoped order state and direct the user to sign in again

## ADDED Requirements

### Requirement: Attachment API requests preserve multipart semantics

The frontend API SHALL send each attachment as one `FormData` request and MUST allow the runtime to generate the multipart Content-Type boundary. It SHALL provide list, upload, download, and delete methods using encoded order and attachment identifiers.

#### Scenario: File is uploaded

- **WHEN** the client uploads a selected file
- **THEN** the request body SHALL be `FormData` containing one `file` field
- **AND** the client SHALL NOT manually set a JSON or multipart Content-Type header

#### Scenario: Attachment identifiers contain unsafe URL characters

- **WHEN** an order or attachment identifier is placed into a request path
- **THEN** the client SHALL URL-encode the identifier before issuing the request
