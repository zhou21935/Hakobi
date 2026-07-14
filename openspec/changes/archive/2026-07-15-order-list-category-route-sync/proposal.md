## Why

`OrderList.vue` 被 `/orders/agent` 與 `/orders/parcel` 兩個分類頁共用，但元件內的 `category` 是在 setup 階段對 `route.params.category` 做的一次性快照，並非響應式。由於這兩個分類頁對應同一個路由紀錄（`/orders/:category`），Vue Router 在分類切換時會重用同一個元件實例、只更新 `route.params`，setup 不會重新執行，導致 `category` 快照卡住不變。結果是頁面標題、清單內容、統計數字、以及新增訂單時寫入的分類，在使用者於「代購」與「集運包裹」之間切換時，仍會沿用切換前的分類，而非跟著目前路由更新（對應 GitHub issue #35）。

## What Changes

- `OrderList.vue` 的分類來源改為響應式：以 `computed(() => route.params.category)` 取代目前的一次性快照 `const category = route.params.category`
- `categoryLabel`、`categoryOrders`、`counts`、`filteredOrders` 皆改為讀取這個響應式分類值，確保切換路由後立即重新計算
- `handleSubmit` 內新增訂單時寫入的 `category` 欄位改為讀取目前路由對應的分類，而非切換前殘留的舊值
- 確認 `src/router/index.js` 現有的路由設定（`/orders/:category` 單一路由紀錄）不需異動，問題純粹出在元件內部的響應性，不是路由設定本身

## Non-Goals

- 不新增新的路由或頁面，僅修正既有 `/orders/:category` 路由頁面的響應性
- 不調整分類清單（`agent`、`parcel`）或分類標籤文字
- 不處理與本次 bug 無關的其他頁面（`Dashboard.vue`、`AllOrders.vue`）

## Capabilities

### New Capabilities

- `order-list-category-sync`：定義 `OrderList` 頁面必須依目前路由的分類參數，響應式同步頁面標題、清單內容、統計數字，以及新增訂單時寫入的分類

### Modified Capabilities

(none)

## Impact

- Affected specs: `order-list-category-sync`（新增）
- Affected code:
  - Modified:
    - src/views/OrderList.vue
  - New: (none)
  - Removed: (none)
