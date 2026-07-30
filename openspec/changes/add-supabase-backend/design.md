## Context

Hakobi 現為 Vue 3 單頁應用，訂單僅由 Pinia persisted state 保存於瀏覽器。Issue #47 要先建立可獨立部署的後端、Supabase PostgreSQL schema、Supabase Auth JWT 驗證與 orders CRUD；前端登入、API 串接與 TypeScript 遷移留待下一個 Issue。專案設定啟用 TDD 與 audit，因此所有 runtime 行為須先有失敗測試，且驗證、參數與錯誤回應不得默默降級。

## Goals / Non-Goals

**Goals:**

- 在 `server/` 建立 Node.js、TypeScript、Fastify 後端，按 `modules/<domain>/` 集中 route、schema、service、repository、mapper 與測試。
- 由 Supabase Auth 簽發 access JWT，後端以 Supabase JWKS 驗證簽章、issuer、audience、expiry、role 與 subject。
- 以 migration 建立具使用者所有權、資料約束與查詢索引的 `public.orders`。
- 提供 `/api/orders` 與 `/api/orders/:id` 的受保護 CRUD contract，所有讀寫由驗證後的 JWT subject 決定 `user_id`。
- 提供一致 JSON 錯誤、環境驗證、健康檢查、關閉流程、自動化測試與 Supabase 設定文件。

**Non-Goals:**

- 不修改 Vue 頁面、Pinia store、router 或既有前端 JavaScript。
- 不建立登入、註冊、登出、忘記密碼或公開註冊 UI。
- 不自行保存密碼、簽發 JWT 或實作 refresh token；這些由 Supabase Auth 負責。
- 不將 Vue 前端遷移至 TypeScript。
- 不在本次執行既有 localStorage 訂單資料匯入。
- 不加入管理員、團隊、共享訂單、Realtime、Storage 或 service-role 操作。

## Decisions

### TypeScript Fastify backend and feature modules

後端置於 `server/`，使用獨立 `server/package.json`、`tsconfig.json` 與 Vitest 設定。入口層僅組裝設定、plugins 與 modules；訂單相關 route、Zod schema、service、repository、mapper 與測試全部置於 `server/src/modules/orders/`。跨領域的 JWT、database、error handler 放在 `server/src/plugins/`，純共用型別或錯誤放在 `server/src/shared/`。

替代方案是依技術層建立全域 routes/controllers/services/repositories，但會使單一功能散落多個目錄，因此拒絕。另一替代方案是把後端直接放入 Vue `src/`，但會混淆瀏覽器與伺服器 runtime，也拒絕。

### Supabase Auth as JWT issuer

後端不提供帳密登入端點，也不持有 JWT 私鑰。受保護請求須帶 `Authorization: Bearer <token>`；auth plugin 透過 `jose` 與 `${SUPABASE_URL}/auth/v1/.well-known/jwks.json` 驗證非對稱簽章，並檢查 issuer `${SUPABASE_URL}/auth/v1`、audience `authenticated`、未過期、`role=authenticated`、`sub` 為 UUID。驗證成功後只把不可由 client 覆寫的 `userId` 放入 Fastify request context。

替代方案是自行簽發 JWT，但會重複 Supabase Auth 的 session、refresh、撤銷與金鑰輪替責任；替代方案 `decode` 而不驗證簽章會允許偽造身分，兩者均拒絕。

### PostgreSQL access through backend

`server` 以 `pg` connection pool 使用 `SUPABASE_DB_URL` 連線；瀏覽器不取得資料庫密碼，後端也不使用 Supabase service-role key。repository 每個 SQL statement 都明確包含已驗證 `user_id` 條件；新增時 `user_id` 永遠取自 request context，不接受 body 欄位。

即使後端連線角色可能繞過 RLS，應用層仍必須實作所有權條件。migration 同時啟用 RLS 並建立 authenticated role policies，作為未來 Data API 使用時的縱深防禦；目前 API 正確性不依賴從後端連線自動傳遞使用者 JWT 至 PostgreSQL。

### Order data model and mapping

`public.orders` 使用 UUID 主鍵與 `user_id uuid references auth.users(id) on delete cascade`。必要欄位為 `name`、正數 `amount`、合法 `category`、`status`、`currency` 及至少一個合法 `product_categories`；布林值與時間戳有安全預設。可選文字使用空字串或 null 的 API contract 會由 mapper 正規化為資料庫 nullable text；日期使用 ISO `YYYY-MM-DD`，金額由 API 表示為 number、資料庫使用 `numeric(14,2)`。

資料庫採 snake_case，HTTP JSON 採既有前端相容的 camelCase。mapper 是唯一轉換邊界。`id`、`userId`、`createdAt`、`updatedAt` 不可由 create body 指定；update 採 partial fields，但合併後仍須符合完整訂單約束。

### API response and error contract

公開端點 `GET /health` 回傳 `{ "status": "ok" }`。受保護端點：

- `GET /api/orders` 回傳目前使用者全部訂單 `{ data: Order[], meta: { count: number } }`。
- `GET /api/orders/:id` 回傳 `{ data: Order }`。
- `POST /api/orders` 成功回傳 201 與 `{ data: Order }`。
- `PATCH /api/orders/:id` 成功回傳 `{ data: Order }`。
- `DELETE /api/orders/:id` 成功回傳 204 且無 body。

