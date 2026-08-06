## Why

訂單 API 已保存物流方式、追蹤號碼與完整日期等資料，但前端無法輸入物流欄位，也缺少集中查看完整內容的介面。現有尚欠金額與付款期限超出目前只需追蹤已付款／未付款的需求，應移除以縮小資料契約並避免產生未使用欄位。

## What Changes

- 新增唯讀訂單詳情 Modal，集中呈現基本資料、訂單資料、物流資料、日期與系統時間。
- 在訂單卡片新增獨立「查看詳情」操作，並允許從詳情直接進入既有編輯表單。
- 在新增／編輯訂單表單加入自由文字的物流方式與追蹤號碼欄位。
- 提供追蹤號碼一鍵複製，以及安全開啟 HTTP／HTTPS 商品網址的操作與成功／失敗回饋。
- 強化前端商品網址驗證，使非法或非 HTTP／HTTPS 網址在送出前顯示欄位錯誤。
- **BREAKING**：以新的 forward migration 移除 orders.balance_due 與 orders.payment_due_date，並同步從後端驗證、mapper 與公開 API shape 移除 balanceDue 與 paymentDueDate。
- 維持付款模型只有訂單金額、幣別與已付款／未付款，不加入部分付款或付款期限。

## Capabilities

### New Capabilities

- `order-details`: 訂單完整詳情檢視、詳情至編輯轉換、追蹤號碼複製與安全商品連結操作。

### Modified Capabilities

- `preorder-orders`: 新增與編輯表單支援物流方式及追蹤號碼，訂單卡片提供獨立查看詳情操作。
- `order-persistence-api`: 移除尚欠金額與付款期限欄位，同時維持物流欄位的建立、更新與穩定回傳契約。
- `order-validation`: 前端共享驗證新增 HTTP／HTTPS 商品網址規則，並維持與後端拒絕非法網址的行為一致。

## Impact

- Affected specs: order-details, preorder-orders, order-persistence-api, order-validation
- Affected code:
  - New:
    - src/components/orders/OrderDetailsModal.vue
    - src/components/orders/__tests__/OrderDetailsModal.spec.js
    - supabase/migrations/20260806000100_remove_order_payment_detail_fields.sql
  - Modified:
    - src/components/orders/OrderFormModal.vue
    - src/components/orders/OrderCard.vue
    - src/components/orders/__tests__/OrderFormModal.spec.js
    - src/components/orders/__tests__/OrderCard.spec.js
    - src/views/__tests__/AllOrders.spec.js
    - src/domain/orderValidation.js
    - src/domain/__tests__/orderValidation.spec.js
    - src/views/AllOrders.vue
    - src/views/OrderList.vue
    - src/views/__tests__/OrderList.spec.js
    - server/src/modules/orders/orders.schema.ts
    - server/src/modules/orders/orders.mapper.ts
    - server/src/modules/orders/orders.mapper.test.ts
    - server/src/modules/orders/orders.repository.test.ts
    - server/src/app.test.ts
    - server/src/migration.test.ts
    - scripts/verify-supabase-deployment.mjs
    - scripts/__tests__/verify-supabase-deployment.spec.js
  - Removed: none
- API compatibility: create、patch 與 response 不再接受或回傳 balanceDue、paymentDueDate；其他訂單端點與身份隔離規則不變。
- Database: 部署新的不可逆資料移除 migration 前必須確認備份與目標 project，且不得修改既有 migration 歷史。
