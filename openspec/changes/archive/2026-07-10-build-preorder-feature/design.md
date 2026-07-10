## Context

Hakobi 是 Vue 3 + Pinia + Vue Router + Tailwind 4 的訂單管理系統。`src/stores/orders.js` 已有完整的 CRUD、篩選、統計 computed,`CATEGORIES` 五個分類(preorder/agent/parcel/merch/manga)與現有 5 種 `STATUSES` 皆已定義,但沒有任何頁面實際使用這些邏輯 —— `Dashboard.vue`、`OrderList.vue` 都只是空殼標題。經過 `add-ui-components` 與 `restyle-warm-purple-theme` 兩個變更,五個基礎元件(`Button`/`Card`/`Input`/`Table`/`Modal`)、`StatusBadge`、暖色系 design tokens(色彩/字體/圓角/陰影)都已就緒。這次要把「預購商品」分類做成第一個完整可用的功能。

## Goals / Non-Goals

**Goals:**

- 使用者可以在「預購商品」分類頁新增、編輯、刪除訂單,並透過狀態篩選 tab 快速查看各階段數量
- Dashboard 顯示預購商品總數與三個重點狀態(待出貨/集運中/已完成)的數量統計
- 訂單資料涵蓋海外購物情境所需欄位:商品連結、下單日期、集運倉標記、多幣別金額、拆分後的預計出貨/到貨日期
- 側邊欄與頁面文字全面繁體中文化

**Non-Goals:**

- 不做圖片欄位(專案是純前端 + localStorage 持久化,沒有後端可存檔案,base64 存 localStorage 容量很快會爆掉)
- 不做海外代購/集運包裹/追星周邊/漫畫小說四個分類的真實頁面內容,這四個分類的 `OrderList.vue` 沿用同一支元件但目前不會有資料
- 不做匯率換算,不做金額跨幣別加總
- 不做登入/會員、金流串接、物流串接、自動通知
- 不做圖示套件安裝,新元件的圖示延續現有 emoji 風格

## Decisions

### STATUSES 改為 8 階段,不保留舊狀態鍵值

`orders.js` 的 `STATUSES` 從 `PENDING`/`PROCESSING`/`SHIPPED`/`DELIVERED`/`CANCELLED` 整個替換為八個新鍵值:`PENDING_PAYMENT`(待付款)、`DEPOSIT_PAID`(已付訂金)、`PAID`(已付款)、`AWAITING_SHIPMENT`(待出貨)、`CONSOLIDATING`(集運中)、`IN_TRANSIT`(運送中)、`ARRIVED`(已抵台)、`COMPLETED`(已完成),每個值只保留 `label` 欄位。

不保留 `color` 欄位(`restyle-warm-purple-theme` 已經讓 `StatusBadge.vue` 改用固定樣式,不再讀取每個狀態各自的顏色,`color` 欄位已是死資料)。`addOrder` 的預設 `status` 從 `PENDING` 改為 `PENDING_PAYMENT`。

理由:8 階段是海外購物/集運情境的實際流程,取代通用電商狀態;移除 `color` 欄位避免留下沒人讀取的死資料。這是 **BREAKING** 變更 —— 任何硬編碼舊狀態鍵值的地方(`UiShowcase.vue` 展示資料)都要同步更新。

### orders.js 新增欄位與拆分日期欄位

`addOrder` 新增三個欄位:商品連結欄位(String,預設空字串)、下單日期欄位(String ISO 日期或 null,預設 null)、是否送往集運倉欄位(Boolean,預設 false)。移除原本的到貨日期欄位,拆成預計出貨日期與預計到貨日期兩個欄位(皆為 String ISO 日期或 null,預設 null)。`updateOrder` 不需要改動(已用物件展開合併,新欄位自動相容)。

理由:對應提案裡列出的欄位需求;日期拆分讓「出貨」與「到貨」兩個時間點可以分開追蹤與顯示。

### stats.byStatus 改為依 STATUSES 動態產生,不再逐一寫死

`orders.js` 的 `stats` computed 裡的 `byStatus` 改用迴圈依目前 `STATUSES` 的鍵值動態計數,取代原本逐行寫死 5 個狀態鍵的方式。

理由:狀態表這次已經改過一次,動態產生可以避免下次調整狀態時又要手動同步 `stats.byStatus` 的 key 列表,兩處定義容易對不上。

### 新增 Select 基礎元件,行為對齊 Input 的 v-model 慣例

`Select.vue` 提供 modelValue、options(必要,元素為 value/label 物件)、label(選用)、placeholder(選用)、disabled(預設 false)四個 props,透過 update:modelValue 支援 v-model。視覺上沿用 `Input.vue` 的邊框/圓角/focus 樣式,維持元件間一致性。

理由:幣別(TWD/USD/KRW/JPY)與狀態選擇都是固定選項,原生下拉選單搭配一致樣式比自由輸入更安全(避免打錯值),且沿用 `Input.vue` 的 API 慣例(v-model + label + disabled)讓使用者不用學新的介面模式。

### OrderFormModal 統一處理新增與編輯

