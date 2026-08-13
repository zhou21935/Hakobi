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
The system SHALL provide a `Modal` component whose visibility is controlled via `modelValue`/`update:modelValue`, with an optional `title` prop, a default content slot, and an optional `footer` slot. The component SHALL close on overlay click or Escape key press. While open, the component SHALL lock background document scrolling on both the root element and body, and SHALL restore each element's pre-existing overflow state after close or component unmount. The component SHALL constrain its panel height, keep its header and footer fixed, and use the content area as the only vertical scroll region when content overflows. The component SHALL NOT render a divider line between the header and content area, nor between the content area and footer.

#### Scenario: Modal opens when modelValue becomes true

- **WHEN** the parent sets `modelValue` to `true`
- **THEN** the `Modal` SHALL become visible and SHALL display the given `title`
- **AND** background document scrolling on both the root element and body SHALL be locked

#### Scenario: Clicking the overlay closes the modal

- **WHEN** a user clicks outside the modal content area while it is open
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Pressing Escape closes the modal

- **WHEN** the `Modal` is open and the user presses the Escape key
- **THEN** the component SHALL emit `update:modelValue` with `false` and SHALL emit `close`

#### Scenario: Overflowing content scrolls while header and footer stay fixed

- **WHEN** the default slot content is taller than the modal's maximum height
- **THEN** the content area SHALL become independently scrollable, and the header and footer SHALL remain visible and fixed in place
- **AND** the background document SHALL remain non-scrollable

#### Scenario: Modal never touches the top or bottom edge of the viewport

- **WHEN** the `Modal` is open, regardless of content length
- **THEN** there SHALL be visible spacing between the modal and the top and bottom edges of the viewport

#### Scenario: Closing restores the previous background overflow state

- **WHEN** an open `Modal` closes after the document body had a pre-existing overflow style
- **THEN** the component SHALL restore the exact pre-existing overflow styles of both the root element and body

#### Scenario: Unmounting an open modal restores background scrolling

- **WHEN** an open `Modal` is unmounted
- **THEN** the component SHALL restore the pre-existing overflow styles of both the root element and body

---
### Requirement: UI component showcase page is reachable from navigation
The system SHALL retain the showcase page at route `/ui-showcase` with examples of `Button`, `Card`, `Input`, `Table`, and `Modal`, and the production sidebar SHALL NOT expose a navigation entry to it.

#### Scenario: Direct showcase route remains available
- **WHEN** an authenticated developer navigates directly to `/ui-showcase`
- **THEN** the showcase page SHALL render the five base component examples

#### Scenario: Product navigation omits showcase
- **WHEN** the product sidebar is rendered
- **THEN** it SHALL NOT contain a link targeting `/ui-showcase`


