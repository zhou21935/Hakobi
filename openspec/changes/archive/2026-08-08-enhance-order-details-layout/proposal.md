## Summary

重新設計訂單詳情 Modal 的資訊層級、響應式排版、捲動行為與日期時間格式，使長內容在桌面及手機上都清楚且不出現突兀的雙捲動軸。

## Motivation

目前訂單詳情的基本資料與訂單資料缺乏足夠的視覺區隔，欄位排列在不同裝置上也不一致；Modal 開啟時背景頁面仍可捲動，造成兩條捲動軸。業務日期還可能顯示不需要的時間內容，系統時間格式亦與期望不符。

## Proposed Solution

- Modal 開啟期間鎖定背景頁面捲動，只保留詳情內容區的一個捲動容器，關閉或卸載後還原原有背景捲動狀態。
- 將基本資料、訂單資料、物流資料與日期資料呈現為淡紫色圓角資訊卡；桌面使用雙欄，窄螢幕使用單欄。
- 系統資訊置於卡片區塊下方，以分隔線和較弱的文字層級呈現。
- 將內容捲動條改為約 6px、透明軌道、低對比灰紫色圓角滑塊，不顯示上下箭頭，滑鼠互動時提高對比。
- 下單日期、預計出貨日期與預計到貨日期只顯示 YYYY/MM/DD。
- 建立時間與最後更新時間以 Asia/Taipei 時區及 24 小時制顯示 YYYY/MM/DD HH:mm。
- 底部關閉與編輯操作固定於 Modal 底部，不隨內容捲動。

## Non-Goals

- 不修改訂單資料模型、API payload 或資料庫欄位。
- 不調整訂單建立／編輯表單。
- 不重新設計其他頁面或非訂單詳情用途的視覺內容。
- 不完全隱藏捲動條，仍保留內容可繼續捲動的提示。

## Alternatives Considered

- 完全隱藏捲動條：視覺最乾淨，但桌面使用者較難察覺下方仍有內容，因此不採用。
- 僅縮小原生捲動條：無法可靠移除突兀的軌道與箭頭，也難以符合現有灰紫色視覺，因此採用可降級的自訂樣式。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `order-details`: 增加詳情分區、響應式欄位排列、單一內容捲動區域、固定操作列及明確日期時間格式的要求。
- `ui-components`: 增加 Modal 開啟時鎖定背景捲動並在關閉後復原的要求。

## Impact

- Affected specs: `order-details`, `ui-components`
- Affected code:
  - Modified: `src/components/orders/OrderDetailsModal.vue`, `src/components/ui/Modal.vue`, `src/components/orders/__tests__/OrderDetailsModal.spec.js`
  - New: `src/components/ui/__tests__/Modal.spec.js`
  - Removed: none
