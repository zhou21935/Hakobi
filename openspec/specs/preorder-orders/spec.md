# preorder-orders Specification

## Purpose

TBD - created by archiving change 'build-preorder-feature'. Update Purpose after archive.

## Requirements

### Requirement: User can create a preorder order with required field validation
The system SHALL allow a user to create a new order from either a supported category view or the all-orders view. A category view SHALL supply its route category, while the all-orders form SHALL require the user to select exactly one supported category. Every creation path SHALL require a non-empty product name and a positive amount, and the orders store's add operation SHALL enforce these rules directly using the shared validation capability.

#### Scenario: Category-view submission creates an order
- **WHEN** a user submits valid input from `/orders/agent`
- **THEN** the system SHALL create an `agent` order with status `AWAITING_SHIPMENT` by default and SHALL add it to the active order list

#### Scenario: All-orders submission creates an explicitly categorized order
- **WHEN** a user opens the create form from `/orders`, selects `parcel`, and submits otherwise valid input
- **THEN** the system SHALL create a `parcel` order and SHALL add it to the active order list

#### Scenario: All-orders submission without category is blocked
- **WHEN** a user submits the all-orders create form without selecting a category
- **THEN** the system SHALL display a category validation error and SHALL NOT create an order

#### Scenario: Invalid core fields are blocked
- **WHEN** a user submits an empty product name or an amount of zero or less
- **THEN** the system SHALL display the corresponding field validation error and SHALL NOT create an order

#### Scenario: Store rejects invalid input independent of the form
- **WHEN** the orders store's add operation receives an empty name, non-positive amount, or unsupported category
- **THEN** the system SHALL NOT issue a create request and SHALL return a validation error


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
### Requirement: User can edit an existing order using the same form
The system SHALL allow a user to edit an existing order's fields using the same form component used for creation, pre-filled with the order's current values.

#### Scenario: Editing updates the existing order
- **WHEN** a user opens the edit form for an order, changes a field, and submits
- **THEN** the system SHALL update that order's data and SHALL NOT create a duplicate order


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
### Requirement: User must confirm before an order is deleted
The system SHALL require explicit confirmation before starting a permanent order deletion, and after confirmation SHALL provide an undo opportunity for the lifetime of the current order view before submitting the delete API request on view exit.

#### Scenario: Confirming deletion starts temporary removal
- **WHEN** a user clicks delete on an active order and confirms the deletion
- **THEN** the system SHALL remove the order from active lists and status counts and SHALL display an undo action without a countdown

#### Scenario: Cancelling the confirmation keeps the order
- **WHEN** a user clicks delete on an active order and then cancels the confirmation dialog
- **THEN** the system SHALL leave the order unchanged in the active list and SHALL issue no delete request


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
### Requirement: Orders progress through a 5-stage shipment status lifecycle

The system SHALL support exactly 5 order statuses representing the shipment lifecycle, in this order: awaiting shipment, consolidating, in transit, arrived, and completed. Payment status SHALL be tracked separately via a boolean `isPaid` field, not as part of this status lifecycle.

#### Scenario: Default status on creation

- **WHEN** a new order is created without an explicit status
- **THEN** the order SHALL be assigned the awaiting-shipment status

#### Scenario: Status can be changed via the edit form

- **WHEN** a user edits an order and selects a different status from the 5 available statuses
- **THEN** the order SHALL be updated to the newly selected status

#### Scenario: Payment can be marked independently of shipment status

- **WHEN** a user edits an order and toggles the "已付款" (paid) checkbox
- **THEN** the order's `isPaid` boolean field SHALL be updated accordingly, without changing the order's shipment status

#### Scenario: Status dropdown lists statuses in shipment progression order

- **WHEN** the order edit form's status dropdown is rendered
- **THEN** the options SHALL appear in this order: awaiting shipment, consolidating, in transit, arrived, completed


<!-- @trace
source: order-status-modal-layout-fix
updated: 2026-07-11
code:
  - src/components/ui/Modal.vue
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
-->

---
### Requirement: Status filter tabs show per-status counts and filter the order list

