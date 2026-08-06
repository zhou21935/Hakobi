## 1. 身分驗證與前端基礎設定

- [x] 1.1 實作「Supabase client 專責前端 session」與「Users authenticate with Supabase email credentials」：在 `src/lib/supabase.js`、`src/stores/auth.js`、`src/views/Login.vue` 加入 Email/Password 登入及安全錯誤呈現；以 `src/stores/__tests__/auth.spec.js`、`src/views/__tests__/Login.spec.js` 驗證成功與失敗流程。
- [x] 1.2 完成「Authentication state survives reloads」：讓 `src/main.js`、`src/router/index.js`、`src/App.vue` 等待 session 初始化並保護訂單 routes，驗證 reload 有 session 時不重登、無 session 時導向 login 的 router/store tests。
- [x] 1.3 完成「Users can end their session」與「401 統一結束受保護流程」：logout 或 orders 401 都清除 orders、結束受保護流程並回到 login；以 auth/orders store tests 驗證切換使用者時不殘留前一使用者資料。

## 2. 訂單 API 與狀態同步

- [x] 2.1 實作「訂單 API client 即時讀取 token」與「API calls use the current access token」：新增 `src/services/ordersApi.js` 的 `listOrders/createOrder/updateOrder/deleteOrder`，每次 request 取得最新 session 並送出單一 Bearer header；以 `src/services/__tests__/ordersApi.spec.js` 驗證 refreshed token、HTTP methods、paths 與 payload。
- [x] 2.2 完成「API errors use one frontend contract」：將 backend envelope、無效成功 payload、network error 與 401 正規化為 `{ code, message, status }` 且不洩漏 token；以 orders API tests 逐一驗證 400、401、500、malformed JSON 與 fetch rejection。
- [x] 2.3 實作「Pinia 採伺服器確認後更新」及「The order store loads the authenticated user's remote orders」：移除 persisted-state，加入 `loadOrders/retry`、`isLoading/error/initialized`，成功時以遠端 `data` 取代 collection；以 `src/stores/__tests__/orders.spec.js` 驗證 loading、成功、失敗與 retry。
- [x] 2.4 完成「Order mutations are confirmed by the backend」：create/update/delete 僅在 201/200/204 後更新 collection，active mutation 禁止重複送出，失敗保留 confirmed data；以 orders store tests 驗證 UUID 回應、validation rejection、404/500 與重複呼叫。
- [x] 2.5 保持「Existing order projections remain client-side」：讓分類、狀態、搜尋、排序、counts 與 stats 對遠端 collection 維持既有輸出且不額外發 request；執行既有及新增 selector tests 驗證結果。

## 3. 訂單畫面整合

- [x] 3.1 實作「Order views expose asynchronous operation state」：在 `src/views/OrderList.vue`、`src/views/AllOrders.vue` 呈現 loading、empty、error、retry 與 mutation disabled 狀態，成功後才關閉表單／確認框；以 view tests 驗證 initial load 不誤顯 empty、失敗可重試、pending 無重複提交。
- [x] 3.2 完成前端整合回歸：確認既有新增、編輯、刪除、category/status filter、search、sort 與 route sync 在 API-backed store 下維持行為；以根目錄 `npm test` 與 `npm run build` 全數通過為驗證。

## 4. Supabase 部署與驗證

- [x] 4.1 落實「Runtime configuration separates public and secret values」：加入前端 env 範例與啟動驗證，更新 `server/.env.example`，確保 browser bundle 僅接收 Supabase URL、anonymous publishable key、API base URL；以缺值測試、`npm run build` 及 bundle 字串檢查驗證無 DB URL、密碼或 privileged key。
- [x] 4.2 實作「部署使用 migration push 與可清理 smoke verifier」及「Deployment verification proves availability and owner isolation」：新增 `scripts/verify-supabase-deployment.mjs`，檢查 health、user A CRUD、user B 404 並在 `finally` 清理；以 mock integration tests 與非正式環境實跑的非零／零 exit code 驗證失敗與成功路徑皆不輸出 token。
- [x] 4.3 完成「The target Supabase database receives repository migrations」與「Deployment instructions include rollback boundaries」：更新 `docs/supabase-setup.md`、`README.md`，要求核對 project ref、migration list、backup 與禁止 remote reset，並記錄 forward-migration rollback；在核准目標執行 status/push 後驗證 orders schema/RLS 存在且第二次 status 無 pending migration。
- [x] 4.4 執行完整交付驗證：依 Migration Plan 在目標環境完成 server `test`、`typecheck`、`build`、frontend `test`、`build` 與兩使用者 smoke verifier，確認測試訂單已清理並將非秘密的 project ref、部署 URL 與驗證時間記錄於部署紀錄。