<!-- @trace
source: improve-product-completeness
updated: 2026-08-10
code:
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SignalDB/LOCK
  - tmp/pdfs/chrome-profile/GrShaderCache/data_2
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/data_3
  - tmp/pdfs/chrome-profile/Default/Code Cache/wasm/index
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/Extension State/LOG
  - .agents/skills/spectra-ask/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Device Bound Sessions
  - tmp/pdfs/chrome-profile-qa/Default/Network/Device Bound Sessions
  - src/router/index.js
  - tmp/pdfs/chrome-pdf-qa/Default/parcel_tracking_db/LOCK
  - tmp/pdfs/chrome-profile/Default/LOG
  - tmp/pdfs/chrome-pdf-qa/extensions_crx_cache/metadata.json
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/data_2
  - tmp/pdfs/chrome-profile/Default/BookmarkMergedSurfaceOrdering
  - tmp/pdfs/chrome-profile/Default/Network/TransportSecurity
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SignalDB/LOG
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/data_2
  - tmp/pdfs/chrome-pdf-qa/Default/Preferences
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/metadata/LOCK
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/index
  - tmp/pdfs/chrome-pdf-qa/Last Version
  - tmp/pdfs/chrome-profile/Default/Service Worker/Database/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/WebStorage/QuotaManager
  - tmp/pdfs/chrome-pdf-qa/Default/README
  - tmp/pdfs/chrome-profile-qa/Default/ClientCertificates/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/engine_allowlist.bf
  - tmp/pdfs/chrome-pdf-qa/Default/Shared Dictionary/cache/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/Default/Network/Trust Tokens-journal
  - tmp/pdfs/chrome-profile/Default/declarative_performance_observer.db-journal
  - tmp/pdfs/chrome-pdf-qa/Default/History
  - tmp/pdfs/chrome-profile-qa/Default/Network/Cookies-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Secure Preferences
  - tmp/pdfs/chrome-pdf-qa/Default/Sync Data/LevelDB/CURRENT
  - tmp/pdfs/chrome-profile/Default/Cache/No_Vary_Search/journal.baj
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/Session Storage/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Session Storage/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Shared Dictionary/db-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Site Characteristics Database/MANIFEST-000001
  - src/App.vue
  - tmp/pdfs/chrome-profile/CrashpadMetrics-active.pma
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SegmentInfoDB/LOG
  - tmp/pdfs/chrome-profile/extensions_crx_cache/metadata.json
  - tmp/pdfs/chrome-profile-qa/Default/WebStorage/QuotaManager
  - tmp/pdfs/chrome-profile-qa/Default/BookmarkMergedSurfaceOrdering
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/CURRENT
  - tmp/pdfs/chrome-profile/Default/Site Characteristics Database/LOG
  - src/views/NotFound.vue
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/js/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/ShaderCache/data_2
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/data_2
  - tmp/pdfs/chrome-profile/Default/parcel_tracking_db/LOG
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SignalStorageConfigDB/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Trust Tokens-journal
  - tmp/pdfs/chrome-profile/Default/chrome_cart_db/LOCK
  - tmp/pdfs/chrome-profile/Default/WebStorage/QuotaManager-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Reporting and NEL-journal
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Extension Rules/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/discounts_db/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/Database/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/MANIFEST-000001
  - .agents/skills/spectra-commit/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/Default/Session Storage/LOCK
  - tmp/pdfs/chrome-profile/Default/Sync Data/LevelDB/CURRENT
  - tmp/pdfs/chrome-profile/Default/Cache/No_Vary_Search/snapshot.baf
  - tmp/pdfs/chrome-pdf-qa/Default/Site Characteristics Database/CURRENT
  - tmp/pdfs/chrome-profile/Default/Network/Reporting and NEL-journal
  - tmp/pdfs/chrome-profile/Default/ServerCertificate-journal
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/index-dir/the-real-index
  - tmp/pdfs/chrome-pdf-qa/Default/Login Data For Account
  - tmp/pdfs/chrome-pdf-qa/Default/Top Sites
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/metadata/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/ClientCertificates/LOG
  - tmp/pdfs/chrome-profile/Default/Shared Dictionary/cache/index
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Rules/CURRENT
  - .agents/skills/spectra-archive/SKILL.md
  - tmp/pdfs/chrome-profile-qa/ShaderCache/index
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Network/NetworkDataMigrated
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/LOCK
  - tmp/pdfs/chrome-profile/GrShaderCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Scripts/LOCK
  - tmp/pdfs/chrome-profile/Default/declarative_performance_observer.db
  - tmp/pdfs/chrome-pdf-qa/Default/PersistentOriginTrials/LOCK
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/4cb013792b196a35_0
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/data_3
  - tmp/pdfs/chrome-profile/Default/discounts_db/LOCK
  - tmp/pdfs/chrome-profile/Default/Favicons
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/data_2
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SegmentInfoDB/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Sync Data/LevelDB/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Sync Data/LevelDB/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Local State
  - tmp/pdfs/chrome-profile/Default/Network/Cookies-journal
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SignalDB/LOG
  - src/domain/orderValidation.js
  - tmp/pdfs/chrome-profile-qa/Default/chrome_cart_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/Session Storage/LOG
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/data_3
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Extension State/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SignalDB/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Favicons-journal
  - tmp/pdfs/chrome-profile-qa/Default/ServerCertificate
  - tmp/pdfs/chrome-profile-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db-wal
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Rules/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Scripts/CURRENT
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/data_0
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/index
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/index
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SegmentInfoDB/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Local Storage/leveldb/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/discount_infos_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Extension Scripts/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Safe Browsing Network/NetworkDataMigrated
  - tmp/pdfs/chrome-profile/Default/Top Sites-journal
  - tmp/pdfs/chrome-profile/GrShaderCache/data_0
  - tmp/pdfs/hakobi-deployment-qa.png
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/data_0
  - tmp/pdfs/chrome-profile/Default/GPUCache/index
  - tmp/pdfs/chrome-pdf-qa/Local State
  - tmp/pdfs/chrome-profile/Default/Local Storage/leveldb/LOG
  - tmp/pdfs/chrome-profile/Default/discount_infos_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Network/Reporting and NEL
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/wasm/index-dir/the-real-index
  - tmp/pdfs/chrome-profile/en-US-10-1.bdic
  - tmp/pdfs/chrome-profile/Default/PersistentOriginTrials/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/ServerCertificate-journal
  - tmp/pdfs/chrome-profile/Default/Sessions/Tabs_13430687822256285
  - tmp/pdfs/chrome-pdf-qa/Default/Top Sites-journal
  - src/components/ui/Select.vue
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/data_1
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/f_000001
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/data_2
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/index
  - tmp/pdfs/chrome-profile-qa/Default/parcel_tracking_db/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Rules/LOG
  - README.md
  - tmp/pdfs/chrome-pdf-qa/Default/Favicons
  - tmp/pdfs/chrome-profile-qa/Default/Site Characteristics Database/LOG
  - tmp/pdfs/chrome-profile/Default/Sync Data/LevelDB/LOG
  - tmp/pdfs/chrome-profile-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/Database/CURRENT
  - tmp/pdfs/chrome-profile/Default/Network/Network Persistent State
  - tmp/pdfs/chrome-pdf-qa/Default/WebStorage/QuotaManager-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Network Persistent State
  - tmp/pdfs/chrome-profile-qa/Crashpad/metadata
  - tmp/pdfs/chrome-profile-qa/Default/Sessions/Session_13430687835319079
  - tmp/pdfs/chrome-profile-qa/Default/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/ClientCertificates/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Extension State/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/Database/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/Local Storage/leveldb/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Web Data
  - tmp/pdfs/chrome-pdf-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db-wal
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/data_2
  - tmp/pdfs/chrome-profile-qa/Default/Site Characteristics Database/CURRENT
  - tmp/pdfs/chrome-profile/Default/GPUCache/data_1
  - tmp/pdfs/chrome-profile/Default/Extension State/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Service Worker/Database/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/ClientCertificates/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Site Characteristics Database/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/data_2
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/data_0
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/index
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Reporting and NEL
  - tmp/pdfs/chrome-pdf-qa/Variations
  - tmp/pdfs/chrome-profile/Default/Site Characteristics Database/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/Shared Dictionary/db
  - tmp/pdfs/chrome-profile-qa/Last Version
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/wasm/index
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/wasm/index
  - tmp/pdfs/chrome-profile/Default/ClientCertificates/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/js/index
  - tmp/pdfs/chrome-profile/Default/Secure Preferences
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SignalStorageConfigDB/LOCK
  - tmp/pdfs/chrome-profile/Default/commerce_subscription_db/LOG
  - tmp/pdfs/chrome-profile/Default/GPUCache/data_0
  - tmp/pdfs/chrome-profile/Default/Session Storage/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/data_2
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/data_0
  - tmp/pdfs/chrome-profile/Default/Favicons-journal
  - tmp/pdfs/pdf-page-1.png
  - tmp/pdfs/chrome-profile/Default/Top Sites
  - .agents/skills/spectra-apply/SKILL.md
  - src/components/AppSidebar.vue
  - .agents/skills/spectra-discuss/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/data_2
  - tmp/pdfs/chrome-profile-qa/Variations
  - tmp/pdfs/chrome-profile/Default/Network/Trust Tokens-journal
  - tmp/pdfs/chrome-profile/Default/Sessions/Session_13430687822250612
  - tmp/pdfs/chrome-profile-qa/Default/Local Storage/leveldb/CURRENT
  - tmp/pdfs/chrome-profile/GrShaderCache/index
  - tmp/pdfs/chrome-profile/Default/Network/NetworkDataMigrated
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/Local Storage/leveldb/MANIFEST-000001
  - .agents/skills/spectra-propose/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/js/index
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SignalDB/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/ScriptCache/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/Default/Extension Scripts/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/History-journal
  - src/services/ordersApi.js
  - tmp/pdfs/chrome-profile-qa/Default/Network/Reporting and NEL-journal
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/index-dir/the-real-index
  - tmp/pdfs/chrome-profile/Default/Account Web Data
  - tmp/pdfs/chrome-profile/Default/Extension Rules/LOG
  - tmp/pdfs/chrome-profile/Default/trusted_vault.pb
  - tmp/pdfs/chrome-profile/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.journal
  - tmp/pdfs/chrome-pdf-qa/Default/Session Storage/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Web Data-journal
  - tmp/pdfs/chrome-profile-qa/Default/Sync Data/LevelDB/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/commerce_subscription_db/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/No_Vary_Search/journal.baj
  - tmp/pdfs/chrome-pdf-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db
  - tmp/pdfs/chrome-profile/Default/Local Storage/leveldb/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/js/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/metadata/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Top Sites
  - tmp/pdfs/chrome-pdf-qa/Default/Affiliation Database-journal
  - tmp/pdfs/chrome-profile/Default/engine_allowlist.bf
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/discount_infos_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Site Characteristics Database/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Favicons
  - tmp/pdfs/chrome-profile/Default/Sync Data/LevelDB/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/index
  - tmp/pdfs/chrome-profile/ShaderCache/data_2
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SignalStorageConfigDB/LOG
  - tmp/pdfs/chrome-profile/Variations
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/metadata/CURRENT
  - tmp/pdfs/chrome-profile/Default/discounts_db/LOG
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/Extension Rules/LOCK
  - tmp/pdfs/chrome-profile/Default/Login Data
  - tmp/pdfs/chrome-pdf-qa/Default/Login Data For Account-journal
  - tmp/pdfs/chrome-profile/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db
  - tmp/pdfs/chrome-profile-qa/Default/Login Data For Account
  - tmp/pdfs/chrome-profile/Default/chrome_cart_db/LOG
  - tmp/pdfs/chrome-profile/Default/Sync Data/LevelDB/LOCK
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/index
  - tmp/pdfs/chrome-profile-qa/Default/README
  - tmp/pdfs/chrome-profile/Default/README
  - tmp/pdfs/chrome-profile/ShaderCache/data_1
  - tmp/pdfs/chrome-profile/Default/Extension State/LOG
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/data_2
  - tmp/pdfs/chrome-profile-qa/Default/Favicons-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/No_Vary_Search/snapshot.baf
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/f_000001
  - tmp/pdfs/chrome-profile/Default/ServerCertificate
  - tmp/pdfs/chrome-pdf-qa/Default/discount_infos_db/LOG
  - tmp/pdfs/chrome-profile/Default/Service Worker/Database/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Network/NetworkDataMigrated
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Cookies
  - src/views/AllOrders.vue
  - tmp/pdfs/chrome-pdf-qa/Default/Sync Data/LevelDB/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Code Cache/js/index
  - src/components/orders/OrderFormModal.vue
  - tmp/pdfs/chrome-profile-qa/Default/Sync Data/LevelDB/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Extension Scripts/LOG
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/parcel_tracking_db/LOCK
  - tmp/pdfs/chrome-profile/Default/Shared Dictionary/db
  - tmp/pdfs/chrome-profile-qa/Default/Account Web Data-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SegmentInfoDB/LOG
  - tmp/pdfs/chrome-profile-qa/CrashpadMetrics-active.pma
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/Affiliation Database-journal
  - tmp/pdfs/chrome-pdf-qa/Default/ClientCertificates/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/ScriptCache/4cb013792b196a35_0
  - tmp/pdfs/chrome-profile/Default/Extension Scripts/CURRENT
  - tmp/pdfs/chrome-profile/VariationsSafeSeedV2
  - tmp/pdfs/chrome-profile-qa/Default/Session Storage/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Extension State/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Crashpad/metadata
  - tmp/pdfs/chrome-pdf-qa/Default/Sync Data/LevelDB/LOCK
  - tmp/pdfs/chrome-profile/Default/Code Cache/js/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/Default/Affiliation Database
  - tmp/pdfs/chrome-profile/ShaderCache/index
  - tmp/pdfs/chrome-profile/Default/Network/Trust Tokens
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/LOG
  - tmp/pdfs/chrome-profile/Default/Service Worker/Database/LOCK
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/data_2
  - tmp/pdfs/chrome-profile/Default/GPUCache/data_2
  - tmp/pdfs/chrome-profile/Default/Preferences
  - src/views/OrderList.vue
  - tmp/pdfs/chrome-pdf-qa/Default/Account Web Data
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/MANIFEST-000001
  - output/pdf/Hakobi_Render部署與除錯紀錄.pdf
  - tmp/pdfs/chrome-pdf-qa/Default/Sessions/Session_13430687870490430
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/Cache/No_Vary_Search/journal.baj
  - tmp/pdfs/chrome-profile-qa/Default/Local Storage/leveldb/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/js/ba678a2fbd8c358c_0
  - tmp/pdfs/chrome-profile-qa/ShaderCache/data_3
  - tmp/pdfs/chrome-profile/Default/WebStorage/QuotaManager
  - tmp/pdfs/chrome-pdf-qa/Default/BookmarkMergedSurfaceOrdering
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/index
  - .agents/skills/spectra-debug/SKILL.md
  - tmp/pdfs/chrome-profile-qa/Default/discounts_db/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Sessions/Tabs_13430687870496258
  - tmp/pdfs/chrome-profile/ShaderCache/data_0
  - tmp/pdfs/chrome-profile-qa/Default/Shared Dictionary/cache/index-dir/the-real-index
  - tmp/pdfs/chrome-profile/Default/Affiliation Database-journal
  - tmp/pdfs/chrome-profile/Default/Local Storage/leveldb/CURRENT
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/metadata/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/Account Web Data-journal
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/data_2
  - tmp/pdfs/chrome-profile/Default/Extension Scripts/LOCK
  - tmp/pdfs/chrome-profile/ShaderCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/Database/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/parcel_tracking_db/LOG
  - .agents/skills/spectra-drift/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/ScriptCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Local Storage/leveldb/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Web Data-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Trust Tokens
  - tmp/pdfs/chrome-pdf-qa/Default/Shared Dictionary/db-journal
  - tmp/pdfs/chrome-profile-qa/Default/commerce_subscription_db/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/chrome_cart_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/discounts_db/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/wasm/index-dir/the-real-index
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Device Bound Sessions-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SegmentInfoDB/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/data_0
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/CURRENT
  - tmp/pdfs/chrome-profile/Default/Affiliation Database
  - tmp/pdfs/chrome-pdf-qa/CrashpadMetrics-active.pma
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/History-journal
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SegmentInfoDB/LOG
  - tmp/pdfs/chrome-profile/Default/Session Storage/LOG
  - tmp/pdfs/chrome-profile/Default/Network/Device Bound Sessions
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/data_2
  - src/components/ui/Modal.vue
  - tmp/pdfs/chrome-profile/Default/Login Data For Account-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Site Characteristics Database/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Extension State/CURRENT
  - tmp/pdfs/chrome-profile/Default/Web Data
  - tmp/pdfs/chrome-profile/Default/Code Cache/js/ba678a2fbd8c358c_0
  - tmp/pdfs/chrome-profile-qa/Default/Login Data-journal
  - tmp/pdfs/chrome-profile-qa/Default/Network/Trust Tokens
  - tmp/pdfs/chrome-pdf-qa/Default/discounts_db/LOG
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/index
  - tmp/pdfs/chrome-pdf-qa/Default/commerce_subscription_db/LOCK
  - tmp/pdfs/chrome-profile/Default/Login Data For Account
  - tmp/pdfs/chrome-profile/Default/parcel_tracking_db/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SignalStorageConfigDB/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Network/Device Bound Sessions-journal
  - tmp/pdfs/chrome-profile-qa/Default/LOG
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/metadata/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/js/ba678a2fbd8c358c_0
  - tmp/pdfs/chrome-profile-qa/Default/PersistentOriginTrials/LOCK
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/metadata/LOG
  - tmp/pdfs/chrome-profile/Default/Account Web Data-journal
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/PersistentOriginTrials/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/declarative_performance_observer.db
  - tmp/pdfs/chrome-profile-qa/Default/declarative_performance_observer.db
  - tmp/pdfs/chrome-profile-qa/Default/Extension State/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/data_2
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/data_0
  - tmp/pdfs/chrome-profile/Default/History
  - tmp/pdfs/chrome-profile-qa/Default/WebStorage/QuotaManager-journal
  - .agents/skills/spectra-ingest/SKILL.md
  - tmp/pdfs/chrome-profile-qa/ShaderCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/data_0
  - tmp/pdfs/chrome-profile/Default/PersistentOriginTrials/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Shared Dictionary/cache/index
  - tmp/pdfs/chrome-profile/Crashpad/settings.dat
  - src/components/orders/DeleteUndoToast.vue
  - tmp/pdfs/chrome-pdf-qa/Default/ServerCertificate
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/metadata/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Safe Browsing Network/NetworkDataMigrated
  - tmp/pdfs/chrome-pdf-qa/Default/Login Data
  - tmp/pdfs/chrome-profile/Default/Extension Rules/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/chrome_cart_db/LOG
  - tmp/pdfs/chrome-profile/Default/Extension Scripts/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SignalStorageConfigDB/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Sync Data/LevelDB/LOCK
  - tmp/pdfs/chrome-profile/Default/Network/Device Bound Sessions-journal
  - tmp/pdfs/chrome-profile/GrShaderCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Network/Network Persistent State
  - tmp/pdfs/chrome-profile-qa/extensions_crx_cache/metadata.json
  - tmp/pdfs/chrome-pdf-qa/Default/Extension State/CURRENT
  - tmp/pdfs/chrome-profile/Default/Extension State/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Account Web Data
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/metadata/LOG
  - tmp/pdfs/chrome-profile-qa/Default/declarative_performance_observer.db-journal
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/metadata/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/trusted_vault.pb
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SignalDB/LOCK
  - tmp/pdfs/chrome-profile/Default/Session Storage/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Session Storage/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Crashpad/settings.dat
  - tmp/pdfs/chrome-profile-qa/Default/engine_allowlist.bf
  - tmp/pdfs/chrome-profile-qa/Default/Extension Rules/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/Database/LOG
  - tmp/pdfs/chrome-profile/Default/commerce_subscription_db/LOCK
  - tmp/pdfs/chrome-profile/Default/Site Characteristics Database/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Scripts/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/discount_infos_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/commerce_subscription_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/index
  - tmp/pdfs/chrome-profile/segmentation_platform/ukm_db
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/Database/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/data_3
  - tmp/pdfs/chrome-profile/Crashpad/metadata
  - tmp/pdfs/chrome-pdf-qa/segmentation_platform/ukm_db
  - tmp/pdfs/hakobi-deployment-troubleshooting.html
  - tmp/pdfs/chrome-profile/Default/Extension Scripts/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Extension Rules/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Top Sites-journal
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/2cc80dabc69f58b6_0
  - tmp/pdfs/chrome-profile/Default/Shared Dictionary/cache/index-dir/the-real-index
  - tmp/pdfs/chrome-pdf-qa/Default/declarative_performance_observer.db-journal
  - tmp/pdfs/chrome-pdf-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.journal
  - tmp/pdfs/chrome-profile/Default/Extension State/CURRENT
  - tmp/pdfs/chrome-profile/Default/History-journal
  - tmp/pdfs/chrome-pdf-qa/Default/PersistentOriginTrials/LOG
  - tmp/pdfs/chrome-profile-qa/Crashpad/settings.dat
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/metadata/LOG
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/4cb013792b196a35_1
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/4cb013792b196a35_0
  - tmp/pdfs/chrome-profile/Default/Code Cache/wasm/index-dir/the-real-index
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/data_0
  - tmp/pdfs/chrome-profile/Default/LOCK
  - tmp/pdfs/chrome-profile/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db-wal
  - tmp/pdfs/chrome-pdf-qa/Default/chrome_cart_db/LOCK
  - tmp/pdfs/chrome-profile-qa/ShaderCache/data_1
  - tmp/pdfs/chrome-profile/Default/Login Data-journal
  - tmp/pdfs/chrome-pdf-qa/Default/LOCK
  - tmp/pdfs/chrome-profile/Default/Network/Cookies
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SignalStorageConfigDB/LOG
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Login Data
  - tmp/pdfs/chrome-profile-qa/Default/Network/Cookies
  - tmp/pdfs/chrome-profile-qa/Default/Preferences
  - tmp/pdfs/chrome-profile/Last Version
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/Database/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Rules/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Local Storage/leveldb/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Cookies-journal
  - tmp/pdfs/chrome-profile-qa/Default/History
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/Database/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Site Characteristics Database/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/2cc80dabc69f58b6_0
  - tmp/pdfs/chrome-profile/Default/Extension Rules/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Web Data-journal
  - tmp/pdfs/chrome-profile-qa/Default/Login Data For Account-journal
  - tmp/pdfs/chrome-profile/Local State
  - tmp/pdfs/chrome-profile-qa/Default/Shared Dictionary/cache/index
  - tmp/pdfs/chrome-profile/Default/Network/Reporting and NEL
  - tmp/pdfs/chrome-profile-qa/Default/discount_infos_db/LOCK
  - tmp/pdfs/chrome-profile/VariationsSeedV2
  - .agents/skills/spectra-audit/SKILL.md
  - tmp/pdfs/chrome-profile-qa/Default/Web Data
  - tmp/pdfs/chrome-profile/Default/Local Storage/leveldb/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Session Storage/LOCK
  - src/stores/orders.js
  - tmp/pdfs/chrome-profile-qa/Default/Sessions/Tabs_13430687835325049
  - tmp/pdfs/chrome-pdf-qa/Default/Extension State/LOCK
  - tmp/pdfs/chrome-profile/Default/Site Characteristics Database/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Scripts/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Shared Dictionary/db
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/metadata/LOCK
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/data_3
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/index
  - tmp/pdfs/chrome-pdf-qa/Default/Affiliation Database
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/data_1
  - tmp/pdfs/chrome-profile/Default/GPUCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/Safe Browsing Network/NetworkDataMigrated
  - tmp/pdfs/chrome-profile-qa/Default/Cache/No_Vary_Search/snapshot.baf
  - tmp/pdfs/chrome-profile-qa/Default/Local Storage/leveldb/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Network/TransportSecurity
  - tmp/pdfs/chrome-profile-qa/Default/Session Storage/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Secure Preferences
  - tmp/pdfs/chrome-profile-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.journal
  - tmp/pdfs/chrome-profile-qa/segmentation_platform/ukm_db
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/data_1
  - tmp/pdfs/chrome-profile/Default/Extension Rules/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/ServerCertificate-journal
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/data_1
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/index
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/4cb013792b196a35_1
  - tmp/pdfs/chrome-profile/Default/Shared Dictionary/db-journal
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/Extension Scripts/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/Login Data-journal
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/__tests__/App.spec.js
  - src/components/orders/__tests__/DeleteUndoToast.spec.js
  - src/stores/__tests__/orders.spec.js
  - src/services/__tests__/ordersApi.spec.js
  - src/router/__tests__/authGuard.spec.js
  - src/views/__tests__/AllOrders.spec.js
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
The system SHALL render Overview and All Orders as adjacent top-level product destinations using the same navigation interaction and active-state treatment, and no development-only destination SHALL appear among them.

