## Why

目前介面以桌機尺寸為主，`src/App.vue` 讓主內容區固定 `ml-64`，`src/components/AppSidebar.vue` 也是固定寬度、固定位置的側邊欄。到平板或手機尺寸時，側邊欄會遮住主畫面、內容被擠壓、操作區不易點擊。訂單列表、篩選列、頁面標題區與 modal 表單也偏向桌機排版，若不補上響應式調整，手機使用體驗會持續卡住（對應 GitHub issue #38）。

## What Changes

- 移除主內容區對固定側邊欄寬度（`ml-64`）的依賴，改為依螢幕尺寸切換的響應式 layout
- `AppSidebar` 新增手機/平板可用的導覽方式（抽屜式側邊欄搭配開關按鈕，或等效的可收合導覽列），並在小螢幕下預設收合、不遮擋主內容
- `Dashboard` 頁面標題與統計卡片在窄螢幕下改為單欄或可換行排列
- `AllOrders` 頁面的篩選列、清單間距與 modal 觸發區塊在窄螢幕下重新排列，避免橫向溢出
- `OrderList` 頁面標題區、操作按鈕與清單在窄螢幕下改為可換行、可堆疊的排列
- `OrderCard` 在窄螢幕下確保卡片資訊、按鈕與標籤不會擠壓變形或溢出
- `StatusFilterTabs` 在窄螢幕下支援換行或水平捲動，避免分頁籤被截斷
- `OrderFormModal` 在手機尺寸下欄位可正常操作，modal 不超出可視範圍，並可正常捲動

## Non-Goals

- 不重新設計視覺風格或色彩系統，僅調整版面與尺寸相關的響應式行為
- 不新增新的業務功能或頁面
- 不處理桌機以上（例如超寬螢幕）的版面優化，僅涵蓋手機與平板尺寸

## Capabilities

### New Capabilities

- `responsive-layout`：定義整體 App layout（含側邊欄導覽）與訂單相關頁面／元件（列表、卡片、篩選列、modal 表單）在手機與平板尺寸下的響應式行為

### Modified Capabilities

(none)

## Impact

- Affected specs: `responsive-layout`（新增）
- Affected code:
  - Modified:
    - src/App.vue
    - src/components/AppSidebar.vue
    - src/views/Dashboard.vue
    - src/views/AllOrders.vue
    - src/views/OrderList.vue
    - src/components/orders/OrderCard.vue
    - src/components/orders/StatusFilterTabs.vue
    - src/components/orders/OrderFormModal.vue
  - New: (none)
  - Removed: (none)
