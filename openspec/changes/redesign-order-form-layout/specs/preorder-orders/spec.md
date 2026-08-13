## ADDED Requirements

### Requirement: Order form uses grouped sections and frontend-only future fields

The order create and edit form SHALL present existing controls in four labelled sections named Product, Cargo, Shipping, and Notes while preserving the current create, edit, category, validation, pending, and submit behavior. The form SHALL provide an order-number input and a multiple-attachment picker with visible filename and type entries that users can remove. Order number and attachments MUST remain local to the currently open form, MUST reset whenever the form is reopened, and MUST NOT be included in the submit event payload.

#### Scenario: Existing fields appear in the intended sections

- **WHEN** a user opens either the create or edit order form
- **THEN** product identity, category, link, amount, currency, payment, preorder, and order number controls appear in Product
- **AND** order date, shipment status, estimated ship date, and estimated arrival date appear in Cargo
- **AND** shipping method and tracking number appear in Shipping
- **AND** notes and attachment controls appear in Notes

#### Scenario: Existing category semantics remain unchanged

- **WHEN** a user creates an order from the all-orders view
- **THEN** the form requires exactly one order category from Overseas Purchasing or Consolidated Parcel
- **AND** product categories remain a multiple selection containing Merchandise, Books, and Other
- **AND** the reference design categories are not introduced

#### Scenario: Frontend-only fields are excluded from submission

- **GIVEN** the user enters order number "114-2938471-0038" and selects "invoice.pdf"
- **AND** all existing required order fields are valid
- **WHEN** the user submits the form
- **THEN** the form emits the existing order payload
- **AND** the payload has neither an orderNumber property nor a files property

#### Scenario: Attachment list supports multiple entries and removal

- **WHEN** the user selects "invoice.pdf" and "photo.jpg" in one or more selections
- **THEN** the Notes section displays both filenames and their file types
- **AND** removing "invoice.pdf" leaves "photo.jpg" visible

#### Scenario: Frontend-only fields reset on reopen

- **GIVEN** the user entered an order number and selected attachments
- **WHEN** the form closes and opens again in create or edit mode
- **THEN** the order-number input is empty
- **AND** the attachment list is empty

### Requirement: Order notes support visible multiline editing

The order create and edit form SHALL render Notes as a multiline textarea with enough minimum height to display multiple lines. The textarea MUST accept natural line breaks, and the existing submit payload MUST preserve those line breaks in the notes string without changing the order API shape.

#### Scenario: User enters multiline notes

- **GIVEN** the user enters "第一行\n第二行" in Notes
- **WHEN** the user submits an otherwise valid order form
- **THEN** the emitted payload contains notes equal to "第一行\n第二行"
- **AND** the Notes control remains a textarea with a multi-line minimum height
