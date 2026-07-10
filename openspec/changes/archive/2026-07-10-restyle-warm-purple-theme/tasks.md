## 1. Design tokens 與字體基礎建設

- [x] 1.1 在 `src/assets/main.css` 依設計決策「Design tokens 定義在 main.css 的 Tailwind 4 @theme」新增 `@theme` 區塊,定義色彩(`page-bg`、`sidebar-from/to`、`sidebar-border`、`card-border`、`card-border-accent`、`primary-from/to`、`accentcard-from/to`、`badge-category-bg`、`badge-status-bg`、`badge-status-text`、`icon-cycle-1`~`5`、`ink`、`ink-muted`)、字體(`heading`、`sans`)、圓角(`card`、`logo`)、陰影(`card`、`emphasis`)tokens,移除未使用的舊 `--accent`/`--text`/`--border` 等變數;於瀏覽器 DevTools 檢查 `<body>` 或任一元素可以套用 `bg-page-bg`、`rounded-card`、`shadow-card` 等新 class 且樣式生效。
- [x] 1.2 在 `index.html` 依設計決策「字體引入方式:index.html 加 Google Fonts link,不做本地字體檔案」新增 Google Fonts 的 `<link rel="preconnect">` 與 `<link rel="stylesheet">`,引入 Baloo 2(400–800)與 Noto Sans TC(700–900);手動於 DevTools 檢查任一標題元素的 computed `font-family` 包含 `Baloo 2`。

## 2. 基礎元件套用新樣式

- [x] 2.1 `Button.vue` 的 primary variant 改用 `primary-from`→`primary-to` 漸層背景與 `shadow-emphasis` 陰影,其餘 variant(secondary/ghost)改用新色彩 tokens、danger 維持既有紅色系不變;手動驗證四種 variant 在 `/ui-showcase` 呈現新配色且 primary 有明顯漸層與陰影。
- [x] 2.2 `Card.vue` 容器改用 `rounded-card`(22px)圓角、`card-border` 邊框、`shadow-card` 陰影,文字顏色改用 `ink`/`ink-muted`;手動驗證 `/ui-showcase` 的 Card 範例呈現新圓角與陰影。
- [x] 2.3 `Input.vue` 的邊框改用 `card-border`、focus 邊框/ring 改用 `primary-from` 色系、label 文字改用 `ink`、`error` 狀態維持既有紅色系不變;手動驗證輸入框 focus 時呈現新的紫色系邊框,error 狀態仍為紅色可辨識。
- [x] 2.4 `Table.vue` 外框改用 `rounded-card`、`card-border`,表頭背景改用 `badge-category-bg`,文字顏色改用 `ink`/`ink-muted`;手動驗證 `/ui-showcase` 的 Table 範例呈現新配色與圓角。
- [x] 2.5 `Modal.vue` 內容容器改用 `rounded-card`、文字顏色改用 `ink`;手動驗證開啟 Modal 時呈現新圓角與文字色。
- [x] 2.6 `StatusBadge.vue` 依設計決策「StatusBadge 改用固定的狀態標籤樣式,不再依 STATUSES.color 動態上色」與規格需求 UI components render using shared warm-purple design tokens 的「Status badges use a uniform status color」情境,改用固定的 `badge-status-bg`/`badge-status-text` class,不再讀取 `STATUSES[status].color`;手動驗證 `/ui-showcase` 的 Table 狀態欄不同狀態(待處理/處理中/已出貨)呈現相同的背景與文字顏色,只有文字標籤不同。

## 3. App shell 與展示頁整合

- [x] 3.1 `App.vue` 的最外層容器背景改用 `page-bg`;手動驗證所有頁面背景呈現暖米白色 `#FFF8F2`。
- [x] 3.2 `AppSidebar.vue` 依設計決策「AppSidebar 新增 Logo 方塊與分類圖示循環底色」:背景改為 `sidebar-from`→`sidebar-to` 漸層、邊框改用 `sidebar-border`;標題文字前新增一個 `rounded-logo`(16px)、主色漸層背景的 Logo 方塊;五個分類導覽項目的 emoji 圖示改包在 `rounded-full` 圓底裡,依索引依序套用 `icon-cycle-1`~`5`(循環使用);選中的導覽項目(Dashboard/UI 元件展示/各分類)改用 `primary-from`→`primary-to` 漸層背景與 `shadow-emphasis`;手動驗證側邊欄呈現漸層背景、Logo 方塊、分類圖示圓底循環色,且點擊切換分類時選中項目有漸層與陰影效果。
- [x] 3.3 `UiShowcase.vue` 依設計決策「UiShowcase 新增強調卡示範,驗證所有新 token」在 Card 區塊新增一個套用 `accentcard-from`→`accentcard-to` 漸層背景與 `card-border-accent` 邊框的強調卡範例(標題「範例:強調卡(待付款)」);手動驗證 `/ui-showcase` 頁面可同時看到一般卡片與強調卡兩種樣式並存,且整頁背景、側邊欄、按鈕、輸入框、表格、Modal、標籤皆呈現新的暖色系配色,瀏覽器 console 無錯誤。