The system SHALL display a row of filter tabs (one for "all" plus one per status) each showing the count of orders in that status, and SHALL filter the visible order list to the selected status when a tab is clicked.

#### Scenario: Tab counts reflect current data

- **WHEN** the order list contains orders in various statuses
- **THEN** each status tab SHALL display the count of orders currently in that status

##### Example: four orders across four statuses

- **GIVEN** four preorder orders with statuses `AWAITING_SHIPMENT`, `CONSOLIDATING`, `IN_TRANSIT`, `COMPLETED` (one each)
- **WHEN** the status filter tabs are rendered
- **THEN** the "all" tab SHALL show 4, the awaiting-shipment tab SHALL show 1, the consolidating tab SHALL show 1, the in-transit tab SHALL show 1, the completed tab SHALL show 1, and the arrived tab SHALL show 0

#### Scenario: Selecting a status tab filters the list

- **WHEN** a user clicks the "arrived" tab
- **THEN** the order list SHALL show only orders with the arrived status


<!-- @trace
source: order-status-modal-layout-fix
updated: 2026-07-11
code:
  - src/components/ui/Modal.vue
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
-->

---
### Requirement: All-orders view lists orders across every category
The system SHALL provide the authenticated home view at `/` with the title "訂單總覽", SHALL list orders from all categories together independent of the per-category views, and SHALL provide search, sorting, status filtering, create, details, edit, and delete actions using the existing all-orders behavior. The legacy `/orders` path SHALL redirect to `/`.

#### Scenario: Home order overview includes every category
- **WHEN** an authenticated user navigates to `/`
- **THEN** the system SHALL display the "訂單總覽" view with every order regardless of category, including preorder orders

#### Scenario: Legacy all-orders URL remains compatible
- **WHEN** an authenticated user navigates to `/orders`
- **THEN** the router SHALL replace or redirect the destination with `/`

---
### Requirement: Orders record an amount in one of four supported currencies without conversion
The system SHALL allow an order's amount to be recorded in one of TWD, USD, KRW, or JPY, and SHALL display the amount together with its currency without converting between currencies.

#### Scenario: Amount displays with its recorded currency
- **WHEN** an order with amount 320 and currency USD is displayed
- **THEN** the displayed amount SHALL show both the value 320 and an indicator of the USD currency, unconverted


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
### Requirement: Order payment status is tracked as an independent boolean field

The system SHALL track whether an order has been paid via a boolean `isPaid` field, independent of the order's shipment status, defaulting to `false` for new orders.

#### Scenario: New order defaults to unpaid

- **WHEN** a new order is created without specifying `isPaid`
- **THEN** the order's `isPaid` field SHALL default to `false`

#### Scenario: Marking an order as paid via the edit form

- **WHEN** a user edits an order, checks the "已付款" checkbox, and submits
- **THEN** the order's `isPaid` field SHALL be updated to `true`

<!-- @trace
source: narrow-order-status-add-paid-checkbox
updated: 2026-07-11
code:
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
  - src/components/ui/Checkbox.vue
  - src/views/Dashboard.vue
-->

---
### Requirement: Sidebar navigation offers exactly two order categories

The system SHALL display exactly two category links in the sidebar navigation, labeled "代購" (agent) and "集運包裹" (parcel), each linking to its own `/orders/:category` view, and SHALL NOT display a navigation entry for any other category value.

#### Scenario: Sidebar shows only agent and parcel category links

- **WHEN** the sidebar navigation is rendered
- **THEN** the category section SHALL contain exactly two links, labeled "代購" and "集運包裹"

#### Scenario: Orders with a legacy category remain visible in the all-orders view

- **WHEN** an order's stored `category` value is not `agent` or `parcel` (a legacy value such as `preorder`, `merch`, or `manga`)
- **THEN** the order SHALL have no matching sidebar category link, and SHALL continue to appear in the 全部訂單 (all-orders) view


