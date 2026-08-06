## Context

目前 orders 資料列與 API 已包含 shippingMethod、trackingNumber、productUrl、日期、付款布林值及系統時間，但前端表單未送出物流欄位，列表卡片只顯示摘要。資料庫同時保留未被產品需求採用的 balance_due 與 payment_due_date；後端 create、patch 與 mapper 仍公開對應 camelCase 欄位。此 change 橫跨 Vue 元件、共享驗證、Fastify/Zod 契約與 Supabase migration，且欄位移除會永久刪除既有資料。

## Goals / Non-Goals

**Goals:**

- 使用既有 orders CRUD 與 Pinia collection，提供完整且唯讀的訂單詳情。
- 讓新增與編輯表單保存自由文字的物流方式與追蹤號碼。
- 讓追蹤號碼可安全複製，商品網址可安全開啟。
- 將付款模型收斂為 amount、currency、isPaid，移除未使用的兩個付款細節欄位。
- 保持既有身份驗證、owner isolation、搜尋、排序、篩選與 RWD 行為。

**Non-Goals:**

- 不建立付款交易、部分付款、付款期限、逾期判定或付款歷史。
- 不串接物流 API、不辨識物流商、不自動開啟物流查詢網站。
- 不新增獨立詳情 route、單筆資料載入流程或後端 endpoint。
- 不新增 Dashboard 付款統計、未付款篩選、通知或匯率換算。

## Decisions

### 詳情使用現有 collection 中的完整 order

OrderDetailsModal 接收單一 order prop，AllOrders 與 OrderList 各自維護目前選取的 order，並透過 OrderCard 的 details event 開啟。這避免為已載入資料新增 GET 請求、route 與重複 loading/error state。替代方案是獨立詳情頁與 GET /api/orders/:id，但目前不需要可分享 URL 或重新整理單筆頁面，因此不採用。

### 詳情 Modal 與編輯 Modal 保持單一作用

OrderDetailsModal 僅負責顯示與發出 close、edit 事件；OrderFormModal 繼續是唯一的新增／編輯入口。使用者從詳情點擊「編輯訂單」時，父 view 先關閉詳情，再把同一 order 傳給既有表單。這避免在詳情元件內複製表單狀態與 mutation 邏輯。

### 物流欄位使用選填自由文字

shippingMethod 與 trackingNumber 都維持後端既有最長 2000 字元的選填字串契約，空值以空字串保存。自由文字可涵蓋任意物流商，不新增物流商 enum 或外部依賴。表單新增、編輯、清空都必須保留此契約。

### 追蹤號碼複製採元件內短暫回饋

OrderDetailsModal 透過 Clipboard API 複製原始 trackingNumber。成功後按鈕短暫顯示「已複製 ✓」再恢復；失敗時保留可手動選取的文字並顯示「複製失敗，請手動選取」。沒有追蹤號碼時顯示「尚未填寫」且不渲染複製按鈕。此流程不寫入 store，也不觸發 API mutation。

### 商品網址在共享 validator 與呈現層雙重防護

共享 order validator 將空字串視為合法選填值，非空值只接受可解析且 protocol 為 http: 或 https: 的 URL。表單顯示共享 validator 的欄位錯誤；詳情元件只在再次確認安全 protocol 後渲染新分頁連結，並使用 noopener noreferrer。後端既有 URL 驗證仍是最後防線。

### 使用 forward migration 移除付款細節欄位

新增 migration 只執行 ALTER TABLE public.orders DROP COLUMN balance_due 與 DROP COLUMN payment_due_date，不修改 20260730000000_create_orders.sql 或 migration history。後端同步移除 balanceDue、paymentDueDate 的 create defaults、patch 欄位、row mapper 與 response；strict schema 會把仍送出舊欄位的 client 視為 VALIDATION_ERROR。替代方案是保留未使用欄位，但會延續模糊的部分付款語意，因此不採用。

## Implementation Contract

### Observable behavior

