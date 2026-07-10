## Context

Hakobi 目前用 Tailwind 4(`@tailwindcss/vite` plugin,無 `tailwind.config.js`,採 CSS-first 的 `@theme` 設定)。`src/assets/main.css` 目前只有 Vite 預設模板殘留的 CSS variables(`--accent`、`--text`、`--border` 等),完全沒被任何元件實際使用;所有元件(`Button`、`Card`、`Input`、`Table`、`Modal`、`StatusBadge`、`AppSidebar`、`App.vue`、`UiShowcase.vue`)目前都是直接寫死 Tailwind 內建的 `slate-*` 灰階 class。`index.html` 目前沒有引入任何 Google Fonts,字體走瀏覽器預設 `system-ui`。

使用者提供了一組完整的視覺規格(色彩、字體、圓角、陰影),源自一張參考截圖(暖色系代購/集運管理介面)。這次要把這組規格轉成 Tailwind 4 的 design tokens,套用到現有元件上。

## Goals / Non-Goals

**Goals:**

- 用 Tailwind 4 的 `@theme` 在 `main.css` 定義一組具名 design tokens(色彩、字體、圓角、陰影),取代目前寫死的 slate 灰階與未使用的舊 CSS variables
- 五個基礎元件、`StatusBadge`、`App.vue`、`AppSidebar.vue`、`UiShowcase.vue` 全部套用新 tokens
- 每個新增的視覺 token 至少有一個可在 `/ui-showcase` 頁面肉眼驗證的地方(延續「先讓畫面產生出來」的精神)

**Non-Goals:**

- 不修改 `src/stores/orders.js` 的資料結構或 `STATUSES`/`CATEGORIES` 定義 —— 狀態機重新設計屬於之後「預購商品功能建置」變更的範圍
- 不新增 icon-only 圓形按鈕(編輯/刪除圖示按鈕)—— `Table.vue` 目前沒有列操作按鈕,這個 UI 模式要等真實訂單列表(預購商品功能)出現時才有具體套用對象
- 不處理「強調卡(待付款項)」在真實 Dashboard/OrderList 頁面的套用 —— 這兩個頁面目前仍是空殼,這次只在 `UiShowcase.vue` 新增一個示範卡驗證樣式本身
- 不改變任何元件的 props/events 介面或互動行為,純視覺樣式調整

## Decisions

### Design tokens 定義在 main.css 的 Tailwind 4 @theme

在 `src/assets/main.css` 用 `@theme { ... }` 區塊定義下列具名 tokens(取代現有未使用的 `--accent`/`--text`/`--border` 等舊變數):

- 色彩(`--color-*`):
  - `--color-page-bg: #FFF8F2`(頁面背景)
  - `--color-sidebar-from: #FBEFE9`、`--color-sidebar-to: #F6E1EC`(側邊欄漸層,左上到右下)
  - `--color-sidebar-border: #F3D9E6`
  - `--color-card-border: #F3E4EC`(一般卡片邊框)、`--color-card-border-accent: #E3C9E8`(強調卡邊框)
  - `--color-primary-from: #8b6fba`、`--color-primary-to: #b78fa5`(主色漸層:按鈕、選中導覽、圖示底)
  - `--color-accentcard-from: #F6E1EC`、`--color-accentcard-to: #EDE1F5`(強調卡背景,如待付款項)
  - `--color-badge-category-bg: #F5E7DE`(分類標籤背景)
  - `--color-badge-status-bg: #F0E1EC`、`--color-badge-status-text: #6a4ab5`(狀態標籤背景/文字)
  - `--color-icon-cycle-1: #F5E7DE`、`--color-icon-cycle-2: #F0E1D6`、`--color-icon-cycle-3: #F6E1EC`、`--color-icon-cycle-4: #EDE1F5`、`--color-icon-cycle-5: #E3D9F2`(分類圖示圓底循環色)
  - `--color-ink: #5B3F63`(主要文字,深梅紫)、`--color-ink-muted: #C99BB8`(次要/說明文字,粉霧紫)
- 字體(`--font-*`):
  - `--font-heading: 'Baloo 2', system-ui, sans-serif`(標題/數字)
  - `--font-sans: 'Noto Sans TC', system-ui, sans-serif`(中文內文,粗細用既有 `font-bold`(700)/`font-extrabold`(800)/`font-black`(900) utility 控制)
