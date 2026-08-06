## Why

Hakobi 已具備 Supabase orders migration 與受 JWT 保護的 CRUD API，但 Vue 前端仍只把訂單保存在瀏覽器 localStorage，且 repository 尚未連結並驗證可用的 Supabase 環境。必須完成部署、前端身分驗證與 API 串接，才能讓訂單由使用者身分隔離並跨裝置持久保存。

## What Changes

- 建立可重複執行且可驗證的 Supabase migration 部署流程，並記錄目標環境與必要設定的檢查方式。
- 在 Vue 前端加入 Supabase Email/Password 登入、session 恢復與登出流程，所有訂單 API 請求使用目前 session 的 access token。
- 將 Pinia 訂單 store 從 localStorage 持久化改為後端 `/api/orders` CRUD，保留現有驗證、篩選、搜尋、排序與統計行為。
- 在訂單畫面呈現初始載入、寫入中、未授權與 API 失敗狀態；只有後端成功後才確認新增、編輯或刪除結果。
- 補齊單元、整合及部署 smoke tests，涵蓋登入、session、CRUD 同步、錯誤回復與 owner isolation。

## Capabilities

### New Capabilities

- `frontend-authentication`: Vue 前端以 Supabase Auth 建立、恢復及結束使用者 session，並為受保護請求提供 access token。
- `order-api-sync`: 訂單 store 與畫面透過既有後端 CRUD API 載入及異動遠端訂單，並提供可觀察的非同步與錯誤狀態。
- `supabase-environment-deployment`: migration、環境設定及健康／隔離檢查可在指定 Supabase 專案上安全且可重複地完成。

### Modified Capabilities

(none)

## Impact

- Affected specs: frontend-authentication, order-api-sync, supabase-environment-deployment
- Affected code:
  - New: src/lib/supabase.js, src/services/ordersApi.js, src/stores/auth.js, src/views/Login.vue, src/services/__tests__/ordersApi.spec.js, src/stores/__tests__/auth.spec.js, src/views/__tests__/Login.spec.js, scripts/verify-supabase-deployment.mjs
  - Modified: package.json, package-lock.json, src/main.js, src/App.vue, src/router/index.js, src/stores/orders.js, src/stores/__tests__/orders.spec.js, src/views/AllOrders.vue, src/views/OrderList.vue, src/views/__tests__/OrderList.spec.js, server/.env.example, docs/supabase-setup.md, README.md
  - Removed: none
- External systems: Supabase Auth, Supabase PostgreSQL, deployed Fastify API environment
- Dependencies: Supabase JavaScript client