- 每張訂單卡片在既有編輯與刪除操作旁顯示獨立查看詳情按鈕；點擊卡片其他區域不開啟詳情。
- 詳情顯示基本、訂單、物流、日期與系統資訊；空白選填值統一顯示「尚未填寫」。
- 詳情的「編輯訂單」關閉詳情並開啟帶入同一筆資料的既有表單；成功更新後 collection、卡片與再次開啟的詳情一致。
- 有 trackingNumber 時可複製原始字串並收到成功或失敗回饋；沒有值時沒有複製按鈕。
- 有安全 productUrl 時可從新分頁開啟；空值或不安全值不產生可點擊連結。

### Interface and data shape

Order 的公開 JSON 保留 category、name、platform、productUrl、status、amount、currency、isPaid、orderDate、estimatedShipDate、estimatedArrivalDate、isPreorder、productCategories、trackingNumber、shippingMethod、notes、createdAt、updatedAt。create 與 patch 接受既有可編輯欄位中的 shippingMethod、trackingNumber；balanceDue 與 paymentDueDate 從 request 與 response 契約移除。

### Failure modes

- 非 HTTP／HTTPS 商品網址由共享 validator 阻止表單送出並顯示商品連結欄位錯誤。
- Clipboard API 拒絕或不可用時，詳情維持追蹤號碼可見並顯示失敗訊息，不拋出未處理錯誤。
- API mutation 失敗時沿用 orders store 現有錯誤契約，保留最後一次後端確認的資料。
- migration 部署前未確認備份、project ref 或 migration plan 時停止遠端部署。

### Acceptance criteria

- OrderFormModal、OrderCard、OrderDetailsModal、orderValidation、mapper、repository 與 migration 測試涵蓋上述成功、空值、非法 URL、Clipboard 失敗與舊欄位拒絕案例。
- 根目錄 npm test 與 npm run build 成功；server 目錄 npm test、npm run typecheck 與 npm run build 成功。
- Supabase migration dry-run 只列出預期的兩個 DROP COLUMN；部署後 migration list 一致。
- 部署 smoke verification 通過 health、owner CRUD 與兩使用者隔離，且建立／更新／讀取的物流欄位一致。

### Scope boundaries

本次只修改訂單詳情呈現、表單物流欄位、安全網址驗證、付款資料契約與對應 migration／測試。任何物流查詢、付款歷史、通知、Dashboard、篩選、匯率或新 route 都不在 apply 範圍。

## Risks / Trade-offs

- [DROP COLUMN 永久刪除既有 balance_due 與 payment_due_date 資料] → 部署前確認可還原備份與目標 project；若需回退應以新 forward migration 重建欄位，但已刪資料只能由備份恢復。
- [舊版 client 仍送出已移除欄位時會收到 400] → 前後端同一部署批次更新，並在 smoke verification 使用新版 client contract。
- [Clipboard API 在權限或非安全 context 下失敗] → 顯示失敗訊息並保留可手動選取的追蹤號碼。
- [詳情讀取 collection 可能在 mutation 後持有舊物件參照] → 父 view 以 selected order ID 從 store collection 派生目前 order，避免保存已被替換的物件快照。
- [2000 字元自由文字可能造成版面溢位] → 詳情允許換行與斷字，卡片不直接完整呈現物流文字。

## Migration Plan

1. 在本機或 dry-run 環境確認新 migration 只移除 public.orders.balance_due 與 public.orders.payment_due_date。
2. 確認 hosted Supabase 的 project ref、migration plan 與可還原備份；若任一項未確認則停止。
3. 同一發布批次先部署相容的新後端與前端，再執行 migration；在切換流量前避免舊 client 寫入舊欄位。
4. 執行 migration list 與第二次 dry-run，確認沒有 pending migration。
5. 執行 health、owner CRUD、物流欄位 round-trip 與 owner isolation smoke verification。
6. 若 schema 必須回退，建立新的 forward migration 重建兩欄與 defaults；歷史資料需從部署前備份恢復，不 reset 遠端資料庫。

## Open Questions

無。討論已確認自由文字物流方式、追蹤號碼一鍵複製、獨立詳情按鈕、詳情至編輯操作，以及移除尚欠金額與付款期限。
