## Context

目前訂單的 `category` 欄位（`src/stores/orders.js`）同時承載兩種語意：決定側邊欄導覽/路由歸屬的業務分類（`agent`、`parcel`），以及商品類型描述（`preorder`、`merch`、`manga`）。表單（`OrderFormModal.vue`）另外有一個獨立的 `isConsolidated` 布林欄位（「送往集運倉」checkbox），跟側邊欄的 `parcel`（集運包裹）分類語意重疊。表單目前完全沒有商品分類欄位——訂單建立時的 `category` 是由 `OrderList.vue` 依當前路由隱含帶入的。

## Goals / Non-Goals

**Goals:**

- 側邊欄分類收斂為 `agent`（代購）、`parcel`（集運包裹）兩項
- 移除 `isConsolidated`，改為語意不同的 `isPreorder`（預購商品），沿用同一個 UI 欄位位置
- 新增必填、可複選的 `productCategories` 欄位（周邊/書籍/其他），並新建支援多選的 `MultiSelect` 元件
- 訂單卡片（`OrderCard.vue`）顯示 `isPreorder` 標籤與 `productCategories` 標籤

**Non-Goals:**

- 不遷移或補值既有 localStorage 中已持久化的舊訂單資料
- 不新增依 `productCategories` 篩選訂單的 UI
- 不重新命名 `preorder-orders` spec capability 目錄
- 不變更既有 5 階段出貨狀態流程或 `isPaid` 邏輯

## Decisions

### category 欄位維持原名與單一字串型別，僅收斂值域

`getByCategory`、`getFiltered({ category })`、路由 `/orders/:category`、以及 `OrderList.vue` 依路由隱含帶入 `category` 的建立流程，在值域縮小後不需要改變任何邏輯——只需要把 `CATEGORIES`/`CATEGORY_LABELS` 縮減為兩項，並同步縮減 `AppSidebar.vue` 的 `categories` 陣列。曾考慮改名為 `businessLine` 以跟新的 `productCategories`做區隔，但因為 `category` 原本的語意（導覽歸屬）並未改變、只是值域變小，改名只會增加不必要的程式碼異動，故不採用。

### isConsolidated 原地重新命名為 isPreorder，而非新增欄位並棄用舊欄位

使用者明確表示不要讓「集運」概念在兩個地方重複存在。沿用同一個資料欄位槽位與 UI 位置（`OrderFormModal.vue` 表單中「貨物狀態」旁的 grid 欄位）可以把改動範圍降到最低。既有持久化訂單裡殘留的 `isConsolidated` 鍵值會變成沒有作用的孤兒欄位，不會造成執行期錯誤，不需要遷移（見 Non-Goals）。

### productCategories 為新的 string[] 欄位，值域固定為三項，必填無預設值

值域常數定義為 `PRODUCT_CATEGORIES = { MERCH: 'merch', BOOK: 'book', OTHER: 'other' }`。獨立於 `category` 之外，避免重蹈「一個欄位兩種語意」的舊問題。必須至少選擇一項才能送出表單，比照現有 `nameError`/`amountError` 的驗證模式處理。

### 新建 MultiSelect 元件，而非讓 Select 元件同時支援單選與多選

`Select.vue` 是原生 `<select>`，`modelValue` 是單一字串，互動模型（選一項即完成）跟多選（可持續勾選多項、面板不因單次選取而關閉）本質不同。曾考慮用原生 `<select multiple>`——因需要 ctrl/cmd 多選、不易發現、無法用 chip 呈現已選項目而放棄；曾考慮讓 `Select.vue` 加一個 `multiple` prop 切換兩種模式——因為會讓單一元件承擔兩套互動邏輯與兩種 `modelValue` 型別，維護成本higher，故改為新建獨立元件 `MultiSelect.vue`。

新元件互動規格：
- 收合狀態：已選項目以 chip 形式顯示在控制項內；未選任何項目時顯示 `placeholder`
- 展開狀態：顯示選項清單，每項前有 checkbox；點擊任一項目只切換該項目的選取狀態，面板不因此關閉，可連續勾選多項
- 關閉時機：點擊元件外部，或按下 Escape 鍵
- 每次切換都會以完整陣列觸發 `update:modelValue`
- 支援 `error` prop（字串），比照 `Input.vue` 的錯誤訊息呈現模式，顯示在控制項下方

面板開關（點外部關閉、Escape 關閉）的實作方式比照 `Modal.vue` 既有且已驗證過的做法，降低新元件的邊角案例風險。

### OrderCard 徽章顯示順序固定

`StatusBadge` 之後，若 `order.isPreorder` 為 `true` 則顯示「預購」標籤，接著依固定順序（周邊、書籍、其他，而非使用者選取順序）顯示 `productCategories` 對應的標籤。固定順序讓卡片版面在編輯後重新渲染時保持視覺穩定，不會因選取順序不同而跳動。

## Implementation Contract