錯誤統一為 `{ "error": { "code": string, "message": string, "details"?: unknown } }`。缺少、格式錯誤、過期或驗證失敗 JWT 均回 401 `AUTH_UNAUTHORIZED`；body、query 或 path 驗證失敗回 400 `VALIDATION_ERROR`；不存在或屬於其他使用者的訂單一律回 404 `ORDER_NOT_FOUND`，避免揭露資源存在；未預期錯誤回 500 `INTERNAL_ERROR` 且不得暴露 SQL、stack 或 secret。

### Test isolation strategy

依 TDD 先建立失敗測試。auth plugin 測試使用測試用非對稱 key/JWKS，涵蓋有效、缺失、過期、錯 issuer、錯 audience、錯 role、非 UUID subject 與錯簽章。orders route 以 Fastify inject 搭配 repository test double 驗證 HTTP contract 與 userId 傳遞；repository 測試驗證 SQL 參數化與所有權條件；migration 由靜態契約測試確認表、constraint、index、RLS 與 policies，並在可用的本機 Supabase stack 執行 reset 驗證。

測試不得連正式 Supabase 專案，不得把真實 token、資料庫 URL 或密鑰寫入版本控制。

## Implementation Contract

### Runtime and configuration

- `npm` 在 repository root 維持既有 Vue scripts；後端指令以 `npm --prefix server run dev|build|start|test|typecheck` 執行。
- 後端啟動時 MUST 驗證 `SUPABASE_URL`、`SUPABASE_DB_URL`、`CORS_ORIGIN` 與可選 `PORT`；必要設定缺失或 URL 無效時 MUST 以非零狀態失敗，錯誤不得包含完整資料庫密碼。
- `.env` 與 `.env.*` secrets MUST 被忽略；`server/.env.example` 僅列變數名稱與安全範例。
- SIGINT/SIGTERM MUST 關閉 Fastify 與 PostgreSQL pool。

### Authentication behavior

- `/health` MUST 可在無 JWT 時使用；所有 `/api/orders` routes MUST 在 handler 前完成 JWT 驗證。
- Authentication context MUST only originate from a cryptographically verified token. Request body、query、path 或自訂 header 中的 `userId` MUST NOT 影響授權身分。
- JWT failure MUST return the common 401 shape and MUST NOT reveal whether signature、claim 或 key lookup failed.

### Order JSON shape

Order response MUST contain `id`, `category`, `name`, `platform`, `productUrl`, `status`, `amount`, `currency`, `isPaid`, `balanceDue`, `orderDate`, `paymentDueDate`, `estimatedShipDate`, `estimatedArrivalDate`, `isPreorder`, `productCategories`, `trackingNumber`, `shippingMethod`, `notes`, `createdAt`, and `updatedAt`; `userId` MUST NOT be returned to the browser. Dates MUST be `YYYY-MM-DD` or null and timestamps MUST be ISO 8601 strings.

Create input MUST require `category`, `name`, `amount`, and non-empty `productCategories`; omitted status/currency/boolean/text fields receive documented defaults. Patch input MUST contain at least one editable field and MUST reject immutable fields `id`, `userId`, `createdAt`, `updatedAt`. Unknown fields MUST be rejected.

### Ownership and persistence

- Every select/update/delete repository operation MUST include both resource ID when applicable and verified `user_id`; list MUST filter by verified `user_id`.
- Cross-user access MUST be indistinguishable from a missing order through 404.
- SQL values MUST use parameters; dynamic client-provided identifiers or SQL fragments MUST NOT be interpolated.
- Migration MUST be repeatable through the Supabase migration workflow and MUST create table constraints, `user_id` index, common list indexes, `updated_at` maintenance, RLS enablement and four owner policies.

### Acceptance criteria

- `npm --prefix server test` passes auth, route, service, repository, mapper, config and migration contract tests.
- `npm --prefix server run typecheck` and `npm --prefix server run build` complete without errors.
- Existing root `npm test` and `npm run build` remain passing without frontend behavior changes.
- A documented manual check demonstrates: no token returns 401; valid owner token can create/read/update/delete; a different user token receives 404 for that order.

### Scope boundaries

In scope: backend scaffolding, database migration, JWT verification, orders CRUD, automated tests, environment examples and operator setup documentation. Out of scope: frontend login/API integration, frontend TypeScript, public registration, localStorage migration, custom JWT issuance, refresh-token storage, admin APIs and production deployment automation.

## Risks / Trade-offs

- [Supabase signing-key rotation or JWKS outage] → 使用標準 JWKS cache 與 `kid` 選擇，不將舊金鑰硬編碼；驗證不可用時採 fail closed。
- [Backend database role can bypass RLS] → 所有 repository 查詢強制 `user_id`，測試跨使用者不可見；migration 仍配置 RLS 作縱深防禦。
- [numeric 轉為 JavaScript number 的精度] → 限制 `numeric(14,2)` 與可接受金額範圍，mapper 明確轉換並測試小數。
- [Schema 與既有前端欄位漂移] → HTTP 維持 camelCase 與現有 order shape，snake_case 僅存在 repository 邊界。
- [沒有本機 Docker/Supabase CLI] → migration contract tests 仍可執行；文件提供正式套用前的本機 reset 與遠端 linked migration 步驟。

## Migration Plan

1. 建立並測試 migration，不連正式資料。
2. 由 Supabase CLI link 至目標專案並套用 migration。
3. 在 Supabase Dashboard 關閉公開註冊並建立個人帳號。
4. 設定後端環境變數，以健康檢查確認 runtime。
5. 使用兩個測試使用者 token 完成 owner/cross-owner 手動驗證後再提供前端串接。
6. 回滾時先停止後端；若尚無正式資料可用反向 migration 移除 orders，若已有資料則先備份並以向前 migration 修正，禁止直接破壞正式資料。

## Open Questions

(none)
