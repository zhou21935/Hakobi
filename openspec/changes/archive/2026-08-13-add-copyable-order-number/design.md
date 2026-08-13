## Context

訂單詳情目前在元件內直接實作追蹤號碼的 Clipboard 狀態與計時器，訂單號碼則使用一般只讀欄位。兩個欄位都屬於可複製的識別碼，應共用顯示與互動契約。

## Goals / Non-Goals

**Goals:**

- 訂單號碼與追蹤號碼均可複製精確顯示值。
- 抽出共用元件集中處理空值、Clipboard、成功逾時重設、失敗提示與清理計時器。
- 保持現有詳情頁顏色、欄位分組與響應式排版。

**Non-Goals:**

- 不改動後端、資料庫、訂單資料形狀或其他欄位。
- 不導入第三方 clipboard 套件或自動 fallback 到舊式 document.execCommand。

## Decisions

### 使用自包含的 CopyableDetailValue 元件

元件接收 `label` 與 `value`，自行渲染 dt/dd 語意、可選取文字、複製按鈕和回饋。相較於在父元件傳入 callback，此設計能確保每個實例擁有獨立狀態，訂單號碼成功不會改變追蹤號碼按鈕文字。

### Clipboard 不可用時明確失敗

若 navigator.clipboard.writeText 不存在或 reject，元件顯示「複製失敗，請手動選取」並保留可選取值；不使用不可靠或權限行為不同的隱式 fallback。

## Implementation Contract

**Observable behavior**

- 非空訂單號碼與追蹤號碼旁各自顯示複製按鈕，點擊後將該欄位完整值寫入 Clipboard。
- 成功的欄位暫時顯示「已複製 ✓」，其他欄位狀態不變，兩秒後恢復「複製」。
- Clipboard 不可用或 reject 時，對應欄位顯示「複製失敗，請手動選取」且值保持可見、可選取。
- 空值顯示「尚未填寫」且不渲染複製按鈕。

**Interface and failure modes**

- CopyableDetailValue props 為 required string `label` 與 optional string/number `value`；元件不向父層暴露 Clipboard 例外。
- 按鈕 aria-label 使用「複製 <label>」，因此分別為「複製 訂單號碼」與「複製 追蹤號碼」。

**Acceptance criteria**

- 共用元件測試覆蓋成功、實例狀態隔離、reject、Clipboard 缺失與空值。
- OrderDetailsModal 測試確認兩個欄位均使用可操作的複製控制且完整既有測試通過。

**Scope boundaries**

- In scope: 共用 UI 元件、訂單詳情整合及相關元件測試。
- Out of scope: API、資料庫、列表卡片、編輯表單與其他複製欄位。

## Risks / Trade-offs

- [Risk] 多個計時器在 modal 關閉後更新狀態 → 元件卸載時清除自己的 timer。
- [Risk] Clipboard API 受瀏覽器安全環境限制 → 顯示明確失敗訊息並保留手動選取路徑。
