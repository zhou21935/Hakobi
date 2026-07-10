# ui-components Specification

## Purpose

TBD - created by archiving change 'add-ui-components'. Update Purpose after archive.

## Requirements

### Requirement: Button component renders with variant and size options
The system SHALL provide a `Button` component that accepts `variant` (`'primary' | 'secondary' | 'danger' | 'ghost'`, default `'primary'`) and `size` (`'sm' | 'md' | 'lg'`, default `'md'`) props to control its visual style.

#### Scenario: Default button renders as primary
- **WHEN** a `Button` is used without a `variant` prop
- **THEN** it SHALL render with the `primary` variant style

#### Scenario: Button forwards click events
- **WHEN** a user clicks a non-disabled `Button`
- **THEN** the component SHALL emit a native `click` event to the parent

#### Scenario: Disabled button does not emit click
- **WHEN** `disabled` is `true`
- **THEN** the rendered `<button>` element SHALL have the `disabled` attribute and SHALL NOT emit `click` events


<!-- @trace
source: add-ui-components
updated: 2026-07-10
code:
  - src/components/ui/Input.vue
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .spectra.yaml
  - .agents/skills/spectra-apply/SKILL.md
  - src/components/ui/Card.vue
  - src/components/ui/Modal.vue
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/AppSidebar.vue
  - src/components/ui/Button.vue
  - src/components/ui/Table.vue
  - src/router/index.js
  - .agents/skills/spectra-drift/SKILL.md
  - src/views/UiShowcase.vue
  - .agents/skills/spectra-audit/SKILL.md
  - CLAUDE.md
  - .agents/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
-->

---
### Requirement: Card component provides structured content slots
The system SHALL provide a `Card` component with a default content slot and optional `header` and `footer` slots, and a `padding` prop (default `true`) controlling default internal spacing.

#### Scenario: Card renders only default slot content
- **WHEN** a `Card` is used with only default slot content
- **THEN** the component SHALL render the content without header or footer regions

#### Scenario: Card renders header and footer when provided
- **WHEN** a `Card` is used with `header` and `footer` slot content
- **THEN** the component SHALL render the header above and footer below the default content


<!-- @trace
source: add-ui-components
updated: 2026-07-10
code:
  - src/components/ui/Input.vue
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .spectra.yaml
  - .agents/skills/spectra-apply/SKILL.md
  - src/components/ui/Card.vue
  - src/components/ui/Modal.vue
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/AppSidebar.vue
  - src/components/ui/Button.vue
  - src/components/ui/Table.vue
  - src/router/index.js
  - .agents/skills/spectra-drift/SKILL.md
  - src/views/UiShowcase.vue
  - .agents/skills/spectra-audit/SKILL.md
  - CLAUDE.md
  - .agents/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
-->

---
### Requirement: Input component supports v-model binding and validation error display
The system SHALL provide an `Input` component that supports two-way binding via `modelValue`/`update:modelValue` and can display a validation error message via an `error` prop.

#### Scenario: Typing updates bound value
- **WHEN** a user types into the `Input` field
- **THEN** the component SHALL emit `update:modelValue` with the new value

#### Scenario: Error message renders when error prop is set
- **WHEN** the `error` prop is a non-empty string
- **THEN** the component SHALL render the error text below the field and SHALL apply an error visual state to the field border


<!-- @trace
source: add-ui-components
updated: 2026-07-10
code:
  - src/components/ui/Input.vue
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .spectra.yaml
  - .agents/skills/spectra-apply/SKILL.md
  - src/components/ui/Card.vue
  - src/components/ui/Modal.vue
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/AppSidebar.vue
  - src/components/ui/Button.vue
  - src/components/ui/Table.vue
  - src/router/index.js
  - .agents/skills/spectra-drift/SKILL.md
  - src/views/UiShowcase.vue
  - .agents/skills/spectra-audit/SKILL.md
  - CLAUDE.md
  - .agents/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
-->

---
### Requirement: Table component renders rows from column definitions with custom cell override
The system SHALL provide a `Table` component that renders `rows` (required `Array<Object>`) according to `columns` (required `Array<{ key, label }>`) definitions, allowing per-column custom rendering via scoped slots, and SHALL show `emptyText` (default `'尚無資料'`) when `rows` is empty.

#### Scenario: Table renders each row's cell using the column key by default
- **WHEN** a `Table` is given `columns` and `rows` without a matching scoped slot
- **THEN** each cell SHALL display the value of `row[column.key]`

