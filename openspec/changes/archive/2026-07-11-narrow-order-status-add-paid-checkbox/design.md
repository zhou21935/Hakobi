## Context

訂單資料模型與表單目前把「付款進度」與「物流階段」混合在單一 `status` 欄位（`STATUSES`，共 8 個值），定義於 `src/stores/orders.js`。`STATUSES` 同時驅動四處 UI：`OrderFormModal.vue` 的「狀態」下拉選單、`StatusFilterTabs.vue`（直接用 `Object.keys(STATUSES)` 產生篩選頁籤）、`StatusBadge.vue`（依 `status` 顯示標籤文字）、`Dashboard.vue`（`statTiles` 硬編碼讀取 `stats.byStatus.AWAITING_SHIPMENT`、`CONSOLIDATING`、`COMPLETED` 三個狀態的訂單數量）。另有 `depositPaid`（訂金金額，數字）與 `balanceDue`（未付餘額，數字）兩個欄位定義於 store，但除了 `OrderFormModal.vue` 的表單輸入外，沒有任何元件顯示或加總這兩個值。

資料儲存透過 `pinia-plugin-persistedstate` 存在瀏覽器 localStorage，屬本地開發假資料，沒有正式後端或多使用者同步機制。

`src/components/ui/` 目前有 6 個共用元件（Button、Card、Input、Table、Modal、Select），對應 `ui-components` spec，皆套用專案的暖紫色 design tokens（`primary-from`/`primary-to`、`card`、`badge-status-*` 等，定義於 Tailwind theme）。

## Goals / Non-Goals

**Goals:**

- 將 `STATUSES` 窄化為 4 個貨物物流狀態：`CONSOLIDATING`（集運中）、`IN_TRANSIT`（運送中）、`ARRIVED`（已抵台）、`COMPLETED`（已完成）
- 新增獨立的布林欄位 `isPaid` 表示「是否已付款」，取代 `depositPaid` 的欄位角色
- 新增可重複使用的 `Checkbox.vue` 元件，套用既有 design tokens，供 `OrderFormModal.vue` 使用
- 訂單編輯彈窗「訂金」輸入改為 `Checkbox` 勾選欄位（label「已付款」），「狀態」下拉選單 label 改為「貨物狀態」
- 修正 `Dashboard.vue` 因狀態窄化而失效的統計卡片：原本讀取已被移除的 `AWAITING_SHIPMENT`（待出貨）狀態計數，改為讀取 `IN_TRANSIT`（運送中），三張卡片變成「集運中、運送中、已完成」

**Non-Goals:**

- 不處理既有 localStorage 假資料的遷移邏輯——舊 `status` 值若已不在新的 4 個狀態之列，維持原樣顯示（`StatusBadge` 會 fallback 顯示原始字串），不寫轉換程式碼
- 不移除或改動 `balanceDue` 欄位——雖然目前未被使用，但不在本次需求範圍內，避免無關的程式碼清理
- 不在 `OrderCard.vue`（訂單卡片）新增「已付款」的視覺指示——需求只要求編輯彈窗欄位調整，卡片顯示不在範圍內
- 不新增後端或跨裝置資料同步機制
- `Checkbox.vue` 不支援 indeterminate（不確定）狀態，僅支援單純的 checked/unchecked 布林值，因為目前唯一使用情境（已付款）不需要此狀態
- 不調整 `Dashboard.vue` 以外的統計/彙總邏輯（例如不新增「已付款訂單數」這類新統計卡片）

## Decisions

### 狀態欄位窄化為貨物物流狀態，付款狀態改用獨立布林欄位

移除 `PENDING_PAYMENT`、`DEPOSIT_PAID`、`PAID`、`AWAITING_SHIPMENT` 這 4 個狀態值，`STATUSES` 只保留 `CONSOLIDATING`、`IN_TRANSIT`、`ARRIVED`、`COMPLETED`。理由：原本 8 個狀態值混合了兩個獨立維度（付款進度、物流階段），窄化後 `status` 欄位語意單一化為物流階段追蹤，付款與否改由新的 `isPaid` 布林欄位獨立表示，兩個維度互不干擾。

