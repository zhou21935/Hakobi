## 1. 資料層調整(orders.js)

- [x] 1.1 依設計決策「STATUSES 改為 8 階段,不保留舊狀態鍵值」與「stats.byStatus 改為依 STATUSES 動態產生,不再逐一寫死」修改 `src/stores/orders.js`:將 `STATUSES` 替換為 `PENDING_PAYMENT`/`DEPOSIT_PAID`/`PAID`/`AWAITING_SHIPMENT`/`CONSOLIDATING`/`IN_TRANSIT`/`ARRIVED`/`COMPLETED` 八個鍵值(僅保留 `label`,移除 `color`),`addOrder` 預設 `status` 改為 `PENDING_PAYMENT`,`stats.byStatus` 改用迴圈依 `Object.keys(STATUSES)` 動態計數,實現規格「Orders progress through an 8-stage status lifecycle」;手動驗證:於瀏覽器主控台建立測試訂單並依序切換八種狀態,`stats.byStatus` 對應鍵值的數字正確增減,`npm run build` 無因舊狀態鍵值字面量殘留導致的執行期錯誤。
- [x] 1.2 依設計決策「orders.js 新增欄位與拆分日期欄位」修改 `src/stores/orders.js` 的 `addOrder`:新增 `productUrl`(預設 `''`)、`orderDate`(預設 `null`)、`isConsolidated`(預設 `false`),移除 `estimatedArrival` 並新增 `estimatedShipDate`、`estimatedArrivalDate`(皆預設 `null`),實現規格「Orders can be flagged as sent to a consolidation warehouse」;手動驗證:呼叫 `addOrder` 不帶這些欄位時,新訂單物件的 `isConsolidated` 為 `false`、日期欄位為 `null`,帶入這些欄位時能正確覆蓋預設值。

## 2. 基礎元件:Select

- [x] 2.1 依設計決策「新增 Select 基礎元件,行為對齊 Input 的 v-model 慣例」建立 `src/components/ui/Select.vue`:props `modelValue`、`options`(必要,`{ value, label }` 陣列)、`label`、`placeholder`、`disabled`(預設 `false`),透過 `update:modelValue` 支援 v-model,樣式沿用 `Input.vue` 的邊框/圓角/focus 色系,實現規格「Select component supports v-model binding over a fixed option list」;手動驗證:於 `/ui-showcase` 新增一個 Select 範例,選擇不同選項時綁定值正確更新,`disabled` 時無法互動且無 `update:modelValue` 觸發。

## 3. 預購商品業務元件

- [x] 3.1 依設計決策「OrderFormModal 統一處理新增與編輯」建立 `src/components/orders/OrderFormModal.vue`:props `modelValue`(Modal 開關)、`order`(`null` 為新增模式,物件為編輯模式),內部用 `Modal` + `Input`/`Select` 組成表單(商品名稱、購買平台、商品連結、金額、幣別、訂金、下單日期、預計出貨日期、預計到貨日期、是否送往集運倉、狀態、備註),商品名稱為空或金額非正數時用 `Input` 的 `error` prop 顯示錯誤並阻止送出,送出時 emit `submit`,實現規格「User can create a preorder order with required field validation」「User can edit an existing order using the same form」「Orders record an amount in one of four supported currencies without conversion」;手動驗證:不填商品名稱或金額為 0 時送出會看到錯誤訊息且不觸發 `submit`,填妥必填欄位後送出會觸發帶正確資料的 `submit` 事件,帶入既有訂單物件時表單正確預填。
- [x] 3.2 依設計決策「OrderCard 呈現單筆訂單,刪除需要二次確認」建立 `src/components/orders/OrderCard.vue`:props `order`(必要),顯示商品名稱、購買平台、依幣別加上符號前綴(TWD→NT$、USD→$、KRW→₩、JPY→¥)的金額、`StatusBadge`、預計出貨日期,並提供圓形編輯/刪除圖示按鈕,點擊編輯 emit `edit`,點擊刪除 emit `request-delete`(不直接刪除);手動驗證:金額依四種幣別分別顯示正確符號,點擊編輯/刪除各自觸發對應事件並帶出正確 payload。
- [x] 3.3 依設計決策「StatusFilterTabs 呈現全部與八個狀態的篩選 tab 與數量」建立 `src/components/orders/StatusFilterTabs.vue`:props `counts`、`modelValue`,依 `STATUSES` 順序渲染「全部」加八個狀態 pill 並顯示數量,選中項用主色漸層樣式,點擊 emit `update:modelValue`,實現規格「Status filter tabs show per-status counts and filter the order list」;手動驗證:比對三筆分屬 `PENDING_PAYMENT`/`CONSOLIDATING`/`COMPLETED` 各一筆的測試資料,全部 tab 顯示 3、這三個狀態 tab 各顯示 1、其餘狀態 tab 顯示 0,點擊任一 tab 會觸發 `update:modelValue` 帶出對應狀態鍵值。

