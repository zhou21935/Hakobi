# order-api-sync Specification

## Purpose

TBD - created by archiving change 'order-supabase-integration'. Update Purpose after archive.

## Requirements

### Requirement: The order store loads the authenticated user's remote orders
The frontend application SHALL fetch `GET /api/orders` once per authenticated session before any protected view relies on order projections, SHALL replace its in-memory active order collection with the returned `data` array, and SHALL NOT use persisted localStorage orders as an authoritative source. Logging out or receiving HTTP 401 MUST reset initialization so a later authenticated session performs a new initial load.

#### Scenario: Dashboard is the first protected view
- **WHEN** an authenticated application starts at `/` and the backend returns two owned active orders
- **THEN** the store SHALL expose those two orders, mark initial loading complete, and the dashboard SHALL compute its totals from them

#### Scenario: Navigation does not duplicate a completed initial load
- **WHEN** initial loading succeeded and the user navigates among the dashboard, all-orders view, and category views
- **THEN** the frontend SHALL NOT issue another initial `GET /api/orders` request during that authenticated session

#### Scenario: Initial load fails
- **WHEN** the initial orders request fails with a non-authentication error
- **THEN** the store SHALL expose an actionable load error, preserve an empty or previously confirmed collection, and allow the user to retry

#### Scenario: A new session reloads owner data
- **WHEN** the user signs out and a user subsequently signs in
- **THEN** the frontend SHALL clear the previous active collection and SHALL perform a new initial orders request


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
### Requirement: Order mutations are confirmed by the backend

The frontend store SHALL update its confirmed collection only from successful backend order responses. Create and update payloads SHALL include `orderNumber` and SHALL allow `productCategories: []`. Attachment mutations SHALL update attachment state only from successful attachment responses and SHALL NOT roll back a confirmed order when a later attachment upload fails.

#### Scenario: Order create confirms number and optional categories

- **WHEN** create succeeds with `orderNumber: 'A-100'` and `productCategories: []`
- **THEN** the store SHALL add the returned order with those exact values

#### Scenario: Order mutation fails

- **WHEN** an order create or update request fails
- **THEN** the store SHALL preserve its previously confirmed order collection

#### Scenario: Attachment upload partially fails after create

- **WHEN** order creation succeeds and a later attachment request fails
- **THEN** the store SHALL retain the created order
- **AND** the UI SHALL retain successful attachment metadata and expose the failed filename for retry


<!-- @trace
source: persist-order-number-and-attachments
updated: 2026-08-13
code:
  - backend/package.json
  - backend/src/modules/order-attachments/order-attachments.repository.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/app.ts
  - backend/src/modules/order-attachments/order-attachments.mapper.ts
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/shared/errors.ts
  - .agents/skills/spectra-apply/SKILL.md
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/modules/orders/orders.routes.ts
  - backend/src/modules/orders/orders.schema.ts
  - src/components/ui/Input.vue
  - backend/src/modules/order-attachments/order-attachments.storage.ts
  - backend/src/modules/order-attachments/order-attachments.service.ts
  - .agents/skills/spectra-ask/SKILL.md
  - supabase/migrations/20260813000000_persist_order_number_and_attachments.sql
  - src/views/AllOrders.vue
  - render.yaml
  - src/views/OrderList.vue
  - backend/src/modules/order-attachments/order-attachments.routes.ts
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - src/services/ordersApi.js
  - supabase/.temp/start-secrets/supabase_edge_runtime_Hakobi/main/index.ts
  - .agents/skills/spectra-audit/SKILL.md
  - src/components/orders/OrderFormModal.vue
  - .agents/skills/spectra-debug/SKILL.md
  - backend/src/config.ts
  - src/domain/orderValidation.js
  - src/components/orders/OrderDetailsModal.vue
  - src/stores/orders.js
