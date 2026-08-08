## Context

訂單詳情由 `OrderDetailsModal` 組合欄位內容，再交給共用 `Modal` 提供遮罩、標題、可捲動內容區與固定 footer。現況只有內容區使用 `overflow-y-auto`，但 Modal 開啟時未鎖定文件背景，因此長頁面與長 Modal 會同時保留捲動能力。詳情區塊的單欄／雙欄規則不一致，日期格式化也未處理 API 回傳含時間的字串。

本次改動影響共用 Modal 行為與訂單詳情視覺，但不改變訂單資料模型、API 或編輯流程。使用者包含桌面滑鼠、鍵盤與手機觸控操作情境。

## Goals / Non-Goals

**Goals:**

- Modal 開啟時只讓內容區捲動，背景文件不可捲動，關閉或卸載後完整還原。
- 以一致的資訊卡建立清楚的詳情分區，桌面雙欄、窄螢幕單欄。
- 讓 footer 操作持續可見，並以低干擾但仍可辨識的捲動條提示更多內容。
- 業務日期固定為 `YYYY/MM/DD`，系統時間固定為台北時區的 `YYYY/MM/DD HH:mm`。

**Non-Goals:**

- 不變更後端日期儲存、API payload、訂單 schema 或時區來源。
- 不修改訂單表單、卡片、列表或其他非詳情內容的視覺配置。
- 不完全隱藏捲動條，也不引入第三方捲動元件。

## Decisions

### 共用 Modal 負責背景捲動鎖定與還原

`Modal` 依 `modelValue` 的開關狀態同時管理 `document.documentElement.style.overflow` 與 `document.body.style.overflow`。開啟前分別保存原值，開啟時設為 `hidden`，關閉或元件卸載時逐一還原保存值。瀏覽器可能將頁面捲動掛在 `html` 或 `body`，兩者必須共同鎖定才能避免不同環境仍出現第二條捲動軸。此責任屬於遮罩元件，而非每個使用者自行處理。

替代方案是只在 `OrderDetailsModal` 鎖定背景，但會留下其他長內容 Modal 的相同行為，故不採用。實作必須避免重複開關導致保存值被覆寫；本次僅承諾目前單一 Modal 堆疊情境，不新增多層 Modal 管理器。

### 詳情內容以語意區段與響應式資訊卡呈現

基本資料、訂單資料、物流資料與日期資料各自維持 `section`、標題與 `dl` 語意，外層增加淡紫色表面、圓角及一致內距。`sm` breakpoint 以下為單欄，以上為雙欄；備註等較長內容可跨滿雙欄，以避免狹窄欄位造成不必要換行。系統資訊使用頂部分隔線和較弱的文字色階，不套用卡片表面。

替代方案是所有區段都使用卡片，但系統資訊會與主要業務資料爭奪視覺注意力，故不採用。

### 內容捲動條採漸進增強樣式

共用 Modal panel 裁切自身 overflow，flex 內容區使用可縮小的 `min-height: 0` 並保留唯一的原生垂直捲動能力、鍵盤、滑鼠滾輪與觸控行為，避免長內容同時撐出 panel 外層捲動。詳情根節點不得單獨設定 `overflow-x: hidden`，因為 CSS overflow 軸的計算規則會使其 Y 軸成為 `auto` 並產生第二個垂直捲動容器；水平溢位改由既有的 `min-width: 0`、換行與欄位寬度約束處理。支援 WebKit scrollbar pseudo-elements 的瀏覽器使用約 6px 寬度、透明軌道、灰紫色圓角滑塊並隱藏 scrollbar button；Firefox 使用 `scrollbar-width: thin` 與 `scrollbar-color`。不支援自訂樣式的瀏覽器回退到原生捲動條，功能不得受影響。

替代方案是完全隱藏捲動條，但會降低桌面內容可發現性，故不採用。

### 日期與系統時間使用不同格式化契約

業務日期只保留輸入值的日曆日期部分並顯示 `YYYY/MM/DD`，不得因瀏覽器本地時區造成日期偏移；ISO datetime 輸入先取得 `T` 之前的日期部分。建立與更新時間則解析為時間點，以 `Asia/Taipei`、24 小時制與固定兩位數欄位輸出 `YYYY/MM/DD HH:mm`。

替代方案是全部交給 `dateStyle`／`timeStyle` 的語系輸出，但結果會出現中文字與上午／下午，無法符合固定格式，故不採用。

## Implementation Contract

- **Observable behavior:** 開啟任何共用 Modal 時，`html` 與 `body` 的背景捲動皆被鎖定；內容超高時只有 Modal 內容區可捲動，header 與 footer 保持可見。關閉、Escape、遮罩點擊或元件卸載後，兩個元素各自原有的 overflow 狀態必須復原。
- **Order details layout:** 四個主要資料區塊具有淡紫色圓角表面；寬螢幕欄位以兩欄排列，375px viewport 以單欄排列且無水平 overflow；系統資訊位於分隔線下並弱化呈現。
- **Date output:** `2026-08-05T16:00:00.000Z` 作為業務日期時顯示 `2026/08/05`；`2026-08-06T14:55:00.000Z` 作為系統時間時顯示 `2026/08/06 22:55`。
- **Scrollbar behavior:** Modal panel 必須裁切 overflow，flex 內容區必須可縮小並作為唯一的垂直捲動區；支援樣式的平台顯示細窄、透明軌道、圓角灰紫滑塊且無上下箭頭，樣式不支援時保留可操作的原生捲動。
- **Failure behavior:** 空字串、`null` 或 `undefined` 仍顯示 `尚未填寫`；本次不新增使用者可見錯誤訊息。
- **Verification:** 以 `OrderDetailsModal` 元件測試驗證分區、響應式 class、固定格式與空值；以 `Modal` 元件測試驗證開關和卸載時的 `html`／`body` overflow 鎖定與各自還原；執行前端完整 Vitest suite 與 production build，並以 375px 和桌面 viewport 人工確認無雙捲動軸與 footer 可見。
- **In scope:** `OrderDetailsModal` 的內容排版、格式化與共用 `Modal` 的背景鎖定及捲動條樣式。
- **Out of scope:** API、資料庫、表單、巢狀 Modal 協調器及全站其他頁面的視覺重整。

## Risks / Trade-offs

- [多個 Modal 同時開啟時，各實例可能競爭 body overflow 原值] → 本次維持單一 Modal 契約並以保存／還原測試防止單實例洩漏；巢狀 Modal 管理器明確排除在範圍外。
- [瀏覽器對捲動條樣式支援不同] → 使用 WebKit 與 Firefox 的漸進增強規則，未支援平台回退原生捲動而不影響功能。
- [直接以 Date 解析業務日期可能跨時區偏移] → 業務日期以字串日曆部分格式化，只有系統 timestamp 進行時區轉換。
- [較大的資訊卡間距增加垂直長度] → footer 固定並提供清楚的單一捲動區域，手機維持單欄可讀性。
