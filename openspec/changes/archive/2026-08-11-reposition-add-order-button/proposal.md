## Why

目前「新增訂單」按鈕位於頁面標題旁，手機版更會佔滿整列，與使用者依序完成搜尋、篩選後再操作訂單的視覺流程不一致。將按鈕移到狀態分頁與訂單卡片之間，可讓桌面與手機版的操作位置一致且更緊湊。

## What Changes

- 將分類訂單頁與全部訂單頁的「+ 新增訂單」按鈕移至狀態分頁之後、訂單卡片之前。
- 桌面與手機版皆將按鈕靠右排列。
- 手機版取消滿版寬度，改為依內容寬度顯示的膠囊按鈕。
- 保留按鈕原有的新增訂單表單開啟行為。

## Non-Goals

- 不變更新增訂單表單、欄位、驗證或資料寫入流程。
- 不調整搜尋、排序、狀態篩選及訂單卡片本身的功能或樣式。
- 不新增浮動按鈕或固定於視窗的操作列。

## Capabilities

### New Capabilities

無。

### Modified Capabilities

- `preorder-orders`: 明確規範新增訂單操作在各訂單列表頁的排列位置，以及桌面與手機版的靠右緊湊呈現。

## Impact

- 受影響頁面：`src/views/OrderList.vue`、`src/views/AllOrders.vue`
- 受影響測試：`tests/views/OrderList.spec.js`、`tests/views/AllOrders.spec.js`
- 不影響 API、資料庫、路由與外部依賴。
