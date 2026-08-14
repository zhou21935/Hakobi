## Context

側欄目前直接嵌入 📦、📊 與 👤 emoji，分類項目也共用包裹 emoji；其外觀會隨作業系統與字型改變。頁籤雖引用 `/favicon.svg`，專案內沒有該資產，router 另會把 `document.title` 改成各路由名稱。複製控制則以文字與成功勾號表達狀態。全站現況由 heading 使用 Baloo 2、一般文字使用 Noto Sans TC，且載入網址只提供 Noto Sans TC 的 700、800、900 字重。

## Goals / Non-Goals

**Goals:**

- 以可重用、可測試的 SVG 元件呈現 Hakobi 品牌與使用者指定的四個導覽 icon。
- 提供實際存在的 Hakobi favicon，並讓頁籤標題固定為 `Hakobi`。
- 讓複製控制使用指定 copy icon，同時保留可存取名稱與既有狀態回饋。
- 不新增 icon 套件或執行期網路請求。
- 全站 heading 與一般文字統一使用 Chiron GoRound TC，預設字重為 Medium 500。

**Non-Goals:**

- 不改動路由、導覽順序、訂單分類或複製資料流程。
- 不重設整體色票、字型與側欄響應式行為。
- 不替換其他頁面已存在且非 emoji 的 SVG action icon。
- 不移除元件為強調語意而明確指定的 bold／semibold utility class。

## Decisions

### 匯入正式 Hakobi 品牌 SVG 資產

品牌唯一來源是 `C:\Users\User\Downloads\Hakobi logo 三方案評選.zip` 內的 `logo/hakobi-logo.svg` 與 `logo/hakobi-icon.svg`。實作時 MUST 原樣解壓並分別放置為 `public/hakobi-logo.svg` 與 `public/favicon.svg`，不得自行重畫、改色、轉為不同 path 或以 PNG 取代。側欄透過 `<img>` 載入正式 logo；瀏覽器直接載入正式 icon，確保 Vue 啟動前也能呈現品牌。

### 建立集中式 AppIcon SVG 元件

新增 `AppIcon` 元件，以受限的 `name` prop 提供 `overview`、`agent`、`parcel`、`profile` 與 `copy` 五個功能變體。功能 icon 使用使用者提供的 Font Awesome path；裝飾性 SVG 設為 `aria-hidden`，可存取名稱由既有連結或按鈕文字／`aria-label` 提供。集中元件比在模板重複 path 更容易維持尺寸、`currentColor` 與測試識別；不引入外部 icon 套件可避免增加 bundle 與版本依賴。正式品牌 logo 與 icon 不納入此元件，以免複製品牌 SVG 內容。

### 固定頁籤品牌識別

`index.html` 保留 SVG favicon link，指向實際新增的 `public/favicon.svg`，靜態 `<title>` 設為 `Hakobi`。router 的 `afterEach` 不再依路由 meta 改變標題，而是每次導覽都設為固定 `Hakobi`；既有 meta title 可保留供未來頁面內文或其他用途。

### 複製 icon 與狀態文字共存

複製按鈕預設顯示 copy SVG 與 `複製` 文字，成功後仍顯示 `已複製 ✓`，錯誤仍顯示現有訊息。如此符合 icon 替換需求，也不犧牲目前測試與使用者依賴的明確狀態回饋。

### 統一 Chiron GoRound TC 與 Medium 500 預設字重

`index.html` 保留既有 Google Fonts 與 gstatic preconnect，但 stylesheet URL 改為使用者指定的 `https://fonts.googleapis.com/css2?family=Chiron+GoRound+TC:wght@200..900&display=swap`。`main.css` 的 `--font-heading` 與 `--font-sans` 都改以 `Chiron GoRound TC` 為第一順位，body 設定 `font-weight: 500`。保留 variable weight 200–900 可讓既有 `font-semibold`、`font-bold` 等語意強調正常運作；未指定字重的全站文字則採 Medium 500。

## Implementation Contract

- `public/hakobi-logo.svg` 與 `public/favicon.svg` MUST 分別與壓縮檔內 `logo/hakobi-logo.svg`、`logo/hakobi-icon.svg` 的位元內容一致；品牌資產不得自行重畫或修改。
- `AppIcon` MUST 接受 `overview`、`agent`、`parcel`、`profile`、`copy` 五個合法名稱並渲染對應 SVG；所有功能圖形使用 `currentColor`，不接受任意 SVG path 或 HTML 字串。
- 側欄品牌區 MUST 以影像渲染 `/hakobi-logo.svg`，且導覽依序使用 `overview`、`agent`、`parcel`、`profile`；側欄內不得再出現 📦、📊、👤 emoji。
- 首次載入與每次 router 導覽後，`document.title` MUST 為精確字串 `Hakobi`；`/favicon.svg` MUST 是壓縮檔提供的正式 Hakobi icon。
- 有值的 `CopyableDetailValue` MUST 在複製按鈕內渲染 `copy` icon，並保留 `aria-label="複製 <label>"`、Clipboard API 行為、兩秒成功重設與失敗訊息；空值仍不得渲染按鈕。
- `index.html` MUST 只載入使用者指定的 Chiron GoRound TC Google Fonts stylesheet，不得繼續載入 Baloo 2 或 Noto Sans TC；兩個 preconnect MUST 保留。
- `--font-heading` 與 `--font-sans` MUST 都以 `'Chiron GoRound TC'` 為第一順位，body MUST 使用 `font-weight: 500`；元件明確指定的其他字重 utility 不在移除範圍。
- 驗收 MUST 由 AppSidebar、CopyableDetailValue 與 router 測試確認 icon 識別、emoji 移除、可存取名稱及固定頁籤名稱，並以完整前端測試套件與 production build 通過為準。
- 範圍只包含品牌／功能 icon、favicon、頁籤標題與相關測試；不改變 API、資料模型、路由目的地或控制流程。

## Risks / Trade-offs

- [正式素材目前來源位於工作區外的 Downloads 壓縮檔] → 實作時將兩個 SVG 複製進版本控制，並以位元比較確認沒有轉碼或修改。
- [logo SVG 自帶 `role="img"` 與 `aria-label="Hakobi"`] → 側欄 `<img>` 使用清楚的 `alt="Hakobi"`，測試確認品牌名稱不因載入方式而遺失。
- [小尺寸 SVG 細節可能不清楚] → 導覽 icon 使用簡化填色 path 與一致尺寸，favicon 使用幾何較少的 brand mark。
- [Google Fonts 載入失敗或被阻擋] → CSS 保留 `system-ui, sans-serif` fallback，避免文字不可見。