新增 `src/components/orders/OrderFormModal.vue`,props:modelValue(控制 Modal 開關)、order(null 代表新增模式,帶入既有訂單物件代表編輯模式)。內部用 Modal 搭配多個 Input/Select 組成表單,欄位對應:商品名稱(必填)、購買平台、商品連結、金額(必填且需為正數)、幣別(下拉選單:TWD/USD/KRW/JPY,預設 TWD)、訂金(選填)、下單日期、預計出貨日期、預計到貨日期、是否送往集運倉(用下拉選單呈現是/否兩個選項,而非額外做 checkbox 元件)、狀態(下拉選單,選項來自 STATUSES,新增模式預設待付款)、備註。表單驗證:商品名稱為空或金額不是正數時,對應欄位透過 Input 的 error prop 顯示錯誤文字,並阻止送出。送出時 emit submit,帶出整理好的訂單資料物件;由呼叫端(OrderList.vue)決定呼叫 addOrder 或 updateOrder。

理由:新增與編輯共用同一個表單結構,避免維護兩份重複的欄位配置;驗證放在表單元件內部,呼叫端不用重複檢查。集運倉標記用下拉選單而非新增 Checkbox/Toggle 元件,降低這次需要新增的基礎元件數量。

### OrderCard 呈現單筆訂單,刪除需要二次確認

新增 `src/components/orders/OrderCard.vue`,props:order(必要)。顯示商品名稱、購買平台、金額(依幣別加上對應符號前綴:TWD 對應 NT$、USD 對應 錢字符號、KRW 對應 韓元符號、JPY 對應 日圓符號)、StatusBadge、預計出貨日期;右側提供編輯與刪除兩個圓形圖示按鈕(編輯用鉛筆圖示、刪除用垃圾桶圖示)。點擊編輯 emit edit(帶出 order);點擊刪除 emit request-delete(帶出 order 的 id),不直接刪除——由 OrderList.vue/AllOrders.vue 統一用一個共用的確認 Modal 二次確認後才真正呼叫 deleteOrder。

理由:刪除是不可逆操作,單擊立即刪除容易誤觸;用共用的一個確認 Modal 而非每張卡片各自掛一個 Modal 實例,避免同時掛載大量未使用的 Modal DOM 節點。

### StatusFilterTabs 呈現全部與八個狀態的篩選 tab 與數量

新增 `src/components/orders/StatusFilterTabs.vue`,props:counts(物件,鍵為狀態鍵值或代表全部的鍵,值為數量)、modelValue(目前選中的狀態鍵值,null 代表「全部」)。依 STATUSES 的鍵值順序渲染「全部」加八個狀態 pill,每個 pill 顯示中文標籤與數量徽章,選中的 pill 用主色漸層底色,其餘用邊框樣式;點擊 emit update:modelValue。

理由:OrderList.vue(預購商品)與 AllOrders.vue(全部訂單)都需要同樣的篩選 tab UI,獨立成元件避免重複程式碼。

### Dashboard 統計沿用 orders.js 既有的全域 stats,不限定分類

Dashboard.vue 直接使用 orders store 的 stats(涵蓋所有分類,不特別篩選分類為預購商品),顯示訂單總數與三張重點狀態卡:待出貨、集運中、已完成,數字對應 stats.byStatus 裡各自的鍵值。

理由:使用者最初的需求是「首頁提供簡易統計資訊,一開啟網站即可掌握目前所有訂單狀況」,概念上 Dashboard 本來就該是全站總覽,不是預購商品專屬頁面;目前只有預購商品分類有真實資料,這樣設計不需要在其他分類做完後回頭改 Dashboard 的邏輯。

### AllOrders 新增獨立路由,不與 /orders/:category 衝突

router/index.js 新增一個新的靜態路徑路由(對應「全部訂單」頁面),與既有的 /orders/:category 動態路由是不同的路徑形式,Vue Router 可以正確區分。AllOrders.vue 使用 store 的 getFiltered 方法(只帶 status 條件,不帶 category)取得全分類訂單,UI 結構與 OrderList.vue 相同(StatusFilterTabs 加 OrderCard 列表),但不顯示「新增訂單」按鈕(全部訂單頁不綁定特定分類,新增訂單需要先選分類,這次僅預購商品有真實新增入口)。AppSidebar.vue 在分類清單下方新增「全部訂單」導覽項目連到這個新路由。

理由:靜態路徑與動態參數路徑不衝突,不需要額外的路由守衛邏輯。

### 側邊欄與分類名稱中文化,不改變底層分類鍵值

AppSidebar.vue 新增一個分類鍵值對應中文顯示名稱的對照表(preorder 對應預購商品、agent 對應海外代購、parcel 對應集運包裹、merch 對應追星周邊、manga 對應漫畫小說),導覽連結的路由參數維持英文小寫鍵值不變,只有畫面顯示文字改用對照表查出的中文。Dashboard 導覽項目文字改為「總覽」,側邊欄副標題改為「訂單管理」。Dashboard.vue/OrderList.vue 的頁面標題與說明文字、router/index.js 的頁面標題設定,一併改為繁體中文或維持 Hakobi 品牌名(不翻譯品牌名本身)。

