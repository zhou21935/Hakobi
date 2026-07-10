## 1. 新增 Checkbox 共用元件

- [x] 1.1 建立 `src/components/ui/Checkbox.vue`，實作「Checkbox component supports v-model binding with a label」規範的 modelValue/update:modelValue 雙向綁定與 label 顯示；驗證方式：於瀏覽器手動點擊勾選/取消勾選，確認外部綁定值同步更新
- [x] 1.2 為 `Checkbox.vue` 加入 disabled 支援並套用暖紫色 design tokens，依「新增共用 `Checkbox.vue` 元件而非內嵌原生 checkbox」設計決策確保視覺與 Button/Input 一致，disabled 時點擊不觸發 update:modelValue；驗證方式：於瀏覽器將元件 disabled 設為 true 並點擊，確認不觸發事件，且勾選狀態的視覺樣式與 Button primary 漸層一致

## 2. 調整訂單資料模型

- [x] 2.1 修改 `src/stores/orders.js` 的 `STATUSES`，依「狀態欄位窄化為貨物物流狀態，付款狀態改用獨立布林欄位」設計決策，實作「Orders progress through an 8-stage status lifecycle」規範窄化為 4 態（CONSOLIDATING/IN_TRANSIT/ARRIVED/COMPLETED），移除 PENDING_PAYMENT/DEPOSIT_PAID/PAID/AWAITING_SHIPMENT；驗證方式：於瀏覽器開啟訂單編輯彈窗的狀態下拉選單，確認僅顯示 4 個選項
- [x] 2.2 依「`depositPaid`（數字）欄位改為 `isPaid`（布林）欄位，而非型別轉換」設計決策，新增 `isPaid` 布林欄位取代 `depositPaid`，實作「Order payment status is tracked as an independent boolean field」規範，`addOrder` 預設 `isPaid: false`、預設 `status` 改為 `'CONSOLIDATING'`；驗證方式：新增訂單且不指定狀態與 isPaid，於瀏覽器檢查新訂單資料的 status 為 CONSOLIDATING、isPaid 為 false

## 3. 調整訂單編輯彈窗

- [x] 3.1 `OrderFormModal.vue` 將「訂金」數字輸入改為 `Checkbox` 勾選欄位，label 改為「已付款」，綁定 `form.isPaid`，實作「Marking an order as paid via the edit form」場景；驗證方式：於瀏覽器編輯訂單，勾選已付款並送出，重新開啟同一筆訂單確認勾選狀態被正確保留
- [x] 3.2 `OrderFormModal.vue` 「狀態」下拉選單 label 改為「貨物狀態」，實作「Status can be changed via the edit form」場景（選項會隨窄化後的 `STATUSES` 自動更新，不需額外過濾邏輯）；驗證方式：於瀏覽器開啟編輯彈窗，確認欄位 label 顯示「貨物狀態」

## 4. 調整 Dashboard 統計卡片

- [x] 4.1 依「Dashboard 統計卡片以「運送中」取代已移除的「待出貨」」設計決策，修改 `src/views/Dashboard.vue` 的 `statTiles`，將第一張卡片 key 改為 `IN_TRANSIT`、label 改為「運送中」，實作「Dashboard shows order count summaries」規範；驗證方式：於瀏覽器開啟總覽頁，確認三張卡片 label 依序為「集運中」「運送中」「已完成」，且數值對應各狀態訂單筆數

## 5. 驗證整體行為與建置

- [x] 5.1 確認 `StatusFilterTabs` 與 `StatusBadge` 不需修改程式碼即可正確反映新的 4 個狀態，實作「Status filter tabs show per-status counts and filter the order list」規範；驗證方式：於瀏覽器 `/orders`（全部訂單）頁面確認篩選頁籤只顯示 4 個貨物狀態加上「全部」，點擊任一頁籤能正確篩選訂單列表
- [x] 5.2 確認新增訂單流程不受欄位調整影響，「User can create a preorder order with required field validation」規範中的必填驗證（商品名稱、金額）維持正常運作，並執行 `npm run build` 確認無編譯錯誤；驗證方式：於瀏覽器測試空白商品名稱與金額為 0 皆會擋下送出，並執行 `npm run build` 指令成功結束
