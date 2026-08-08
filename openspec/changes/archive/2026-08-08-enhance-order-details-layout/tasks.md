## 1. 共用 Modal 捲動契約

- [x] 1.1 先在 `src/components/ui/__tests__/Modal.spec.js` 為「Modal component supports v-model visibility control and dismiss interactions」加入失敗測試，覆蓋「共用 Modal 負責背景捲動鎖定與還原」：開啟時 `document.body.style.overflow` 為 `hidden`，透過 model 關閉及卸載時皆還原原值，並以 `npm test -- --run src/components/ui/__tests__/Modal.spec.js` 驗證測試在實作前確實失敗。
- [x] 1.2 在 `src/components/ui/Modal.vue` 實作「共用 Modal 負責背景捲動鎖定與還原」，分別保存、鎖定並還原 `html` 與 `body` 原有 overflow 值，使不同瀏覽器的背景捲動來源都被停用、內容區保持獨立捲動且 header/footer 固定；以 `npm test -- --run src/components/ui/__tests__/Modal.spec.js` 驗證開關、Escape、遮罩關閉與卸載路徑全數通過。
- [x] 1.3 在共用 Modal 的內容捲動區落實「內容捲動條採漸進增強樣式」：panel 裁切 overflow，flex 內容區以 `min-h-0` 成為唯一捲動區；支援平台呈現約 6px、透明軌道、圓角低對比灰紫滑塊、無箭頭且互動時加深，不支援平台仍可原生捲動；以元件 class/style assertion 與完整 Modal tests 確認 header/footer 固定且其他 Modal 無回歸。

## 2. 訂單詳情資訊呈現

- [x] 2.1 先在 `src/components/orders/__tests__/OrderDetailsModal.spec.js` 為「Order details present distinct responsive information groups」與「Order details retain fixed actions and a discoverable content scrollbar」加入失敗測試，驗證四個淡紫圓角語意區段、桌面雙欄、窄螢幕單欄、弱化系統資訊及固定 footer 契約；以 `npm test -- --run src/components/orders/__tests__/OrderDetailsModal.spec.js` 確認實作前測試失敗。
- [x] 2.2 在 `src/components/orders/OrderDetailsModal.vue` 落實「詳情內容以語意區段與響應式資訊卡呈現」，讓基本資料、訂單資料、物流資料與日期資料在 `sm` 以上雙欄、以下單欄，長內容可跨欄且無水平 overflow，系統資訊位於分隔線下並降低強調；以 `npm test -- --run src/components/orders/__tests__/OrderDetailsModal.spec.js` 及 375px／桌面 viewport 人工檢查驗證參考版面與操作可用性。
- [x] 2.3 先為「Order details use explicit date and timestamp formats」補上日期轉換失敗測試，再在 `src/components/orders/OrderDetailsModal.vue` 實作「日期與系統時間使用不同格式化契約」：業務日期從 ISO 值顯示 `YYYY/MM/DD` 且不跨時區偏移，系統 timestamp 以 `Asia/Taipei` 顯示零補齊的 `YYYY/MM/DD HH:mm`，空值顯示 `尚未填寫`；以範例 `2026-08-05T16:00:00.000Z` → `2026/08/05`、`2026-08-06T14:55:00.000Z` → `2026/08/06 22:55` 的元件測試驗證。

## 3. 整體驗證

- [x] 3.1 執行 `npm test` 與 `npm run build`，確認完整前端測試與 production build 通過；再以桌面及 375px viewport 開啟長訂單詳情，人工確認背景不可捲動、僅有低對比內容捲動條、四個資訊區塊層級清楚、footer 持續可見，且關閉後頁面恢復原本捲動能力。
