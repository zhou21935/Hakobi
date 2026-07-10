## Context

`src/stores/orders.js` 的 `STATUSES` 目前只有 4 個貨物物流狀態（`CONSOLIDATING`、`IN_TRANSIT`、`ARRIVED`、`COMPLETED`），先前的 change 移除了 `AWAITING_SHIPMENT`（待出貨）。`src/components/orders/OrderFormModal.vue` 目前用單一 `grid grid-cols-1 sm:grid-cols-2 gap-4` 包住全部 12 個表單欄位，欄位不分組。`src/components/ui/Modal.vue` 是共用的彈窗元件，目前 header 用 `border-b`、footer 用 `border-t` 分隔線，容器沒有 `max-height` 限制也沒有內容捲動機制，外層遮罩用 `items-center` 置中但只有左右 `px-4`、沒有上下 padding。`Modal` 被 `OrderFormModal.vue`（表單，內容長）、`OrderList.vue`/`AllOrders.vue`（刪除確認，內容短）、`UiShowcase.vue`（元件展示範例）共用。

「送往集運倉」欄位目前用 `Select`（`consolidatedOptions`：是/否），送出時把字串 `'true'/'false'` 轉成布林值寫入 `isConsolidated`；底層資料欄位本來就是布林值，只是表單呈現用字串。

## Goals / Non-Goals

**Goals:**

- `STATUSES` 補回 `AWAITING_SHIPMENT`（待出貨），並排在最前面：待出貨 → 集運中 → 運送中 → 已抵台 → 已完成
- 新訂單預設狀態由 `CONSOLIDATING` 改回 `AWAITING_SHIPMENT`
- `OrderFormModal.vue` 版面改為逐列自訂欄數，而非單一均分 2 欄的 grid
- 「送往集運倉」從 `Select` 改為 `Checkbox`，label 簡化為「送往集運倉」
- `Modal.vue` 移除 header/footer 分隔線、加入 `max-height` + 內容捲動、外層遮罩加上下 padding

**Non-Goals:**

- 不修改 `Dashboard.vue` 的統計卡片內容（目前顯示集運中/運送中/已完成，不因新增待出貨而調整，維持 3 張卡片不變）
- 不修改 `StatusFilterTabs.vue`、`StatusBadge.vue`、`OrderCard.vue` 的程式碼——兩者皆動態讀取 `STATUSES`，會自動反映新增的待出貨狀態
- 不新增 Modal 的 `size`/`maxHeight` 客製化 prop——所有 Modal 使用同一組固定的 `max-height` 與間距設定，不做每個呼叫端各自客製
- 不調整刪除確認彈窗（`OrderList.vue`/`AllOrders.vue`）或 `UiShowcase.vue` 展示彈窗的內容本身，只受 `Modal.vue` 共用樣式調整影響

## Decisions

### STATUSES 補回待出貨並排在最前面

在 `STATUSES` 物件字面量中，於 `CONSOLIDATING` 之前新增 `AWAITING_SHIPMENT: { label: '待出貨' }`，讓 `Object.keys(STATUSES)` 的迭代順序（JS 物件對字串 key 保留插入順序）自然反映「待出貨 → 集運中 → 運送中 → 已抵台 → 已完成」的順序，`StatusFilterTabs`、`OrderFormModal` 的下拉選單都直接依此順序渲染，不需要額外排序邏輯。

替代方案：把 `AWAITING_SHIPMENT` 加在陣列最後、另外用一個顯示順序陣列排序。否決原因：現有程式碼完全依賴物件 key 插入順序做迭代，額外维护一份排序陣列是不必要的複雜度。

### 訂單編輯彈窗改為逐列自訂欄數的 grid 版面

`OrderFormModal.vue` 的欄位不再包在單一 `grid grid-cols-1 sm:grid-cols-2 gap-4` 裡，改成每一列各自一個 `div`，依內容數量套用對應的 grid 欄數：
- 商品名稱/購買平台：`grid grid-cols-1 sm:grid-cols-2 gap-4`
- 商品連結：不用 grid，單一欄位佔滿寬度
- 金額/幣別/已付款：`grid grid-cols-1 sm:grid-cols-3 gap-4`
- 下單日期/貨物狀態/送往集運倉：`grid grid-cols-1 sm:grid-cols-3 gap-4`
- 預計出貨日期/預計到貨日期：`grid grid-cols-1 sm:grid-cols-2 gap-4`
- 備註：不用 grid，單一欄位佔滿寬度

各列之間用 `space-y-4`（外層容器）維持垂直間距，取代原本 grid 的 `gap-4` 垂直間距角色。

替代方案：維持單一 grid，用 `sm:col-span-2`/`sm:col-span-3` 之類的欄位跨欄控制版面。否決原因：3 欄與 2 欄混合在同一個 grid 容器裡，欄寬計算會互相影響（3 欄那幾列的每欄寬度和 2 欄列不一致），視覺上金額/幣別的寬度會跟商品名稱/購買平台對不齊；逐列拆開各自控制欄數，才能讓每一列依照自己的內容數量取得一致的欄寬比例。

### 送往集運倉從 Select 改為 Checkbox，資料型別直接用布林值

`isConsolidated` 表單欄位直接綁定布林值（透過新的 `Checkbox` 元件），拿掉原本 `Select` 用字串 `'true'/'false'` 表示、送出時再轉型的中介邏輯。`emptyForm`/`resetForm`/`handleSubmit` 對應調整為直接讀寫布林值。

