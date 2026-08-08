## Summary

重新整理訂單列表卡片的資訊層級與操作按鈕，讓狀態、主要資料、操作與出貨日期形成清楚的三列結構，並以一致的文字與 SVG 控制取代 emoji。

## Motivation

目前卡片的資訊與操作集中在左右兩區，主要欄位的視覺關係不夠明確，且 emoji 圖示在不同平台的樣式不一致。統一排列與圖示可提升掃讀效率、介面一致性及操作辨識度。

## Proposed Solution

- 第一列依序顯示貨物狀態、預購狀態與商品分類標籤。
- 第二列顯示商品名稱、金額，以及訂單詳情、編輯、刪除三個操作圖示。
- 第三列只顯示預計出貨日期。
- 詳情操作顯示文字「訂單詳情」，編輯與刪除操作使用指定的 Font Awesome SVG path。
- 預計出貨日期以留白和主要資料區隔，不在商品名稱與日期之間顯示分隔線。
- 手機版將商品名稱與金額排在第二列，並將「預計出貨日 日期」與三個操作排在第三列；桌面版與平板版維持現有排列。
- 保留既有 details、edit 與 request-delete 事件及無障礙 aria-label。
- 在窄螢幕維持可讀、可操作且不溢出的響應式排列。

## Non-Goals

- 不變更訂單資料模型、篩選、排序、儲存或同步行為。
- 不調整訂單詳情、編輯表單或刪除確認視窗的內容。
- 不引入新的圖示套件或外部執行階段依賴。

## Capabilities

### New Capabilities

- `order-card-presentation`: 定義訂單列表卡片的三列資訊結構、SVG 操作圖示及響應式行為。

### Modified Capabilities

(none)

## Impact

- Affected specs: order-card-presentation
- Affected code:
  - Modified: src/components/orders/OrderCard.vue
  - Modified: src/components/orders/__tests__/OrderCard.spec.js
  - Modified: src/views/OrderList.vue
  - Modified: src/views/AllOrders.vue
  - New: openspec/specs/order-card-presentation/spec.md（封存時同步）
  - Removed: none
