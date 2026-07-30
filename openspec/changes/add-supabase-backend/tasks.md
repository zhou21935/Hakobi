## 1. 後端基礎與資料庫

- [x] 1.1 依 **TypeScript Fastify backend and feature modules** 建立 `server/` package、feature-based module 邊界、Fastify app factory 與公開 `GET /health`，並依 **Backend lifecycle and configuration are deterministic** 及 **Runtime and configuration** 驗證環境設定與 graceful shutdown；先寫 config/app lifecycle 測試，再以 `npm --prefix server test`、`npm --prefix server run typecheck` 驗證。
- [x] 1.2 依 **PostgreSQL access through backend** 建立可注入及可關閉的 `pg` pool plugin，確保設定錯誤不洩漏連線密碼；先寫 database plugin 單元測試，再以 `npm --prefix server test -- database` 驗證。
- [x] 1.3 依 **Order data model and mapping**、**Ownership and persistence** 與 **Database schema enforces ownership and query performance** 建立 `supabase/migrations/` SQL，包含 `orders` 欄位、constraints、foreign key、indexes、updated trigger、RLS 與四項 owner policies；先寫 migration contract 測試，再以 `npm --prefix server test -- migration` 驗證。

## 2. JWT 驗證

- [x] 2.1 依 **Supabase Auth as JWT issuer** 與 **Supabase access tokens establish caller identity** 先以測試用非對稱 key/JWKS 建立有效、錯簽章、錯 issuer、錯 audience、過期、錯 role 與非 UUID subject 的失敗測試，再實作 `jose` JWT verifier；以 `npm --prefix server test -- auth` 驗證全部 claims 與簽章檢查。
- [x] 2.2 完成 **Authentication behavior**、**Protected routes require a bearer token**、**Authentication failures fail closed without leaking details** 與 **Client input cannot override authenticated identity**：將 verifier 封裝為 Fastify auth plugin、建立 request `userId` context、統一 401 並保留公開 health route；以 Fastify inject 測試缺 token、錯格式、JWKS 失敗及 body `userId` 攻擊。

## 3. 訂單領域與持久化

- [x] 3.1 依 **Order JSON shape** 與 **Order responses use the stable public shape** 建立 Zod order schemas 與唯一 snake_case/camelCase mapper，拒絕 unknown/immutable fields 並正規化日期、numeric 與 nullable values；先寫 mapper/schema 邊界測試，再以 `npm --prefix server test -- orders.mapper` 驗證。
- [x] 3.2 依 **Users can list only their own orders** 與 **Users can read one owned order without resource disclosure** 建立參數化 repository list/find 查詢，每次明確限定 verified `user_id` 並對 missing/cross-owner 回同一結果；先寫 SQL contract 測試，再以 `npm --prefix server test -- orders.repository` 驗證。
- [x] 3.3 依 **Orders are persisted with validated ownership and values** 建立 create repository/service，所有權只取 verified `userId`，合法輸入回完整 Order、非法輸入不執行 SQL；先寫 create service 與 repository 測試，再以 `npm --prefix server test -- orders` 驗證。
- [x] 3.4 依 **Users can partially update an owned order** 建立 partial update service/repository，要求至少一個 editable field、驗證合併後狀態並以 ID + verified `user_id` 更新；先寫 owner、cross-owner、empty 與 immutable patch 測試，再執行 orders 測試。
- [x] 3.5 依 **Users can delete an owned order** 建立 delete service/repository，以 ID + verified `user_id` 刪除並對 missing/cross-owner 統一回 not found；先寫 owner 與非 owner 測試，再執行 orders 測試。

## 4. HTTP API 與錯誤契約

- [x] 4.1 依 **API response and error contract** 註冊 `GET/POST /api/orders` 與 `GET/PATCH/DELETE /api/orders/:id`，回傳指定 status、data/meta shape 並把 verified `userId` 傳入 service；先寫每個端點的 Fastify inject contract tests，再以 `npm --prefix server test -- orders.routes` 驗證。
- [x] 4.2 完成 **Invalid request structure uses a consistent error contract** 與全域 error handler，將 Zod/path 錯誤映射為 400、missing/cross-owner 映射為 404、未知錯誤映射為不洩密的 500；以 validation、database failure、SQL/stack/secret 不出現在 response 的測試驗證。

## 5. 操作文件與整體驗證

- [x] 5.1 建立 `server/.env.example`、`docs/supabase-setup.md` 與 README 後端章節，記錄 migration、關閉公開註冊、建立個人帳號、取得測試 JWT、啟動與 curl owner/cross-owner 驗證流程；以文件內容檢查確認不含真實 URL、token、密碼或 service-role key。
- [x] 5.2 依 **Acceptance criteria** 執行 `npm --prefix server test`、`npm --prefix server run typecheck`、`npm --prefix server run build`、root `npm test`、root `npm run build` 與 `spectra analyze add-supabase-backend`；確認 **Test isolation strategy**、所有驗收條件與 **Scope boundaries** 均成立，未修改前端行為，失敗項目修正後才完成任務。

