## 1. 側邊欄與整體 Layout 骨架

- [x] 1.1 依「斷點策略採用 Tailwind 預設 md（768px）作為手機／桌機分界」與需求「Sidebar collapses into a drawer on narrow viewports」，於 `AppSidebar.vue` 新增 `open` prop（或 `defineModel('open')`）與相對應的關閉 emit，並在小於 768px 寬度時預設為關閉；驗證：`src/components/__tests__/AppSidebar.spec.js` 新增測試，掛載時未傳入 open 應套用收合的 class（例如 `-translate-x-full`）
- [x] 1.2 依「AppSidebar 改為可控制顯示狀態的抽屜（drawer），由 App.vue 持有開關狀態」，在 `AppSidebar.vue` 實作小於 768px 時的滑入/滑出 transform 動畫與半透明遮罩（overlay），點擊遮罩或導覽連結會觸發關閉 emit；驗證：`AppSidebar.spec.js` 測試傳入 `open=true` 時 overlay 元素存在，點擊 overlay 後 emit 對應的關閉事件
- [x] 1.3 在 `md`（768px）以上尺寸，讓 `AppSidebar.vue` 忽略 `open` 狀態、恆常顯示且不渲染 overlay；驗證：新增測試以 CSS class 斷言側邊欄在桌機情境下不含收合 class（透過檢查 class 是否包含 `md:translate-x-0` 或等效恆顯示 class）
- [x] 1.4 依「App.vue 主內容區改用響應式 margin，僅在 md 以上套用 ml-64」與需求「Main content area does not reserve fixed sidebar space on narrow viewports」，將 `App.vue` 的 `main` class 由 `ml-64` 改為 `md:ml-64`，並新增小於 768px 時顯示的漢堡選單切換按鈕、以本地 `ref`（例如 `isSidebarOpen`）控制 `AppSidebar` 的 `open` 狀態；驗證：手動於瀏覽器 DevTools 將 viewport 設為 375px 寬，確認 `main` 元素不含左邊距且點擊漢堡按鈕可切換側邊欄顯示

## 2. Dashboard 頁面

- [x] 2.1 依「Dashboard layout reflows on narrow viewports」與「各頁面與元件改用 Tailwind 響應式工具類調整排列方向與間距」，調整 `src/views/Dashboard.vue` 的統計卡片容器為 `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`（或既有欄位數對應的響應式 grid），標題區改為 `flex-col md:flex-row`；驗證：手動於 375px 與 768px 寬度下確認統計卡片單欄排列、無橫向捲動

## 3. All Orders 頁面

- [x] 3.1 依「All Orders page filter row and list reflow on narrow viewports」，調整 `src/views/AllOrders.vue` 的篩選列為 `flex-col md:flex-row` 並加上適當 `gap`，避免窄螢幕橫向溢出；驗證：手動於 375px 寬度下確認篩選列縱向堆疊且無橫向捲動條
- [x] 3.2 確認 `AllOrders.vue` 的訂單表單 modal 觸發按鈕在 375px 寬度下維持在可視範圍內且可點擊；驗證：手動測試點擊按鈕可正常開啟 `OrderFormModal`

## 4. Order List 頁面

- [x] 4.1 依「Order List page header and actions reflow on narrow viewports」，調整 `src/views/OrderList.vue` 的標題區與操作按鈕為 `flex-col md:flex-row`，清單間距在窄螢幕縮小；驗證：手動於 375px 寬度下確認標題與按鈕縱向堆疊、清單項目間無重疊

## 5. Order Card 元件

- [x] 5.1 依「Order card content remains readable and tappable on narrow viewports」，調整 `src/components/orders/OrderCard.vue` 的文字、標籤容器加上 `flex-wrap`，按鈕在窄螢幕改為全寬或換行排列；驗證：`src/components/orders/__tests__/OrderCard.spec.js` 新增測試斷言標籤容器 class 含 `flex-wrap`

## 6. Status Filter Tabs 元件

- [x] 6.1 依「Status filter tabs remain usable on narrow viewports」，調整 `src/components/orders/StatusFilterTabs.vue` 的標籤列容器加上 `overflow-x-auto` 與 `flex-nowrap`，確保窄螢幕下可水平捲動且標籤不被截斷；驗證：手動於 375px 寬度下確認標籤列可水平捲動、所有標籤皆可點擊到達

## 7. Order Form Modal 元件

- [x] 7.1 依「Order form modal remains operable on narrow viewports」，調整 `src/components/orders/OrderFormModal.vue` 的 modal 容器加上 `max-h-[90vh] overflow-y-auto` 並縮減窄螢幕 padding；驗證：`src/components/orders/__tests__/OrderFormModal.spec.js` 新增測試斷言 modal 容器 class 含 `max-h-[90vh]` 與 `overflow-y-auto`
- [x] 7.2 調整 `OrderFormModal.vue` 表單欄位容器為 `grid-cols-1 md:grid-cols-2`，使窄螢幕下欄位單欄排列；驗證：`OrderFormModal.spec.js` 新增測試斷言表單欄位容器 class 含 `grid-cols-1` 與 `md:grid-cols-2`

## 8. 整體驗證

- [x] 8.1 執行 `npm run test:unit`（或專案既有測試指令）確認所有新增與既有元件測試皆通過；驗證：測試指令輸出全數 pass
- [x] 8.2 於瀏覽器 DevTools 依序將 viewport 設為 320px、375px、768px、1024px，手動走訪 Dashboard、AllOrders、OrderList（含分類頁）、UI Showcase 頁面，確認無橫向溢出、側邊欄可透過漢堡按鈕正常開關、`OrderFormModal` 可完整捲動操作；驗證：於本次改動的手動測試紀錄中列出每個尺寸與頁面的檢查結果
