<!--
Each task description MUST state:
- the behavior or contract being delivered (what is observably true when the
  task is complete), and
- the verification target that proves completion (test, CLI invocation,
  analyzer check, manual assertion, or content review on a generated artifact.
-->

## 1. TDD 規格化

- [x] 1.1 針對 `Tracking numbers can be copied with visible feedback` 與 `Copyable detail values provide reusable isolated feedback` 先新增失敗測試：驗證訂單號碼及追蹤號碼可精確複製、兩個元件回饋互不影響、成功後兩秒重設、拒絕或缺少 Clipboard API 時顯示失敗提示、空值不顯示按鈕；執行對應 Vitest 測試並確認實作前因缺少共用元件或整合而失敗。

## 2. 共用元件與訂單詳情整合

- [x] 2.1 依「使用自包含的 CopyableDetailValue 元件」決策建立 `src/components/ui/CopyableDetailValue.vue`，讓每個實例以 `label`、`value` 獨立呈現可選取值、具 `aria-label` 的複製按鈕及成功狀態，並在卸載時清除計時器；執行 `tests/components/ui/CopyableDetailValue.spec.js` 驗證元件契約及狀態隔離。
- [x] 2.2 依「Clipboard 不可用時明確失敗」決策處理 Clipboard 缺失與 rejected Promise，確保顯示「複製失敗，請手動選取」、保留值且不拋出未處理例外；以元件測試中的 unavailable 與 rejection 案例驗證。
- [x] 2.3 將訂單詳情的訂單號碼與追蹤號碼改用共用元件，保持現有顏色、欄位分組及響應式排版，且訂單號碼按鈕可精確複製顯示值；執行 `tests/components/orders/OrderDetailsModal.spec.js` 驗證兩個欄位的可操作複製控制。

## 3. 完整驗證

- [x] 3.1 執行前端完整測試與 production build，確認共用元件重構未造成回歸且建置成功；以 `npm test -- --run` 與 `npm run build` 均成功作為完成標準。
