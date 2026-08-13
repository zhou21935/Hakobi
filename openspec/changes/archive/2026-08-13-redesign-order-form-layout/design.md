## Context

現有新增與編輯訂單共用 `OrderFormModal.vue`，透過 `Modal.vue` 提供置中、最大寬度 448px 的對話框。表單已具備訂單分類、商品資料、付款狀態、貨物日期、物流與備註，但以連續欄位排列，缺乏資訊區塊與針對三種裝置尺寸的版型。參考壓縮檔提供單一響應式對話框、純桌機與純手機範例；本專案採單一響應式方案，且必須保留 Hakobi 現有色彩 token、驗證、submit payload 與新增／編輯共用行為。

## Goals / Non-Goals

**Goals:**

- 將表單組織為商品、貨物、物流、備註四個有標題與視覺邊界的區塊。
- 以同一份欄位 DOM 與 state 支援手機、平板、電腦，避免三套表單行為分岔。
- 保留現有訂單分類與商品分類語意、驗證、pending 防重送及新增／編輯資料回填。
- 提供訂單號碼輸入，以及附件多選、檔名／類型清單與移除互動。
- 以元件測試鎖定 RWD class contract、新欄位不進入 payload，以及表單重開後暫存值清除。

**Non-Goals:**

- 不修改 `src/stores/orders.js`、`src/services/ordersApi.js`、後端 schema、API 或資料庫。
- 不保存訂單號碼，不上傳或保存附件，不在編輯模式回填這兩類資料。
- 不變更現有必填欄位、URL 驗證、分類選項、狀態選項或貨幣選項。
- 不變更取消、送出等操作按鈕的既有品牌配色，不新增字型或第三方依賴。
- 不將新增與編輯拆成不同表單元件，也不建立手機／平板／電腦三套元件。

## Decisions

### 單一響應式訂單表單與四區塊結構

`OrderFormModal.vue` 繼續同時擁有新增與編輯模式，並用商品、貨物、物流、備註四個 section 呈現。商品與備註在電腦跨越兩欄，貨物與物流各占一欄；手機和平板依尺寸收斂欄位欄數。這讓欄位、驗證與 submit 邏輯維持單一來源。替代方案是拆三個 viewport 元件，但會複製 state、錯誤訊息與事件契約，因此拒絕。

### Modal 提供具預設值的樣式介面

擴充 `Modal.vue` 以 props 或具名 slots／class props 提供 overlay、panel、header、content、footer 的響應式樣式控制；既有呼叫端未傳新設定時維持目前 max-width、置中與間距。訂單表單使用該介面實現：小於 640px 底部貼齊且高度 92dvh、640–1023px 置中且寬 560px、1024px 起寬 880px；內容獨立捲動，footer 固定在 panel 底部，並保留背景捲動鎖定、Escape 與遮罩關閉。

替代方案是在 `OrderFormModal.vue` 重新實作 Teleport、focus／scroll lifecycle 與 overlay，會複製共用 Modal 已有行為，因此拒絕。

### 非按鈕表面依參考設計且按鈕維持品牌色

參考檔作為資訊階層、尺寸、間距、RWD 行為及非按鈕表面的視覺依據。Modal content 與商品、貨物、物流、備註四個 section body 使用相同白色底色，避免區塊外圍出現不同色帶；Modal header（新增／編輯訂單標題區）保留目前淡紫底色。section header、輸入框、選單、日期欄位、複選 chip、附件區的邊框、圓角與高度依參考畫面調整；取消與送出等操作按鈕繼續使用既有 `Button` variant 與 Hakobi 品牌色。共用輸入元件若需要外觀覆寫，使用具安全預設值的 class interface，避免全站其他表單被無意改色。

### 備註使用可換行的多行輸入

備註內容不得再使用單行 `Input`。訂單表單改用與其他欄位視覺一致的 textarea，手機與平板最小高度 120px、電腦最小高度 104px，保留垂直調整大小能力並以 `white-space: pre-wrap` 等價的原生 textarea 行為接受換行。submit payload 仍使用既有 `notes: string`，不改驗證、store 或 API 契約。

### 訂單號碼與附件保持純前端暫存

`OrderFormModal.vue` 內部新增 `orderNumber` 字串與 `files` 陣列。附件項目至少保留供畫面使用的 `name` 與副檔名類型，支援 input multiple、PDF／圖片 accept、選取後列出及逐筆移除。`handleSubmit` 明確只組合既有 payload 欄位，不展開完整 form，也不加入 `orderNumber` 或 `files`。每次開啟表單執行 reset，兩者回到空值；編輯模式同樣不回填。

替代方案是將新欄位放入 store 或 API payload，但後端 strict schema 會拒絕未知欄位，且違反本期純前端範圍，因此拒絕。

