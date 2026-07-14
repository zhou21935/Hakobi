## Context

`src/components/orders/OrderFormModal.vue` 的 `handleSubmit` 目前用三個內嵌的三元判斷式定義驗證規則（`form.name.trim() === '' ? '商品名稱不可為空' : ''`、`Number(form.amount) > 0 ? '' : '金額須為大於 0 的數字'`、`form.productCategories.length === 0 ? '請至少選擇一項商品分類' : ''`），並在同一個函式內把整理後的資料（`name: form.name.trim()`、`amount: Number(form.amount)`）透過 `emit('submit', payload)` 交給父層元件（`AllOrders.vue`/`OrderList.vue`）的 `handleSubmit`，父層再呼叫 `store.addOrder`/`store.updateOrder`。`src/stores/orders.js` 的 `addOrder`/`updateOrder` 目前對輸入資料沒有任何檢查，只做欄位預設值處理（例如 `orderData.name || ''`）。專案使用 Vue 3 `<script setup>` + Pinia，沒有既有的「domain 邏輯層」目錄慣例（`src/` 下目前只有 `components/`、`views/`、`stores/`、`router/`、`utils/` 未使用過）。

## Goals / Non-Goals

**Goals:**

- 讓名稱非空、金額為正數、商品分類至少一項這三條規則只存在一份程式碼，表單與 store 都呼叫同一份
- 讓 `stores/orders.js` 的 `addOrder`/`updateOrder` 在資料不合法時拒絕寫入（回傳 `null`），不再無條件接受任何輸入
- 讓資料整理邏輯（trim 名稱、金額轉數字）也集中，不重複寫在表單與未來可能的其他入口

**Non-Goals:**

- 不新增或調整驗證規則本身的判斷標準
- 不改變 `AllOrders.vue`、`OrderList.vue` 呼叫 `store.addOrder`/`store.updateOrder` 之後的既有處理流程
- 不引入表單驗證函式庫（例如 vee-validate、zod），純手寫函式已足以應付現有三條規則的複雜度

## Decisions

### 驗證與整理邏輯放在新的 src/domain/orderValidation.js 純函式模組

新建 `src/domain/` 目錄，放置 `orderValidation.js`，匯出 `normalizeOrderInput(data)` 與 `validateOrder(data)` 兩個不依賴 Vue、不依賴 Pinia 的純函式：
- `normalizeOrderInput(data)`：回傳一個新物件，將 `data.name` 轉為 `typeof data.name === 'string' ? data.name.trim() : data.name`、`data.amount` 轉為 `Number(data.amount)`，其餘欄位原樣帶過（`{ ...data, name: ..., amount: ... }`），不修改傳入的 `data`
- `validateOrder(data)`：對傳入的（已整理過的）資料做三項檢查，回傳 `{ isValid: boolean, errors: { name: string | null, amount: string | null, productCategories: string | null } }`：
  - `name` 為空字串（trim 後）時，`errors.name = '商品名稱不可為空'`
  - `amount` 不是大於 0 的數字（`!(Number.isFinite(data.amount) && data.amount > 0)`）時，`errors.amount = '金額須為大於 0 的數字'`
  - `Array.isArray(data.productCategories)` 為 false 或長度為 0 時，`errors.productCategories = '請至少選擇一項商品分類'`
  - `isValid` 為三個 `errors` 欄位皆為 `null` 時才是 `true`

理由：純函式不依賴 Vue reactivity 或 Pinia store 實例，可以同時被 `stores/orders.js`（Pinia store 內部）與 `OrderFormModal.vue`（Vue 元件）直接 import 呼叫，也方便日後任何新入口（例如批次匯入腳本）重複使用，且不需要額外的測試基礎設施（不需要 mount 元件或建立 store 就能單元測試）。

替代方案：把驗證邏輯放進 `stores/orders.js` 內部、由 `OrderFormModal.vue` 透過呼叫一個 store 的 action（例如 `store.validateOrder(data)`）取得驗證結果——拒絕，因為這樣表單要驗證就必須先取得 store 實例並呼叫 store 方法，讓「純粹顯示錯誤」的表單元件多了一層對 Pinia store 的耦合，且不利於未來在非 Vue 環境（例如 Node 腳本做批次匯入）重複使用同一份規則。

