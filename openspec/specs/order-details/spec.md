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
The details modal SHALL provide a copy control only when a non-empty tracking number exists. The frontend MUST copy the exact displayed tracking number, SHALL show temporary success feedback after a successful copy, and SHALL show a user-readable failure message while keeping the number visible when copying fails.

#### Scenario: Tracking number is copied
- **WHEN** a user activates copy for tracking number `EN123456789JP` and the Clipboard API succeeds
- **THEN** the frontend SHALL write exactly `EN123456789JP` to the clipboard and SHALL temporarily display `已複製 ✓`

#### Scenario: Clipboard operation fails
- **WHEN** the Clipboard API rejects the copy operation
- **THEN** the frontend SHALL display `複製失敗，請手動選取`, SHALL keep the tracking number visible, and SHALL NOT produce an unhandled error

#### Scenario: Tracking number is absent
- **WHEN** the selected order has an empty tracking number
- **THEN** the frontend SHALL display `尚未填寫` and SHALL NOT render a copy control

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