替代方案：維持 `Select`，只是把選項文字改成勾選圖示。否決原因：使用者已在討論階段明確選擇 Checkbox 呈現方式，且拿掉字串轉型邏輯本身就是程式碼簡化。

### Modal 加入 max-height 與內容捲動、移除邊框線、外層加上下 padding

`Modal.vue` 的最外層遮罩容器（`fixed inset-0 ... px-4`）加上 `py-8` 提供上下留白；彈窗容器本身加上 `max-h-[85vh]` 與 `flex flex-col`；header、footer 各自加 `shrink-0`（維持固定不隨內容捲動），並移除 header 的 `border-b`、footer 的 `border-t`；中間內容區（原本 `<slot />` 所在的 `div`）改為 `flex-1 overflow-y-auto`，讓內容過長時只有中間區塊可以用滾輪捲動，header/footer 固定可見。

替代方案：只加 `max-height` 不做 flex-col + overflow-y-auto 分區，讓整個彈窗（含 header/footer）一起捲動。否決原因：使用者明確要求「header/footer 固定、只有中間內容可以捲動」的行為（下單日期以上與取消/送出按鈕都應該一直可見），單純限制整體高度做不到這點。

## Implementation Contract

**行為（Behavior）：**
- 訂單編輯彈窗中「貨物狀態」下拉選單顯示 5 個選項，由上到下依序為：待出貨、集運中、運送中、已抵台、已完成
- 新增訂單且未指定狀態時，訂單預設狀態為「待出貨」
- 訂單編輯彈窗版面由上到下依序為：商品名稱/購買平台同一列、商品連結獨立一列、金額/幣別/已付款同一列、下單日期/貨物狀態/送往集運倉同一列、預計出貨日期/預計到貨日期同一列、備註獨立一列
- 「送往集運倉」呈現為勾選欄位，勾選後送出的訂單資料 `isConsolidated` 為 `true`
- 所有透過 `Modal` 元件呈現的彈窗（訂單編輯、刪除確認、UI 元件展示）的 header 與 footer 不再顯示分隔線
- 內容高度超過彈窗可視高度時（例如訂單編輯彈窗），只有中間內容區塊可以用滑鼠滾輪捲動，header 與 footer 固定不隨之捲動
- 彈窗與瀏覽器視窗的上下邊緣之間有可見的留白間距，不貼齊頂部或底部

**介面 / 資料形狀：**
- `src/stores/orders.js` 匯出的 `STATUSES` 物件新增 key `AWAITING_SHIPMENT`（value 為 `{ label: '待出貨' }`），插入順序排在 `CONSOLIDATING` 之前
- `addOrder` 的預設 `status` 由 `'CONSOLIDATING'` 改為 `'AWAITING_SHIPMENT'`
- `OrderFormModal.vue` 表單資料 `form.isConsolidated` 型別由字串（`'true'`/`'false'`）改為布林值（`true`/`false`），`emptyForm()` 預設值改為 `false`
- `Modal.vue` 對外的 props（`modelValue`、`title`）與 emits（`update:modelValue`、`close`）不變，僅內部樣式與版面調整

**失敗模式：**
- 既有 localStorage 訂單資料若 `status` 為已被上一版移除的舊值（例如殘留的 `DEPOSIT_PAID`），行為與前一個 change 相同：`StatusBadge` fallback 顯示原始字串，不特別處理，不在本次範圍內修正

**驗收條件：**
- 於瀏覽器開啟「新增訂單」彈窗，確認「貨物狀態」下拉選單依序顯示 5 個選項，且新訂單預設狀態為「待出貨」
- 於瀏覽器開啟編輯彈窗，確認版面列排列與 Implementation Contract 描述一致
- 於瀏覽器勾選「送往集運倉」並送出，重新開啟同一筆訂單確認勾選狀態被正確保留
- 於瀏覽器將視窗縮小高度或開啟訂單編輯彈窗，確認 header（標題列）與 footer（取消/送出按鈕列）不再有分隔線，且中間內容可用滾輪捲動、header/footer 固定不動
- 於瀏覽器確認彈窗與視窗上下邊緣之間有留白，不貼齊頂部
- `npm run build` 成功無編譯錯誤

**範圍界線：**
- 範圍內：`src/stores/orders.js`（STATUSES 定義與預設狀態）、`src/components/orders/OrderFormModal.vue`（版面與送往集運倉欄位）、`src/components/ui/Modal.vue`（間距、捲動、邊框）
- 範圍外：`Dashboard.vue`、`StatusFilterTabs.vue`、`StatusBadge.vue`、`OrderCard.vue`、刪除確認彈窗與 `UiShowcase.vue` 的彈窗內容本身（僅因 Modal 共用樣式調整而間接受影響，不需修改程式碼）

## Risks / Trade-offs

- [Risk] `Modal.vue` 是共用元件，樣式調整會影響所有現有使用處（刪除確認彈窗、UiShowcase 展示彈窗），若這些短內容彈窗因為 `max-h-[85vh]` 或 `flex flex-col` 產生非預期的視覺變化 → Mitigation：刪除確認彈窗與展示彈窗內容都遠短於 85vh，不會觸發捲動；`flex flex-col` 對短內容彈窗只是让 header/footer/content 三段依序排列，視覺上與原本一致
- [Risk] 待出貨狀態重新加入後，舊有已標記為集運中/運送中/已抵台/已完成的本地測試訂單不會自動變回待出貨（屬預期行為，非資料錯誤）→ Mitigation：不需要處理，這是本地開發假資料