tests:
  - scripts/tests/deploymentConfig.spec.js
  - backend/tests/order-attachments/order-attachments.service.test.ts
  - backend/tests/migrations/migration.test.ts
  - backend/tests/config/config.test.ts
  - backend/tests/orders/orders.repository.test.ts
  - backend/tests/orders/orders.service.test.ts
  - tests/views/AllOrders.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - backend/tests/order-attachments/order-attachments.routes.test.ts
  - tests/stores/orders.spec.js
  - backend/tests/order-attachments/order-attachments.storage.test.ts
  - tests/domain/orderValidation.spec.js
  - backend/tests/app/app.test.ts
  - tests/views/OrderList.spec.js
-->

---
### Requirement: Order views expose asynchronous operation state
Order views MUST distinguish initial loading, empty success, mutation-in-progress, and request failure states. Controls that would duplicate an active mutation SHALL be disabled until that mutation settles.

#### Scenario: Initial request is pending
- **WHEN** the order store is loading its initial collection
- **THEN** the view SHALL display a loading state and SHALL NOT display the empty-orders message

#### Scenario: Mutation is pending
- **WHEN** a create, update, or delete request is in progress
- **THEN** the relevant submit or confirmation control SHALL be disabled and repeated submission SHALL NOT issue another request

#### Scenario: Request fails
- **WHEN** an order request fails after authentication
- **THEN** the view SHALL display a user-readable error and provide retry for initial-load failures

---
### Requirement: Existing order projections remain client-side
Category filtering, status filtering, keyword search, sorting, counts, and aggregate statistics SHALL operate over the remotely confirmed in-memory collection and SHALL retain their current observable results.

#### Scenario: Remote collection is filtered and sorted
- **WHEN** the loaded collection contains matching and non-matching categories, statuses, names, notes, dates, and amounts
- **THEN** existing filter, search, sort, count, and statistics selectors SHALL compute from the loaded collection without additional API requests

---
### Requirement: API errors use one frontend contract

The API client SHALL normalize order and attachment failures into an error containing a stable frontend code, user-safe message, and HTTP status. It SHALL preserve attachment limit/type/size codes and MUST treat HTTP 401 as an invalid authenticated flow.

#### Scenario: Attachment limit is returned

- **WHEN** the backend responds HTTP 409 with code `ATTACHMENT_LIMIT_REACHED`
- **THEN** the client SHALL expose that code and the backend's user-safe message

#### Scenario: Backend returns unauthorized

- **WHEN** any order or attachment request responds with HTTP 401
- **THEN** the frontend SHALL clear user-scoped order state and direct the user to sign in again


<!-- @trace
source: persist-order-number-and-attachments
updated: 2026-08-13
code:
  - backend/package.json
  - backend/src/modules/order-attachments/order-attachments.repository.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/app.ts
  - backend/src/modules/order-attachments/order-attachments.mapper.ts
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/shared/errors.ts
  - .agents/skills/spectra-apply/SKILL.md
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/modules/orders/orders.routes.ts
  - backend/src/modules/orders/orders.schema.ts
  - src/components/ui/Input.vue
  - backend/src/modules/order-attachments/order-attachments.storage.ts
  - backend/src/modules/order-attachments/order-attachments.service.ts
  - .agents/skills/spectra-ask/SKILL.md
  - supabase/migrations/20260813000000_persist_order_number_and_attachments.sql
  - src/views/AllOrders.vue
  - render.yaml
  - src/views/OrderList.vue
  - backend/src/modules/order-attachments/order-attachments.routes.ts
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - src/services/ordersApi.js
  - supabase/.temp/start-secrets/supabase_edge_runtime_Hakobi/main/index.ts
  - .agents/skills/spectra-audit/SKILL.md
  - src/components/orders/OrderFormModal.vue
  - .agents/skills/spectra-debug/SKILL.md
  - backend/src/config.ts
  - src/domain/orderValidation.js
  - src/components/orders/OrderDetailsModal.vue
  - src/stores/orders.js