替代方案：保留全部 8 個狀態值，只在表單裡用一個子集合過濾顯示選項。否決原因：這樣 `STATUSES` 仍然混合兩種語意，`StatusFilterTabs` 與 `StatusBadge` 依然會顯示混合了付款與物流意義的完整清單，沒有真正解決語意混亂的問題。

### `depositPaid`（數字）欄位改為 `isPaid`（布林）欄位，而非型別轉換

新增全新的 `isPaid` 布林欄位（預設 `false`），取代 `depositPaid` 在 store 預設值與表單中的位置；不保留 `depositPaid` 欄位名稱。理由：`depositPaid` 目前完全沒有在任何顯示或加總邏輯中被使用（只在表單雙向綁定），資料型別從「金額數字」變成「是否已付款」的布林語意完全不同，沿用舊欄位名稱只會誤導未來讀程式碼的人。

替代方案：把 `depositPaid` 直接改成布林值（欄位名稱不變）。否決原因：欄位名稱 `depositPaid`（訂金已付金額）在語意上仍然暗示「金額」，跟新的「已付款/未付款」布林概念不符，容易誤導。

### 新增共用 `Checkbox.vue` 元件而非內嵌原生 checkbox

在 `src/components/ui/Checkbox.vue` 新增元件，支援 `modelValue`/`update:modelValue` 雙向綁定與 `label` prop，套用既有 design tokens（勾選狀態使用 `primary-from`/`primary-to` 漸層，比照 `Button` primary 樣式的視覺語言）。理由：專案現有的表單欄位（`Input`、`Select`）都是走共用元件模式，統一由 `ui-components` 元件庫管理樣式與行為，避免在 `OrderFormModal.vue` 內嵌原生 `<input type="checkbox">` 造成視覺與其餘欄位不一致，且未來其餘表單有勾選需求時可直接重用。

替代方案：直接在 `OrderFormModal.vue` 內嵌原生 checkbox 加簡單樣式。否決原因：與專案既有的「所有表單欄位皆為共用元件」慣例不一致，且使用者在討論階段已明確選擇建立共用元件的方案。

### Dashboard 統計卡片以「運送中」取代已移除的「待出貨」

`Dashboard.vue` 的 `statTiles` 硬編碼讀取 `AWAITING_SHIPMENT`、`CONSOLIDATING`、`COMPLETED` 三個狀態的訂單數。由於 `AWAITING_SHIPMENT` 狀態被移除，若不修改會導致該卡片永遠顯示 0 且 label「待出貨」名不符實。改為讀取 `IN_TRANSIT`（運送中），三張卡片變成「集運中、運送中、已完成」，涵蓋新 4 狀態中除「已抵台」外的三個階段，維持原本「顯示流程中段與結束狀態」的呈現意圖。

替代方案一：新增第 4 張卡片顯示「已抵台」，總共 4 張卡片對應全部新狀態。否決原因：使用者需求未提及要調整 Dashboard 版面配置（grid 欄位數等），維持 3 張卡片、僅替換其中一張的資料來源是最小改動。
替代方案二：改顯示「已抵台」而非「運送中」。否決原因：「運送中」在物流階段上更貼近原本「待出貨」所代表的「進行中、尚未完成」語意，是比「已抵台」更自然的替代。

## Implementation Contract

**行為（Behavior）：**
- 訂單編輯彈窗（新增或編輯訂單）中，原本「訂金」數字輸入欄位不再存在，取而代之的是一個勾選欄位，label 顯示「已付款」；使用者勾選後，送出的訂單資料中 `isPaid` 為 `true`，未勾選則為 `false`
- 訂單編輯彈窗中「狀態」欄位的 label 文字顯示為「貨物狀態」；其下拉選單只列出 4 個選項：集運中、運送中、已抵台、已完成
- 新增訂單且未指定狀態時，預設狀態為 `CONSOLIDATING`（集運中）
- 側邊欄以外的 `StatusFilterTabs`（訂單列表頁的篩選頁籤）與 `StatusBadge`（訂單卡片上的狀態標籤）皆只會出現/接受這 4 個狀態值，不需要額外程式碼修改（因為兩者皆動態讀取 `STATUSES` 物件的 key）
- Dashboard（總覽頁）的三張統計卡片依序顯示「集運中」「運送中」「已完成」三個狀態的訂單數量，取代原本的「待出貨」「集運中」「已完成」