- 圓角(`--radius-*`):
  - `--radius-card: 22px`(統計卡、分類卡、訂單卡、空狀態框 —— 這次先套用在 `Card.vue` 與 `Modal.vue` 的容器上)
  - `--radius-logo: 16px`(Logo 方塊)
  - 導覽項目/頁籤 pill/標籤 badge/新增按鈕的 999px,以及圖示圓框的 50%,直接沿用 Tailwind 內建的 `rounded-full` utility,不另外定義 token(`rounded-full` 在矩形元素上即為膠囊、在正方形元素上即為正圓,已滿足兩種需求)
- 陰影(`--shadow-*`):
  - `--shadow-card: 0 8px 24px -6px rgba(183, 143, 165, 0.14)`(卡片用)
  - `--shadow-emphasis: 0 10px 28px -6px rgba(139, 111, 186, 0.35)`(按鈕/選中導覽項目用)

Tailwind 4 會依這些 `--color-*`/`--font-*`/`--radius-*`/`--shadow-*` 命名自動產生對應 utility class(如 `bg-page-bg`、`text-ink`、`font-heading`、`rounded-card`、`shadow-card`),元件直接用這些 class,不用寫任意值(arbitrary value)。

理由:Tailwind 4 是 CSS-first 設定,把 tokens 集中定義在一處,之後要再調整色彩只需要改 `main.css` 一個地方,呼應 `add-ui-components` 設計文件裡「顏色集中管理方便之後整批替換」的既定方向。

### 字體引入方式:index.html 加 Google Fonts link,不做本地字體檔案

在 `index.html` 的 `<head>` 加入 Google Fonts 的 `<link rel="preconnect">` 與 `<link rel="stylesheet">`,引入 Baloo 2(weight 400–800)與 Noto Sans TC(weight 700–900)。

理由:專案目前沒有字體檔案或字體管理機制,Google Fonts CDN 是最快讓兩款字體上線的方式;之後若要做離線/自架字體,屬於另一個獨立變更。

### StatusBadge 改用固定的狀態標籤樣式,不再依 STATUSES.color 動態上色

`StatusBadge.vue` 目前用 `:style="{ backgroundColor: statusColor }"` 讀取 `orders.js` 的 `STATUSES[status].color`(每個狀態一個不同色相:橘/藍/綠/紫/紅)。改版後 `StatusBadge.vue` 一律使用固定的 `bg-badge-status-bg text-badge-status-text` class,不再依狀態動態變色;`orders.js` 的 `STATUSES[status].color` 欄位本身不修改(保留但變成未使用),因為狀態機本身會在後續「預購商品功能建置」變更整個重做。

理由:參考截圖裡的狀態標籤(如「已付訂金」)是統一的粉紫色系膠囊,不是每個狀態各自一色;这樣才符合使用者要的整體配色調性。這是一個會降低「不同狀態一眼辨色」能力的取捨,直接記錄在下面的風險段落。

### AppSidebar 新增 Logo 方塊與分類圖示循環底色

`AppSidebar.vue` 目前只有純文字標題(「Hakobi」+「Orders Management」),沒有 Logo 方塊。改版後在標題文字前新增一個 16px 圓角、主色漸層背景的小方塊(內放一個代表性 emoji,如 📦),還原參考截圖裡「圖示方塊 + 文字」的 Logo 排版。分類導覽清單(`categories` 迴圈產生的 5 個項目)每個項目的 emoji 圖示改包在一個 `rounded-full` 的小圓底裡,依索引依序套用 `--color-icon-cycle-1` 到 `5`(超過 5 個從頭循環)。

理由:這兩個元素在參考截圖裡都是明確可見、且都直接對應使用者提供的 token(Logo 方塊 16px、分類圖示圓底循環色),`AppSidebar.vue` 本來就在這次變更的受影響檔案清單裡,適合一併完成。

### UiShowcase 新增強調卡示範,驗證所有新 token

`UiShowcase.vue` 的 Card 區塊新增第二個示範卡,套用 `--color-accentcard-from/to` 漸層背景與 `--color-card-border-accent` 邊框,模擬「強調卡(待付款項)」的樣式(不連接真實訂單資料,純樣式示範,標題文字用「範例:強調卡(待付款)」)。

理由:`--color-accentcard-*` 這組 token 在這次變更沒有真實頁面(Dashboard/OrderList 仍是空殼)可以套用,但如果不在任何地方渲染出來,就無法用瀏覽器肉眼驗證顏色是否正確,不符合「先讓畫面產生出來」的精神,所以用展示頁補一個純樣式範例。

## Implementation Contract

