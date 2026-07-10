## Why

目前訂單的「狀態」欄位混合了付款進度與物流階段（待付款、已付訂金、已付款、待出貨、集運中、運送中、已抵台、已完成共 8 種），語意混亂，且「訂金」欄位是數字輸入但實際上沒有在任何地方被顯示或加總使用。需要把「付款與否」拆成獨立的布林勾選欄位，「狀態」欄位單純化為只追蹤貨物物流階段。對應 GitHub issue #25。

## What Changes

- `STATUSES` 窄化為 4 項貨物狀態：`CONSOLIDATING`（集運中）、`IN_TRANSIT`（運送中）、`ARRIVED`（已抵台）、`COMPLETED`（已完成），**BREAKING**：移除 `PENDING_PAYMENT`（待付款）、`DEPOSIT_PAID`（已付訂金）、`PAID`（已付款）、`AWAITING_SHIPMENT`（待出貨）
- 訂單資料新增布林欄位 `isPaid`（已付款），取代數字型 `depositPaid`（訂金金額）欄位；新訂單預設狀態改為 `CONSOLIDATING`（原本預設 `PENDING_PAYMENT` 已被移除）
- 新增共用 `Checkbox` UI 元件，套用既有暖紫色 design tokens，納入 ui-components 元件庫
- 訂單編輯彈窗「訂金」數字輸入改為 `Checkbox` 勾選欄位（label「已付款」），「狀態」下拉選單 label 改為「貨物狀態」
- Dashboard 總覽頁的 3 個統計卡片，原本顯示「待出貨、集運中、已完成」，因「待出貨」狀態被移除，改為顯示「集運中、運送中、已完成」

## Non-Goals (optional)

（design.md 已建立，Non-Goals 記錄於該檔案的 Goals/Non-Goals 區塊）

## Capabilities

### New Capabilities

- `ui-checkbox`: 新增可重複使用的 `Checkbox` 表單元件，支援 `v-model` 布林綁定與 label，套用專案既有的暖紫色 design tokens

### Modified Capabilities

- `preorder-orders`: 訂單的狀態欄位語意窄化為僅追蹤貨物物流階段（4 個狀態值），付款狀態改由獨立的 `isPaid` 布林欄位表示，訂單編輯表單的欄位與 label、新訂單預設狀態、Dashboard 統計卡片隨之調整

## Impact

- Affected specs: ui-checkbox (new), preorder-orders (modified)
- Affected code:
  - New: src/components/ui/Checkbox.vue
  - Modified: src/stores/orders.js
  - Modified: src/components/orders/OrderFormModal.vue
  - Modified: src/views/Dashboard.vue
