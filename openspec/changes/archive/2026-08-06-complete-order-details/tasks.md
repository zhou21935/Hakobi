## 1. 資料庫與後端契約

- [x] 1.1 依「使用 forward migration 移除付款細節欄位」決策新增 supabase/migrations/20260806000100_remove_order_payment_detail_fields.sql，使 Payment persistence is binary：只移除 balance_due、payment_due_date 並保留 amount、currency、is_paid；以 server/src/migration.test.ts 驗證 DROP COLUMN 目標、既有 migration 未修改及付款欄位保留。
- [x] 1.2 從 createOrderSchema、patchOrderSchema、toOrder 與 toColumns 移除 balanceDue、paymentDueDate，使舊欄位輸入收到 VALIDATION_ERROR 且 response 不再輸出舊欄位；以 server/src/modules/orders/orders.mapper.test.ts 與 schema/API injection 測試驗證 request rejection 和 response shape。
- [x] 1.3 依「物流欄位使用選填自由文字」實現 Logistics fields persist through the stable order API，確保 shippingMethod、trackingNumber 在 create、patch、清空與 read round-trip 保持原字串或空字串；以 mapper、repository 與 app route 測試驗證 snake_case/camelCase 映射及 owner isolation 不變。

## 2. 共享驗證與訂單表單

- [x] 2.1 依「商品網址在共享 validator 與呈現層雙重防護」在 src/domain/orderValidation.js 實現 Product URLs use shared safe web validation：空字串合法，非空值只接受 absolute HTTP/HTTPS，其他輸入產生 productUrl 欄位錯誤；以 src/domain/__tests__/orderValidation.spec.js 及 store 測試驗證非法 URL 不會呼叫 API mutation。
- [x] 2.2 在 OrderFormModal 實現 Order forms capture optional logistics information，新增選填自由文字 shippingMethod、trackingNumber，支援新增送出、編輯回填與清空，並顯示共享 productUrl 錯誤；以 OrderFormModal.spec.js 驗證 create/edit payload、空字串、2000 字元邊界、pending 防重送與非法 URL 阻擋。

## 3. 唯讀訂單詳情

- [x] 3.1 建立 OrderDetailsModal，使 Users can inspect complete order details：按基本、訂單、物流、日期、系統資訊分區顯示完整 order，空字串或 null 顯示「尚未填寫」，金額、日期與長文字可讀；以 OrderDetailsModal.spec.js 驗證完整值與空值案例。
- [x] 3.2 依「追蹤號碼複製採元件內短暫回饋」實現 Tracking numbers can be copied with visible feedback：成功複製精確字串並短暫顯示「已複製 ✓」，Clipboard API 缺失或拒絕時保留號碼並顯示失敗訊息，空值不渲染按鈕；以 fake timers 與 Clipboard mock 測試三條路徑。
- [x] 3.3 實現 Product links open only through safe web protocols：只有再次驗證為 HTTP/HTTPS 的 productUrl 才顯示新分頁操作，並具 noopener、noreferrer；以 OrderDetailsModal.spec.js 驗證 HTTPS、HTTP、空值、javascript 與 malformed URL。
- [x] 3.4 實現 Order details remain usable on narrow viewports：375px 寬度下詳情內容可換行、不造成水平頁面溢位，關閉、編輯、複製與商品連結都有可辨識名稱及可操作目標；以元件 class/attribute assertions 與窄 viewport 渲染測試驗證。

## 4. 卡片與 View 狀態整合

- [x] 4.1 在 OrderCard 實現 Order cards expose a separate details action，使查看詳情、編輯、刪除為三個獨立且具 aria-label 的操作，卡片其他區域不發出 details；以 OrderCard.spec.js 驗證各事件只在對應按鈕觸發。
- [x] 4.2 依「詳情使用現有 collection 中的完整 order」在 AllOrders 與 OrderList 以 selected order ID 從 store 派生目前資料，開啟詳情時不發出 GET /api/orders/:id；以 view 測試驗證正確訂單、零額外 API 請求及 mutation 後不保留舊物件快照。
- [x] 4.3 依「詳情 Modal 與編輯 Modal 保持單一作用」實現 Order details use an explicit card action and support editing：詳情的關閉只關閉 Modal，編輯先關閉詳情再開啟既有表單並帶入同一筆資料，成功更新後再次開啟顯示後端確認值；以 AllOrders 與 OrderList interaction 測試驗證完整轉換。

## 5. 契約驗證與部署安全

- [x] 5.1 對照 design 的 Observable behavior、Interface and data shape、Failure modes、Acceptance criteria 與 Scope boundaries 完成回歸覆蓋，確認既有登入、owner isolation、搜尋、排序、篩選、CRUD 與 RWD 未改變，且未加入物流 API、付款歷史、通知、Dashboard、篩選或新 route；以根目錄 npm test、npm run build 及 server 目錄 npm test、npm run typecheck、npm run build 全部成功為驗證。
- [x] 5.2 擴充 scripts/verify-supabase-deployment.mjs 的 owner CRUD payload 與 assertions，使 shippingMethod、trackingNumber 的 create/update/read round-trip 可驗證且 cleanup 仍執行；先以腳本單元測試驗證不輸出秘密，再在明確 project ref、migration plan 與備份確認後執行 migration dry-run、部署、migration list 及雙使用者 smoke verification。
