## 1. 重新整理時序測試

- [x] 1.1 先以失敗測試覆蓋 `Authenticated interface displays the owned member username` 與「同時監看初始化與登入狀態」，使用 reactive Auth mock 模擬 session 已存在但 initialized 稍後才完成，驗證完成後只呼叫一次 `loadProfile`；以 `npm test -- --run tests/app/App.spec.js` 在實作前因未觸發載入而如預期失敗。

## 2. 會員名稱載入修正

- [x] 2.1 調整 authenticated shell 的啟動條件，讓初始化完成且 session 有效時可靠載入 profile，並依「Email 僅作暫時與失敗 fallback」保留 profile 已存在、載入中及失敗時的既有安全行為；以第 1.1 項測試轉為通過且 `loadProfile` 呼叫次數為一次驗證。

## 3. 個人資料標籤

- [x] 3.1 先以失敗測試覆蓋 `Authenticated members can view their personal profile` 與「個人資料採用會員名稱標籤」，驗證 username 輸入欄位標籤為「會員名稱」且不再顯示「會員使用名稱」；以 `npm test -- --run tests/views/Profile.spec.js` 在實作前如預期失敗，再以最小文案修改使測試通過。

## 4. 完整驗證

- [x] 4.1 執行完整前端測試與 production build，確認重新整理會員名稱載入、Email fallback、個人資料編輯及其他受保護頁面未回歸；以 `npm test -- --run` 與 `npm run build` 均成功完成驗證。

## 5. 移除載入期間 Email 閃現

- [x] 5.1 先以失敗測試補充 `Authenticated interface displays the owned member username` 與「載入期間使用中性會員文字」，驗證有效 session 已存在但 profile 尚未完成時側欄收到空的 identity fallback、顯示中性「會員」且不顯示 Email，載入失敗後才收到 Email fallback；以 `npm test -- --run tests/app/App.spec.js tests/components/common/AppSidebar.spec.js` 在實作前如預期失敗。
- [x] 5.2 讓 authenticated shell 只在 profile 載入失敗時傳入 session Email，等待與載入期間改用側欄既有中性「會員」fallback，成功時仍顯示會員名稱；以第 5.1 項測試轉為通過驗證。

## 6. 更新後完整驗證

- [x] 6.1 執行完整前端測試與 production build，確認無 Email 閃現、會員名稱載入、失敗 fallback、個人資料編輯及其他受保護頁面未回歸；以 `npm test -- --run` 與 `npm run build` 均成功完成驗證。

## 7. 移除所有載入中身份文字

- [x] 7.1 先以失敗測試補充 `Authenticated interface displays the owned member username` 與「載入期間保留空白身份區」，驗證重新整理及重新登入的 profile loading 狀態會傳入明確 loading prop，身份列保持存在但不顯示「會員」、Email 或其他文字，載入成功與失敗狀態仍分別顯示會員名稱與 Email；以 `npm test -- --run tests/app/App.spec.js tests/components/common/AppSidebar.spec.js` 在實作前如預期失敗。
- [x] 7.2 在 authenticated shell 衍生 identity loading 狀態並由 `AppSidebar` 以 Boolean prop 接收，loading 時保留身份列樣式但清空可見文字，成功與失敗時沿用既有身份優先順序；以第 7.1 項測試轉為通過驗證。

## 8. 最終完整驗證

- [x] 8.1 執行完整前端測試與 production build，確認重新整理、重新登入、成功會員名稱、失敗 Email fallback、個人資料編輯與 footer 版面皆未回歸；以 `npm test -- --run` 與 `npm run build` 均成功完成驗證。