### stores/orders.js 的 addOrder / updateOrder 在寫入前呼叫 normalizeOrderInput 與 validateOrder，失敗回傳 null

`addOrder(orderData)`：
1. `const normalized = normalizeOrderInput(orderData)`
2. `const { isValid } = validateOrder(normalized)`
3. 若 `!isValid`，直接 `return null`，不執行任何 `orders.value.push(...)`
4. 若合法，沿用現有欄位預設值邏輯（`normalized.category || ''` 等），但 `name`/`amount` 一律使用 `normalized.name`/`normalized.amount`（已經是 trim/Number 過的值），建立並 push 新訂單物件，回傳該物件

`updateOrder(id, orderData)`：
1. 先用現有邏輯 `const index = orders.value.findIndex(order => order.id === id)`，找不到時維持現行行為回傳 `null`
2. 找到時，先計算合併後的完整結果 `const merged = { ...orders.value[index], ...orderData }`
3. `const normalized = normalizeOrderInput(merged)`
4. `const { isValid } = validateOrder(normalized)`
5. 若 `!isValid`，直接 `return null`，**不修改** `orders.value[index]`（保留既有資料不變）
6. 若合法，`orders.value[index] = normalized`，回傳更新後的物件

理由：對「合併後的完整結果」做驗證而非只驗證傳入的 `orderData` 片段，是因為 `updateOrder` 目前允許局部更新（例如只傳 `{ isPaid: true }`），若只驗證片段，片段本身可能永遠合法（`{ isPaid: true }` 沒有 `name`/`amount`/`productCategories` 欄位，三項規則都會誤判為不合法，因為 `undefined` 不是非空字串、不是正數、不是非空陣列）；驗證合併後的完整結果才能正確反映「更新後這筆訂單資料是否仍然合法」。

替代方案：`updateOrder` 只驗證傳入的 `orderData` 片段——拒絕，會導致任何局部更新（例如只切換 `isPaid`）都被誤判為不合法而遭拒絕，這不是本次要引入的行為。

失敗回傳 `null` 而非拋出例外，理由與替代方案已記錄於 proposal.md 的「Alternatives Considered」，此處不重複。

### OrderFormModal.vue 改為呼叫共用函式取得錯誤訊息與整理後的送出資料

`handleSubmit` 改為：
1. `const normalized = normalizeOrderInput(form)`（`form` 是既有的 `reactive` 表單物件，包含 `name`、`amount`、`productCategories` 等欄位）
2. `const { isValid, errors } = validateOrder(normalized)`
3. `nameError.value = errors.name || ''`、`amountError.value = errors.amount || ''`、`productCategoriesError.value = errors.productCategories || ''`（沿用現有 ref 皆為空字串代表無錯誤的慣例，把 `validateOrder` 回傳的 `null` 轉為空字串）
4. 若 `!isValid`，`return`（不 emit）
5. 若合法，`emit('submit', { ...normalized, currency: form.currency, isPaid: form.isPaid, status: form.status, orderDate: form.orderDate || null, estimatedShipDate: form.estimatedShipDate || null, estimatedArrivalDate: form.estimatedArrivalDate || null, isPreorder: form.isPreorder, notes: form.notes })`，其中 `name`/`amount`/`productCategories` 已經包含在 `normalized` 展開內，不需要再手動寫一次

## Implementation Contract