**介面 / 資料形狀：**
- `src/stores/orders.js` 匯出的 `STATUSES` 物件只保留 4 個 key：`CONSOLIDATING`、`IN_TRANSIT`、`ARRIVED`、`COMPLETED`，每個 value 維持 `{ label: string }` 形狀不變
- 訂單物件（`addOrder`/`updateOrder` 處理的資料）新增 `isPaid: boolean` 欄位，預設值 `false`；不再包含 `depositPaid` 欄位；`addOrder` 的預設 `status` 由 `'PENDING_PAYMENT'` 改為 `'CONSOLIDATING'`
- 新元件 `src/components/ui/Checkbox.vue` 對外介面：
  - Props: `modelValue: Boolean`（必填）、`label: String`（選填，預設空字串）、`disabled: Boolean`（選填，預設 `false`）
  - Emits: `update:modelValue`，payload 為勾選後的新布林值
  - 點擊已 `disabled` 的 checkbox 不得觸發 `update:modelValue`
- `src/views/Dashboard.vue` 的 `statTiles` 陣列第一個項目 key 由 `'AWAITING_SHIPMENT'`／label `'待出貨'` 改為 key `'IN_TRANSIT'`／label `'運送中'`，其餘兩張卡片（集運中、已完成）不變

**失敗模式：**
- 若既有 localStorage 訂單資料的 `status` 值不在新的 4 個 key 之中（例如殘留的舊 `DEPOSIT_PAID`），`StatusBadge.vue` 的 `statusLabel` 計算屬性會 fallback 顯示 `props.status` 原始字串（既有邏輯 `statusInfo.value?.label || props.status` 已涵蓋此情況，不需修改）；`StatusFilterTabs` 不會為這類殘留值產生篩選頁籤（因為頁籤只依新 `STATUSES` 的 4 個 key 產生），但仍可透過「全部」頁籤看到該訂單；Dashboard 的統計卡片對這類殘留狀態值也不會計數（`stats.byStatus` 仍會統計到該 key，但沒有對應卡片顯示）

**驗收條件：**
- 於瀏覽器開啟「新增訂單」與「編輯既有訂單」彈窗，確認「已付款」為勾選欄位（非數字輸入），且「貨物狀態」下拉選單僅顯示 4 個選項
- 勾選「已付款」並送出後，重新開啟同一筆訂單的編輯彈窗，確認勾選狀態被正確保留（驗證 `isPaid` 有正確寫回並讀出）
- 於 `/orders`（全部訂單）與各分類頁面，確認 `StatusFilterTabs` 篩選頁籤只顯示 4 個貨物狀態 + 「全部」
- 於 `/`（總覽頁），確認三張統計卡片 label 依序為「集運中」「運送中」「已完成」，且數值對應各狀態的訂單筆數
- 新增訂單且不特別選擇狀態時，確認訂單預設狀態為「集運中」
- `npm run build` 成功無編譯錯誤

**範圍界線：**
- 範圍內：`src/stores/orders.js`（STATUSES 定義與訂單資料欄位）、`src/components/orders/OrderFormModal.vue`（表單欄位與 label）、`src/views/Dashboard.vue`（統計卡片資料來源）、新增 `src/components/ui/Checkbox.vue`
- 範圍外：`OrderCard.vue`、`StatusFilterTabs.vue`、`StatusBadge.vue` 不需修改程式碼（行為會自動隨 `STATUSES` 窄化而改變）；既有資料遷移；`balanceDue` 欄位相關程式碼；Dashboard 版面配置調整（卡片數量、grid 結構）

## Risks / Trade-offs

- [Risk] 既有 localStorage 中殘留舊 `status` 值（如 `DEPOSIT_PAID`）的訂單，在新版本的篩選頁籤與 Dashboard 統計卡片中會「消失」（因為對應頁籤/卡片已移除，只能在「全部」頁籤看到）→ Mitigation：屬本地開發假資料，Non-Goals 已明確排除資料遷移；使用者可手動刪除或重新編輯該筆訂單設定新狀態
- [Risk] 移除 `depositPaid` 欄位屬 breaking change，若日後需要「訂金金額」這類財務數據，需要重新設計欄位 → Mitigation：目前 `depositPaid` 未被任何顯示/計算邏輯使用，移除風險低；若未來有需求，可另開新的 change 處理