**行為(Behavior)**:
- 開啟任何頁面(Dashboard、`/ui-showcase`、`/orders/:category`)時,頁面背景、側邊欄、卡片、按鈕、輸入框、表格、Modal、標籤徽章皆呈現新的暖色系配色(米白背景、側邊欄漸層、主色紫漸層按鈕/選中項),不再是 slate 灰階
- 標題與數字文字使用 Baloo 2 字體渲染(圓潤感明顯區別於中文內文字體),中文內文使用 Noto Sans TC、字重落在 700–900 之間的地方(如卡片標題、按鈕文字)明顯比一般內文粗
- `AppSidebar.vue` 頂部出現一個 16px 圓角、主色漸層底的 Logo 方塊;五個分類導覽項目的 emoji 圖示各自包在不同循環色的圓底裡
- `/ui-showcase` 的 Card 區塊可以看到一般卡片與強調卡(漸層背景)兩種樣式並存

**介面 / 資料形狀(Interface / data shape)**:
- `main.css` 新增 `@theme` 區塊,輸出上述具名 CSS 變數與對應 Tailwind utility class(`bg-page-bg`、`text-ink`、`text-ink-muted`、`font-heading`、`rounded-card`、`rounded-logo`、`shadow-card`、`shadow-emphasis`、`bg-badge-category-bg`、`bg-badge-status-bg`、`text-badge-status-text`、`bg-icon-cycle-1`~`5`、以及漸層用的 `from-sidebar-from`/`to-sidebar-to`、`from-primary-from`/`to-primary-to`、`from-accentcard-from`/`to-accentcard-to`)
- `index.html` 新增 Google Fonts 的 `<link>` 標籤(Baloo 2、Noto Sans TC)
- 元件 props/events 介面不變(沿用 `openspec/specs/ui-components/spec.md` 既有定義)

**失敗模式(Failure modes)**:
- 若 Google Fonts CDN 載入失敗或被封鎖,瀏覽器會 fallback 到 `system-ui`,不影響版面結構或功能,只是字體觀感退回系統預設,不需要額外的錯誤處理邏輯

**驗收標準(Acceptance criteria)**:
- `npm run dev` 啟動後,`/ui-showcase` 頁面背景為 `#FFF8F2`、側邊欄呈現漸層、Logo 方塊與分類圖示圓底可見、Card 區塊有一般卡片與強調卡兩種樣式、按鈕與選中導覽項目呈現主色漸層與陰影、標題文字明顯使用 Baloo 2(圓潤字型,肉眼可辨識與中文內文不同)
- 瀏覽器 DevTools 檢查任一標題元素,`font-family` computed style 應包含 `Baloo 2`
- 瀏覽器 console 無 404(字體載入失敗除外,那只會是 network 警告不是 console error)或其他錯誤

**範圍邊界(Scope boundaries)**:
- 範圍內:`main.css` 的 `@theme` tokens、`index.html` 的字體引入、五個基礎元件、`StatusBadge.vue`、`App.vue`、`AppSidebar.vue`(含新增 Logo 方塊與分類圖示循環色)、`UiShowcase.vue`(含新增強調卡示範)
- 範圍外:`Dashboard.vue`、`OrderList.vue` 的實際內容或資料串接;`orders.js` 的 `STATUSES`/`CATEGORIES` 定義;任何 icon-only 圓形操作按鈕(編輯/刪除)的新增

## Risks / Trade-offs

- [風險] 次要文字色 `#C99BB8`(粉霧紫)在頁面背景 `#FFF8F2`(暖米白)上的對比度偏低,粗估對比比約在 2:1~2.5:1,低於 WCAG AA 對一般文字要求的 4.5:1 → [緩解] 只把這個顏色用在較大字級或非關鍵說明文字(如卡片副標、輔助說明),不用在小字級的重要資訊上;這是使用者明確指定的色號,這裡先記錄風險,不擅自更換色值
- [風險] `StatusBadge` 統一用單一配色後,不同狀態(待付款/已出貨/已完成等)不再能靠顏色一眼分辨,只能靠文字 → [緩解] 狀態機本身會在後續「預購商品功能建置」變更重新設計,屆時可以一併重新評估是否需要狀態間的顏色差異(例如用不同飽和度而非完全不同色相,維持整體色系一致又保留辨識度)
- [風險] Google Fonts 屬於外部 CDN 依賴,離線開發環境下標題字體會 fallback 成系統字體,視覺跟設計稿不完全一致 → [緩解] 不影響功能,純視覺退化,且專案目前本來就需要網路環境跑 `npm run dev` 的其他資源