**Behavior**：新增/編輯訂單時，使用者必須透過新的多選控制項選擇至少一項商品分類才能送出表單；未選擇時顯示行內錯誤訊息，且不會呼叫 `store.addOrder`/`store.updateOrder`。「預購商品」checkbox 取代原本「送往集運倉」在表單中的相同位置；勾選後儲存，該訂單卡片會立即且每次渲染都在狀態徽章旁顯示「預購」標籤。已選取的商品分類會以標籤形式顯示在同一張卡片上。側邊欄僅顯示「代購」「集運包裹」兩個分類連結；舊資料中 `category` 為 preorder/merch/manga 的訂單不再有對應側邊欄入口，但仍會出現在「全部訂單」（`AllOrders.vue`）頁面，不受分類過濾影響。

**Interface / data shape**：
- `src/stores/orders.js`：`CATEGORIES = { AGENT: 'agent', PARCEL: 'parcel' }`、`CATEGORY_LABELS = { agent: '海外代購', parcel: '集運包裹' }`；新增 `PRODUCT_CATEGORIES = { MERCH: 'merch', BOOK: 'book', OTHER: 'other' }` 與 `PRODUCT_CATEGORY_LABELS = { merch: '周邊', book: '書籍', other: '其他' }`；訂單物件移除 `isConsolidated`，新增 `isPreorder: boolean`（預設 `false`）與 `productCategories: string[]`（預設 `[]`）
- `src/components/ui/MultiSelect.vue`：props `modelValue: string[]`（預設 `() => []`）、`options: {value, label}[]`（必填）、`label`、`placeholder`、`error`、`disabled`；emits `update:modelValue`，傳完整陣列
- `src/components/AppSidebar.vue`：`categories` 陣列縮減為 `['agent', 'parcel']`
- `src/components/orders/OrderFormModal.vue`：`Checkbox v-model="form.isConsolidated" label="送往集運倉"` 改為 `Checkbox v-model="form.isPreorder" label="預購商品"`；新增 `MultiSelect v-model="form.productCategories" label="商品分類" :options="productCategoryOptions" :error="productCategoriesError"`；`handleSubmit` 送出的 payload 包含 `productCategories` 與 `isPreorder`
- `src/components/orders/OrderCard.vue`：`order.isPreorder` 為真時渲染預購標籤；`order.productCategories` 內每個值渲染一個標籤，兩者都緊鄰 `StatusBadge`

**Failure modes**：未選商品分類是純前端驗證失敗（行內錯誤、不寫入 store），不是例外；本專案沒有後端/API 層，不存在網路失敗模式。

**Acceptance criteria**：透過 `/verify` 技能實際操作新增/編輯表單驗證：不選商品分類送出會被擋下並顯示錯誤；分別選 1 項與 3 項商品分類送出後資料正確持久化且卡片顯示對應標籤；勾選/取消「預購商品」會讓卡片上的「預購」標籤出現/消失；側邊欄剛好只有兩個分類連結；直接以瀏覽器網址列造訪已移除的分類路由（例如 `/orders/preorder`）不再有側邊欄入口可點，但該分類的舊資料仍會出現在「全部訂單」。

**Scope boundaries**：範圍內——側邊欄導覽、訂單資料模型、訂單表單、訂單卡片顯示、新建的 `MultiSelect` 元件。範圍外——任何後端/API（本專案沒有）、既有 localStorage 訂單資料遷移、依商品分類篩選的 UI、`preorder-orders` spec capability 目錄改名、5 階段出貨狀態流程或 `isPaid` 邏輯的任何變更。

## Risks / Trade-offs

- [Risk] 既有已持久化的訂單在此變更後會殘留無作用的 `isConsolidated` 鍵，且缺少 `productCategories`/`isPreorder` 欄位，卡片會顯示 0 個分類標籤、`isPreorder` 視為未定義（falsy）直到使用者編輯該筆訂單 → Mitigation：依 Non-Goals 不做遷移；`isPreorder` 未定義時預設視為 `false`（不顯示標籤），`productCategories` 未定義時視為空陣列（不顯示任何標籤），兩者都不會拋出錯誤
- [Risk] 移除三個側邊欄分類路由後，被歸類為 preorder/merch/manga 的舊訂單可能讓使用者誤以為資料遺失 → Mitigation：`AllOrders.vue`（全部訂單）持續無過濾地列出這些訂單，符合提案中明確的範圍決定
- [Risk] 自訂多選下拉元件（點外部關閉、Escape 關閉）比原生 `<select>` 有更多邊角案例（例如焦點管理、與其他彈出層同時開啟時的互動）→ Mitigation：開關邏輯直接比照 `src/components/ui/Modal.vue` 既有且已在生產環境驗證過的模式實作，降低風險

## Migration Plan

不適用——範圍內不含任何持久化資料遷移（見 Non-Goals）。部署方式為一般前端版本發布；由於這是純前端 SPA，既有的本機持久化狀態在缺少新欄位時會優雅降級（見 Risks），回滾方式即為還原此次的 commit，不需要額外的資料回滾步驟。

## Open Questions

無——所有決策已在 discuss 模式與使用者確認完畢。
