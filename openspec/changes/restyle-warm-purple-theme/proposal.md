## Why

目前介面沿用 Tailwind 預設的 slate 灰階與系統字體,是 `add-ui-components` 變更為了「先讓畫面產生出來」暫時套用的陽春樣式。現在使用者已經提供明確的參考設計(暖色系代購/集運管理介面截圖)與完整的視覺規格(色彩、字體、圓角、陰影),應該把這組視覺風格正式套用上去,讓畫面真正反映想要的產品調性。

## What Changes

- 建立一組共用的視覺 design tokens(色彩、字體、圓角、陰影),定義在 `src/assets/main.css` 的 Tailwind 4 `@theme` 設定中,取代目前寫死在各元件 class 裡的 slate 灰階
- 引入標題/數字字體 Baloo 2(圓潤感)與中文內文字體 Noto Sans TC(700–900 字重)
- 五個基礎 UI 元件(`Button`、`Card`、`Input`、`Table`、`Modal`)、`StatusBadge`、`App.vue`、`AppSidebar.vue`、`UiShowcase.vue` 全部改用新的色彩、圓角、陰影規格
- 側邊欄背景改為漸層(`#FBEFE9` → `#F6E1EC`),主要按鈕與選中導覽項目改為主色漸層底色(`#8b6fba` → `#b78fa5`)
- 卡片、標籤 badge、導覽項目、按鈕、圖示圓框依規格分別套用 22px / 999px / 50% 圓角
- 不新增或修改任何元件的 props、events 介面,不改變任何互動行為或資料邏輯

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `ui-components`: 新增一條需求,規範元件必須套用共用的 design tokens(色彩/字體/圓角/陰影),取代目前寫死的 slate 灰階;既有的 props/events 介面需求不變

## Impact

- Affected specs: `ui-components`(新增一條 design tokens 需求,既有行為/介面需求不變)
- Affected code:
  - Modified:
    - src/assets/main.css
    - src/components/ui/Button.vue
    - src/components/ui/Card.vue
    - src/components/ui/Input.vue
    - src/components/ui/Table.vue
    - src/components/ui/Modal.vue
    - src/components/StatusBadge.vue
    - src/components/AppSidebar.vue
    - src/App.vue
    - src/views/UiShowcase.vue
    - index.html
  - New: (none)
  - Removed: (none)
