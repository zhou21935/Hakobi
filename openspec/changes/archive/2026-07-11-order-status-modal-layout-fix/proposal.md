## Summary

「貨物狀態」補回「待出貨」選項，訂單編輯彈窗改成逐列自訂欄數的版面，「送往集運倉」改為勾選欄位，並調整共用 `Modal` 元件加入捲動、去除邊框線與間距，修正彈窗內容過長時貼齊螢幕頂部的問題。

## Motivation

「貨物狀態」目前只有 4 個選項（集運中、運送中、已抵台、已完成），缺少「待出貨」這個出貨前的起始階段。訂單編輯彈窗欄位排列不夠清楚，且共用 `Modal` 元件沒有 `max-height`/捲動機制，內容過長時視覺上貼齊螢幕頂部、看起來沒有間距。對應 GitHub issue #27。

## Proposed Solution

1. `src/stores/orders.js` 的 `STATUSES` 補回 `AWAITING_SHIPMENT`（待出貨），排列順序調整為：待出貨 → 集運中 → 運送中 → 已抵台 → 已完成；新訂單預設狀態由 `CONSOLIDATING` 改回 `AWAITING_SHIPMENT`
2. `src/components/orders/OrderFormModal.vue` 版面從單一 `grid grid-cols-2` 改為逐列自訂欄數：商品名稱/購買平台（2欄）、商品連結（整列）、金額/幣別/已付款（3欄）、下單日期/貨物狀態/送往集運倉（3欄）、預計出貨日期/預計到貨日期（2欄）、備註（整列）
3. 「送往集運倉」欄位從 `Select`（是/否選單）改為 `Checkbox`，label 改為「送往集運倉」，`isConsolidated` 資料型別由字串 `'true'/'false'` 直接改為布林值
4. `src/components/ui/Checkbox.vue` 增加使用場景：「送往集運倉」欄位重用既有元件
5. `src/components/ui/Modal.vue`：移除 header `border-b` 與 footer `border-t`；容器改為 `flex flex-col` 搭配 `max-height` 限制，中間內容區加入 `overflow-y-auto` 可捲動，header/footer 固定不捲動；外層遮罩容器增加上下 padding，讓彈窗不貼齊螢幕頂部

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `preorder-orders`: 貨物狀態新增「待出貨」選項並調整順序，新訂單預設狀態改變，「送往集運倉」欄位型別與呈現方式改變
- `ui-components`: `Modal` 元件的間距、捲動行為與邊框樣式調整

## Impact

- Affected specs: preorder-orders (modified), ui-components (modified)
- Affected code:
  - Modified: src/stores/orders.js
  - Modified: src/components/orders/OrderFormModal.vue
  - Modified: src/components/ui/Modal.vue
