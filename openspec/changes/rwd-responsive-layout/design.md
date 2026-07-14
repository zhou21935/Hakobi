## Context

目前 `src/App.vue` 使用 `flex` 排列 `AppSidebar` 與 `main`，`main` 固定套用 `ml-64`，而 `AppSidebar.vue` 本身是 `fixed left-0 top-0 h-screen w-64` 的固定側邊欄。這個組合在桌機尺寸下正常，但在手機／平板尺寸下，`main` 的 `ml-64` 會持續保留、側邊欄仍固定顯示，導致內容被擠壓或側邊欄直接蓋住主畫面。專案使用 Tailwind CSS 做樣式管理，並以 Vue 3 `<script setup>` 撰寫元件，因此響應式調整以 Tailwind 的斷點工具類（`sm:` / `md:` / `lg:`）與 Vue 的 local state（`ref`）為主，不引入新的第三方套件或全域狀態庫。

## Goals / Non-Goals

**Goals:**

- 定義一致的斷點策略：手機（< `md`，Tailwind `md` = 768px）採用抽屜式側邊欄；`md` 以上維持現有固定側邊欄版面
- 讓 `AppSidebar` 在手機／平板尺寸下預設收合，並提供開關按鈕與遮罩（overlay）觸發顯示/隱藏
- 讓 `App.vue` 的主內容區在手機／平板尺寸下不再套用 `ml-64`，避免被側邊欄佔位擠壓
- 讓 Dashboard、AllOrders、OrderList 等頁面與 OrderCard、StatusFilterTabs、OrderFormModal 等元件在窄螢幕下維持版面不溢出、資訊可讀、按鈕可點擊

**Non-Goals:**

- 不引入額外的 UI 框架或 CSS-in-JS 方案，僅使用既有 Tailwind 設定
- 不變更路由結構或新增頁面
- 不處理平板以上（`md` 以上）版面的視覺重新設計，僅確保既有桌機版面不受影響

## Decisions

### 斷點策略採用 Tailwind 預設 md（768px）作為手機／桌機分界

以 Tailwind 預設斷點 `md`（768px）作為「手機/平板抽屜導覽」與「桌機固定側邊欄」的分界，小於 `md` 一律視為需要抽屜式導覽的窄螢幕情境（涵蓋手機與直向平板）。理由：專案已使用 Tailwind 且未自訂斷點，沿用預設值可降低維護成本；`md` 是 Tailwind 生態中最常見的手機/桌機切分點，符合 issue 中「平板或手機尺寸」的描述。

替代方案：自訂斷點（例如 640px）— 拒絕，因為沒有證據顯示需要更細的切分，且會增加 Tailwind config 的客製化成本。

### AppSidebar 改為可控制顯示狀態的抽屜（drawer），由 App.vue 持有開關狀態

`AppSidebar` 新增 `open`（Boolean，透過 prop 或 `defineModel` 控制）與觸發關閉的 emit，在小於 `md` 尺寸時：
- 側邊欄本身改為 `fixed` + `transform translate-x` 動畫，預設 `-translate-x-full`（完全收合、不佔版面、不遮擋）
- 開啟時疊加一層可點擊的半透明遮罩（overlay），點擊遮罩或選單項目後自動關閉側邊欄
- `App.vue` 在小於 `md` 尺寸新增一顆漢堡選單按鈕（固定於頁首左上角），點擊後切換側邊欄開關狀態；狀態使用 `ref` 存放在 `App.vue`，透過 prop/emit 傳遞給 `AppSidebar`

在 `md` 以上尺寸：側邊欄維持現有 `fixed left-0 top-0 h-screen w-64` 且不受開關狀態影響（一律可見），遮罩不顯示，漢堡按鈕隱藏。

替代方案：改用可收合但仍佔版面的側邊欄（縮成 icon-only）— 拒絕，因為手機寬度有限，保留任何固定佔位仍會擠壓內容，抽屜式（完全移出畫面）更符合 issue 要求的「不被固定側邊欄擠壓或遮擋」。

替代方案：使用瀏覽器原生 `<dialog>` 或第三方 drawer 套件 — 拒絕，避免引入不必要的依賴，Tailwind + Vue 既有能力已足夠實作。

### App.vue 主內容區改用響應式 margin，僅在 md 以上套用 ml-64

`main` 的 class 由固定 `ml-64` 改為 `md:ml-64`（小於 `md` 不套用左邊距，大於等於 `md` 維持原本行為），確保手機／平板尺寸下主內容從畫面最左側開始排列，不預留側邊欄空間。

### 各頁面與元件改用 Tailwind 響應式工具類調整排列方向與間距

