## Context

目前 `/` 由 `Dashboard.vue` 呈現統計卡，`/orders` 由 `AllOrders.vue` 提供完整訂單管理，側欄同時顯示兩個入口。登入、Email 驗證與密碼重設流程也將 `/orders` 當作預設成功目的地。這些行為需要一起調整，才能讓首頁成為唯一的跨分類訂單總覽而不留下重複入口或失效導向。

## Goals / Non-Goals

**Goals:**

- 讓 `/` 成為標題為「訂單總覽」的完整跨分類訂單管理頁。
- 讓 `/orders` 相容性導向 `/`。
- 統一側欄與帳號流程的首頁目的地。
- 移除不再使用的 Dashboard 元件並更新受影響的路由測試。
- 讓兩個分類訂單頁只顯示分類主標題，不再顯示重複的說明副標題。

**Non-Goals:**

- 不新增統計圖表、彙總金額或新的訂單欄位。
- 不改變分類訂單頁的訂單功能與其餘版面，也不改變訂單 API、Store 或資料庫。
- 不重新設計已確認的訂單列表響應式版面。

## Decisions

### 首頁沿用 AllOrders 行為

將既有 `AllOrders.vue` 作為首頁路由元件並改標題為「訂單總覽」，而不是把相同行為複製到 `Dashboard.vue`。這能保留已測試的搜尋、排序、篩選與 CRUD 整合，並避免兩個元件長期漂移。替代方案是把 AllOrders 內容搬進 Dashboard，但只會造成無價值的重新命名與較大 diff。

### 舊 orders 路由使用 redirect

保留 `/orders` 路由紀錄但設定為重新導向 `/`，而不是直接刪除。這能維持既有書籤、瀏覽紀錄與外部連結相容性，同時讓網址收斂到單一 canonical home path。

### 所有預設成功導向統一為首頁

登入無 redirect、無效 redirect、Email 驗證完成、密碼重設完成，以及已登入會員造訪 guest-only 頁面時，一律導向 `/`。合法且安全的原始 protected redirect（例如 `/orders/parcel`）仍須保留。

### 側欄只保留單一總覽入口

移除「全部訂單」項目，讓「總覽」成為唯一跨分類入口；分類與會員區塊不變。這避免兩個導覽項目落到相同內容，並保持現有資訊架構。

### 分類頁只保留主標題

移除 `OrderList` 依分類產生的「管理海外代購分類的訂單」與「管理集運包裹分類的訂單」說明文字，只保留現有分類名稱主標題。兩頁共用同一個元件，因此採用移除共用副標題的方式，避免為分類建立不必要的條件分支；搜尋、排序、狀態篩選及訂單操作皆維持原狀。

## Implementation Contract

- Behavior：已登入會員開啟 `/` 時看到「訂單總覽」與完整全部訂單功能；開啟 `/orders` 時抵達 `/`；側欄沒有「全部訂單」。
- Route contract：`/` 為受保護的 canonical home route；`/orders` 僅作 redirect；`/orders/:category` 維持原行為。
- Account navigation：沒有合法 redirect 時，登入、驗證、重設與 guest-only guard 的成功目的地為 `/`；合法 protected redirect 不被覆蓋。
- Failure modes：訂單載入、建立、更新與刪除錯誤仍使用既有 AllOrders 狀態，不新增或吞掉錯誤。
- Category heading：`/orders/agent` 與 `/orders/parcel` 保留分類名稱主標題，但不顯示「管理…分類的訂單」說明副標題。
- Acceptance：路由、側欄、登入／驗證／重設與 AllOrders 測試涵蓋上述行為；完整前端測試及 production build 通過。
- In scope：前端路由、頁面標題、側欄、帳號成功導向、相關元件與測試清理。
- Out of scope：後端 API、資料模型、統計功能擴充，以及分類頁標題以外的改版。

## Risks / Trade-offs

- [舊測試與程式仍依賴 AllOrders route name] → 將 canonical route name 統一並更新所有明確引用，另外測試 `/orders` redirect。
- [刪除 Dashboard 可能遺留 lazy import 或 route stub] → 以全域搜尋確認沒有 `Dashboard.vue` 或 Dashboard route component 引用。
- [帳號流程漏改一處仍回到舊網址] → 對登入、驗證、重設與 auth guard 分別建立目的地斷言。
