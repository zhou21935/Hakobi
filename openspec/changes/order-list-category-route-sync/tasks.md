## 1. 分類來源改為響應式

- [x] 1.1 依需求「OrderList page title reflects the current route category」，將 `src/views/OrderList.vue` 的 `const category = route.params.category` 改為 `const category = computed(() => route.params.category)`，並將所有讀取 `category` 的地方改為讀取 `category.value`；驗證：於 `src/views/__tests__/OrderList.spec.js` 新增測試，在同一個元件實例上把 `route.params.category` 從 `agent` 改為 `parcel` 後，`categoryLabel` 顯示的文字會更新為 `parcel` 對應的標籤，不再停留在 `agent` 的標籤
- [x] 1.2 依需求「OrderList order list and counts reflect the current route category」，確認 `categoryOrders`、`filteredOrders`、`counts` 三個 computed 都改為讀取 `category.value`，使其在路由分類切換後立即重新計算；驗證：同一測試檔案中，切換路由分類後斷言清單只包含新分類的訂單，且 `StatusFilterTabs` 顯示的統計數字改為以新分類的訂單數計算
- [x] 1.3 依需求「New order created from OrderList is written to the current route category」，將 `handleSubmit` 內 `store.addOrder({ ...payload, category })` 改為使用 `category.value`，確保切換分類後新增訂單寫入目前分類；驗證：同一測試檔案中，切換路由分類後透過表單新增訂單，斷言 `store.addOrder` 收到的 payload 的 `category` 為切換後的新分類

## 2. 路由設定確認

- [x] 2.1 檢視 `src/router/index.js` 中 `/orders/:category` 路由紀錄，確認任務 1.1-1.3 的響應式修正已足以解決分類切換不同步的問題，不需要額外的路由層級變更（例如 `key` 屬性強制重建元件）；驗證：執行任務 1 新增的測試全數通過，證明不重建元件、僅靠響應式資料流即可正確同步

## 3. 整體驗證

- [x] 3.1 執行 `npm test` 確認所有新增與既有測試皆通過；驗證：測試指令輸出全數 pass
