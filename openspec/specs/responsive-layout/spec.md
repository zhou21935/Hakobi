# responsive-layout Specification

## Purpose

TBD - created by archiving change 'rwd-responsive-layout'. Update Purpose after archive.

## Requirements

### Requirement: Sidebar collapses into a drawer on narrow viewports

The system SHALL render `AppSidebar` as a hidden, off-canvas drawer on viewports narrower than the `md` breakpoint (768px), and SHALL render it as a fixed, always-visible sidebar on viewports at or above the `md` breakpoint.

#### Scenario: Sidebar hidden by default on narrow viewport
- **WHEN** the viewport width is below 768px and the page loads
- **THEN** the sidebar SHALL be visually hidden (off-canvas) and SHALL NOT overlap or push the main content

#### Scenario: Sidebar opens via toggle button on narrow viewport
- **WHEN** the viewport width is below 768px and the user activates the sidebar toggle button
- **THEN** the sidebar SHALL slide into view and a semi-transparent overlay SHALL appear behind it, above the main content

#### Scenario: Sidebar closes via overlay or navigation
- **WHEN** the viewport width is below 768px, the sidebar is open, and the user clicks the overlay or activates a navigation link inside the sidebar
- **THEN** the sidebar SHALL slide back off-canvas and the overlay SHALL be removed

#### Scenario: Sidebar always visible on wide viewport
- **WHEN** the viewport width is at or above 768px
- **THEN** the sidebar SHALL be displayed as a fixed, always-visible panel regardless of the toggle state, and the overlay and toggle button SHALL NOT be rendered


<!-- @trace
source: rwd-responsive-layout
updated: 2026-07-15
code:
  - src/components/orders/OrderFormModal.vue
  - src/App.vue
  - src/views/AllOrders.vue
  - src/components/AppSidebar.vue
  - src/components/orders/OrderCard.vue
  - src/views/OrderList.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/views/Dashboard.vue
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/__tests__/AppSidebar.spec.js
-->

---
### Requirement: Main content area does not reserve fixed sidebar space on narrow viewports

The system SHALL render the main content area in `App.vue` without a fixed left margin on viewports narrower than the `md` breakpoint, and SHALL preserve the existing fixed left margin on viewports at or above the `md` breakpoint.

#### Scenario: Main content spans full width on narrow viewport
- **WHEN** the viewport width is below 768px
- **THEN** the main content area SHALL start at the left edge of the viewport with no reserved sidebar margin

#### Scenario: Main content reserves sidebar margin on wide viewport
- **WHEN** the viewport width is at or above 768px
- **THEN** the main content area SHALL retain the fixed left margin matching the sidebar width


<!-- @trace
source: rwd-responsive-layout
updated: 2026-07-15
code:
  - src/components/orders/OrderFormModal.vue
  - src/App.vue
  - src/views/AllOrders.vue
  - src/components/AppSidebar.vue
  - src/components/orders/OrderCard.vue
  - src/views/OrderList.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/views/Dashboard.vue
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/__tests__/AppSidebar.spec.js
-->

---
### Requirement: Dashboard layout reflows on narrow viewports

The system SHALL rearrange the Dashboard page's header and statistic cards into a single-column, vertically stacked layout on viewports narrower than the `md` breakpoint, without horizontal overflow.

#### Scenario: Statistic cards stack on narrow viewport
- **WHEN** the viewport width is below 768px and the Dashboard page is displayed
- **THEN** the statistic cards SHALL be arranged in a single column (or a reduced column count) and SHALL NOT cause horizontal scrolling

#### Scenario: Header reflows on narrow viewport
- **WHEN** the viewport width is below 768px and the Dashboard page is displayed
- **THEN** the page title and any header controls SHALL stack vertically instead of being forced onto one row


<!-- @trace
source: rwd-responsive-layout
updated: 2026-07-15
code:
  - src/components/orders/OrderFormModal.vue
  - src/App.vue
  - src/views/AllOrders.vue
  - src/components/AppSidebar.vue
  - src/components/orders/OrderCard.vue
  - src/views/OrderList.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/views/Dashboard.vue
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/__tests__/AppSidebar.spec.js
-->

---
### Requirement: All Orders page filter row and list reflow on narrow viewports

The system SHALL rearrange the All Orders page's filter row, list spacing, and modal trigger controls to stack vertically and remain fully visible on viewports narrower than the `md` breakpoint.

#### Scenario: Filter row stacks on narrow viewport
- **WHEN** the viewport width is below 768px and the All Orders page is displayed
- **THEN** the filter controls SHALL stack vertically and SHALL NOT cause horizontal overflow

