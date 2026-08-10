## 1. 訂單初始化與路由完整性

- [x] 1.1 依「在應用層協調每個登入階段的初始訂單載入」讓有效 session 從任何受保護頁面只觸發一次初始 load，登出或 401 後重設；以 store 與 App tests 驗證 Dashboard first-load、去重與 session 切換，交付「The order store loads the authenticated user's remote orders」。
- [x] 1.2 依「由 Router 驗證分類並提供單一 Not Found 畫面」限制 category 為 `agent|parcel`，新增 catch-all 與返回 `/orders` 操作；以 router/view tests 驗證兩個合法分類、`/orders/unknown` 和未知路徑，交付「Unknown application locations render a recoverable Not Found view」。
- [x] 1.3 依「正式導覽僅保留產品入口」移除 sidebar 的 `/ui-showcase` 連結但保留 direct route；以 `AppSidebar.spec.js` 與 route test 驗證，交付「UI component showcase page is reachable from navigation」及「Top-level sidebar navigation items render with consistent styling and adjacency」。

## 2. 全部訂單建立入口

- [x] 2.1 依「共用表單以可選的訂單分類欄位支援兩種建立入口」讓 all-orders create 顯示必填 category、category view 使用鎖定 route category、edit 不改變既有分類；以 `OrderFormModal.spec.js` 驗證 payload 與錯誤，交付「User can create a preorder order with required field validation」。
- [x] 2.2 在 AllOrders view 加入新增入口並串接 confirmed create mutation，失敗時保留 modal 與輸入；以 `AllOrders.spec.js` 驗證 agent/parcel 建立與 API failure。

## 3. 無倒數的頁面生命週期 Undo

- [x] 3.1 依「以 view 生命週期管理單筆延遲刪除與 Undo」在 order store 保存一筆 pending order 與原始索引，確認後立即排除 active projections，Undo 則原位恢復且不呼叫 API；以 store tests 驗證，交付「Deleted orders remain undoable while the current order view stays mounted」。
- [x] 3.2 建立共用 `DeleteUndoToast`，在 pending 存在期間無倒數持續顯示復原按鈕，並整合 AllOrders/OrderList 的確認文案與操作；以 component/view tests 驗證取消確認、確認後顯示及復原，交付「User must confirm before an order is deleted」。
- [x] 3.3 依「保留既有永久刪除 API 與資料庫模型」在 view unmount、route navigation、sign-out、document unload 或第二筆刪除時 finalize 既有 DELETE 恰好一次，unload 使用 keepalive；以 fake lifecycle/fetch tests 驗證，交付「Only one pending undo deletion is active」。
- [x] 3.4 在應用仍存活的 delete failure 中回插快照或重新載入 confirmed orders 並顯示錯誤，unload request 未送達時允許下次 load 顯示原資料；以 API/store/view failure tests 驗證，交付「Failed deferred deletion restores confirmed state when possible」與「Order mutations are confirmed by the backend」。

## 4. 整合驗證

- [x] 4.1 依 Implementation Contract 補齊 initial load、Not Found、all-orders create、無倒數 Undo、離頁 finalize、第二筆 finalize 與 failure recovery 回歸測試，並確認 `npm test`、`npm --prefix server test`、`npm --prefix server run typecheck`、`npm run build`、`npm --prefix server run build` 全部通過。
- [x] 4.2 依 Migration Plan 確認本變更沒有 database migration 或後端新端點，更新必要的產品行為文件並以內容審查與 `spectra validate improve-product-completeness` 驗證；確認 Risks / Trade-offs 已記錄 keepalive 未送達時採資料安全優先。