<!-- @trace
source: order-category-rework
updated: 2026-07-12
code:
  - src/stores/orders.js
  - src/components/AppSidebar.vue
  - vite.config.js
  - package.json
  - src/components/ui/MultiSelect.vue
  - src/components/orders/OrderCard.vue
  - src/components/orders/OrderFormModal.vue
tests:
  - src/components/ui/__tests__/MultiSelect.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/stores/__tests__/orders.spec.js
-->

---
### Requirement: Orders can be flagged as a preorder item

The system SHALL allow a user to mark an order as a preorder item via a boolean `isPreorder` field, presented as a checkbox labeled "預購商品" in the order edit form, defaulting to not a preorder, and SHALL display a "預購" tag next to the order's status badge on its order card when `isPreorder` is `true`.

#### Scenario: New order defaults to not a preorder

- **WHEN** a new order is created without specifying the preorder flag
- **THEN** the order's `isPreorder` field SHALL default to `false`

#### Scenario: Checking the preorder checkbox marks the order and shows a tag

- **WHEN** a user checks the "預購商品" checkbox in the order edit form and submits
- **THEN** the order's `isPreorder` field SHALL be updated to `true`, and the order's card SHALL display a "預購" tag next to its status badge

#### Scenario: Unchecked preorder flag shows no tag

- **WHEN** an order's `isPreorder` field is `false`
- **THEN** the order's card SHALL NOT display a "預購" tag


<!-- @trace
source: order-category-rework
updated: 2026-07-12
code:
  - src/stores/orders.js
  - src/components/AppSidebar.vue
  - vite.config.js
  - package.json
  - src/components/ui/MultiSelect.vue
  - src/components/orders/OrderCard.vue
  - src/components/orders/OrderFormModal.vue
tests:
  - src/components/ui/__tests__/MultiSelect.spec.js
  - src/components/orders/__tests__/OrderCard.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/components/__tests__/AppSidebar.spec.js
  - src/stores/__tests__/orders.spec.js
-->

---
### Requirement: Orders can be tagged with one or more product categories

The system SHALL require a user to select at least one product category — from the fixed set 周邊 (merch), 書籍 (book), 其他 (other) — via a multi-select control in the order create/edit form before the order can be submitted, SHALL store the selection as the order's `productCategories` array field, and SHALL display one tag per selected value on the order's card. The orders store's add and update operations SHALL enforce the at-least-one-category requirement directly, independent of the form, using the shared validation rules defined by the `order-validation` capability.

#### Scenario: Submitting without any product category blocks submission

- **WHEN** a user submits the order form with zero product categories selected
- **THEN** the system SHALL display a validation error on the product category field and SHALL NOT create or update the order

#### Scenario: Selecting multiple product categories persists all of them

- **WHEN** a user selects both "周邊" and "書籍" in the product category control and submits
- **THEN** the order's `productCategories` field SHALL contain both `merch` and `book`

##### Example: three orders with different selections

| Selected labels | Stored `productCategories` | Tags shown on card |
| --- | --- | --- |
| 周邊 | `['merch']` | 周邊 |
| 書籍, 其他 | `['book', 'other']` | 書籍, 其他 |
| 周邊, 書籍, 其他 | `['merch', 'book', 'other']` | 周邊, 書籍, 其他 |

#### Scenario: Tags render in a fixed order regardless of selection order

- **WHEN** a user selects "其他" before "周邊"
- **THEN** the order's card SHALL display the "周邊" tag before the "其他" tag, following the fixed option order 周邊, 書籍, 其他

#### Scenario: Store rejects an empty product category list independent of the form

- **WHEN** the orders store's add operation is called directly with an empty `productCategories` array, bypassing the form
- **THEN** the system SHALL NOT create the order and SHALL return a value indicating the write did not occur

<!-- @trace
source: centralize-order-validation
updated: 2026-07-15
code:
  - src/domain/orderValidation.js
  - src/stores/orders.js
  - src/components/orders/OrderFormModal.vue
tests:
  - src/stores/__tests__/orders.spec.js
  - src/components/orders/__tests__/OrderFormModal.spec.js
  - src/domain/__tests__/orderValidation.spec.js
  - src/views/__tests__/OrderList.spec.js
