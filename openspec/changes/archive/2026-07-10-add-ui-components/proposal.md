## Why

目前 `Dashboard.vue` 與 `OrderList.vue` 都只是空殼標題,`src/components/` 底下只有 `AppSidebar.vue` 與 `StatusBadge.vue` 兩個特定用途元件,沒有任何可重複使用的基礎 UI 元件。在畫面風格還沒定案前,需要先有一組基礎元件把畫面架構撐起來,才能實際看到畫面並逐步調整成想要的風格。

## What Changes

- 新增一組基礎 UI 元件:`Button`、`Card`、`Input`、`Table`、`Modal`,放在 `src/components/ui/` 底下,用純手刻 Vue SFC + Tailwind 撰寫,不引入外部 UI library
- 元件先採最陽春的預設樣式(不套用特定品牌色系),之後由使用者自行調整視覺風格
- 新增一個元件展示頁(showcase page),把五個元件實際渲染出來,讓使用者可以在瀏覽器中看到並調整風格
- 不會把 `Dashboard.vue`、`OrderList.vue` 串接 `orders` store 的真實資料,也不會新增圖示套件(沿用現有 emoji 風格)

## Capabilities

### New Capabilities

- `ui-components`: 一組可重複使用的基礎 UI 元件(Button、Card、Input、Table、Modal),提供一致的元件介面(props/events),讓後續頁面開發可以組裝畫面,並可透過展示頁預覽與調整風格

### Modified Capabilities

(none)

## Impact

- Affected specs: `ui-components`(新增)
- Affected code:
  - New:
    - src/components/ui/Button.vue
    - src/components/ui/Card.vue
    - src/components/ui/Input.vue
    - src/components/ui/Table.vue
    - src/components/ui/Modal.vue
    - src/views/UiShowcase.vue
  - Modified:
    - src/router/index.js（新增展示頁路由）
    - src/components/AppSidebar.vue（新增展示頁選單項目）
  - Removed: (none)
