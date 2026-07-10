## 1. 調整訂單狀態資料模型

- [x] 1.1 依「STATUSES 補回待出貨並排在最前面」設計決策，在 `src/stores/orders.js` 新增 `AWAITING_SHIPMENT`，實作「Orders progress through a 4-stage shipment status lifecycle」規範（規範標題沿用既有 spec 的原文字以利比對，內容窄化為 5 態），確保 `STATUSES` 依序為待出貨/集運中/運送中/已抵台/已完成；驗證方式：於瀏覽器開啟訂單編輯彈窗「貨物狀態」下拉選單，確認依序顯示 5 個選項
- [x] 1.2 `addOrder` 預設 `status` 改為 `AWAITING_SHIPMENT`，實作「User can create a preorder order with required field validation」中的預設狀態規範；驗證方式：新增訂單不指定狀態，於瀏覽器檢查新訂單資料的 status 為 AWAITING_SHIPMENT

## 2. 調整訂單編輯彈窗版面與送往集運倉欄位

- [x] 2.1 依「訂單編輯彈窗改為逐列自訂欄數的 grid 版面」設計決策，重排 `OrderFormModal.vue` 版面為：商品名稱/購買平台同列、商品連結獨立列、金額/幣別/已付款同列、下單日期/貨物狀態/送往集運倉同列、預計出貨日期/預計到貨日期同列、備註獨立列；驗證方式：於瀏覽器開啟編輯彈窗，確認各列排列與設計一致
- [x] 2.2 依「送往集運倉從 Select 改為 Checkbox，資料型別直接用布林值」設計決策，將「送往集運倉」欄位由 `Select` 改為 `Checkbox`，label 改為「送往集運倉」，實作「Orders can be flagged as sent to a consolidation warehouse」規範；驗證方式：於瀏覽器勾選送往集運倉並送出，重新開啟同一筆訂單確認勾選狀態被正確保留

## 3. 調整 Modal 共用元件

- [x] 3.1 依「Modal 加入 max-height 與內容捲動、移除邊框線、外層加上下 padding」設計決策，修改 `src/components/ui/Modal.vue` 移除 header/footer 分隔線並加入 `max-height` + `flex flex-col` + `overflow-y-auto`，實作「Modal component supports v-model visibility control and dismiss interactions」規範中新增的捲動與間距行為；驗證方式：於瀏覽器開啟訂單編輯彈窗，確認 header/footer 無分隔線、中間內容可用滾輪捲動、header/footer 固定不動
- [x] 3.2 為 `Modal.vue` 外層遮罩容器增加上下 padding，讓彈窗與視窗上下邊緣有留白、不貼齊頂部；驗證方式：於瀏覽器開啟任一 Modal（含 `OrderList.vue` 的刪除確認彈窗），觀察彈窗與視窗邊緣之間有可見間距

## 4. 篩選頁籤與整體驗證

- [x] 4.1 確認 `StatusFilterTabs` 不需修改程式碼即可反映新增的待出貨狀態，實作「Status filter tabs show per-status counts and filter the order list」規範；驗證方式：於瀏覽器 `/orders`（全部訂單）頁面確認篩選頁籤顯示 5 個貨物狀態加上「全部」
- [x] 4.2 執行 `npm run build` 確認無編譯錯誤，並確認刪除確認彈窗與 `/ui-showcase` 展示彈窗因 `Modal.vue` 共用樣式調整後視覺仍正常；驗證方式：`npm run build` 指令成功結束，並於瀏覽器分別開啟刪除確認彈窗與 `/ui-showcase` 頁面的 Modal 範例確認樣式正常無異常