### 既有分類與驗證契約不變

訂單分類在全訂單新增模式仍要求選擇海外代購或集運包裹；分類 route 新增模式維持鎖定；編輯模式維持原分類。商品分類仍是周邊、書籍、其他複選，不採參考檔的公仔模型、服飾、3C。名稱、正金額、至少一個商品分類與安全 URL 等現有驗證繼續控制是否 emit submit。

## Implementation Contract

**Observable behavior**

- 新增與編輯表單皆顯示商品、貨物、物流、備註四區塊與目前模式標題。
- 在 390px 寬 viewport，panel 自底部展開、表單欄位單欄、內容可捲動、操作列固定；在 768px，panel 置中且貨物日期可雙欄；在 1280px，panel 約 880px 且貨物與物流左右排列。
- 訂單號碼可輸入；附件 input 可一次選取多檔，清單顯示每個檔名與類型，使用者可移除任一檔案。
- 備註內容顯示為多行 textarea，至少可看見數行文字，輸入 Enter 換行後 submit payload 的 `notes` 保留換行字元。
- Modal content 與商品、貨物、物流、備註四個大區塊的底色皆為白色；新增／編輯訂單標題區維持目前淡紫底色；所有表單 controls 的非按鈕邊框、圓角、高度與間距符合參考畫面，取消與送出按鈕顏色維持目前 Hakobi 樣式。
- 關閉後重新開啟時，訂單號碼與附件清單為空。
- 有效表單送出時，`submit` event 維持目前欄位集合；payload MUST NOT 擁有 `orderNumber` 或 `files` property。
- pending 時送出按鈕維持 disabled 且不 emit；現有欄位驗證失敗時顯示原錯誤並不 emit。

**Interface and data shape**

- `OrderFormModal` props 與 emits 保持相容：`modelValue`, `order`, `pending`, `category`；`update:modelValue`, `submit`。
- 新的本地附件顯示項目為 `{ name: string, type: string }` 或等價且不離開元件的結構；原始 `File` 可在元件開啟期間保留，但不得進入 submit event。
- `Modal` 新增的樣式控制介面必須全部具有維持既有外觀的預設值，其他 Modal 呼叫端不需修改。
- 表單 control 的外觀覆寫必須是 caller opt-in；未提供外觀設定的 `Input`、`Select`、`MultiSelect`、`Checkbox` 不得改變。

**Failure modes**

- 不支援的檔案由 native `accept` 限制；本期不顯示上傳成功訊息，因為不會執行上傳。
- 同名附件可依選取次序各自顯示與移除，render key 不得只依賴檔名。
- 取消、Escape 或遮罩關閉皆不得提交；下一次開啟必須重設本地新欄位。

**Acceptance criteria**

- `tests/components/orders/OrderFormModal.spec.js` 驗證四區塊、三種 breakpoint class、分類選項、訂單號碼與附件互動、重開清除、payload 排除與既有驗證／pending 行為。
- `tests/components/orders/OrderFormModal.spec.js` 另驗證備註是 textarea、可提交包含換行的字串、Modal content 與四個大區塊使用白色底色、標題區仍為淡紫底色，以及按鈕仍使用原 variant。
- `tests/components/ui/Modal.spec.js` 驗證新增樣式介面的預設相容性、響應式 override 以及既有 Escape、overlay、scroll lock 行為。
- 執行 `npm test` 與 `npm run build` 均成功，並以 390px、768px、1280px viewport 做視覺確認，無水平溢位且 footer 可操作。

**Scope boundaries**

- In scope: `OrderFormModal.vue`、必要的 `Modal.vue` 相容性擴充、兩者測試與純前端附件互動。
- Out of scope: store、API client、後端、資料庫、檔案儲存服務、訂單詳情／卡片顯示新欄位，以及正式附件安全掃描與容量限制。

## Risks / Trade-offs

- [Risk] 共用 Modal 的樣式擴充可能改變其他對話框 → 新介面使用現有 class 作預設值，並以既有 Modal 測試確認零設定呼叫端不變。
- [Risk] 880px panel 在短螢幕溢出 → panel 限制最大高度，只有內容區捲動，header／footer 保持可見。
- [Risk] 純前端欄位可能讓使用者誤以為已保存 → 不顯示上傳完成狀態，change artifacts 明確排除保存；後續正式串接前不在訂單詳情顯示。
- [Risk] 同一欄位為配合桌機位置而重複渲染會造成 state、label 或無障礙問題 → 使用單一 control 並以 grid placement 調整位置，不建立兩個綁定同一 state 的 input。
- [Risk] 直接修改共用 Input／Select 預設樣式會影響登入與其他頁面 → 以訂單表單 opt-in class props 或 scoped wrapper 套用參考外觀，並以共用元件既有測試確認預設不變。
