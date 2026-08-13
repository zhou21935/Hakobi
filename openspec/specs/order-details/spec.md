# order-details Specification

## Purpose

TBD - created by archiving change 'complete-order-details'. Update Purpose after archive.

## Requirements

### Requirement: Users can inspect complete order details
The frontend SHALL provide a read-only order details modal that displays the selected order's basic information, order attributes, logistics information, dates, and system timestamps. Optional fields with an empty string or null value SHALL display `尚未填寫`.

#### Scenario: Complete details are displayed
- **WHEN** a user opens details for an order containing platform, product categories, product URL, notes, amount, currency, payment status, preorder status, shipment status, shipping method, tracking number, order date, estimated shipment date, estimated arrival date, creation time, and update time
- **THEN** the modal SHALL display every value in its corresponding section without issuing another API request

#### Scenario: Optional details are absent
- **WHEN** a user opens an order whose optional text and date fields are empty
- **THEN** the modal SHALL display `尚未填寫` for each absent value and SHALL remain operable

---
### Requirement: Order details use an explicit card action and support editing
Each order card SHALL expose a distinct details control separate from edit and delete. The details modal SHALL expose close and edit controls, and choosing edit SHALL close details and open the existing edit form with the same order's current confirmed values.

#### Scenario: Explicit details action opens the selected order
- **WHEN** a user activates the details control on one order card
- **THEN** the frontend SHALL open the read-only modal for that order and SHALL NOT treat unrelated card clicks as details activation

#### Scenario: Edit is entered from details
- **WHEN** a user activates edit from the details modal
- **THEN** the frontend SHALL close details and open the existing edit form populated with that order's current confirmed values

---
### Requirement: Tracking numbers can be copied with visible feedback
The details modal SHALL provide independent copy controls when non-empty order-number or tracking-number values exist. The frontend MUST copy the exact displayed value for the activated field, SHALL show temporary success feedback only for that field after a successful copy, and SHALL show a user-readable failure message while keeping the value visible when copying fails.

#### Scenario: Order number is copied
- **WHEN** a user activates copy for order number `114-2938471-0038` and the Clipboard API succeeds
- **THEN** the frontend SHALL write exactly `114-2938471-0038` to the clipboard and SHALL temporarily display `已複製 ✓` for the order-number field

#### Scenario: Tracking number is copied
- **WHEN** a user activates copy for tracking number `EN123456789JP` and the Clipboard API succeeds
- **THEN** the frontend SHALL write exactly `EN123456789JP` to the clipboard and SHALL temporarily display `已複製 ✓` for the tracking-number field

#### Scenario: Clipboard operation fails
- **WHEN** the Clipboard API rejects a copy operation for either field
- **THEN** the frontend SHALL display `複製失敗，請手動選取` for that field, SHALL keep its value visible, and SHALL NOT produce an unhandled error

#### Scenario: Copyable value is absent
- **WHEN** the selected order has an empty order number or tracking number
- **THEN** the corresponding field SHALL display `尚未填寫` and SHALL NOT render a copy control


<!-- @trace
source: add-copyable-order-number
updated: 2026-08-13
code:
  - src/components/ui/CopyableDetailValue.vue
  - src/components/orders/OrderDetailsModal.vue
tests:
  - tests/components/ui/CopyableDetailValue.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
-->

---
### Requirement: Product links open only through safe web protocols
The details modal SHALL render an `開啟商品頁` action only for a product URL whose protocol is HTTP or HTTPS. The action MUST open a new browsing context with opener access disabled.

#### Scenario: HTTPS product link is opened
- **WHEN** an order contains `https://example.com/item/1` and the user activates `開啟商品頁`
- **THEN** the frontend SHALL open that URL in a new browsing context with `noopener` and `noreferrer`

#### Scenario: Product link is absent or unsafe
- **WHEN** an order contains an empty product URL or a URL using a protocol other than HTTP or HTTPS
- **THEN** the frontend SHALL NOT render a clickable product link

---
### Requirement: Order details remain usable on narrow viewports
The details modal and its close, edit, copy, and product-link controls MUST remain readable, visible, and operable without horizontal page overflow on narrow viewports.

#### Scenario: Details are viewed on a narrow viewport
- **WHEN** the details modal is rendered at a 375 pixel viewport width with long logistics text
- **THEN** content SHALL wrap within the modal and every action SHALL remain operable without horizontal page scrolling

---
### Requirement: Order details present distinct responsive information groups
The order details modal SHALL present basic information, order attributes, logistics information, and business dates as separate rounded warm-purple information surfaces. At viewport widths below the `sm` breakpoint, every information group SHALL arrange fields in one column. At the `sm` breakpoint and above, each group SHALL arrange compatible fields in two columns while long-form values remain readable. System information SHALL appear after a visual divider with lower emphasis and SHALL NOT use the primary information-card surface.

#### Scenario: Details are grouped on a desktop viewport
- **WHEN** a user opens order details at a viewport width at or above the `sm` breakpoint
- **THEN** the four primary sections SHALL appear as distinct rounded warm-purple surfaces with compatible fields arranged in two columns
- **AND** system information SHALL appear after a divider with lower visual emphasis

#### Scenario: Details use one column on a narrow viewport
- **WHEN** a user opens order details at a 375 pixel viewport width
- **THEN** every information group SHALL arrange its fields in one column without horizontal page overflow

---
### Requirement: Order details use explicit date and timestamp formats
The order details modal SHALL display order date, estimated shipment date, and estimated arrival date as `YYYY/MM/DD` without a time component. It SHALL display creation and update timestamps converted to the `Asia/Taipei` time zone as `YYYY/MM/DD HH:mm`, using a 24-hour clock with zero-padded numeric fields. Empty date or timestamp values SHALL continue to display `尚未填寫`.

#### Scenario: Business dates omit time components
- **WHEN** an order business-date value is `2026-08-05T16:00:00.000Z`
- **THEN** the corresponding detail value SHALL display `2026/08/05`
- **AND** it SHALL NOT display a time or time-zone suffix

#### Scenario: System timestamps use Taipei 24-hour time
- **WHEN** an order system timestamp is `2026-08-06T14:55:00.000Z`
- **THEN** the corresponding detail value SHALL display `2026/08/06 22:55`

---
### Requirement: Order details retain fixed actions and a discoverable content scrollbar
The order details modal SHALL keep its header and footer actions visible while overflowing detail content scrolls in one internal content region. On platforms supporting scrollbar styling, that region SHALL use an approximately 6 pixel thin scrollbar with a transparent track, a rounded low-contrast warm-gray or warm-purple thumb, no arrow buttons, and increased thumb contrast during pointer interaction. Platforms without custom scrollbar support SHALL retain a functional native scrollbar.

#### Scenario: Long details scroll without moving actions
- **WHEN** order details exceed the modal maximum height
- **THEN** the detail content SHALL scroll independently while the close and edit actions remain visible
- **AND** the page SHALL expose only the modal content region as scrollable

#### Scenario: Custom scrollbar styling is unsupported
- **WHEN** the browser does not support the configured custom scrollbar rules
- **THEN** the detail content SHALL remain scrollable through the browser's native scrollbar, mouse wheel, keyboard, and touch input