- `Dashboard.vue`：統計卡片容器由固定多欄 grid 改為 `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`（依現有欄位數調整），標題區改為 `flex-col md:flex-row`
- `AllOrders.vue`：篩選列由橫向排列改為 `flex-col md:flex-row` 並加上 `gap`，避免窄螢幕橫向溢出；modal 觸發按鈕維持在可視區域內
- `OrderList.vue`：標題、操作按鈕改為 `flex-col md:flex-row`，清單項目間距在窄螢幕縮小
- `OrderCard.vue`：卡片內文字/標籤改用 `flex-wrap`，避免長文字或多標籤擠壓版面；按鈕在窄螢幕改為全寬或換行排列
- `StatusFilterTabs.vue`：標籤列在窄螢幕改為 `overflow-x-auto` 水平捲動（搭配 `flex-nowrap`），避免標籤被截斷或換行破版
- `OrderFormModal.vue`：modal 容器在窄螢幕改為 `max-h-[90vh] overflow-y-auto` 並縮減 padding，表單欄位改為單欄（`grid-cols-1 md:grid-cols-2`），避免超出可視範圍

## Implementation Contract

**行為（Behavior）：**
- 當視窗寬度小於 768px（Tailwind `md` 斷點）時：
  - 首次載入 `AppSidebar` 為隱藏狀態，主內容區從畫面左側開始（無左邊距）
  - 頁面左上角顯示漢堡選單按鈕，點擊後側邊欄由左側滑入並顯示半透明遮罩
  - 點擊遮罩或點擊任一導覽連結後，側邊欄滑出隱藏、遮罩消失
- 當視窗寬度大於等於 768px 時：側邊欄固定顯示、主內容區維持 `ml-64` 左邊距，行為與現況一致，漢堡按鈕與遮罩不顯示
- Dashboard、AllOrders、OrderList 頁面與 OrderCard、StatusFilterTabs、OrderFormModal 元件在小於 768px 寬度下不出現橫向捲動（除 StatusFilterTabs 刻意採用的水平捲動外）、文字與按鈕不重疊、modal 表單可完整捲動操作

**介面/資料形狀：**
- `AppSidebar.vue` 新增 `open`（Boolean prop）與 `update:open`（emit，或改用 `defineModel('open')`）用於雙向綁定開關狀態
- `App.vue` 新增本地 `ref` 變數（例如 `isSidebarOpen`）管理側邊欄開關，並在小於 `md` 尺寸渲染漢堡按鈕

**失敗模式：**
- 若 JavaScript 狀態切換失敗（例如 emit 未觸發），側邊欄應維持預設收合狀態（fail closed），不應遮擋主內容；不特別處理極端情況（例如視窗寬度在 md 邊界上下快速調整），交由 CSS transition 自然呈現

**驗收標準：**
- 於瀏覽器 DevTools 將 viewport 調整為常見手機尺寸（375x667）與平板尺寸（768x1024），手動驗證：Dashboard、AllOrders、OrderList、UI Showcase 頁面皆無橫向溢出、側邊欄可透過漢堡按鈕開關、modal 表單可正常操作與捲動
- `npm run build` 或既有 lint/test 指令可正常通過（不因樣式調整導致既有元件測試失敗）

**範圍邊界：**
- 範圍內：`src/App.vue`、`src/components/AppSidebar.vue`、`src/views/Dashboard.vue`、`src/views/AllOrders.vue`、`src/views/OrderList.vue`、`src/components/orders/OrderCard.vue`、`src/components/orders/StatusFilterTabs.vue`、`src/components/orders/OrderFormModal.vue` 的響應式版面調整
- 範圍外：新增業務邏輯、修改資料流或 API、重新設計視覺風格、處理超寬螢幕版面優化

## Risks / Trade-offs

- [風險] 抽屜式側邊欄的開關狀態邏輯若未正確處理視窗尺寸變化（例如從手機尺寸放大到桌機尺寸時 `isSidebarOpen` 殘留為 true）可能導致桌機版面短暫異常 → 因應：桌機（`md` 以上）版面透過 CSS 類別強制側邊欄可見、遮罩隱藏，不依賴 JS 狀態值，避免 JS 狀態與版面顯示不一致
- [風險] 多個檔案同時調整版面，可能遺漏某個窄螢幕情境（例如極窄的 320px 寬度）→ 因應：以 375px（常見手機寬度）與 320px（最小常見寬度）都做手動驗證
- [取捨] 不引入 drawer 或 responsive 第三方套件，改以 Tailwind + Vue 原生能力實作，換取更小的依賴風險，但需要自行處理 transition 與 overlay 的細節