#### Scenario: Product destinations render in order
- **WHEN** the sidebar navigation is rendered
- **THEN** Overview SHALL be followed immediately by All Orders before the category section

<!-- @trace
source: improve-product-completeness
updated: 2026-08-10
code:
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SignalDB/LOCK
  - tmp/pdfs/chrome-profile/GrShaderCache/data_2
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/data_3
  - tmp/pdfs/chrome-profile/Default/Code Cache/wasm/index
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/Extension State/LOG
  - .agents/skills/spectra-ask/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Device Bound Sessions
  - tmp/pdfs/chrome-profile-qa/Default/Network/Device Bound Sessions
  - src/router/index.js
  - tmp/pdfs/chrome-pdf-qa/Default/parcel_tracking_db/LOCK
  - tmp/pdfs/chrome-profile/Default/LOG
  - tmp/pdfs/chrome-pdf-qa/extensions_crx_cache/metadata.json
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/data_2
  - tmp/pdfs/chrome-profile/Default/BookmarkMergedSurfaceOrdering
  - tmp/pdfs/chrome-profile/Default/Network/TransportSecurity
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SignalDB/LOG
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/data_2
  - tmp/pdfs/chrome-pdf-qa/Default/Preferences
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/metadata/LOCK
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/index
  - tmp/pdfs/chrome-pdf-qa/Last Version
  - tmp/pdfs/chrome-profile/Default/Service Worker/Database/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/WebStorage/QuotaManager
  - tmp/pdfs/chrome-pdf-qa/Default/README
  - tmp/pdfs/chrome-profile-qa/Default/ClientCertificates/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/engine_allowlist.bf
  - tmp/pdfs/chrome-pdf-qa/Default/Shared Dictionary/cache/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/Default/Network/Trust Tokens-journal
  - tmp/pdfs/chrome-profile/Default/declarative_performance_observer.db-journal
  - tmp/pdfs/chrome-pdf-qa/Default/History
  - tmp/pdfs/chrome-profile-qa/Default/Network/Cookies-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Secure Preferences
  - tmp/pdfs/chrome-pdf-qa/Default/Sync Data/LevelDB/CURRENT
  - tmp/pdfs/chrome-profile/Default/Cache/No_Vary_Search/journal.baj
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/Session Storage/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Session Storage/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Shared Dictionary/db-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Site Characteristics Database/MANIFEST-000001
  - src/App.vue
  - tmp/pdfs/chrome-profile/CrashpadMetrics-active.pma
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SegmentInfoDB/LOG
  - tmp/pdfs/chrome-profile/extensions_crx_cache/metadata.json
  - tmp/pdfs/chrome-profile-qa/Default/WebStorage/QuotaManager
  - tmp/pdfs/chrome-profile-qa/Default/BookmarkMergedSurfaceOrdering
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/CURRENT
  - tmp/pdfs/chrome-profile/Default/Site Characteristics Database/LOG
  - src/views/NotFound.vue
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/js/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/ShaderCache/data_2
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/data_2
  - tmp/pdfs/chrome-profile/Default/parcel_tracking_db/LOG
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SignalStorageConfigDB/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Trust Tokens-journal
  - tmp/pdfs/chrome-profile/Default/chrome_cart_db/LOCK
  - tmp/pdfs/chrome-profile/Default/WebStorage/QuotaManager-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Reporting and NEL-journal
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Extension Rules/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/discounts_db/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/Database/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/MANIFEST-000001
  - .agents/skills/spectra-commit/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/Default/Session Storage/LOCK
  - tmp/pdfs/chrome-profile/Default/Sync Data/LevelDB/CURRENT
  - tmp/pdfs/chrome-profile/Default/Cache/No_Vary_Search/snapshot.baf
  - tmp/pdfs/chrome-pdf-qa/Default/Site Characteristics Database/CURRENT
  - tmp/pdfs/chrome-profile/Default/Network/Reporting and NEL-journal
  - tmp/pdfs/chrome-profile/Default/ServerCertificate-journal
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/index-dir/the-real-index
  - tmp/pdfs/chrome-pdf-qa/Default/Login Data For Account
  - tmp/pdfs/chrome-pdf-qa/Default/Top Sites
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/metadata/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/ClientCertificates/LOG
  - tmp/pdfs/chrome-profile/Default/Shared Dictionary/cache/index
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Rules/CURRENT
  - .agents/skills/spectra-archive/SKILL.md
  - tmp/pdfs/chrome-profile-qa/ShaderCache/index
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Network/NetworkDataMigrated
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/LOCK
  - tmp/pdfs/chrome-profile/GrShaderCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Scripts/LOCK
  - tmp/pdfs/chrome-profile/Default/declarative_performance_observer.db
  - tmp/pdfs/chrome-pdf-qa/Default/PersistentOriginTrials/LOCK
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/4cb013792b196a35_0
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/data_3
  - tmp/pdfs/chrome-profile/Default/discounts_db/LOCK
  - tmp/pdfs/chrome-profile/Default/Favicons
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/data_2
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SegmentInfoDB/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Sync Data/LevelDB/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Sync Data/LevelDB/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Local State
  - tmp/pdfs/chrome-profile/Default/Network/Cookies-journal
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SignalDB/LOG
  - src/domain/orderValidation.js
  - tmp/pdfs/chrome-profile-qa/Default/chrome_cart_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/Session Storage/LOG
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/data_3
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Extension State/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SignalDB/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Favicons-journal
  - tmp/pdfs/chrome-profile-qa/Default/ServerCertificate
  - tmp/pdfs/chrome-profile-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db-wal
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Rules/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Scripts/CURRENT
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/data_0
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/index
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/index
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SegmentInfoDB/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Local Storage/leveldb/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/discount_infos_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Extension Scripts/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Safe Browsing Network/NetworkDataMigrated
  - tmp/pdfs/chrome-profile/Default/Top Sites-journal
  - tmp/pdfs/chrome-profile/GrShaderCache/data_0
  - tmp/pdfs/hakobi-deployment-qa.png
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/data_0
  - tmp/pdfs/chrome-profile/Default/GPUCache/index
  - tmp/pdfs/chrome-pdf-qa/Local State
  - tmp/pdfs/chrome-profile/Default/Local Storage/leveldb/LOG
  - tmp/pdfs/chrome-profile/Default/discount_infos_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Network/Reporting and NEL
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/wasm/index-dir/the-real-index
  - tmp/pdfs/chrome-profile/en-US-10-1.bdic
  - tmp/pdfs/chrome-profile/Default/PersistentOriginTrials/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/ServerCertificate-journal
  - tmp/pdfs/chrome-profile/Default/Sessions/Tabs_13430687822256285
  - tmp/pdfs/chrome-pdf-qa/Default/Top Sites-journal
  - src/components/ui/Select.vue
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/data_1
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/f_000001
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/data_2
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/index
  - tmp/pdfs/chrome-profile-qa/Default/parcel_tracking_db/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Rules/LOG
  - README.md
  - tmp/pdfs/chrome-pdf-qa/Default/Favicons
  - tmp/pdfs/chrome-profile-qa/Default/Site Characteristics Database/LOG
  - tmp/pdfs/chrome-profile/Default/Sync Data/LevelDB/LOG
  - tmp/pdfs/chrome-profile-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/Database/CURRENT
  - tmp/pdfs/chrome-profile/Default/Network/Network Persistent State
  - tmp/pdfs/chrome-pdf-qa/Default/WebStorage/QuotaManager-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Network Persistent State
  - tmp/pdfs/chrome-profile-qa/Crashpad/metadata
  - tmp/pdfs/chrome-profile-qa/Default/Sessions/Session_13430687835319079
  - tmp/pdfs/chrome-profile-qa/Default/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/ClientCertificates/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Extension State/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/Database/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/Local Storage/leveldb/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Web Data
  - tmp/pdfs/chrome-pdf-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db-wal
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/data_2
  - tmp/pdfs/chrome-profile-qa/Default/Site Characteristics Database/CURRENT
  - tmp/pdfs/chrome-profile/Default/GPUCache/data_1
  - tmp/pdfs/chrome-profile/Default/Extension State/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Service Worker/Database/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/ClientCertificates/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Site Characteristics Database/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/data_2
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/data_0
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/index
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Reporting and NEL
  - tmp/pdfs/chrome-pdf-qa/Variations
  - tmp/pdfs/chrome-profile/Default/Site Characteristics Database/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/Shared Dictionary/db
  - tmp/pdfs/chrome-profile-qa/Last Version
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/wasm/index
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/wasm/index
  - tmp/pdfs/chrome-profile/Default/ClientCertificates/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/js/index
  - tmp/pdfs/chrome-profile/Default/Secure Preferences
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SignalStorageConfigDB/LOCK
  - tmp/pdfs/chrome-profile/Default/commerce_subscription_db/LOG
  - tmp/pdfs/chrome-profile/Default/GPUCache/data_0
  - tmp/pdfs/chrome-profile/Default/Session Storage/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/data_2
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/data_0
  - tmp/pdfs/chrome-profile/Default/Favicons-journal
  - tmp/pdfs/pdf-page-1.png
  - tmp/pdfs/chrome-profile/Default/Top Sites
  - .agents/skills/spectra-apply/SKILL.md
  - src/components/AppSidebar.vue
  - .agents/skills/spectra-discuss/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/data_2
  - tmp/pdfs/chrome-profile-qa/Variations
  - tmp/pdfs/chrome-profile/Default/Network/Trust Tokens-journal
  - tmp/pdfs/chrome-profile/Default/Sessions/Session_13430687822250612
  - tmp/pdfs/chrome-profile-qa/Default/Local Storage/leveldb/CURRENT
  - tmp/pdfs/chrome-profile/GrShaderCache/index
  - tmp/pdfs/chrome-profile/Default/Network/NetworkDataMigrated
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/Local Storage/leveldb/MANIFEST-000001
  - .agents/skills/spectra-propose/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/js/index
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SignalDB/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/ScriptCache/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/Default/Extension Scripts/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/History-journal
  - src/services/ordersApi.js
  - tmp/pdfs/chrome-profile-qa/Default/Network/Reporting and NEL-journal
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/index-dir/the-real-index
  - tmp/pdfs/chrome-profile/Default/Account Web Data
  - tmp/pdfs/chrome-profile/Default/Extension Rules/LOG
  - tmp/pdfs/chrome-profile/Default/trusted_vault.pb
  - tmp/pdfs/chrome-profile/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.journal
  - tmp/pdfs/chrome-pdf-qa/Default/Session Storage/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Web Data-journal
  - tmp/pdfs/chrome-profile-qa/Default/Sync Data/LevelDB/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/commerce_subscription_db/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/No_Vary_Search/journal.baj
  - tmp/pdfs/chrome-pdf-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db
  - tmp/pdfs/chrome-profile/Default/Local Storage/leveldb/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/js/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/metadata/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Top Sites
  - tmp/pdfs/chrome-pdf-qa/Default/Affiliation Database-journal
  - tmp/pdfs/chrome-profile/Default/engine_allowlist.bf
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/discount_infos_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Site Characteristics Database/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Favicons
  - tmp/pdfs/chrome-profile/Default/Sync Data/LevelDB/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/index
  - tmp/pdfs/chrome-profile/ShaderCache/data_2
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SignalStorageConfigDB/LOG
  - tmp/pdfs/chrome-profile/Variations
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/metadata/CURRENT
  - tmp/pdfs/chrome-profile/Default/discounts_db/LOG
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/Extension Rules/LOCK
  - tmp/pdfs/chrome-profile/Default/Login Data
  - tmp/pdfs/chrome-pdf-qa/Default/Login Data For Account-journal
  - tmp/pdfs/chrome-profile/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db
  - tmp/pdfs/chrome-profile-qa/Default/Login Data For Account
  - tmp/pdfs/chrome-profile/Default/chrome_cart_db/LOG
  - tmp/pdfs/chrome-profile/Default/Sync Data/LevelDB/LOCK
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/index
  - tmp/pdfs/chrome-profile-qa/Default/README
  - tmp/pdfs/chrome-profile/Default/README
  - tmp/pdfs/chrome-profile/ShaderCache/data_1
  - tmp/pdfs/chrome-profile/Default/Extension State/LOG
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/data_2
  - tmp/pdfs/chrome-profile-qa/Default/Favicons-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/No_Vary_Search/snapshot.baf
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/f_000001
  - tmp/pdfs/chrome-profile/Default/ServerCertificate
  - tmp/pdfs/chrome-pdf-qa/Default/discount_infos_db/LOG
  - tmp/pdfs/chrome-profile/Default/Service Worker/Database/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Network/NetworkDataMigrated
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Cookies
  - src/views/AllOrders.vue
  - tmp/pdfs/chrome-pdf-qa/Default/Sync Data/LevelDB/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Code Cache/js/index
  - src/components/orders/OrderFormModal.vue
  - tmp/pdfs/chrome-profile-qa/Default/Sync Data/LevelDB/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Extension Scripts/LOG
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/parcel_tracking_db/LOCK
  - tmp/pdfs/chrome-profile/Default/Shared Dictionary/db
  - tmp/pdfs/chrome-profile-qa/Default/Account Web Data-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SegmentInfoDB/LOG
  - tmp/pdfs/chrome-profile-qa/CrashpadMetrics-active.pma
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/Affiliation Database-journal
  - tmp/pdfs/chrome-pdf-qa/Default/ClientCertificates/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/ScriptCache/4cb013792b196a35_0
  - tmp/pdfs/chrome-profile/Default/Extension Scripts/CURRENT
  - tmp/pdfs/chrome-profile/VariationsSafeSeedV2
  - tmp/pdfs/chrome-profile-qa/Default/Session Storage/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Extension State/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Crashpad/metadata
  - tmp/pdfs/chrome-pdf-qa/Default/Sync Data/LevelDB/LOCK
  - tmp/pdfs/chrome-profile/Default/Code Cache/js/index-dir/the-real-index
  - tmp/pdfs/chrome-profile-qa/Default/Affiliation Database
  - tmp/pdfs/chrome-profile/ShaderCache/index
  - tmp/pdfs/chrome-profile/Default/Network/Trust Tokens
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/LOG
  - tmp/pdfs/chrome-profile/Default/Service Worker/Database/LOCK
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/data_2
  - tmp/pdfs/chrome-profile/Default/GPUCache/data_2
  - tmp/pdfs/chrome-profile/Default/Preferences
  - src/views/OrderList.vue
  - tmp/pdfs/chrome-pdf-qa/Default/Account Web Data
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/MANIFEST-000001
  - output/pdf/Hakobi_Render部署與除錯紀錄.pdf
  - tmp/pdfs/chrome-pdf-qa/Default/Sessions/Session_13430687870490430
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/Cache/No_Vary_Search/journal.baj
  - tmp/pdfs/chrome-profile-qa/Default/Local Storage/leveldb/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Code Cache/js/ba678a2fbd8c358c_0
  - tmp/pdfs/chrome-profile-qa/ShaderCache/data_3
  - tmp/pdfs/chrome-profile/Default/WebStorage/QuotaManager
  - tmp/pdfs/chrome-pdf-qa/Default/BookmarkMergedSurfaceOrdering
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/index
  - .agents/skills/spectra-debug/SKILL.md
  - tmp/pdfs/chrome-profile-qa/Default/discounts_db/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Sessions/Tabs_13430687870496258
  - tmp/pdfs/chrome-profile/ShaderCache/data_0
  - tmp/pdfs/chrome-profile-qa/Default/Shared Dictionary/cache/index-dir/the-real-index
  - tmp/pdfs/chrome-profile/Default/Affiliation Database-journal
  - tmp/pdfs/chrome-profile/Default/Local Storage/leveldb/CURRENT
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/metadata/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/Account Web Data-journal
  - tmp/pdfs/chrome-profile/Default/DawnWebGPUCache/data_2
  - tmp/pdfs/chrome-profile/Default/Extension Scripts/LOCK
  - tmp/pdfs/chrome-profile/ShaderCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/Database/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/parcel_tracking_db/LOG
  - .agents/skills/spectra-drift/SKILL.md
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/ScriptCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Local Storage/leveldb/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Web Data-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Trust Tokens
  - tmp/pdfs/chrome-pdf-qa/Default/Shared Dictionary/db-journal
  - tmp/pdfs/chrome-profile-qa/Default/commerce_subscription_db/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/chrome_cart_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/discounts_db/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/wasm/index-dir/the-real-index
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Device Bound Sessions-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SegmentInfoDB/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/data_0
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/CURRENT
  - tmp/pdfs/chrome-profile/Default/Affiliation Database
  - tmp/pdfs/chrome-pdf-qa/CrashpadMetrics-active.pma
  - tmp/pdfs/chrome-pdf-qa/Default/DawnGraphiteCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/History-journal
  - tmp/pdfs/chrome-profile/Default/Segmentation Platform/SegmentInfoDB/LOG
  - tmp/pdfs/chrome-profile/Default/Session Storage/LOG
  - tmp/pdfs/chrome-profile/Default/Network/Device Bound Sessions
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/data_2
  - src/components/ui/Modal.vue
  - tmp/pdfs/chrome-profile/Default/Login Data For Account-journal
  - tmp/pdfs/chrome-pdf-qa/Default/Site Characteristics Database/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Extension State/CURRENT
  - tmp/pdfs/chrome-profile/Default/Web Data
  - tmp/pdfs/chrome-profile/Default/Code Cache/js/ba678a2fbd8c358c_0
  - tmp/pdfs/chrome-profile-qa/Default/Login Data-journal
  - tmp/pdfs/chrome-profile-qa/Default/Network/Trust Tokens
  - tmp/pdfs/chrome-pdf-qa/Default/discounts_db/LOG
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/index
  - tmp/pdfs/chrome-pdf-qa/Default/commerce_subscription_db/LOCK
  - tmp/pdfs/chrome-profile/Default/Login Data For Account
  - tmp/pdfs/chrome-profile/Default/parcel_tracking_db/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Segmentation Platform/SignalStorageConfigDB/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Network/Device Bound Sessions-journal
  - tmp/pdfs/chrome-profile-qa/Default/LOG
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/metadata/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Code Cache/js/ba678a2fbd8c358c_0
  - tmp/pdfs/chrome-profile-qa/Default/PersistentOriginTrials/LOCK
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/metadata/LOG
  - tmp/pdfs/chrome-profile/Default/Account Web Data-journal
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/PersistentOriginTrials/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/declarative_performance_observer.db
  - tmp/pdfs/chrome-profile-qa/Default/declarative_performance_observer.db
  - tmp/pdfs/chrome-profile-qa/Default/Extension State/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Cache/Cache_Data/data_2
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/data_0
  - tmp/pdfs/chrome-profile/Default/History
  - tmp/pdfs/chrome-profile-qa/Default/WebStorage/QuotaManager-journal
  - .agents/skills/spectra-ingest/SKILL.md
  - tmp/pdfs/chrome-profile-qa/ShaderCache/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/data_0
  - tmp/pdfs/chrome-profile/Default/PersistentOriginTrials/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Shared Dictionary/cache/index
  - tmp/pdfs/chrome-profile/Crashpad/settings.dat
  - src/components/orders/DeleteUndoToast.vue
  - tmp/pdfs/chrome-pdf-qa/Default/ServerCertificate
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/data_1
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/metadata/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Safe Browsing Network/NetworkDataMigrated
  - tmp/pdfs/chrome-pdf-qa/Default/Login Data
  - tmp/pdfs/chrome-profile/Default/Extension Rules/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/chrome_cart_db/LOG
  - tmp/pdfs/chrome-profile/Default/Extension Scripts/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SignalStorageConfigDB/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Sync Data/LevelDB/LOCK
  - tmp/pdfs/chrome-profile/Default/Network/Device Bound Sessions-journal
  - tmp/pdfs/chrome-profile/GrShaderCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Network/Network Persistent State
  - tmp/pdfs/chrome-profile-qa/extensions_crx_cache/metadata.json
  - tmp/pdfs/chrome-pdf-qa/Default/Extension State/CURRENT
  - tmp/pdfs/chrome-profile/Default/Extension State/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Account Web Data
  - tmp/pdfs/chrome-pdf-qa/Default/shared_proto_db/metadata/LOG
  - tmp/pdfs/chrome-profile-qa/Default/declarative_performance_observer.db-journal
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/metadata/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/trusted_vault.pb
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SignalDB/LOCK
  - tmp/pdfs/chrome-profile/Default/Session Storage/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Session Storage/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Crashpad/settings.dat
  - tmp/pdfs/chrome-profile-qa/Default/engine_allowlist.bf
  - tmp/pdfs/chrome-profile-qa/Default/Extension Rules/CURRENT
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/Database/LOG
  - tmp/pdfs/chrome-profile/Default/commerce_subscription_db/LOCK
  - tmp/pdfs/chrome-profile/Default/Site Characteristics Database/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Scripts/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/discount_infos_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/commerce_subscription_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/index
  - tmp/pdfs/chrome-profile/segmentation_platform/ukm_db
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/Database/MANIFEST-000001
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/data_3
  - tmp/pdfs/chrome-profile/Crashpad/metadata
  - tmp/pdfs/chrome-pdf-qa/segmentation_platform/ukm_db
  - tmp/pdfs/hakobi-deployment-troubleshooting.html
  - tmp/pdfs/chrome-profile/Default/Extension Scripts/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Extension Rules/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Top Sites-journal
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/2cc80dabc69f58b6_0
  - tmp/pdfs/chrome-profile/Default/Shared Dictionary/cache/index-dir/the-real-index
  - tmp/pdfs/chrome-pdf-qa/Default/declarative_performance_observer.db-journal
  - tmp/pdfs/chrome-pdf-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.journal
  - tmp/pdfs/chrome-profile/Default/Extension State/CURRENT
  - tmp/pdfs/chrome-profile/Default/History-journal
  - tmp/pdfs/chrome-pdf-qa/Default/PersistentOriginTrials/LOG
  - tmp/pdfs/chrome-profile-qa/Crashpad/settings.dat
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/LOG
  - tmp/pdfs/chrome-profile-qa/Default/shared_proto_db/metadata/LOG
  - tmp/pdfs/chrome-profile/Default/Service Worker/ScriptCache/4cb013792b196a35_1
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/4cb013792b196a35_0
  - tmp/pdfs/chrome-profile/Default/Code Cache/wasm/index-dir/the-real-index
  - tmp/pdfs/chrome-pdf-qa/ShaderCache/data_0
  - tmp/pdfs/chrome-profile/Default/LOCK
  - tmp/pdfs/chrome-profile/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.db-wal
  - tmp/pdfs/chrome-pdf-qa/Default/chrome_cart_db/LOCK
  - tmp/pdfs/chrome-profile-qa/ShaderCache/data_1
  - tmp/pdfs/chrome-profile/Default/Login Data-journal
  - tmp/pdfs/chrome-pdf-qa/Default/LOCK
  - tmp/pdfs/chrome-profile/Default/Network/Cookies
  - tmp/pdfs/chrome-profile-qa/Default/DawnGraphiteCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Segmentation Platform/SignalStorageConfigDB/LOG
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/Login Data
  - tmp/pdfs/chrome-profile-qa/Default/Network/Cookies
  - tmp/pdfs/chrome-profile-qa/Default/Preferences
  - tmp/pdfs/chrome-profile/Last Version
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/data_0
  - tmp/pdfs/chrome-pdf-qa/Default/Service Worker/Database/CURRENT
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Rules/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Local Storage/leveldb/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/Network/Cookies-journal
  - tmp/pdfs/chrome-profile-qa/Default/History
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/Database/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Site Characteristics Database/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/2cc80dabc69f58b6_0
  - tmp/pdfs/chrome-profile/Default/Extension Rules/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Web Data-journal
  - tmp/pdfs/chrome-profile-qa/Default/Login Data For Account-journal
  - tmp/pdfs/chrome-profile/Local State
  - tmp/pdfs/chrome-profile-qa/Default/Shared Dictionary/cache/index
  - tmp/pdfs/chrome-profile/Default/Network/Reporting and NEL
  - tmp/pdfs/chrome-profile-qa/Default/discount_infos_db/LOCK
  - tmp/pdfs/chrome-profile/VariationsSeedV2
  - .agents/skills/spectra-audit/SKILL.md
  - tmp/pdfs/chrome-profile-qa/Default/Web Data
  - tmp/pdfs/chrome-profile/Default/Local Storage/leveldb/MANIFEST-000001
  - tmp/pdfs/chrome-profile/Default/Session Storage/LOCK
  - src/stores/orders.js
  - tmp/pdfs/chrome-profile-qa/Default/Sessions/Tabs_13430687835325049
  - tmp/pdfs/chrome-pdf-qa/Default/Extension State/LOCK
  - tmp/pdfs/chrome-profile/Default/Site Characteristics Database/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/Extension Scripts/LOG
  - tmp/pdfs/chrome-pdf-qa/Default/GPUCache/index
  - tmp/pdfs/chrome-profile-qa/Default/Shared Dictionary/db
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/metadata/LOCK
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/data_3
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/index
  - tmp/pdfs/chrome-pdf-qa/Default/Affiliation Database
  - tmp/pdfs/chrome-pdf-qa/Default/Cache/Cache_Data/data_1
  - tmp/pdfs/chrome-profile/Default/GPUCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/Safe Browsing Network/NetworkDataMigrated
  - tmp/pdfs/chrome-profile-qa/Default/Cache/No_Vary_Search/snapshot.baf
  - tmp/pdfs/chrome-profile-qa/Default/Local Storage/leveldb/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Network/TransportSecurity
  - tmp/pdfs/chrome-profile-qa/Default/Session Storage/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/Default/Secure Preferences
  - tmp/pdfs/chrome-profile-qa/GPUPersistentCache/DawnGraphiteCache/P27VQJWCZTEA4KHQSE2IQBIIQMS5IZPD/cache.journal
  - tmp/pdfs/chrome-profile-qa/segmentation_platform/ukm_db
  - tmp/pdfs/chrome-profile/Default/Cache/Cache_Data/data_1
  - tmp/pdfs/chrome-profile/Default/Extension Rules/LOCK
  - tmp/pdfs/chrome-pdf-qa/Default/ServerCertificate-journal
  - tmp/pdfs/chrome-profile/Default/DawnGraphiteCache/data_1
  - tmp/pdfs/chrome-profile/Default/shared_proto_db/MANIFEST-000001
  - tmp/pdfs/chrome-profile-qa/GrShaderCache/index
  - tmp/pdfs/chrome-pdf-qa/GrShaderCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/LOG
  - tmp/pdfs/chrome-profile-qa/Default/Service Worker/ScriptCache/4cb013792b196a35_1
  - tmp/pdfs/chrome-profile/Default/Shared Dictionary/db-journal
  - tmp/pdfs/chrome-profile-qa/Default/GPUCache/data_3
  - tmp/pdfs/chrome-profile-qa/Default/Extension Scripts/LOCK
  - tmp/pdfs/chrome-profile-qa/Default/DawnWebGPUCache/data_3
  - tmp/pdfs/chrome-pdf-qa/Default/DawnWebGPUCache/data_1
  - tmp/pdfs/chrome-pdf-qa/Default/Login Data-journal