## 4. 頁面整合

- [x] 4.1 重寫 `src/views/OrderList.vue`:組合 `StatusFilterTabs`(依目前選中狀態篩選 `getFiltered({ category: 'preorder', status })` 的結果)、`OrderCard` 列表、「新增訂單」按鈕觸發 `OrderFormModal`(新增模式)、`OrderCard` 的 edit 事件觸發 `OrderFormModal`(編輯模式)、`request-delete` 事件開啟一個共用的確認 `Modal`,確認後呼叫 `deleteOrder`,實現規格「User must confirm before an order is deleted」;手動驗證:新增訂單後立即出現在列表與對應狀態 tab 數量中,編輯後列表即時反映,點擊刪除先看到確認彈窗、確認後訂單消失、取消則訂單保留。
- [x] 4.2 依設計決策「Dashboard 統計沿用 orders.js 既有的全域 stats,不限定分類」重寫 `src/views/Dashboard.vue`:顯示 `stats.total` 訂單總數,以及待出貨(`AWAITING_SHIPMENT`)、集運中(`CONSOLIDATING`)、已完成(`COMPLETED`)三張數量統計卡,實現規格「Dashboard shows order count summaries」;手動驗證:新增/刪除訂單或變更狀態後,Dashboard 三個數字與 `OrderList` 篩選 tab 上對應狀態的數字保持一致。
- [x] 4.3 依設計決策「AllOrders 新增獨立路由,不與 /orders/:category 衝突」建立 `src/views/AllOrders.vue` 並在 `src/router/index.js` 新增對應路由:`AllOrders.vue` 用 `getFiltered({ status })`(不帶 category)取得全分類訂單,UI 結構與 `OrderList.vue` 相同但不顯示新增訂單按鈕,實現規格「All-orders view lists orders across every category」;手動驗證:進入全部訂單頁能看到預購商品分類的訂單資料,狀態篩選功能正常運作。

## 5. 中文化與展示頁更新

- [x] 5.1 依設計決策「側邊欄與分類名稱中文化,不改變底層分類鍵值」修改 `src/components/AppSidebar.vue`(新增分類中文對照表、Dashboard 項目文字改「總覽」、副標題改「訂單管理」、新增「全部訂單」導覽項目)、`src/views/Dashboard.vue`、`src/views/OrderList.vue`、`src/router/index.js` 的頁面標題設定,將所有殘留英文使用者可見文字改為繁體中文(路由參數與 `CATEGORIES` 鍵值不變);手動驗證:瀏覽全站頁面與側邊欄,不再出現任何英文分類名稱或英文頁面標題,瀏覽器分頁標題也顯示繁體中文。
- [x] 5.2 更新 `src/views/UiShowcase.vue`:Table 範例的假資料狀態值改用新 `STATUSES` 鍵值(移除 `PENDING`/`PROCESSING`/`SHIPPED` 等舊鍵值),新增一個 `Select` 元件的展示範例;手動驗證:`/ui-showcase` 頁面正常渲染,狀態欄位正確顯示新狀態標籤且無 prop 驗證警告,`npm run build` 通過。
