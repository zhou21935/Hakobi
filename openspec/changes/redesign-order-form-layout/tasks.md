## 1. 共用 Modal 響應式介面

- [x] 1.1 以 TDD 為「Modal supports backward-compatible responsive layout customization」在 `tests/components/ui/Modal.spec.js` 新增失敗測試，鎖定未傳新設定時維持既有置中、max-width、內容捲動、Escape、overlay close 與 scroll lock，並鎖定訂單表單可覆寫 overlay、panel、header、content、footer classes；驗證目標：新測試在實作前因缺少介面而失敗。
- [x] 1.2 實作設計決策「Modal 提供具預設值的樣式介面」，讓 `src/components/ui/Modal.vue` 可支援 bottom sheet 與 880px panel，同時所有新介面以原 class 為預設；驗證目標：`tests/components/ui/Modal.spec.js` 全數通過，且現有 Modal 呼叫端無需修改。

## 2. 訂單表單區塊與既有契約

- [x] 2.1 以 TDD 為「Order form uses grouped sections and frontend-only future fields」新增失敗測試，驗證新增與編輯模式都有商品、貨物、物流、備註四區塊，保留海外代購／集運包裹及周邊／書籍／其他分類，並維持既有 validation、pending 與 submit event；驗證目標：`tests/components/orders/OrderFormModal.spec.js` 的新增案例在重排前失敗，既有案例持續通過。
- [x] 2.2 實作設計決策「單一響應式訂單表單與四區塊結構」及「既有分類與驗證契約不變」，在 `src/components/orders/OrderFormModal.vue` 使用單一份 controls/state 完成四區塊 grid，新增與編輯共享版型且不引入參考檔的公仔模型／服飾／3C；驗證目標：區塊、分類、回填、驗證、pending 與 payload 相關元件測試通過。
- [x] 2.3 套用設計決策「使用現有色彩 token 套用參考版型」，讓 section header、邊框、背景、文字、chip 與操作按鈕只使用 `src/assets/main.css` 既有 token／UI variant，不出現參考壓縮檔固定色碼；驗證目標：檢視 `OrderFormModal.vue` diff 不含參考色碼，並在 390px、768px、1280px 畫面確認 Hakobi 配色一致。

## 3. 前端暫存欄位

- [x] 3.1 以 TDD 新增失敗測試，使用具體訂單號碼 `114-2938471-0038` 與附件 `invoice.pdf`、`photo.jpg` 驗證多選、檔名／類型顯示、逐筆移除、關閉重開清除，以及 emit payload 不含 `orderNumber`／`files`；驗證目標：`tests/components/orders/OrderFormModal.spec.js` 的新互動案例在實作前失敗。
- [x] 3.2 實作設計決策「訂單號碼與附件保持純前端暫存」，新增單一訂單號碼 control、multiple PDF／image file input 與使用 index-safe key 的附件清單，且 `handleSubmit` 明確維持既有 payload 白名單；驗證目標：新互動測試通過，並確認 `src/stores/orders.js`、`src/services/ordersApi.js`、`backend/`、`supabase/` 無變更。

## 4. 三種尺寸整合與驗收

- [x] 4.1 以 TDD 為「Order form adapts across phone, tablet, and desktop viewports」新增 layout contract 測試，鎖定 `<640px` bottom sheet／單欄／固定 footer、`640–1023px` 560px 置中／選定雙欄、`≥1024px` 880px／商品與備註跨欄／貨物與物流並排，且無重複 inputs；驗證目標：responsive class assertions 在版型實作前失敗。
- [x] 4.2 串接 responsive Modal 介面與表單 grid classes，完成手機、平板、電腦版型，確保內容獨立捲動、header/footer 可操作且無水平溢位；驗證目標：layout contract 測試通過，並以 390px、768px、1280px 手動檢查新增與編輯畫面。
- [x] 4.3 執行完整回歸與 production build，確認本 change 只影響前端版型與元件內暫存互動；驗證目標：`npm test`、`npm run build` 成功，`git diff -- src/stores/orders.js src/services/ordersApi.js backend supabase` 無輸出，且依 Implementation Contract 逐項人工驗收通過。