tests:
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/__tests__/App.spec.js
  - src/components/orders/__tests__/DeleteUndoToast.spec.js
  - src/stores/__tests__/orders.spec.js
  - src/services/__tests__/ordersApi.spec.js
  - src/router/__tests__/authGuard.spec.js
  - src/views/__tests__/AllOrders.spec.js
-->

---
### Requirement: Modal supports backward-compatible responsive layout customization

The shared Modal component SHALL provide an explicit interface for callers to customize responsive overlay, panel, header, content, and footer layout classes needed by large or bottom-sheet dialogs. Every customization input MUST default to the current Modal layout so existing callers retain their present width, centering, spacing, scrolling, Escape handling, overlay-close behavior, and background-scroll lock without modification.

#### Scenario: Existing caller receives unchanged defaults

- **WHEN** a caller renders Modal without responsive customization inputs
- **THEN** the overlay remains centered with the existing page padding
- **AND** the panel retains its current maximum width, height, spacing, and independent content scrolling

#### Scenario: Order form supplies responsive customization

- **WHEN** the order form passes its responsive Modal customization
- **THEN** the phone panel can align to the bottom and the desktop panel can expand to 880px
- **AND** header, content, and footer styling can change at the defined breakpoints without replacing Modal lifecycle behavior

#### Scenario: Modal lifecycle remains intact after customization

- **WHEN** a customized Modal is closed by Escape, overlay click, or its model update
- **THEN** it emits the same close and model-update events as before
- **AND** document and body scrolling are restored to their prior values

---
### Requirement: Order form controls match the reference surfaces without recoloring actions

The order form SHALL use a white background for the modal content and the Product, Cargo, Shipping, and Notes section cards while retaining the existing pale-purple modal header background. It SHALL apply the reference design's borders, radii, control heights, and spacing to text inputs, selects, date controls, checkbox chips, textarea, and attachment area. Cancel and submit action buttons MUST retain their existing Hakobi variants and colors. Any shared control customization MUST be opt-in so callers outside the order form preserve their current appearance.

#### Scenario: Reference surfaces and existing action colors coexist

- **WHEN** the order form is displayed on phone, tablet, or desktop
- **THEN** the modal content and all four section cards have white backgrounds
- **AND** the modal header retains its existing pale-purple background
- **AND** its controls use the reference surface styling consistently
- **AND** cancel and submit retain their existing Hakobi button variants
- **AND** an Input or Select outside the order form retains its default styling
