## ADDED Requirements

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
