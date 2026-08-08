## 1. 卡片結構與圖示測試

- [x] 1.1 以測試先定義「Order cards present information in three visual rows」契約：驗證狀態／預購／分類、商品名稱／金額／操作、預計出貨日分屬三個可辨識區塊，並驗證缺少選填資料時不顯示占位標籤；執行 `npm test -- --run src/components/orders/__tests__/OrderCard.spec.js` 確認測試會在實作前失敗。
- [x] 1.2 以測試先定義「Order card actions use consistent inline SVG icons」契約：驗證三個操作皆含 inline SVG、不含 emoji、保留 aria-label 與既有事件 payload，並覆蓋詳情開啟／關閉的眼睛圖示狀態；執行 `npm test -- --run src/components/orders/__tests__/OrderCard.spec.js` 確認測試會在實作前失敗。
- [x] 1.3 以測試先定義「Three-row card remains usable on narrow screens」契約：驗證窄版會換行或堆疊、標籤可換行、操作不與文字重疊且第三列維持獨立；執行 `npm test -- --run src/components/orders/__tests__/OrderCard.spec.js` 確認測試會在實作前失敗。

## 2. 卡片版面與操作實作

- [x] 2.1 在 `src/components/orders/OrderCard.vue` 實作「Order cards present information in three visual rows」，讓第一列、第二列、分隔線與第三列符合規格且選填資料缺少時不留下空白內容；以 OrderCard 元件測試與桌面／窄版人工檢視驗證。
- [x] 2.2 在 `src/components/orders/OrderCard.vue` 實作「Order card actions use consistent inline SVG icons」，直接使用指定 path 的 eye、eye-slash、pen-to-square、trash-can SVG，保留 details、edit、request-delete 事件與 aria-label；以 OrderCard actions 測試驗證圖示、狀態與事件相容性。
- [x] 2.3 在 `src/components/orders/OrderCard.vue` 完成「Three-row card remains usable on narrow screens」的響應式樣式，確保標籤、主要資料與操作在 `sm` 以下不水平溢出或重疊；以窄版元件測試及手機寬度人工檢視驗證。

## 3. 整體驗證

- [x] 3.1 執行 `npm test -- --run` 與 `npm run build`，確認全部測試通過、正式建置成功，且訂單列表既有篩選、排序與操作流程未受影響。

## 4. 詳情文字與日期區隔調整

- [x] 4.1 以測試先更新「Order card actions use consistent controls」及「Three-row card remains usable on narrow screens」契約：驗證詳情控制顯示文字「訂單詳情」且不含 SVG、編輯與刪除仍使用 SVG，並驗證預計出貨列不含分隔線 class；執行 `npm test -- --run src/components/orders/__tests__/OrderCard.spec.js` 確認測試會在實作前失敗。
- [x] 4.2 在 `src/components/orders/OrderCard.vue` 將詳情控制改為文字「訂單詳情」、移除眼睛／閉眼 SVG 與不再需要的狀態 prop，並移除預計出貨日前的分隔線；以 OrderCard 元件測試驗證文字、圖示、事件及三列排版契約。

## 5. 調整後整體驗證

- [x] 5.1 執行 `npm test -- --run` 與 `npm run build`，確認完整測試與正式建置通過，並以 `git diff --check` 確認變更沒有格式錯誤。

## 6. 手機版三列排版

- [x] 6.1 以測試先更新「Order cards present information in three visual rows」與「Three-row card remains usable on narrow screens」契約：驗證 ISO 預計出貨值只顯示 `YYYY-MM-DD`、手機版第二列為商品名稱／金額、第三列為「預計出貨日 日期」／三個操作，且 `sm` 以上仍保留目前排列；執行 `npm test -- --run src/components/orders/__tests__/OrderCard.spec.js` 確認測試會在實作前失敗。
- [x] 6.2 在 `src/components/orders/OrderCard.vue` 加入 ISO 日期前綴格式化，並以響應式 grid／flex 完成手機版三列結構；保留「訂單詳情」文字、編輯與刪除 SVG、無分隔線及既有事件契約，以 OrderCard 元件測試驗證日期、手機與 `sm` 以上排列。

## 7. 手機排版整體驗證

- [x] 7.1 執行 `npm test -- --run`、`npm run build` 與 `git diff --check`，確認完整測試、正式建置及格式檢查全部通過。
