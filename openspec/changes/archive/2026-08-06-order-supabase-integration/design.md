## Context

目前 `supabase/migrations/20260730000000_create_orders.sql` 已定義 owner-scoped orders schema，`server/` 已提供驗證 Supabase JWT 的 Fastify CRUD API；但 `src/stores/orders.js` 仍同步寫入 localStorage，前端沒有身分驗證、HTTP client、載入或錯誤狀態。此變更跨越 Vue、Pinia、Supabase Auth、Fastify 部署設定與遠端 migration，因此需要明確界定資料所有權、非同步狀態與部署驗證。

## Goals / Non-Goals

**Goals:**

- 使用 Supabase Email/Password Auth 建立可恢復的前端 session，並保護訂單路由。
- 讓後端回應成為訂單的唯一確認來源，同時保留既有 selector 與表單驗證。
- 安全部署現有 migration，並以兩個測試使用者驗證 CRUD 與 owner isolation。
- 為登入、API client、store 與主要畫面提供自動測試及可重複的 smoke verification。

**Non-Goals:**

- 不新增公開註冊、忘記密碼、OAuth、多因素驗證或角色管理。
- 不讓瀏覽器直接存取 `public.orders`，也不把 service-role key 或資料庫連線字串放進前端。
- 不自動搬移既有 localStorage 訂單至 Supabase；舊資料在首次遠端載入後不再使用。
- 不重新設計既有訂單 schema、搜尋／排序規則或視覺系統。
- 不在未確認 Supabase project reference、部署環境與憑證的情況下操作遠端環境。

## Decisions

### Supabase client 專責前端 session

新增單一 Supabase browser client，由 auth store 負責 `signInWithPassword`、`getSession`、auth state subscription 與 `signOut`。router 在 session 初始化完成後決定進入登入頁或受保護頁，避免 reload 時短暫顯示受保護內容。選擇官方 client 而非自行呼叫 Auth REST API，因為它已處理 session 儲存與 token refresh；不把訂單查詢交給該 client，確保所有訂單規則仍經過 Fastify service。

### 訂單 API client 即時讀取 token

`ordersApi` 的每個 operation 都在送出前向 auth session provider 取得目前 access token，並透過可設定的 API base URL 呼叫既有 `/api/orders`。它驗證成功 payload 的必要結構，將後端 error envelope、HTTP 非成功狀態及網路例外正規化為 `{ code, message, status }`。不快取 token，避免 refresh 後沿用過期值；不在錯誤或 console 中包含 token。

### Pinia 採伺服器確認後更新

orders store 移除 persisted-state 設定，新增 `isLoading`、`isMutating`、`error`、`initialized` 與 `loadOrders/retry`。建立、更新與刪除使用 pessimistic update：後端成功後才變更 `orders`，失敗時保留最後確認狀態。此方式比 optimistic rollback 簡單，並可避免 UUID、server defaults 或驗證結果與本地狀態分歧。既有 computed selectors 直接作用於遠端快取，不為篩選或排序增加 API calls。

### 401 統一結束受保護流程

API client 將 401 正規化，store 清空使用者資料並通知 auth store 執行本地 session 清理／重新導向登入；400、404 與 500 則保留 confirmed data 並顯示安全訊息。logout 同樣先阻止新請求、清空 orders，再結束 Supabase session。這避免上一位使用者資料在換帳號時殘留。

### 部署使用 migration push 與可清理 smoke verifier

操作員先明確 link project，再檢查 migration list 並 push；禁止對遠端執行 reset。Node smoke verifier 從環境取得 API URL 及兩位專用測試使用者的 token 或登入憑證，依序檢查 health、A 的 CRUD 與 B 對 A 資源收到 404，並在 `finally` 以 A 身分嘗試刪除測試 order。腳本遮蔽 token 與秘密，失敗時使用非零 exit code。選擇端對端 HTTP 驗證，而非只查 schema，因為部署成功還依賴 CORS、JWT issuer、DB connection 與 owner filtering 一致運作。

## Implementation Contract

**Behavior:** 未登入使用者只能看到登入頁；有效 session 恢復後載入本人訂單。列表在初始 request 完成前顯示 loading 而非 empty；新增、編輯、刪除期間停用對應重複操作，成功後採用 API 回傳狀態，失敗則保留上次確認資料並顯示訊息。logout 或任何 orders 401 都清空 orders 並返回登入頁。

**Interfaces and data:** 前端環境提供 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`、`VITE_API_BASE_URL`。orders API client 實作 `listOrders()`、`createOrder(input)`、`updateOrder(id, patch)`、`deleteOrder(id)`；前三者回傳 API `data`，delete 僅在 204 resolve。正規化錯誤包含穩定的 `code`、安全的 `message` 及 HTTP `status`（網路失敗時 status 為 null）。orders store 的 mutation actions 回傳成功資料或拋出正規化錯誤，不以 `null` 表示遠端失敗。

**Failure modes:** 缺少前端必要環境值時啟動即顯示明確設定錯誤而不發送 request。401 觸發重新登入；其他 HTTP、payload 或 network failures 顯示 user-safe message，confirmed orders 不變。smoke verifier 缺少目標或測試身分設定時在任何寫入前失敗；建立測試資料後的所有退出路徑都嘗試清理。

**Acceptance criteria:** 根目錄 `npm test` 與 `npm run build`、server 的 test/typecheck/build 全數通過；新增 client/store/view tests 覆蓋 specs 的成功、失敗、重複提交與 401 狀態。對已確認的 Supabase project 執行 migration status/push 後，部署 verifier 必須通過兩使用者隔離檢查，且再次檢查顯示無待部署 migration。

**Scope boundaries:** 範圍內包含 Email/Password 登入、session route guard、orders API client、Pinia 遠端同步、訂單畫面狀態、環境文件及 deployment smoke verification。範圍外包含註冊／密碼復原、直接 Supabase Data API、舊 localStorage 資料搬移、schema 欄位變更、正式環境代管平台選型與非訂單功能。

## Risks / Trade-offs

- [既有 localStorage 訂單不會自動出現在遠端] → README 與畫面 release note 明示切換，實作前由產品擁有者自行匯出重要測試資料。
- [token refresh 與 request 同時發生可能收到 401] → 每次 request 讀取最新 session；401 fail closed 並要求重新登入，不自行無限重試 mutation。
- [mutation 採伺服器確認後更新使 UI 感覺較慢] → 顯示進度並鎖定重複操作，優先確保資料一致性。
- [遠端 migration 或 smoke test 指錯專案] → push 前顯示並人工核對 project reference；腳本要求明確 API URL 與專用帳號，且不提供 reset 功能。
- [測試清理因 API 中斷而失敗] → verifier 輸出不含秘密的殘留 order UUID，供 owner 恢復後手動刪除。

## Migration Plan

1. 在本機執行既有 Supabase migration reset 與 server/frontend test suites，確認基線。
2. 完成 auth、API client、store 與 UI 串接，於非正式 Supabase project 執行完整整合測試。
3. 操作員核對目標 project reference、migration list、備份政策及前後端環境值，再執行 migration push；不得執行 remote reset。
4. 部署 Fastify API 與 Vue 前端，設定精確 CORS origin，執行兩使用者 smoke verifier。
5. 再次確認沒有 pending migration、測試訂單已清除，才宣告部署完成。
6. 若應用部署失敗，回退前後端版本；若 schema 需修正，以經 review 的新 forward migration 處理，不刪除 migration history 或 reset 遠端資料。

## Open Questions

無；實際 Supabase project reference、部署 URL 與秘密值在 apply 階段由操作員以環境設定提供，不寫入 artifacts 或版本控制。
