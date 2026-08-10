## Summary

補齊既有訂單管理流程的產品完整性，確保使用者從任何入口都看到正確資料、只能進入有效頁面、可在所有訂單頁建立訂單，並能復原誤刪資料。

## Motivation

目前總覽頁不會自行載入訂單，直接進入時可能錯誤顯示零筆；分類路由未拒絕未知分類，正式導覽仍暴露 UI 元件展示頁，且全部訂單頁缺少新增入口。訂單刪除則是立即永久刪除，使單次誤操作造成不可逆資料損失。

## Proposed Solution

- 讓受保護應用在有效登入階段只觸發一次初始訂單載入，總覽與訂單列表共享一致資料狀態。
- 對未知路由及未知訂單分類顯示可返回有效頁面的 Not Found 畫面。
- 從正式側邊欄移除 UI 元件展示入口，但保留元件與既有開發用途路由，不將其作為產品導覽。
- 在全部訂單頁提供新增入口，並要求使用者於表單內選擇訂單分類；分類頁維持由目前路由預先指定分類。
- 訂單刪除後立即從畫面隱藏並持續顯示復原按鈕；目前訂單頁存續期間可取消刪除，重新整理、切換頁面或離開時送出既有永久刪除請求並讓按鈕消失。

## Non-Goals

- 不包含會員註冊、Email 驗證、密碼重設或第三方登入。
- 不包含伺服器端分頁、搜尋、排序或資料匯出。
- 不重新設計訂單狀態、分類或總覽統計指標。
- 不移除 `src/views/UiShowcase.vue` 或其開發用途路由。

## Alternatives Considered

- 持久垃圾桶與軟刪除：復原保障較高，但需要資料庫 migration、額外 API 與新頁面，超出目前希望的精簡範圍。
- 僅增加第二次刪除確認：可降低誤觸，但仍不能處理確認後才發現選錯資料的情況。

## Capabilities

### New Capabilities

- `order-delete-undo`: 刪除後在目前頁面存續期間的暫時復原、離頁提交與失敗回復契約。
- `route-not-found`: 未知應用路由及未知訂單分類的可預期導向與復原操作。

### Modified Capabilities

- `order-api-sync`: 登入階段的單次初始載入，以及延遲刪除的確認同步。
- `preorder-orders`: 全部訂單頁可建立訂單並明確選擇分類。
- `ui-components`: 正式側邊欄移除 UI 元件展示入口。

## Impact

- Affected specs: `order-delete-undo`, `route-not-found`, `order-api-sync`, `preorder-orders`, `ui-components`
- Affected code:
  - Modified: `src/App.vue`, `src/router/index.js`, `src/stores/orders.js`, `src/services/ordersApi.js`, `src/views/Dashboard.vue`, `src/views/AllOrders.vue`, `src/views/OrderList.vue`, `src/components/AppSidebar.vue`, `src/components/orders/OrderFormModal.vue`
  - New: `src/views/NotFound.vue`, `src/components/orders/DeleteUndoToast.vue`
  - Removed: none
- API impact: Existing `DELETE /api/orders/:id` remains the only deletion endpoint and retains permanent-delete semantics.
- Database impact: none.