**行為（Behavior）：**
- 呼叫 `store.addOrder(data)`：當 `data`（經過 trim 名稱、轉換金額後）名稱為空、金額非正數、或商品分類為空陣列時，SHALL NOT 把新訂單加入 `orders` 陣列，SHALL 回傳 `null`；三項規則皆通過時，SHALL 建立並回傳新訂單物件（維持現有欄位預設值行為不變）
- 呼叫 `store.updateOrder(id, data)`：當找不到對應 `id` 的訂單時維持現行行為回傳 `null`；找到時，若 `data` 與既有訂單合併後的結果（經過 trim 名稱、轉換金額後）名稱為空、金額非正數、或商品分類為空陣列，SHALL NOT 修改該筆既有訂單資料，SHALL 回傳 `null`；驗證通過時 SHALL 寫入合併後的整理結果並回傳
- `OrderFormModal.vue` 送出表單時：驗證失敗時 SHALL 在對應欄位（商品名稱、金額、商品分類）顯示現行文字的錯誤訊息，且 SHALL NOT 觸發 `submit` 事件；驗證成功時 SHALL 觸發 `submit` 事件，事件酬載的 `name`/`amount` SHALL 是已經 trim/轉換過的值

**介面/資料形狀：**
- `src/domain/orderValidation.js` 匯出 `normalizeOrderInput(data: object): object` 與 `validateOrder(data: object): { isValid: boolean, errors: { name: string | null, amount: string | null, productCategories: string | null } }`
- `store.addOrder`、`store.updateOrder` 的回傳型別維持「合法時回傳訂單物件、不合法時回傳 `null`」不變（`updateOrder` 原本就有這個回傳慣例，`addOrder` 是新增這個回傳 `null` 的分支）

**失敗模式：**
- 驗證失敗時一律回傳 `null`，不拋出例外；呼叫端（本次不修改的 `AllOrders.vue`/`OrderList.vue`）在正常操作流程下不會遇到這個分支，因為 `OrderFormModal.vue` 已經在 emit 前擋掉不合法資料，store 端的拒絕屬於未經表單直接呼叫 store 時的防禦層

**驗收標準：**
- `src/stores/__tests__/orders.spec.js` 新增測試：`addOrder`/`updateOrder` 在不合法資料（缺名稱、金額為 0 或負數、缺商品分類）下回傳 `null` 且不改變 `orders` 陣列內容；在合法資料下行為與現行一致
- `src/components/orders/__tests__/OrderFormModal.spec.js` 既有的三個錯誤訊息測試（商品名稱不可為空、金額須為大於 0 的數字、請至少選擇一項商品分類）持續通過
- `npm test` 全數通過

**範圍邊界：**
- 範圍內：新增 `src/domain/orderValidation.js`；修改 `src/stores/orders.js` 的 `addOrder`/`updateOrder`；修改 `src/components/orders/OrderFormModal.vue` 的 `handleSubmit`；更新對應測試檔案
- 範圍外：`src/views/AllOrders.vue`、`src/views/OrderList.vue` 呼叫 store 後的錯誤處理流程；新增或調整驗證規則本身；引入第三方驗證函式庫

## Risks / Trade-offs

- [風險] `updateOrder` 改為驗證「合併後的完整結果」而非「傳入的片段」，若未來有呼叫端習慣性地只傳極小片段（例如只想切換 `isPaid`）且該筆既有訂單本身缺少必要欄位（理論上不該發生，因為 `addOrder` 已確保寫入時合法），仍可能因為既有資料不完整而被誤判——因應：`addOrder` 保證所有透過它建立的訂單都是合法的，現有測試資料也都會補上必要欄位，這個風險僅存在於繞過 `addOrder` 直接操作 store 內部狀態的情境，屬於已知且可接受的邊界
- [風險] `orders.spec.js` 既有 4 個測試（`addOrder isPreorder` 與 `addOrder productCategories` 兩個 describe 內）目前呼叫 `store.addOrder({ name: 'test', amount: 10 })` 未帶 `productCategories`，套用新規則後會回傳 `null` 導致這些測試失敗——因應：本次變更會直接更新這 4 個測試，改為傳入 `productCategories: ['merch']`（或該測試已經測試的分類陣列），這是配合新規則的預期更新，不是回歸
- [取捨] 不使用第三方驗證函式庫，換取零額外依賴，但需要自行維護三條規則的手寫判斷邏輯；目前規則數量少（3 條），此取捨合理
