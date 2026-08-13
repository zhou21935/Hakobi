## Summary

將新增與編輯訂單表單重新設計為以「商品、貨物、物流、備註」區塊組織的單一響應式介面，並依手機、平板與電腦提供對應版型。

## Motivation

目前表單以連續欄位排列，欄位增加後難以快速理解資訊層級，且窄螢幕主要仰賴單一捲動容器，未針對手機、平板與電腦建立清楚一致的版面。參考設計已定義區塊結構與三種尺寸行為，本次需要在保留 Hakobi 原有色彩、驗證與資料契約的前提下整合至既有表單。

## Proposed Solution

- 新增與編輯訂單繼續共用 `OrderFormModal.vue`，以單一響應式實作支援三種尺寸。
- 將既有欄位重新分入商品、貨物、物流與備註四個可辨識區塊。
- 手機使用底部展開、單欄內容與固定操作列；平板使用置中對話框與適度雙欄；電腦使用約 880px 的雙欄區塊配置。
- 保留現有訂單分類「海外代購／集運包裹」與商品分類「周邊／書籍／其他」複選行為。
- 增加訂單號碼輸入與附件選取、清單顯示、移除等純前端畫面互動，關閉表單時清除。
- 新欄位不進入 submit payload；現有 API、store、後端 schema 與資料庫維持不變。
- 版面結構、間距、RWD 行為、彈窗／區塊／欄位底色與邊框參考使用者提供的「購物清單重新排版設計 (1)」壓縮檔；取消、送出等操作按鈕顏色維持專案現有 design token。
- 備註內容改為具足夠高度、支援自然換行的多行輸入欄位。

## Alternatives Considered

- 為手機、平板與電腦維護三套表單元件：拒絕，因欄位、驗證與新增／編輯行為容易分岔，維護成本高。
- 立即將訂單號碼與附件送往後端：拒絕，本期範圍明確限於樣式與前端呈現，後端契約尚未設計。
- 全面替換按鈕配色：拒絕，操作按鈕維持 Hakobi 既有品牌色；非按鈕表面則依參考設計調整。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `preorder-orders`: 新增與編輯訂單表單改為四區塊結構，加入僅存在於前端暫存狀態的訂單號碼與附件介面，並讓備註支援足夠高度的多行輸入與換行。
- `responsive-layout`: 訂單表單在手機、平板與電腦採用明確的 bottom sheet、置中對話框與寬版雙欄配置。
- `ui-components`: 共用 Modal 支援訂單表單所需的響應式 panel、內容與 footer 樣式覆寫；訂單表單的非按鈕表面與欄位外觀依參考設計統一，按鈕顏色維持原樣。

## Impact

- Affected specs: `preorder-orders`, `responsive-layout`, `ui-components`
- Affected code:
  - Modified: `src/components/orders/OrderFormModal.vue`, `src/components/ui/Modal.vue`, `tests/components/orders/OrderFormModal.spec.js`, `tests/components/ui/Modal.spec.js`
  - New: none
  - Removed: none
- Unchanged systems: `src/stores/orders.js`, `src/services/ordersApi.js`, `backend/`, `supabase/`
