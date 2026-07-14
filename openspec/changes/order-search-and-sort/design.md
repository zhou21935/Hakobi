## Context

`src/stores/orders.js` 的 `getFiltered(filters)` 目前接受 `{ category, status, search }`，依序過濾 `orders.value`，`search` 已經實作為對 `name`/`notes` 欄位做不分大小寫的子字串比對，但 `AllOrders.vue`、`OrderList.vue` 目前都只傳入 `category`/`status`，沒有任何輸入框讓使用者填 `search`。排序完全沒有實作，`getFiltered` 回傳的陣列順序就是 `orders.value` 的原始順序（新增順序）。兩個列表頁的結構高度相似：都用 `StatusFilterTabs` 做狀態篩選、都用 `computed(() => store.getFiltered({...}))` 算出 `filteredOrders`、都用 `OrderCard` 逐筆渲染。訂單資料欄位中，`orderDate`（下單日期，使用者於表單手動填寫的 `<input type="date">`，可留空）與 `amount`（金額，數字）是本次要支援排序的兩個依據；`createdAt`（建立時間戳）是系統自動產生、必定存在，但代表的是「這筆資料何時被建立」而非使用者認知的訂單日期。

## Goals / Non-Goals

**Goals:**

- 讓使用者能在 `AllOrders.vue`、`OrderList.vue` 用關鍵字搜尋現有訂單（沿用既有的 name/notes 比對邏輯）
- 讓使用者能依「下單日期」或「金額」排序，且能選擇正序或反序
- 搜尋、排序、分類篩選、狀態篩選四者可同時套用，彼此不衝突
- 兩個列表頁的搜尋/排序 UI 與行為完全一致（同一個共用元件、同一套呼叫 `getFiltered` 的方式）

**Non-Goals:**

- 不支援依其他欄位排序（例如平台、幣別、商品分類），僅支援日期與金額
- 不實作伺服器端分頁或虛擬捲動，排序後的完整清單仍一次性渲染
- 不改變 `StatusFilterTabs`、`OrderCard` 既有元件的介面或行為
- 不新增儲存使用者搜尋/排序偏好的持久化機制（例如記住上次的排序選項），每次進入頁面排序回到預設（不排序）、搜尋回到空字串

## Decisions

### 排序依據的「日期」使用 orderDate（下單日期），缺值的訂單排序時固定排在最後

排序選項中的「日期」對應訂單的 `orderDate` 欄位（表單上的「下單日期」），而非系統自動產生的 `createdAt`。理由：`orderDate` 是使用者在表單上直接認知、可編輯的「訂單日期」，符合「依日期排序」這個功能描述在使用者心智模型中的預期；`createdAt` 是實作細節（資料何時寫入前端 store），不是使用者會在意的排序依據。

`orderDate` 可能為空字串或 `null`（表單未填寫時的預設值）。排序時，缺少 `orderDate` 的訂單一律排在結果陣列的最後面，無論選擇的是正序或反序，理由是讓「有日期的訂單」形成一組有意義的順序，不會因為空值排序規則（空字串在字串比較中通常排最前面）而混在最前面造成使用者誤解。

替代方案：使用 `createdAt` 作為「日期」排序依據——拒絕，因為 `createdAt` 對使用者不可見也不可控，與「日期」這個詞在表單／清單其他地方的用法（皆指 `orderDate`）不一致。

替代方案：缺 `orderDate` 的訂單排在最前面——拒絕，因為使用者切換排序通常是想看「最近/最舊」的有效資料，缺日期的資料排最前面會擋住有意義的排序結果。

### getFiltered 新增 sort 參數，值為 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc'，套用於過濾後的結果、不修改 orders.value

`getFiltered(filters)` 的 `filters` 新增可選欄位 `sort`，型別為字串，合法值為 `'date-asc'`、`'date-desc'`、`'amount-asc'`、`'amount-desc'`；未提供或提供其他值時，維持現有行為（不排序，回傳過濾後的原始順序）。排序邏輯在既有的 `category`/`status`/`search` 過濾都套用完之後才執行，對過濾後的陣列做 `[...filtered].sort(...)`（複製後排序，不使用會原地修改陣列的 `.sort()` 直接呼叫在 `result` 上，也絕不修改 `orders.value` 本身）：
- `'date-asc'`/`'date-desc'`：依 `orderDate` 排序，空值（`''`、`null`、`undefined`）一律視為排序鍵值最大（永遠排在陣列最後，不論 asc/desc）；有值的訂單依 `orderDate` 字串（`YYYY-MM-DD` 格式，字串比較即為時間先後比較）排序
- `'amount-asc'`/`'amount-desc'`：依 `amount`（數字）排序

理由：用字串 enum 而非拆成 `sortBy`/`sortOrder` 兩個參數，是因為呼叫端（UI 的 `Select` 下拉選單）本來就只需要提供一個下拉選項值，用單一字串可以直接把 `<select>` 的 `value` 傳給 `getFiltered`，不需要在元件裡再組合物件。

替代方案：`sortBy`（`'date' | 'amount'`）與 `sortOrder`（`'asc' | 'desc'`）兩個獨立參數——拒絕，會讓呼叫端多一層轉換，且下拉選單天生就是「選一個選項」的互動模式，單一字串 enum 更直接對應。

### 新增共用元件 SearchSortControls.vue，透過 v-model:search 與 v-model:sort 雙向綁定

新建 `src/components/orders/SearchSortControls.vue`，內部使用既有的 `Input`（搜尋框，`placeholder="搜尋名稱或備註"`）與 `Select`（排序下拉選單，選項為「預設排序」「日期：新到舊」「日期：舊到新」「金額：高到低」「金額：低到高」，對應 value 分別為空字串、`date-desc`、`date-asc`、`amount-desc`、`amount-asc`）。元件對外用 Vue 3 的多重 `v-model`：`defineProps(['search', 'sort'])` + `defineEmits(['update:search', 'update:sort'])`，讓父層可以 `v-model:search="searchQuery" v-model:sort="sortOption"`。