理由:路由與資料層的英文鍵值是程式內部識別碼,不需要跟著中文化,只有「使用者看到的文字」需要改;這樣改動範圍最小,不影響既有的篩選邏輯。

## Implementation Contract

**行為(Behavior)**:
- 使用者在「預購商品」分類頁點擊「新增訂單」,OrderFormModal 開啟(新增模式,狀態預設待付款),填寫商品名稱與金額(必填)後送出,新訂單出現在列表與對應的狀態篩選 tab 數量中
- 點擊某張訂單卡片的編輯圖示,OrderFormModal 開啟並帶入該筆資料(編輯模式),送出後該筆訂單資料更新,列表即時反映
- 點擊某張訂單卡片的刪除圖示,先彈出確認 Modal,確認後該筆訂單從列表與統計中消失;取消則保留原狀
- 點擊狀態篩選 tab,列表只顯示對應狀態的訂單,tab 上的數量即時反映目前資料
- 進入 Dashboard,看到預購商品訂單總數,以及待出貨/集運中/已完成三個數量卡片,數字與實際訂單資料一致
- 進入「全部訂單」頁,看到所有分類的訂單(目前等同預購商品的資料),同樣可用狀態篩選
- 側邊欄與各頁面標題、分類名稱皆顯示繁體中文,不再出現英文分類名稱或英文頁面標題

**介面 / 資料形狀(Interface / data shape)**:
- STATUSES 鍵值:PENDING_PAYMENT、DEPOSIT_PAID、PAID、AWAITING_SHIPMENT、CONSOLIDATING、IN_TRANSIT、ARRIVED、COMPLETED,每個值只有 label 欄位
- 訂單物件新增/變更欄位:商品連結欄位、下單日期欄位、是否送往集運倉欄位、預計出貨日期欄位、預計到貨日期欄位(取代原本的到貨日期欄位)
- Select.vue:props modelValue、options(必要,value/label 陣列)、label、placeholder、disabled;emit update:modelValue
- OrderFormModal.vue:props modelValue(布林)、order(物件或 null);emit update:modelValue、submit(payload 為整理好的訂單欄位物件)
- OrderCard.vue:props order(必要);emit edit(payload 為 order)、request-delete(payload 為 order 的 id)
- StatusFilterTabs.vue:props counts、modelValue(字串或 null);emit update:modelValue

**失敗模式(Failure modes)**:
- OrderFormModal 送出時若商品名稱為空或金額非正數,阻止送出並在對應欄位顯示錯誤文字,不呼叫 addOrder/updateOrder
- 刪除訂單一律要先經過確認 Modal,沒有「一鍵刪除且無法復原」的路徑
- stats.byStatus 對於資料庫中不存在於目前 STATUSES 的舊狀態值不做特殊相容處理(這次會整批替換,沒有既有真實資料需要遷移)

**驗收標準(Acceptance criteria)**:
- npm run dev 啟動後,側邊欄與所有頁面文字皆為繁體中文,無殘留英文分類名稱或頁面標題
- 在「預購商品」頁新增一筆訂單,填寫商品名稱與金額後送出,列表與 Dashboard 數字同步更新;不填商品名稱送出會看到錯誤訊息且訂單不會被建立
- 編輯既有訂單並更改狀態,對應的狀態篩選 tab 數量正確增減
- 刪除訂單需要先確認,確認後才消失
- Dashboard 的「待出貨」「集運中」「已完成」三個數字與 OrderList 篩選 tab 上對應狀態的數字一致
- 全部訂單頁顯示與「預購商品」頁相同的資料(因為目前只有這個分類有資料)
- 瀏覽器 console 無錯誤

**範圍邊界(Scope boundaries)**:
- 範圍內:orders.js 資料模型調整、Select/OrderFormModal/OrderCard/StatusFilterTabs 四個新元件、Dashboard.vue/OrderList.vue/AllOrders.vue/AppSidebar.vue/router/index.js/UiShowcase.vue 的對應調整、全站文字中文化
- 範圍外:海外代購/集運包裹/追星周邊/漫畫小說四個分類的真實資料與頁面內容;圖片欄位;匯率換算;登入/金流/物流/通知串接

## Risks / Trade-offs

- [風險] STATUSES 鍵值整批替換屬於 BREAKING 變更,若之後有任何硬編碼舊鍵值的地方沒改到,StatusBadge 的 prop validator 會擋下渲染 → [緩解] tasks 會明確列出 UiShowcase.vue 需要同步更新展示資料,建置流程(npm run build)也能提早抓到殘留的舊鍵值字面量
- [風險] Select.vue 用原生下拉選單,樣式客製化程度不如自製下拉選單(如無法輕易加搜尋/多選)→ [緩解] 目前的選項數量都很少(幣別 4 個、狀態 8 個、是否集運倉 2 個),原生下拉選單已足夠,不需要更複雜的元件
- [風險] OrderCard 用 emoji 當編輯/刪除圖示,不同作業系統/瀏覽器的 emoji 字體渲染略有差異 → [緩解] 這符合專案目前「不引入圖示套件」的既定方向,視覺差異不影響功能操作