#### Scenario: Modal trigger remains reachable on narrow viewport
- **WHEN** the viewport width is below 768px and the All Orders page is displayed
- **THEN** the control that opens the order form modal SHALL remain fully visible and tappable within the viewport


<!-- @trace
source: rwd-responsive-layout
updated: 2026-07-15
code:
  - src/components/orders/OrderFormModal.vue
  - src/App.vue
  - src/views/AllOrders.vue
  - src/components/AppSidebar.vue
  - src/components/orders/OrderCard.vue
  - src/views/OrderList.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/views/Dashboard.vue
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/__tests__/AppSidebar.spec.js
-->

---
### Requirement: Order List page header and actions reflow on narrow viewports

The system SHALL rearrange the Order List page's title, action buttons, and list items into a stacked, single-column layout on viewports narrower than the `md` breakpoint.

#### Scenario: Header and action buttons stack on narrow viewport
- **WHEN** the viewport width is below 768px and an Order List page is displayed
- **THEN** the page title and action buttons SHALL stack vertically instead of overflowing horizontally


<!-- @trace
source: rwd-responsive-layout
updated: 2026-07-15
code:
  - src/components/orders/OrderFormModal.vue
  - src/App.vue
  - src/views/AllOrders.vue
  - src/components/AppSidebar.vue
  - src/components/orders/OrderCard.vue
  - src/views/OrderList.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/views/Dashboard.vue
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/__tests__/AppSidebar.spec.js
-->

---
### Requirement: Order card content remains readable and tappable on narrow viewports

The system SHALL wrap `OrderCard` text, tags, and buttons on viewports narrower than the `md` breakpoint so that no content is clipped, overlapping, or rendered outside the card boundary.

#### Scenario: Order card content wraps instead of overflowing
- **WHEN** the viewport width is below 768px and an `OrderCard` is displayed
- **THEN** its text, tags, and action buttons SHALL wrap onto additional lines as needed and SHALL remain fully visible within the card boundary


<!-- @trace
source: rwd-responsive-layout
updated: 2026-07-15
code:
  - src/components/orders/OrderFormModal.vue
  - src/App.vue
  - src/views/AllOrders.vue
  - src/components/AppSidebar.vue
  - src/components/orders/OrderCard.vue
  - src/views/OrderList.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/views/Dashboard.vue
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/__tests__/AppSidebar.spec.js
-->

---
### Requirement: Status filter tabs remain usable on narrow viewports

The system SHALL make `StatusFilterTabs` horizontally scrollable (or wrap) on viewports narrower than the `md` breakpoint so that no tab is truncated or hidden.

#### Scenario: Status tabs scroll horizontally on narrow viewport
- **WHEN** the viewport width is below 768px and `StatusFilterTabs` is displayed with more tabs than fit on one line
- **THEN** the tab row SHALL allow horizontal scrolling (or wrap onto multiple lines) so every tab remains reachable and none is truncated


<!-- @trace
source: rwd-responsive-layout
updated: 2026-07-15
code:
  - src/components/orders/OrderFormModal.vue
  - src/App.vue
  - src/views/AllOrders.vue
  - src/components/AppSidebar.vue
  - src/components/orders/OrderCard.vue
  - src/views/OrderList.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/views/Dashboard.vue
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/__tests__/AppSidebar.spec.js
-->

---
### Requirement: Order form modal remains operable on narrow viewports

The system SHALL constrain `OrderFormModal` to the visible viewport height and SHALL arrange its form fields in a single column on viewports narrower than the `md` breakpoint, with vertical scrolling available when content exceeds the viewport.

#### Scenario: Modal fits within viewport on narrow screen
- **WHEN** the viewport width is below 768px and `OrderFormModal` is open
- **THEN** the modal SHALL NOT exceed the visible viewport height, and SHALL become vertically scrollable when its content is taller than the viewport

#### Scenario: Form fields stack in a single column on narrow screen
- **WHEN** the viewport width is below 768px and `OrderFormModal` is open
- **THEN** form fields SHALL be arranged in a single column instead of a multi-column grid

<!-- @trace
source: rwd-responsive-layout
updated: 2026-07-15
code:
  - src/components/orders/OrderFormModal.vue
  - src/App.vue
  - src/views/AllOrders.vue
  - src/components/AppSidebar.vue
  - src/components/orders/OrderCard.vue
  - src/views/OrderList.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/views/Dashboard.vue
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/__tests__/AppSidebar.spec.js
-->