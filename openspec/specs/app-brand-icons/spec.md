# app-brand-icons Specification

## Purpose

Define the official Hakobi brand assets, browser-tab identity, deterministic navigation icons, and accessible copy-control icon behavior.

## Requirements

### Requirement: Hakobi brand identity is consistent across application chrome

The frontend SHALL render the official `hakobi-logo.svg` from the supplied Hakobi logo archive in the sidebar brand area, SHALL use the archive's official `hakobi-icon.svg` as its SVG favicon without redrawing either asset, and MUST keep the browser document title equal to the exact string `Hakobi` on initial load and after every route navigation.

#### Scenario: Sidebar brand is displayed

- **WHEN** the application sidebar is rendered
- **THEN** the brand area SHALL contain the supplied official Hakobi logo rather than a package emoji

#### Scenario: Browser tab remains branded during navigation

- **WHEN** the application initially loads or completes navigation to any route
- **THEN** the browser SHALL use the Hakobi SVG favicon
- **AND** `document.title` SHALL equal `Hakobi`


<!-- @trace
source: replace-emoji-with-brand-icons
updated: 2026-08-14
code:
  - public/favicon.svg
  - public/hakobi-logo.svg
  - src/components/common/AppSidebar.vue
  - index.html
  - src/router/index.js
tests:
  - tests/components/common/AppSidebar.spec.js
  - tests/router/authGuard.spec.js
-->

---
### Requirement: Sidebar navigation uses deterministic SVG icons

The frontend SHALL render the specified SVG icon for Overview, Overseas Purchasing, Consolidated Parcels, and Profile navigation destinations, and SHALL NOT use emoji for those destinations.

#### Scenario: All navigation destinations are rendered

- **WHEN** the authenticated application sidebar is displayed
- **THEN** Overview SHALL render the home icon
- **AND** Overseas Purchasing SHALL render the globe icon
- **AND** Consolidated Parcels SHALL render the parcel icon
- **AND** Profile SHALL render the user icon

#### Scenario: Navigation remains accessible

- **WHEN** a screen reader or user inspects a navigation link containing an icon
- **THEN** the link text SHALL continue to provide its accessible name
- **AND** the decorative SVG SHALL be hidden from the accessibility tree


<!-- @trace
source: replace-emoji-with-brand-icons
updated: 2026-08-14
code:
  - src/components/common/AppSidebar.vue
  - src/components/icons/AppIcon.vue
tests:
  - tests/components/common/AppSidebar.spec.js
  - tests/components/icons/AppIcon.spec.js
-->

---
### Requirement: Copy controls use the copy SVG without changing clipboard behavior

A copyable detail value SHALL render the specified copy SVG inside its available copy control while preserving the existing accessible label, exact-value Clipboard API write, isolated success feedback, two-second reset, empty-value fallback, and surfaced failure behavior.

#### Scenario: Available value exposes an icon copy control

- **WHEN** a copyable detail component receives a non-empty value
- **THEN** it SHALL render a copy icon control with the accessible label `複製 <label>`
- **AND** activating the control SHALL copy the exact displayed value

#### Scenario: Copy succeeds

- **WHEN** the Clipboard API resolves successfully
- **THEN** only the activated component SHALL display `已複製 ✓`
- **AND** it SHALL return to the default copy state after two seconds

#### Scenario: Value is empty or copying fails

- **WHEN** the value is empty, null, or undefined
- **THEN** the component SHALL display `尚未填寫` and SHALL NOT render a copy control
- **WHEN** the Clipboard API is unavailable or rejects the write
- **THEN** the component SHALL retain the selectable value and display `複製失敗，請手動選取`

<!-- @trace
source: replace-emoji-with-brand-icons
updated: 2026-08-14
code:
  - src/components/ui/CopyableDetailValue.vue
  - src/components/icons/AppIcon.vue
tests:
  - tests/components/ui/CopyableDetailValue.spec.js
  - tests/components/icons/AppIcon.spec.js
-->