#### Scenario: Table renders custom content when a matching scoped slot is provided
- **WHEN** a `Table` is given a scoped slot named `cell-<key>` matching a column's `key`
- **THEN** the component SHALL render that slot's content for the column instead of the raw value, passing the row as a slot prop

##### Example: status column rendered via StatusBadge
- **GIVEN** columns `[{ key: 'name', label: 'Name' }, { key: 'status', label: 'Status' }]` and a scoped slot `#cell-status="{ row }"` rendering `<StatusBadge :status="row.status" />`
- **WHEN** a row `{ name: 'Order A', status: 'PENDING' }` is rendered
- **THEN** the status cell SHALL display the `StatusBadge` component instead of the literal text `PENDING`

#### Scenario: Table shows empty state text when rows is empty
- **WHEN** `rows` is an empty array
- **THEN** the component SHALL render the `emptyText` message instead of a row


<!-- @trace
source: add-ui-components
updated: 2026-07-10
code:
  - src/components/ui/Input.vue
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .spectra.yaml
  - .agents/skills/spectra-apply/SKILL.md
  - src/components/ui/Card.vue
  - src/components/ui/Modal.vue
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/AppSidebar.vue
  - src/components/ui/Button.vue
  - src/components/ui/Table.vue
  - src/router/index.js
  - .agents/skills/spectra-drift/SKILL.md
  - src/views/UiShowcase.vue
  - .agents/skills/spectra-audit/SKILL.md
  - CLAUDE.md
  - .agents/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
-->

---
### Requirement: Modal component supports v-model visibility control and dismiss interactions

The system SHALL provide a `Modal` component whose visibility is controlled via `modelValue`/`update:modelValue`, with an optional `title` prop, a default content slot, and an optional `footer` slot. The component SHALL close on overlay click or Escape key press. The component SHALL constrain its own height so it never exceeds the viewport, keeping its header and footer fixed in place while its content area scrolls independently when content overflows. The component SHALL NOT render a divider line between the header and content area, nor between the content area and footer.

#### Scenario: Modal opens when modelValue becomes true

- **WHEN** the parent sets `modelValue` to `true`
- **THEN** the `Modal` SHALL become visible and SHALL display the given `title`

#### Scenario: Clicking the overlay closes the modal

- **WHEN** a user clicks outside the modal content area while it is open
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Pressing Escape closes the modal

- **WHEN** the `Modal` is open and the user presses the Escape key
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Overflowing content scrolls while header and footer stay fixed

- **WHEN** the default slot content is taller than the modal's maximum height
- **THEN** the content area SHALL become independently scrollable, and the header and footer SHALL remain visible and fixed in place

#### Scenario: Modal never touches the top or bottom edge of the viewport

- **WHEN** the `Modal` is open, regardless of content length
- **THEN** there SHALL be visible spacing between the modal and the top and bottom edges of the viewport


<!-- @trace
source: order-status-modal-layout-fix
updated: 2026-07-11
code:
  - src/components/ui/Modal.vue
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
-->

---
### Requirement: UI component showcase page is reachable from navigation
The system SHALL provide a showcase page at route `/ui-showcase` that renders at least one example of each of the five base components, and SHALL expose a navigation entry to it in the sidebar.

#### Scenario: Navigating to the showcase route renders all components
- **WHEN** a user navigates to the `/ui-showcase` route
- **THEN** the page SHALL render at least one example of `Button`, `Card`, `Input`, `Table`, and `Modal`

#### Scenario: Sidebar link navigates to the showcase page
- **WHEN** a user clicks the showcase navigation item in the sidebar
- **THEN** the router SHALL navigate to the `/ui-showcase` route

<!-- @trace
source: add-ui-components
updated: 2026-07-10
code:
  - src/components/ui/Input.vue
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .spectra.yaml
  - .agents/skills/spectra-apply/SKILL.md
  - src/components/ui/Card.vue
  - src/components/ui/Modal.vue
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - src/components/AppSidebar.vue
  - src/components/ui/Button.vue
  - src/components/ui/Table.vue
  - src/router/index.js
  - .agents/skills/spectra-drift/SKILL.md
  - src/views/UiShowcase.vue
  - .agents/skills/spectra-audit/SKILL.md
  - CLAUDE.md
  - .agents/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
-->

---
### Requirement: UI components render using shared warm-purple design tokens
The system SHALL provide a shared set of design tokens (color, typography, radius, shadow) defined in the Tailwind theme, and the `Button`, `Card`, `Input`, `Table`, `Modal`, and `StatusBadge` components SHALL render using these tokens instead of hardcoded neutral gray utility classes.

