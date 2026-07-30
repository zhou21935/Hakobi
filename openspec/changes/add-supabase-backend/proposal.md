## Why

Hakobi 目前僅以瀏覽器本機狀態保存訂單，缺乏可跨裝置、可驗證身分且由伺服器強制授權的持久化層。為後續正式產品化與前端登入串接，需要先建立獨立後端、Supabase PostgreSQL schema、Supabase Auth JWT 驗證及完整訂單 API。

## What Changes

- 新增 Node.js、TypeScript 與 Fastify 後端，採 feature-based modules，使各 API 的 route、schema、service、repository 與測試集中於所屬領域。
- 新增 Supabase PostgreSQL migrations，建立以 Supabase Auth 使用者 UUID 為擁有者的 orders 資料表、約束與索引。
- 新增 Supabase JWT 驗證插件，所有訂單端點僅接受有效的 authenticated access token。
- 新增 orders CRUD REST API，強制每筆查詢與異動限定於 JWT subject 對應的 user_id。
- 新增環境設定、統一錯誤格式、資料欄位 mapper、單元與整合測試，以及個人 Supabase Auth 帳號設定文件。

## Capabilities

### New Capabilities

- `api-authentication`: 後端驗證 Supabase Auth JWT、建立可信任的請求者身分，並以一致的未授權回應保護端點。
- `order-persistence-api`: 以 PostgreSQL 持久化訂單，並提供具所有權隔離、輸入驗證與一致回應格式的 orders CRUD API。

### Modified Capabilities

(none)

## Impact

- Affected specs: api-authentication, order-persistence-api
- Affected code:
  - New: server/, supabase/migrations/, docs/supabase-setup.md
  - Modified: package.json, package-lock.json, .gitignore, README.md
  - Removed: none
- External systems: Supabase Auth, Supabase PostgreSQL
- Dependencies: Fastify, TypeScript, Zod, jose, PostgreSQL client and test tooling
- GitHub tracking: Issue #47
