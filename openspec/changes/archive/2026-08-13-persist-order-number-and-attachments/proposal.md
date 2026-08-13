## Why

訂單表單目前已提供訂單號碼與附件介面，但兩者只存在於元件暫存狀態，關閉後即消失；商品分類仍被強制要求，金額的原生 number control 也會顯示不符合期望的上下調整鈕。需要補齊持久化、私有附件生命週期與一致的前後端驗證，讓畫面上的能力成為可靠的正式功能。

## What Changes

- 將訂單號碼納入 orders 資料表、建立／更新 schema、mapper、API payload、store 與新增／編輯表單回填。
- 建立 private Supabase Storage bucket 與 `order_attachments` metadata table；附件只能由訂單擁有者列出、上傳、下載及刪除。
- 新增附件 list、upload、download、delete API；僅允許 PDF、JPEG、PNG，單檔最多 10 MB，每張訂單最多 10 個附件。
- 新增訂單時先建立訂單再上傳附件；部分檔案失敗不回滾訂單，前端須標示各失敗檔案並允許重試。
- 將商品分類改為選填，未選擇時以空陣列儲存；仍拒絕不支援的分類值。
- 將金額 control 改為無原生 spinner 的 decimal 文字輸入，阻止負號輸入；空白、非數字、零與負數仍由共用驗證、API 及資料庫拒絕。

## Capabilities

### New Capabilities

- `order-attachments`: 私有訂單附件的儲存、metadata、擁有權、限制、下載及刪除生命週期。

### Modified Capabilities

- `preorder-orders`: 訂單號碼與附件由純前端暫存改為正式持久化，商品分類改為選填，金額輸入不顯示 spinner 且阻止負數。
- `order-validation`: 商品分類允許空陣列，金額仍必須為大於零的有限數字。
- `order-persistence-api`: orders schema 與 API 正式保存訂單號碼、允許空商品分類，並提供附件資源端點。
- `order-api-sync`: 前端 store/API 同步訂單號碼、附件 metadata 與部分上傳失敗結果。

## Impact

- Affected specs: `order-attachments`, `preorder-orders`, `order-validation`, `order-persistence-api`, `order-api-sync`
- Affected code:
  - New: `backend/src/modules/order-attachments/order-attachments.schema.ts`, `backend/src/modules/order-attachments/order-attachments.repository.ts`, `backend/src/modules/order-attachments/order-attachments.service.ts`, `backend/src/modules/order-attachments/order-attachments.routes.ts`, `supabase/migrations/20260813000000_persist_order_number_and_attachments.sql`, `backend/tests/order-attachments/order-attachments.routes.test.ts`, `backend/tests/order-attachments/order-attachments.repository.test.ts`
  - Modified: `backend/src/app.ts`, `backend/src/config.ts`, `backend/src/modules/orders/orders.schema.ts`, `backend/src/modules/orders/orders.mapper.ts`, `backend/tests/orders/orders.mapper.test.ts`, `backend/tests/orders/orders.repository.test.ts`, `backend/tests/migrations/migration.test.ts`, `src/components/orders/OrderFormModal.vue`, `src/components/orders/OrderDetailsModal.vue`, `src/domain/orderValidation.js`, `src/services/ordersApi.js`, `src/stores/orders.js`, `tests/components/orders/OrderFormModal.spec.js`, `tests/components/orders/OrderDetailsModal.spec.js`, `tests/domain/orderValidation.spec.js`, `tests/services/ordersApi.spec.js`, `tests/stores/orders.spec.js`
  - Removed: none
- Data and infrastructure: new `orders.order_number` column, new `order_attachments` table, private Storage bucket and ownership policies.
- Dependencies: backend multipart parsing and Supabase Storage access will require a supported Fastify multipart package and server-side Supabase client configuration.
