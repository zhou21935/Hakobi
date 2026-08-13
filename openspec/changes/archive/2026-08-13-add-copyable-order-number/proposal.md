## Summary

將訂單詳情中的訂單號碼與追蹤號碼統一改用可重用的複製欄位元件。

## Motivation

追蹤號碼已有複製操作，但訂單號碼只能手動選取；兩者的顯示、Clipboard API、成功提示與失敗提示若分別維護，容易產生行為與無障礙標籤不一致。

## Proposed Solution

- 新增共用可複製欄位元件，負責標籤、空值 fallback、長字串換行、複製按鈕及成功／失敗回饋。
- 訂單詳情的訂單號碼與追蹤號碼改用同一元件。
- 空白值仍顯示「尚未填寫」且不顯示複製按鈕。

## Non-Goals

- 不變更訂單 API、資料庫 schema 或訂單號碼驗證。
- 不新增其他欄位的複製能力，也不改變既有顏色與卡片版面。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `order-details`: 訂單號碼與追蹤號碼都提供一致的複製操作與回饋。
- `ui-components`: 提供可重用、可存取且能處理 Clipboard 失敗的複製欄位元件。

## Impact

- Affected specs: order-details, ui-components
- Affected code:
  - New: src/components/ui/CopyableDetailValue.vue, tests/components/ui/CopyableDetailValue.spec.js
  - Modified: src/components/orders/OrderDetailsModal.vue, tests/components/orders/OrderDetailsModal.spec.js
  - Removed: none
