## Context

Hakobi 目前由各訂單列表頁觸發初始載入，總覽直接進入時可能顯示零筆；路由接受任意分類字串，正式導覽仍顯示開發用途頁面。刪除目前在確認後立即呼叫永久刪除 API，使用者沒有在當前操作脈絡中撤回的機會。使用者選擇精簡的頁面生命週期 Undo，不建立持久垃圾桶。

## Goals / Non-Goals

**Goals:**

- 每個登入階段只協調一次訂單初始載入。
- 未知路由與分類顯示一致 Not Found。
- 全部訂單頁可建立明確分類的訂單。
- 確認刪除後立即更新畫面，並在目前訂單 view 存續期間提供無倒數的復原操作。
- 重新整理、切換頁面、登出或離開文件時完成待刪除 request，復原操作不跨 view 保存。
- 正式導覽移除 UI showcase 入口。

**Non-Goals:**

- 不建立垃圾桶頁面、`deleted_at`、restore API、永久刪除新端點或資料庫 migration。
- Undo 不跨重新整理、路由切換、登出或瀏覽器離開保存。
- 不提供 Undo 倒數、自動保存期限、批次操作或操作歷史。
- 帳號註冊、OAuth、分頁與匯出不在範圍內。

## Decisions

### 在應用層協調每個登入階段的初始訂單載入

`App.vue` 在有效 session 且 order store 尚未初始化時呼叫既有 `loadOrders()`；登出或 401 清除初始化狀態。列表頁保留冪等防護但不得重複請求，使 Dashboard 與其他受保護頁面取得相同資料。

### 由 Router 驗證分類並提供單一 Not Found 畫面

`/orders/:category` 只接受 `agent` 與 `parcel`；無效分類和 catch-all route 共用 Not Found view，並提供返回 `/orders` 的操作。

### 共用表單以可選的訂單分類欄位支援兩種建立入口

分類頁傳入鎖定分類；全部訂單頁未傳入分類時，`OrderFormModal` 顯示必填 category Select。建立 payload 永遠包含合法分類，編輯模式不意外改變既有分類。

### 以 view 生命週期管理單筆延遲刪除與 Undo

確認刪除後，store 暫存訂單及原始索引並立即從 active collection 移除；共用 `DeleteUndoToast` 顯示不倒數的復原按鈕。點擊復原會取消 pending delete 並把同一筆訂單放回原始位置，不呼叫 API。訂單 view unmount、route navigation、sign-out 或 document unload 時呼叫既有 `DELETE /api/orders/:id` 並清除 Undo。為避免多個未提交刪除，同時只允許一筆 pending；第二次刪除先 finalize 第一筆。

### 保留既有永久刪除 API 與資料庫模型

後端 `DELETE /api/orders/:id` 與資料庫 schema 不變。正常可等待的離頁流程使用現有 API；document unload 使用已取得的 access token 發送 keepalive delete，使 request 在頁面終止後仍可完成。若 keepalive 未送達，下一次載入會重新顯示仍存在的訂單，採資料不遺失優先。

### 正式導覽僅保留產品入口

側邊欄移除 UI showcase 連結；`/ui-showcase` route 保留供直接開啟，不新增垃圾桶入口。

## Implementation Contract

- Initial load: 首個受保護頁面為 `/` 時亦載入遠端訂單；成功後同一 session 不重複初始載入。
- Routing: `/orders/agent`、`/orders/parcel` 有效；無效分類與未知路徑顯示 Not Found 並可回到 `/orders`。
- Creation: `/orders` 可新增訂單且 category 必填；分類頁沿用 route category。
- Delete start: 使用者確認後，選定訂單立即從 active list、搜尋、counts 與 Dashboard stats 排除，Undo control 無倒數持續顯示。
- Undo: view 尚未離開時點擊復原，不呼叫 delete API，使用同一物件與原始索引恢復 active collection。
- Finalize: route/view unmount、sign-out、document unload 或第二筆刪除開始時，第一筆 pending delete 恰好送出一次，Undo 消失。
- Failure: 應用仍存活時 delete 失敗須恢復訂單或重新載入並顯示錯誤；unload keepalive 未成功時，下次正常 load 會讓未刪除訂單重新出現。
- Scope: 僅一筆 pending Undo；不保存 localStorage、不新增 server state、不新增 database 欄位。
- Acceptance: fake timers 與 route/unmount tests 驗證沒有倒數依賴、Undo、離頁 finalize、第二筆 finalize 與失敗回復；前後端 tests、typecheck 與 builds 全部通過。

## Risks / Trade-offs

- [使用者停留頁面時後端仍保留待刪訂單] → 這是無期限 view-scoped Undo 的必要取捨；畫面 projection 立即排除它。
- [document unload request 不保證送達] → 使用 keepalive，且以資料安全優先；未送達時訂單在下次載入重新出現。
- [多筆 pending 增加狀態複雜度] → 僅允許一筆，第二筆開始前先 finalize 第一筆。
- [刪除失敗時畫面與後端短暫不同步] → 應用存活時回插快照或重載 confirmed collection。

## Migration Plan

不需要資料庫 migration 或後端部署順序。部署前端後驗證 Undo、route navigation、reload keepalive 與 delete failure；回滾只需回到舊前端版本。

## Open Questions

無；Undo 明確不設定秒數，存續範圍限定目前訂單 view。
