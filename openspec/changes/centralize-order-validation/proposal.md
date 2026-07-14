## Summary

把目前散落在 `OrderFormModal.vue` 表單元件內的訂單驗證規則（名稱非空、金額為正數、商品分類至少一項）與資料整理邏輯（trim 名稱、金額轉數字），集中到一個共用的驗證模組，並讓 `stores/orders.js` 的 `addOrder`/`updateOrder` 也直接套用同一套規則，讓表單不再是唯一防線。

## Motivation

目前驗證規則寫死在 `OrderFormModal.vue` 的 `handleSubmit` 內，`stores/orders.js` 的 `addOrder`/`updateOrder` 完全不做檢查，任何資料呼叫都會直接寫入。這在目前只有一個表單入口時堪用，但只要未來新增第二個建立/編輯入口（例如批次匯入、其他頁面的快速編輯、未來的 API），這些入口很容易忘記重做一次驗證，或用不一致的規則實作，造成資料品質不一致。集中驗證規則能確保「資料規則只有一份來源」，UI 表單只負責蒐集輸入與呈現錯誤訊息。

## Proposed Solution

- 新增 `src/domain/orderValidation.js`，提供兩個純函式：
  - `normalizeOrderInput(data)`：整理輸入資料，將 `name` 去除頭尾空白、`amount` 轉為 `Number`，回傳整理後的新物件（不修改傳入的原物件）
  - `validateOrder(data)`：基於整理後的資料，回傳 `{ isValid, errors }`，其中 `errors` 為 `{ name, amount, productCategories }`，任何一項規則不通過時填入現行用語的錯誤訊息字串（不通過為 `null`）：
    - `name`：trim 後為空字串時，錯誤訊息「商品名稱不可為空」
    - `amount`：非大於 0 的數字時，錯誤訊息「金額須為大於 0 的數字」
    - `productCategories`：陣列長度為 0 時，錯誤訊息「請至少選擇一項商品分類」
- `src/stores/orders.js` 的 `addOrder(orderData)`：先呼叫 `normalizeOrderInput` 整理資料，再呼叫 `validateOrder` 驗證整理後的資料；驗證失敗時**不將訂單加入 `orders` 陣列**，直接回傳 `null`；驗證成功時沿用現有欄位預設值邏輯，建立並回傳新訂單物件（維持現有回傳合法訂單物件的行為）
- `src/stores/orders.js` 的 `updateOrder(id, orderData)`：先找出既有訂單，將 `orderData` 與既有訂單合併成待寫入的完整結果，對這個合併後的完整結果呼叫 `normalizeOrderInput` 與 `validateOrder`；驗證失敗時**不覆蓋既有訂單資料**，直接回傳 `null`（與目前「找不到 id 回傳 null」的既有慣例一致）；驗證成功時才寫入合併後的結果並回傳
- `src/components/orders/OrderFormModal.vue` 的 `handleSubmit`：移除目前手寫的三條規則判斷式，改為呼叫 `validateOrder`（可先用 `normalizeOrderInput` 整理 `form` 的內容再驗證，以便錯誤訊息與最終送出的資料一致），把回傳的 `errors.name`/`errors.amount`/`errors.productCategories` 指派給現有的 `nameError`/`amountError`/`productCategoriesError` ref 顯示；`errors` 皆為 `null` 時才 `emit('submit', ...)`，送出的 payload 改用 `normalizeOrderInput` 整理後的 `name`/`amount`，取代目前手動的 `form.name.trim()`、`Number(form.amount)`

## Non-Goals

- 不改變現有三條驗證規則的判斷邏輯本身（名稱非空、金額 > 0、分類至少一項），只搬動規則的存放位置，不新增或放寬規則
- 不改變 `AllOrders.vue`、`OrderList.vue` 呼叫 `store.addOrder`/`store.updateOrder` 後的既有流程（例如收到 `null` 時是否要重新開啟表單），因為透過 `OrderFormModal` 的表單提交在正常操作下一定已經通過驗證，store 端的驗證屬於防禦性的第二層防線，不在本次範圍內調整呼叫端行為
- 不新增新的驗證規則（例如金額上限、名稱長度上限），僅限於現有三條規則的集中化
- 不變更錯誤訊息文字內容，維持現有的繁體中文訊息不變

## Alternatives Considered

- 讓 `addOrder`/`updateOrder` 驗證失敗時改為拋出例外（`throw`）而非回傳 `null`——拒絕，因為 `updateOrder` 現有「找不到 id」的失敗情境已經是回傳 `null` 的慣例，沿用同一種失敗回傳方式讓呼叫端只需要判斷回傳值是否為 `null`，不需要為了驗證失敗另外包一層 `try/catch`，與現有程式風格更一致
- 讓 `OrderFormModal.vue` 直接呼叫 `store.addOrder`/`store.updateOrder` 取得驗證結果，不在表單內先驗證一次——拒絕，因為現有的「送出前即時顯示錯誤、不清空表單」互動體驗需要在表單提交當下就取得逐欄位錯誤訊息，而不是等呼叫 store 後才知道；因此表單仍呼叫共用的 `validateOrder` 取得錯誤訊息用於顯示，store 端的驗證是另一層獨立的資料保護，兩者呼叫同一份規則但各自執行

## Capabilities

### New Capabilities

- `order-validation`：定義訂單資料的驗證規則（名稱非空、金額為正數、商品分類至少一項）與整理邏輯（trim 名稱、金額轉數字）集中於單一共用模組，且新增與編輯訂單的所有入口（表單與 store 操作）都必須套用這同一套規則

### Modified Capabilities

- `preorder-orders`：擴充「User can create a preorder order with required field validation」與「Orders can be tagged with one or more product categories」這兩條既有需求，明確納入 store 層（`addOrder`/`updateOrder`）也必須直接強制執行同樣的驗證規則，而不只是透過表單元件間接防堵

## Impact

- Affected specs: `order-validation`（新增）、`preorder-orders`（修改）
- Affected code:
  - New:
    - src/domain/orderValidation.js
  - Modified:
    - src/stores/orders.js
    - src/components/orders/OrderFormModal.vue
    - src/stores/__tests__/orders.spec.js
    - src/components/orders/__tests__/OrderFormModal.spec.js
  - Removed: (none)