-->

---
### Requirement: Order forms capture optional logistics information
The shared create and edit order form SHALL provide optional free-text fields for `shippingMethod` and `trackingNumber`, SHALL submit their current values through the existing order mutation flow, and SHALL pre-fill both fields when editing an order.

#### Scenario: Logistics information is created
- **WHEN** a user creates an order with shipping method `日本郵便 EMS` and tracking number `EN123456789JP`
- **THEN** the created order SHALL contain those exact logistics values

#### Scenario: Existing logistics information is edited
- **WHEN** a user opens an order whose logistics fields are populated, changes either value, and submits the edit form
- **THEN** the form SHALL start with the confirmed values and the updated order SHALL contain the submitted values without creating a duplicate

#### Scenario: Logistics information is cleared
- **WHEN** a user clears both logistics fields while editing and submits
- **THEN** the updated order SHALL store both fields as empty strings

---
### Requirement: Order cards expose a separate details action
Each order card SHALL render a details action separate from its edit and delete actions, and each action MUST have an accessible name and a touch-operable target on narrow viewports.

#### Scenario: Card actions remain distinct
- **WHEN** a user views an order card
- **THEN** the card SHALL expose separate controls for details, edit, and delete without making the entire card activate details

---
### Requirement: Order list create action follows the filtering controls

The system SHALL display the "+ 新增訂單" action on both the category order list and the all-orders list alongside the status filter tabs at desktop viewport sizes and after the status filter tabs at mobile viewport sizes, SHALL align the action to the right edge of the order content at all supported viewport sizes, and SHALL size the action to its content rather than stretching it across the available width.

#### Scenario: Desktop order list aligns a compact create action with status filters

- **WHEN** a user views either order list at a desktop viewport
- **THEN** the status filter tabs and the "+ 新增訂單" action SHALL appear on the same row before the order content
- **AND** the action SHALL be aligned to the right edge of the order content with content-based width

#### Scenario: Mobile order list keeps a compact create action below status filters

- **WHEN** a user views either order list at a mobile viewport
- **THEN** the "+ 新增訂單" action SHALL appear on the row after the status filter tabs and before the order content
- **AND** the action SHALL be aligned to the right without occupying the full row width

#### Scenario: Repositioned action opens the existing create form

- **WHEN** a user activates the repositioned "+ 新增訂單" action
- **THEN** the system SHALL open the existing new-order form with the same behavior as before the layout change

<!-- @trace
source: align-desktop-add-order-action
updated: 2026-08-11
code:
  - src/views/OrderList.vue
  - .agents/skills/spectra-apply/SKILL.md
  - src/views/AllOrders.vue
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-audit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - .agents/skills/spectra-ask/SKILL.md
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-archive/SKILL.md
  - .agents/skills/spectra-debug/SKILL.md
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
tests:
  - tests/views/AllOrders.spec.js
  - tests/views/OrderList.spec.js
-->

---
### Requirement: Sidebar exposes one consolidated order overview entry
The sidebar SHALL display one "總覽" entry linked to `/`, SHALL NOT display a separate "全部訂單" entry, and SHALL retain the existing category and member navigation entries.

#### Scenario: Authenticated sidebar avoids duplicate all-orders navigation
- **WHEN** the authenticated sidebar is rendered
- **THEN** it SHALL contain the "總覽" link and SHALL NOT contain a link labeled "全部訂單"

---
### Requirement: Category order views use title-only headings
The category order views SHALL display the category name as the page heading and SHALL NOT render an explanatory subtitle in the form "管理<category>分類的訂單".

#### Scenario: Overseas purchasing view omits its explanatory subtitle
- **WHEN** an authenticated user navigates to `/orders/agent`
- **THEN** the system SHALL display the "海外代購" heading and SHALL NOT display "管理海外代購分類的訂單"

#### Scenario: Parcel forwarding view omits its explanatory subtitle
- **WHEN** an authenticated user navigates to `/orders/parcel`
- **THEN** the system SHALL display the "集運包裹" heading and SHALL NOT display "管理集運包裹分類的訂單"
