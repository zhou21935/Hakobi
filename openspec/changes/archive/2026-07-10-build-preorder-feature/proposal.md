## Why

`Dashboard.vue` 與 `OrderList.vue` 目前都只是空殼標題,`orders.js` store 雖然已有完整的 CRUD 邏輯,但沒有任何頁面真正串接使用。使用者的核心需求(集中記錄海外購物/預購商品、追蹤每筆訂單的狀態進度)還沒有可用的介面。現在基礎 UI 元件與暖色系視覺風格(`add-ui-components`、`restyle-warm-purple-theme`)都已完成,是把「預購商品」分類做成第一個完整可用功能的時機。

## What Changes

- `orders.js` 的 `STATUSES` 從現有 5 種狀態(待處理/處理中/已出貨/已交付/已取消)**BREAKING** 替換為海外購物流程的 8 階段:待付款 → 已付訂金 → 已付款 → 待出貨 → 集運中 → 運送中 → 已抵台 → 已完成
- `orders.js` 新增欄位:`productUrl`(商品連結)、`orderDate`(下單日期)、`isConsolidated`(是否送往集運倉);將既有 `estimatedArrival` 拆成 `estimatedShipDate`(預計出貨日期)與 `estimatedArrivalDate`(預計到貨日期)兩個欄位;不新增圖片欄位
- 新增 `Select` 基礎 UI 元件(下拉選單),供幣別(TWD/USD/KRW/JPY)與狀態選擇使用
- `Dashboard.vue` 改為真實頁面:顯示預購商品訂單總數,以及「待出貨」「集運中」「已完成」三個重點狀態的數量統計卡
- `OrderList.vue`(預購商品分類頁)改為真實頁面:頂部狀態篩選 tab(含各狀態數量)、訂單卡片列表(顯示商品名稱、購買平台、價格與幣別、目前狀態、預計出貨日期),每張卡片提供編輯與刪除操作
- 新增「全部訂單」頁面與路由,顯示所有分類的訂單(目前僅預購商品分類有實際資料)
- 新增/編輯訂單改用 `Modal` + 表單處理,同一個 Modal 依是否帶入既有資料切換新增/編輯模式
- 側邊欄與頁面殘留的英文文字改為繁體中文:導覽項目(Dashboard→總覽)、五個分類名稱(preorder/agent/parcel/merch/manga → 預購商品/海外代購/集運包裹/追星周邊/漫畫小說)、`Orders Management` 副標題、`Dashboard.vue`/`OrderList.vue` 的預留文字、瀏覽器分頁標題
- `UiShowcase.vue` 更新:狀態徽章展示資料改用新的 `STATUSES` 鍵值(原本的 `PENDING`/`PROCESSING`/`SHIPPED` 會隨舊狀態表移除而失效),並新增 `Select` 元件的展示範例

## Capabilities

### New Capabilities

- `preorder-orders`: 預購商品分類的訂單管理功能,包含新增/編輯/刪除、8 階段狀態流程、狀態篩選與數量統計、集運倉標記

### Modified Capabilities

- `ui-components`: 新增 `Select` 下拉選單元件的行為規格

## Impact

- Affected specs: `preorder-orders`(新增)、`ui-components`(新增 Select 需求)
- Affected code:
  - New:
    - src/components/ui/Select.vue
    - src/components/orders/OrderFormModal.vue
    - src/components/orders/OrderCard.vue
    - src/components/orders/StatusFilterTabs.vue
    - src/views/AllOrders.vue
  - Modified:
    - src/stores/orders.js
    - src/views/Dashboard.vue
    - src/views/OrderList.vue
    - src/components/AppSidebar.vue
    - src/router/index.js
    - src/views/UiShowcase.vue
  - Removed: (none)