tests:
  - scripts/tests/deploymentConfig.spec.js
  - backend/tests/order-attachments/order-attachments.service.test.ts
  - backend/tests/migrations/migration.test.ts
  - backend/tests/config/config.test.ts
  - backend/tests/orders/orders.repository.test.ts
  - backend/tests/orders/orders.service.test.ts
  - tests/views/AllOrders.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - backend/tests/order-attachments/order-attachments.routes.test.ts
  - tests/stores/orders.spec.js
  - backend/tests/order-attachments/order-attachments.storage.test.ts
  - tests/domain/orderValidation.spec.js
  - backend/tests/app/app.test.ts
  - tests/views/OrderList.spec.js
-->

---
### Requirement: Attachment API requests preserve multipart semantics

The frontend API SHALL send each attachment as one `FormData` request and MUST allow the runtime to generate the multipart Content-Type boundary. It SHALL provide list, upload, download, and delete methods using encoded order and attachment identifiers.

#### Scenario: File is uploaded

- **WHEN** the client uploads a selected file
- **THEN** the request body SHALL be `FormData` containing one `file` field
- **AND** the client SHALL NOT manually set a JSON or multipart Content-Type header

#### Scenario: Attachment identifiers contain unsafe URL characters

- **WHEN** an order or attachment identifier is placed into a request path
- **THEN** the client SHALL URL-encode the identifier before issuing the request

<!-- @trace
source: persist-order-number-and-attachments
updated: 2026-08-13
code:
  - backend/package.json
  - backend/src/modules/order-attachments/order-attachments.repository.ts
  - backend/src/modules/orders/orders.mapper.ts
  - backend/src/app.ts
  - backend/src/modules/order-attachments/order-attachments.mapper.ts
  - .agents/skills/spectra-discuss/SKILL.md
  - .agents/skills/spectra-ingest/SKILL.md
  - backend/src/shared/errors.ts
  - .agents/skills/spectra-apply/SKILL.md
  - backend/src/modules/orders/orders.service.ts
  - .agents/skills/spectra-archive/SKILL.md
  - backend/src/modules/orders/orders.routes.ts
  - backend/src/modules/orders/orders.schema.ts
  - src/components/ui/Input.vue
  - backend/src/modules/order-attachments/order-attachments.storage.ts
  - backend/src/modules/order-attachments/order-attachments.service.ts
  - .agents/skills/spectra-ask/SKILL.md
  - supabase/migrations/20260813000000_persist_order_number_and_attachments.sql
  - src/views/AllOrders.vue
  - render.yaml
  - src/views/OrderList.vue
  - backend/src/modules/order-attachments/order-attachments.routes.ts
  - .agents/skills/spectra-drift/SKILL.md
  - .agents/skills/spectra-commit/SKILL.md
  - .agents/skills/spectra-propose/SKILL.md
  - src/services/ordersApi.js
  - supabase/.temp/start-secrets/supabase_edge_runtime_Hakobi/main/index.ts
  - .agents/skills/spectra-audit/SKILL.md
  - src/components/orders/OrderFormModal.vue
  - .agents/skills/spectra-debug/SKILL.md
  - backend/src/config.ts
  - src/domain/orderValidation.js
  - src/components/orders/OrderDetailsModal.vue
  - src/stores/orders.js
tests:
  - scripts/tests/deploymentConfig.spec.js
  - backend/tests/order-attachments/order-attachments.service.test.ts
  - backend/tests/migrations/migration.test.ts
  - backend/tests/config/config.test.ts
  - backend/tests/orders/orders.repository.test.ts
  - backend/tests/orders/orders.service.test.ts
  - tests/views/AllOrders.spec.js
  - tests/services/ordersApi.spec.js
  - tests/components/orders/OrderDetailsModal.spec.js
  - tests/components/orders/OrderFormModal.spec.js
  - backend/tests/orders/orders.mapper.test.ts
  - backend/tests/order-attachments/order-attachments.routes.test.ts
  - tests/stores/orders.spec.js
  - backend/tests/order-attachments/order-attachments.storage.test.ts
  - tests/domain/orderValidation.spec.js
  - backend/tests/app/app.test.ts
  - tests/views/OrderList.spec.js
-->