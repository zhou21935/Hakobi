## Summary

調整 `AppSidebar.vue` 導覽選單順序，將「全部訂單」移到「總覽」正下方，並統一兩者的按鈕樣式。

## Motivation

目前側邊欄導覽順序為：總覽 → UI 元件展示 → 分類清單 → 全部訂單。「全部訂單」與「總覽」同屬頂層導覽入口（非分類子項目），但被排在清單最下面，且樣式（多了 `text-sm`）與「總覽」不一致，使用者不容易第一時間找到常用的「全部訂單」入口。對應 GitHub issue #23。

## Proposed Solution

在 `src/components/AppSidebar.vue` 中：
1. 將「📋 全部訂單」的 `<li>` 區塊從清單末尾移到「📊 總覽」`<li>` 之後（成為第 2 個導覽項目），原本「UI 元件展示」與「分類」區塊依序往後遞移一位。
2. 將全部訂單 `router-link` 的 class 由 `flex items-center gap-3 px-4 py-2 rounded-full text-sm text-ink hover:bg-white/50 transition-colors` 改為與總覽相同的 `flex items-center gap-3 px-4 py-2 rounded-full text-ink hover:bg-white/50 transition-colors`（移除 `text-sm`）。
3. `isActive('/orders')` 的判斷邏輯與 active 狀態 class（`bg-gradient-to-br from-primary-from to-primary-to text-white shadow-emphasis`）維持不變，只是套用位置改變。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `ui-components`: 新增一條規範，要求側邊欄頂層導覽項目（總覽、全部訂單）使用一致的樣式與相鄰排序。

## Impact

- Affected specs: ui-components
- Affected code:
  - Modified: src/components/AppSidebar.vue
