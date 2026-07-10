## Context

專案是 Vue 3 + Pinia + Vue Router + Tailwind 4(`hakobi` 訂單管理系統)。目前 `src/components/` 只有兩個特定用途元件(`AppSidebar.vue`、`StatusBadge.vue`),`Dashboard.vue`、`OrderList.vue` 都是空殼畫面。`src/assets/main.css` 有一組 CSS variables(`--accent`、`--text`、`--border` 等),但屬於 Vite 預設模板殘留,目前畫面(`App.vue`、`AppSidebar.vue`)實際用的是 Tailwind 內建的 slate 色階。這次要新增一組基礎 UI 元件,讓畫面可以先組裝出來,之後再迭代視覺風格。

## Goals / Non-Goals

**Goals:**

- 定義五個基礎元件(`Button`、`Card`、`Input`、`Table`、`Modal`)的 props/events 介面,讓後續頁面開發可以直接組裝
- 元件視覺上與現有 `App.vue`/`AppSidebar.vue` 的 slate 色階一致,不引入 `main.css` 裡的 `--accent` 紫色或其他品牌色
- 新增一個展示頁(`UiShowcase.vue`),把五個元件實際渲染在畫面上,並可透過側邊欄導覽進入,讓使用者能在瀏覽器中看到並調整風格

**Non-Goals:**

- 不引入外部 UI 元件庫(PrimeVue、Element Plus 等)
- 不將 `Dashboard.vue`、`OrderList.vue` 串接 `orders` store 的真實資料
- 不新增圖示套件,繼續沿用現有 emoji 風格
- 不建立主題切換(dark mode toggle)或設計 token 系統,元件先用固定的 Tailwind class

## Decisions

### Button 元件的 variant/size 介面

`Button.vue` 提供 `variant`(`'primary' | 'secondary' | 'danger' | 'ghost'`,預設 `'primary'`)與 `size`(`'sm' | 'md' | 'lg'`,預設 `'md'`)兩個 props,以及 `disabled`(Boolean)、`type`(原生 button type,預設 `'button'`)。點擊時透過原生 `click` 事件冒泡(不重新命名 emit),內容用 default slot 傳入文字或圖示。

理由:variant/size 是最常見的按鈕分類方式,能覆蓋目前預期的操作(送出表單、次要操作、刪除、無底色的次要連結),且用固定字串聯集而非布林旗標組合,避免狀態爆炸。

### Card 元件的 slot 結構

`Card.vue` 提供 default slot(主要內容)與具名 slot `header`、`footer`(皆為選用),並提供 `padding` prop(Boolean,預設 `true`)控制是否套用預設內距。

理由:Dashboard 統計卡片、之後的訂單卡片都會需要「可選標題列 + 內容 + 可選底部操作列」的結構,用具名 slot 比新增多個 title/footer 字串 props 更有彈性,允許放任意內容(如按鈕、徽章)。

### Input 元件走 v-model 而非手動綁定

`Input.vue` 透過 `modelValue` prop 與 `update:modelValue` emit 支援 `v-model`,額外提供 `label`(String,選用)、`type`(String,預設 `'text'`)、`placeholder`、`error`(String,驗證錯誤訊息,選用)、`disabled`。當 `error` 有值時,邊框轉為紅色並在下方顯示錯誤文字。

理由:v-model 是 Vue 表單元件的標準介面,之後訂單表單(新增/編輯)會大量使用;內建 `error` 顯示避免每個使用場景都要重寫錯誤訊息排版。

### Table 元件用 columns + scoped slot 客製欄位

`Table.vue` 接受 `columns`(Array,元素為 `{ key, label }`)與 `rows`(Array,任意物件陣列)兩個必要 props,並提供 `emptyText`(String,預設 `'尚無資料'`)。每個欄位預設直接顯示 `row[column.key]`,若使用者提供具名 scoped slot `#cell-<key>="{ row }"` 則優先使用該 slot 渲染該欄內容(例如用 `StatusBadge` 渲染狀態欄)。

理由:訂單資料欄位多且部分欄位(狀態、金額)需要客製渲染(如套用 `StatusBadge`),純資料驅動的 columns/rows 搭配可選 scoped slot,比每個欄位都開一個獨立 prop 更容易擴充,也讓 `Table` 元件不需要知道 `StatusBadge` 的存在。

### Modal 元件走 v-model 控制開關

`Modal.vue` 透過 `modelValue` prop(Boolean)與 `update:modelValue` emit 支援 `v-model` 控制顯示/隱藏,並提供 `title`(String,選用)。內容用 default slot,操作按鈕區用具名 slot `footer`(選用)。點擊遮罩或按 Esc 鍵會 emit `update:modelValue` 為 `false` 並額外 emit `close` 事件。