#### Scenario: Page background and card surfaces use the warm-purple palette
- **WHEN** any page (Dashboard, `/ui-showcase`, `/orders/:category`) is rendered
- **THEN** the page background SHALL use the `page-bg` color token (`#FFF8F2`) and card surfaces SHALL use the `card` border-radius token (`22px`) and `card` shadow token, replacing the previous slate-based styling

#### Scenario: Primary actions and selected navigation use the primary gradient
- **WHEN** a primary-variant `Button` or the active sidebar navigation item is rendered
- **THEN** it SHALL use a gradient background from the `primary-from` color token (`#8b6fba`) to the `primary-to` color token (`#b78fa5`) and the `emphasis` shadow token

#### Scenario: Status badges use a uniform status color instead of per-status hues
- **WHEN** a `StatusBadge` renders for any status value
- **THEN** it SHALL use the fixed `badge-status-bg` background color token (`#F0E1EC`) and `badge-status-text` text color token (`#6a4ab5`) regardless of which status is passed, instead of the previous per-status color mapping

##### Example: same badge styling across different statuses
- **GIVEN** two `StatusBadge` instances with `status="PENDING"` and `status="SHIPPED"`
- **WHEN** both are rendered
- **THEN** both SHALL have identical background and text colors, differing only in label text

#### Scenario: Headings render with the Baloo 2 typeface
- **WHEN** an element using the `heading` font token is rendered (e.g. a page title or card header)
- **THEN** its computed `font-family` SHALL include `Baloo 2`

<!-- @trace
source: restyle-warm-purple-theme
updated: 2026-07-10
code:
  - .agents/skills/spectra-apply/SKILL.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
  - src/components/ui/Card.vue
  - .agents/skills/spectra-archive/SKILL.md
  - src/components/AppSidebar.vue
  - src/components/ui/Table.vue
  - index.html
  - src/components/ui/Modal.vue
  - .agents/skills/spectra-propose/SKILL.md
  - src/components/ui/Input.vue
  - src/views/UiShowcase.vue
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - src/App.vue
  - CLAUDE.md
  - src/assets/main.css
  - .agents/skills/spectra-ingest/SKILL.md
  - AGENTS.md
  - src/components/ui/Button.vue
  - src/router/index.js
  - src/components/StatusBadge.vue
  - .spectra.yaml
-->

---
### Requirement: Select component supports v-model binding over a fixed option list
The system SHALL provide a `Select` component that supports two-way binding via `modelValue`/`update:modelValue` over a required `options` list of `{ value, label }` pairs, with an optional `label` and `disabled` state.

#### Scenario: Choosing an option updates bound value
- **WHEN** a user selects a different option in the `Select` field
- **THEN** the component SHALL emit `update:modelValue` with the selected option's `value`

#### Scenario: Disabled select cannot be changed
- **WHEN** `disabled` is `true`
- **THEN** the rendered select element SHALL have the `disabled` attribute and SHALL NOT emit `update:modelValue` on interaction

<!-- @trace
source: build-preorder-feature
updated: 2026-07-10
code:
  - src/components/AppSidebar.vue
  - src/views/AllOrders.vue
  - src/components/orders/OrderFormModal.vue
  - src/components/orders/OrderCard.vue
  - src/main.js
  - src/views/OrderList.vue
  - src/router/index.js
  - src/components/ui/Select.vue
  - src/views/UiShowcase.vue
  - src/views/Dashboard.vue
  - src/components/orders/StatusFilterTabs.vue
  - src/stores/orders.js
-->

---
### Requirement: Top-level sidebar navigation items render with consistent styling and adjacency

The system SHALL render the "總覽" (Overview) and "全部訂單" (All Orders) sidebar navigation items as adjacent top-level entries using identical button classes (padding, rounded shape, font size, hover, and active-state styling), with "全部訂單" positioned immediately below "總覽".

#### Scenario: All Orders item matches Overview item styling

- **WHEN** the sidebar renders the "總覽" and "全部訂單" navigation items
- **THEN** both `router-link` elements SHALL share the same class list (`flex items-center gap-3 px-4 py-2 rounded-full text-ink hover:bg-white/50 transition-colors`) and the same active-state class (`bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis`)

#### Scenario: All Orders item is positioned directly below Overview

- **WHEN** the sidebar navigation list is rendered
- **THEN** the "全部訂單" list item SHALL immediately follow the "總覽" list item, before "UI 元件展示" and the category list

<!-- @trace
source: reorder-sidebar-nav
updated: 2026-07-11
code:
  - src/components/AppSidebar.vue
-->