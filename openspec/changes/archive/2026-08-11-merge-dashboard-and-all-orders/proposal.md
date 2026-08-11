## Why

目前「總覽」與「全部訂單」分成兩個入口，但總覽只呈現少量統計卡，使用者仍需切換頁面才能搜尋、篩選與管理訂單。將完整訂單管理整合到首頁，可減少重複導覽並讓登入後立即進入主要工作流程。

## What Changes

- 將首頁 `/` 改為「訂單總覽」，呈現原全部訂單頁的搜尋、排序、狀態分頁、新增訂單與跨分類訂單卡片。
- 移除原 Dashboard 統計卡頁面與其專用測試。
- 左側欄保留「總覽」並移除「全部訂單」入口，分類與會員入口維持不變。
- 將舊網址 `/orders` 重新導向 `/`，保留既有書籤與連結相容性。
- 將登入、Email 驗證、密碼重設與 guest-only 路由的預設成功目的地由 `/orders` 改為 `/`。
- 保留已確認的桌面與手機訂單列表響應式配置。
- 移除分類訂單頁的說明副標題，只保留「海外代購」或「集運包裹」主標題。

## Capabilities

### New Capabilities

無。

### Modified Capabilities

- `preorder-orders`: 以首頁訂單總覽取代獨立 Dashboard 與全部訂單入口，並定義舊 `/orders` 的重新導向與側欄行為。
- `frontend-authentication`: 將登入成功、無效 redirect fallback 與已登入會員離開 guest-only 頁面的目的地改為 `/`。
- `account-registration`: 將 Email 驗證成功後的目的地改為 `/`。

## Impact

- Affected specs: `preorder-orders`, `frontend-authentication`, `account-registration`
- Affected code:
  - Modified: `src/router/index.js`
  - Modified: `src/views/AllOrders.vue`
  - Modified: `src/views/OrderList.vue`
  - Modified: `src/views/Login.vue`
  - Modified: `src/views/VerifyEmail.vue`
  - Modified: `src/views/ResetPassword.vue`
  - Modified: `src/components/common/AppSidebar.vue`
  - Modified: `tests/router/authGuard.spec.js`
  - Modified: `tests/views/AllOrders.spec.js`
  - Modified: `tests/views/OrderList.spec.js`
  - Modified: `tests/views/Login.spec.js`
  - Modified: `tests/views/ResetPassword.spec.js`
  - Modified: `tests/components/common/AppSidebar.spec.js`
  - Removed: `src/views/Dashboard.vue`
  - New: none
