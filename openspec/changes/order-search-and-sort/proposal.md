## Why

目前 `src/stores/orders.js` 的 `getFiltered` 已支援依名稱/備註關鍵字搜尋（`filters.search`），但沒有任何畫面接上這個能力；排序功能完全未實作。以現在的功能成熟度來看，補上搜尋與排序是最直接提升使用體驗的一步，讓專案更像可用的訂單管理工具，而不只是靜態展示型原型（對應 GitHub issue #37）。

## What Changes

- `getFiltered` 新增 `sort` 篩選參數，支援依「下單日期」或「金額」排序，各自支援正序（舊到新／低到高）與反序（新到舊／高到低）；不帶 `sort` 參數時維持現有行為（依 `orders` 陣列原始順序，不排序）
- 新增共用元件 `src/components/orders/SearchSortControls.vue`，內含關鍵字搜尋輸入框與排序下拉選單，透過 `v-model:search` 與 `v-model:sort` 雙向綁定
- `src/views/AllOrders.vue`：加入 `SearchSortControls`，與現有 `StatusFilterTabs` 並列顯示，搜尋與排序條件會與現有的狀態篩選一起傳入 `getFiltered`
- `src/views/OrderList.vue`：加入 `SearchSortControls`，與現有的分類篩選（來自路由 `category` 參數）、狀態篩選（`StatusFilterTabs`）一起傳入 `getFiltered`，行為與 `AllOrders.vue` 一致

## Capabilities

### New Capabilities

- `order-search-sort`：定義訂單列表頁的關鍵字搜尋與排序行為，包含搜尋比對欄位、排序依據欄位與方向、搜尋/排序與既有分類/狀態篩選的共存規則，以及全部訂單頁與分類頁的行為一致性

### Modified Capabilities

(none)

## Impact

- Affected specs: `order-search-sort`（新增）
- Affected code:
  - New:
    - src/components/orders/SearchSortControls.vue
  - Modified:
    - src/stores/orders.js
    - src/views/AllOrders.vue
    - src/views/OrderList.vue
  - Removed: (none)
