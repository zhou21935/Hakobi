## Summary

依螢幕尺寸調整訂單列表的新增操作排列：桌面版與狀態分頁同列，手機版維持下一列靠右。

## Motivation

目前桌面版將「+ 新增訂單」獨立放在狀態分頁下方，產生不必要的垂直空間，也未利用分頁列右側的可用區域。將桌面按鈕放回同列並對齊訂單卡片右緣，可讓寬螢幕版面更緊湊，同時保留手機版清楚且容易操作的分列配置。

## Proposed Solution

- 分類訂單頁與全部訂單頁在桌面寬度下，將狀態分頁與「+ 新增訂單」放在同一列。
- 桌面版按鈕靠最右，右緣與下方訂單卡片一致。
- 手機版維持狀態分頁下一列的靠右、內容寬度按鈕。

## Non-Goals

- 不變更狀態分頁的篩選、捲動或計數功能。
- 不變更新增訂單表單與資料流程。
- 不調整訂單卡片寬度或頁面最大寬度。

## Capabilities

### New Capabilities

無。

### Modified Capabilities

- `preorder-orders`: 將新增訂單操作的響應式位置改為桌面與狀態分頁同列、手機維持下一列。

## Impact

- Affected specs: `preorder-orders`
- Affected code:
  - Modified: `src/views/OrderList.vue`
  - Modified: `src/views/AllOrders.vue`
  - Modified: `tests/views/OrderList.spec.js`
  - Modified: `tests/views/AllOrders.spec.js`
  - New: none
  - Removed: none