理由:v-model 讓外部呼叫端(如「新增訂單」按鈕)只需綁定一個 boolean ref;分離 `update:modelValue` 與 `close` 讓使用者可以區分「純粹關閉」與「需要額外處理的關閉」(例如清空表單)。

### UiShowcase 頁面與導覽

新增 `src/views/UiShowcase.vue`,在同一頁面依序渲染五個元件的多種狀態範例(例如 Button 的四種 variant、Table 帶 3 筆假資料、Modal 用一個按鈕觸發開關)。在 `src/router/index.js` 新增路由 `path: '/ui-showcase'`、`name: 'UiShowcase'`;在 `AppSidebar.vue` 的導覽選單新增一個項目(emoji 圖示,例如 🎨)連到該路由,放在 Dashboard 項目之後、Orders 分類之前。

理由:「讓畫面先產生出來」需要一個實際可以在瀏覽器看到全部元件的地方;放在既有側邊欄導覽下最省事,不需要新增額外的 layout。

## Implementation Contract

**行為(Behavior)**:
- 使用者從側邊欄點擊新增的導覽項目後,瀏覽器導向 `/ui-showcase`,頁面顯示 Button(4 種 variant × 各 size 範例各至少一顆)、Card(含 header/footer 範例)、Input(含一般狀態與 `error` 狀態各一個)、Table(3 筆假資料,其中狀態欄使用 `StatusBadge` 透過 `#cell-status` scoped slot 渲染)、Modal(一顆觸發按鈕,點擊後開啟 Modal,顯示 title 與 footer 內的關閉按鈕,點擊遮罩或按鈕皆可關閉)。
- 所有元件皆可在其他 `.vue` 檔案中被 `import` 並使用,不依賴 `UiShowcase.vue` 才能運作。

**介面 / 資料形狀(Interface / data shape)**:
- `Button.vue`:props `variant: 'primary' | 'secondary' | 'danger' | 'ghost'`(預設 `'primary'`)、`size: 'sm' | 'md' | 'lg'`(預設 `'md'`)、`disabled: Boolean`(預設 `false`)、`type: String`(預設 `'button'`);default slot。
- `Card.vue`:props `padding: Boolean`(預設 `true`);slots `default`、`header`(選用)、`footer`(選用)。
- `Input.vue`:props `modelValue: String | Number`、`label: String`(選用)、`type: String`(預設 `'text'`)、`placeholder: String`(選用)、`error: String`(選用)、`disabled: Boolean`(預設 `false`);emit `update:modelValue`。
- `Table.vue`:props `columns: Array<{ key: String, label: String }>`(必要)、`rows: Array<Object>`(必要)、`emptyText: String`(預設 `'尚無資料'`);scoped slot `cell-<key>="{ row }"`(選用,依 columns 的 key 動態決定 slot 名稱)。
- `Modal.vue`:props `modelValue: Boolean`(必要)、`title: String`(選用);emits `update:modelValue`、`close`;slots `default`、`footer`(選用)。

**失敗模式(Failure modes)**:
- `Table.vue` 在 `rows` 為空陣列時顯示 `emptyText` 文字,不拋錯。
- `Table.vue`、`Modal.vue` 的必要 props 缺漏時屬開發期錯誤,依 Vue 預設行為在 console 顯示 prop 驗證警告,不需要額外的 runtime 檢查或 fallback UI。

**驗收標準(Acceptance criteria)**:
- `npm run dev` 啟動後,從側邊欄可以導覽到 `/ui-showcase`,五個元件皆有渲染且無 console 錯誤。
- Modal 範例的開關互動(觸發按鈕開啟、遮罩或 footer 按鈕關閉)可手動操作驗證。
- Table 範例的狀態欄實際渲染出 `StatusBadge`,而非原始字串。

**範圍邊界(Scope boundaries)**:
- 範圍內:五個元件本身、`UiShowcase.vue`、路由新增、側邊欄新增一個導覽項目。
- 範圍外:`Dashboard.vue`、`OrderList.vue` 的內容重寫或資料串接;圖示套件安裝;`main.css` 既有 CSS variables 的調整或套用;元件的自動化測試框架導入決策(交由 tasks 依 `.spectra.yaml` 的 `tdd: true` 設定決定測試方式)。

## Risks / Trade-offs

- [風險] 元件目前用固定 Tailwind class,之後套用自訂風格時可能需要大量改動 class 名稱 → [緩解] 顏色/間距集中寫在單一 `<script setup>` 內的 class 字串或 computed,方便之後整批替換
- [風險] `Table.vue` 的動態 scoped slot 名稱(`cell-<key>`)對不熟悉 Vue scoped slot 的維護者較不直覺 → [緩解] 在元件內加上簡短範例用法於 `UiShowcase.vue` 中示範
