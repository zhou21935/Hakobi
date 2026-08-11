## MODIFIED Requirements

### Requirement: All-orders view lists orders across every category
The system SHALL provide the authenticated home view at `/` with the title "訂單總覽", SHALL list orders from all categories together independent of the per-category views, and SHALL provide search, sorting, status filtering, create, details, edit, and delete actions using the existing all-orders behavior. The legacy `/orders` path SHALL redirect to `/`.

#### Scenario: Home order overview includes every category
- **WHEN** an authenticated user navigates to `/`
- **THEN** the system SHALL display the "訂單總覽" view with every order regardless of category, including preorder orders

#### Scenario: Legacy all-orders URL remains compatible
- **WHEN** an authenticated user navigates to `/orders`
- **THEN** the router SHALL replace or redirect the destination with `/`

## ADDED Requirements

### Requirement: Sidebar exposes one consolidated order overview entry
The sidebar SHALL display one "總覽" entry linked to `/`, SHALL NOT display a separate "全部訂單" entry, and SHALL retain the existing category and member navigation entries.

#### Scenario: Authenticated sidebar avoids duplicate all-orders navigation
- **WHEN** the authenticated sidebar is rendered
- **THEN** it SHALL contain the "總覽" link and SHALL NOT contain a link labeled "全部訂單"

### Requirement: Category order views use title-only headings
The category order views SHALL display the category name as the page heading and SHALL NOT render an explanatory subtitle in the form "管理<category>分類的訂單".

#### Scenario: Overseas purchasing view omits its explanatory subtitle
- **WHEN** an authenticated user navigates to `/orders/agent`
- **THEN** the system SHALL display the "海外代購" heading and SHALL NOT display "管理海外代購分類的訂單"

#### Scenario: Parcel forwarding view omits its explanatory subtitle
- **WHEN** an authenticated user navigates to `/orders/parcel`
- **THEN** the system SHALL display the "集運包裹" heading and SHALL NOT display "管理集運包裹分類的訂單"

## REMOVED Requirements

### Requirement: Dashboard shows order count summaries

**Reason**: The dedicated statistics-only Dashboard is replaced by the consolidated home order overview.

**Migration**: Use the status tab counts on the `/` order overview instead of the removed Dashboard summary cards.

#### Scenario: Dashboard numbers match underlying data

- **WHEN** the dashboard is rendered
- **THEN** the displayed total count SHALL equal the number of orders in the store, and the three status counts SHALL equal the corresponding values from the status filter tabs