理由：`AllOrders.vue`、`OrderList.vue` 需要完全相同的搜尋/排序 UI 與互動邏輯，抽成共用元件避免重複的 template 與 class，也讓「兩個列表頁行為一致」這個完成條件在元件層級上就有保證（同一份程式碼，不可能行為分歧）。

替代方案：直接在兩個 view 裡各自寫一份搜尋輸入框與排序下拉選單——拒絕，會需要手動確保兩份重複程式碼的行為永遠一致，且違反本次「全部訂單頁與分類頁行為一致」的完成條件精神。

### AllOrders.vue、OrderList.vue 把 SearchSortControls 放在 StatusFilterTabs 上方，三種條件一起傳入 getFiltered

兩個 view 都新增 `searchQuery`（`ref('')`）與 `sortOption`（`ref('')`）兩個響應式狀態，`SearchSortControls` 放在 `StatusFilterTabs` 上方（維持窄螢幕 `flex-col md:flex-row` 的既有響應式排版慣例），既有的 `filteredOrders` computed 改為：
```
store.getFiltered({
  category: category.value,        // 僅 OrderList.vue 有，AllOrders.vue 不傳
  status: selectedStatus.value || undefined,
  search: searchQuery.value || undefined,
  sort: sortOption.value || undefined
})
```

## Implementation Contract

**行為（Behavior）：**
- 在 `AllOrders.vue`、`OrderList.vue` 的搜尋輸入框輸入關鍵字後，清單即時（不需按下額外按鈕）只顯示 `name` 或 `notes` 欄位包含該關鍵字（不分大小寫）的訂單，且這個過濾與目前選取的分類（僅 `OrderList.vue`）、狀態篩選同時套用（交集，非聯集）
- 在排序下拉選單選擇「日期：新到舊」「日期：舊到新」「金額：高到低」「金額：低到高」任一選項後，清單依對應規則重新排序；選擇「預設排序」（或未選擇）時清單維持原始（未排序）順序；排序作用在當下已通過搜尋/分類/狀態篩選後的結果上
- 排序依 `orderDate` 時，`orderDate` 為空的訂單一律出現在清單最後面，無論選了新到舊或舊到新
- 切換路由分類（`OrderList.vue` 的 `/orders/agent` ↔ `/orders/parcel`）或重新整理頁面後，搜尋關鍵字與排序選項都重置為預設值（空字串／不排序），不做跨頁面或跨工作階段的記憶

**介面/資料形狀：**
- `store.getFiltered(filters)` 的 `filters` 新增可選欄位 `sort: 'date-asc' | 'date-desc' | 'amount-asc' | 'amount-desc' | undefined`，其餘既有欄位（`category`、`status`、`search`）行為不變
- `SearchSortControls.vue` props：`search: String`（預設 `''`）、`sort: String`（預設 `''`）；emits：`update:search`、`update:sort`

**失敗模式：**
- 排序鍵值缺失（`orderDate` 為空、`amount` 為 `undefined`）不視為錯誤，依上述「排最後」規則靜默處理，不拋出例外、不顯示錯誤訊息
- `sort` 收到未知字串（非四個合法值之一）時，`getFiltered` SHALL 視同未提供 `sort`，回傳未排序的過濾結果，不拋出例外

**驗收標準：**
- `src/stores/__tests__/orders.spec.js` 新增測試：`getFiltered` 在 `sort: 'date-asc'`/`'date-desc'`/`'amount-asc'`/`'amount-desc'` 下回傳正確排序的陣列；缺 `orderDate` 的訂單在兩種日期排序下都排在最後；未提供 `sort` 或提供不合法值時回傳未排序的原始過濾結果；`orders.value` 本身在呼叫 `getFiltered` 後順序不變（未被原地排序修改）
- `AllOrders.vue`、`OrderList.vue` 的手動或自動化測試：輸入搜尋關鍵字後清單即時篩選；選擇排序選項後清單重新排序；同時套用分類/狀態篩選與搜尋/排序時結果為交集
- `npm test` 全數通過

**範圍邊界：**
- 範圍內：`src/stores/orders.js` 的 `getFiltered`；新增 `src/components/orders/SearchSortControls.vue`；`src/views/AllOrders.vue`、`src/views/OrderList.vue` 整合搜尋/排序狀態與 UI
- 範圍外：`StatusFilterTabs.vue`、`OrderCard.vue`、`OrderFormModal.vue` 的介面或行為；伺服器端分頁；搜尋/排序偏好的持久化

## Risks / Trade-offs

- [風險] `orderDate` 是使用者手動輸入的日期字串（`<input type="date">` 產生的 `YYYY-MM-DD` 格式），字串比較恰好等同時間先後比較，但若未來欄位格式改變（例如改成含時間的 ISO 字串或時間戳），排序邏輯需要同步調整——因應：本次僅依賴 `<input type="date">` 現有輸出格式，若欄位格式變更屬於另一個變更的範圍
- [風險] 搜尋為即時（每次輸入觸發 computed 重新計算），訂單數量極大時可能有效能疑慮——因應：目前專案為本地端 Pinia store、資料量小（demo/prototype 等級），暫不處理效能優化，如未來資料量成長可另外評估防抖動（debounce）或虛擬捲動
- [取捨] 排序與搜尋狀態不持久化，使用者每次重新整理或切換分類頁都要重新設定——換取實作簡單、行為可預測（不會有「為什麼清單長得跟我上次看到的不一樣」的隱藏狀態疑惑），符合 Non-Goals 的決定
