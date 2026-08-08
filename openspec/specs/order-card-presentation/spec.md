# order-card-presentation Specification

## Purpose

TBD - created by archiving change 'refine-order-card-layout-and-icons'. Update Purpose after archive.

## Requirements

### Requirement: Order cards present information in three visual rows
The order list SHALL render each order card with a first row containing shipment status, preorder status when applicable, and product category tags; a second row containing product name, formatted amount, and the details, edit, and delete actions; and a third row containing only the estimated shipment date when available.
The card SHALL render an ISO date-time estimated shipment value as its `YYYY-MM-DD` calendar-date prefix and SHALL NOT display its time component.

#### Scenario: Complete order card information is arranged by row
- **WHEN** an order has shipment status `待出貨`, preorder status, category `周邊`, product name `test`, amount `NT$50`, and estimated shipment date `2026-08-09`
- **THEN** the first row displays `待出貨`, `預購`, and `周邊`
- **AND** the second row displays `test`, `NT$50`, and the three action controls
- **AND** the third row displays `預計出貨日 2026-08-09`

#### Scenario: Optional tags and date are absent
- **WHEN** an order is not a preorder, has no product category, and has no estimated shipment date
- **THEN** the card omits the preorder tag, category tags, and estimated shipment date without leaving labeled placeholder content

#### Scenario: ISO estimated shipment value is date-only
- **WHEN** an order has estimated shipment value `2026-08-09T16:00:00.000Z`
- **THEN** the card displays `預計出貨日 2026-08-09`
- **AND** the card does not display `T16:00:00.000Z`


<!-- @trace
source: refine-order-card-layout-and-icons
updated: 2026-08-09
code:
  - .agents/skills/spectra-archive/SKILL.md
  - src/components/orders/OrderCard.vue
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
tests:
  - src/views/__tests__/AllOrders.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: Order card actions use consistent controls
The details control SHALL display the visible text `訂單詳情`, while the edit and delete controls SHALL render the provided Font Awesome pen-to-square and trash-can SVG paths. None of the three controls SHALL render emoji. Each control MUST retain its accessible name and existing emitted event contract.

#### Scenario: Text and icon controls are rendered
- **WHEN** an order card is displayed
- **THEN** its details control displays the text `訂單詳情` and contains no SVG icon
- **AND** its edit and delete controls contain inline SVG icons
- **AND** the controls expose the accessible names `查看詳情`, `編輯`, and `刪除`
- **AND** no emoji is rendered by those controls

#### Scenario: Existing action events remain compatible
- **WHEN** a user activates the details, edit, or delete control
- **THEN** the component emits `details` with the order, `edit` with the order, or `request-delete` with the order identifier respectively


<!-- @trace
source: refine-order-card-layout-and-icons
updated: 2026-08-09
code:
  - .agents/skills/spectra-archive/SKILL.md
  - src/components/orders/OrderCard.vue
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
tests:
  - src/views/__tests__/AllOrders.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: Three-row card remains usable on narrow screens
The card SHALL preserve the three information groups on narrow screens while allowing row contents to wrap or stack without horizontal overflow, clipped text, or overlapping action controls.

#### Scenario: Narrow viewport layout
- **WHEN** the card is rendered below the `sm` breakpoint
- **THEN** tags wrap within the first row
- **AND** the product name appears at the left and the formatted amount appears at the right of the second row
- **AND** `預計出貨日 <date>` appears at the left and the details, edit, and delete controls appear at the right of the third row
- **AND** no divider line appears between the second and third rows

#### Scenario: Tablet and desktop layout remains unchanged
- **WHEN** the card is rendered at or above the `sm` breakpoint
- **THEN** the product name, formatted amount, and action controls retain the existing primary-row arrangement
- **AND** `預計出貨日 <date>` remains a separate final row without a divider line

<!-- @trace
source: refine-order-card-layout-and-icons
updated: 2026-08-09
code:
  - .agents/skills/spectra-archive/SKILL.md
  - src/components/orders/OrderCard.vue
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
tests:
  - src/views/__tests__/AllOrders.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/views/__tests__/OrderList.spec.js
-->