## Problem

已登入會員重新整理受保護頁面後，左側欄可能不會重新載入擁有者的會員資料，因而持續顯示電子郵件 fallback，而不是已儲存的會員名稱；即使載入成功，目前也會在等待期間短暫閃現電子郵件。個人資料頁的欄位標籤「會員使用名稱」也與使用者期待的「會員名稱」用語不一致。

## Root Cause

應用程式只監看 `auth.isAuthenticated` 來啟動會員資料載入。Supabase 還原 session 時，登入狀態可能在 `auth.initialized` 完成前先改變，watcher 因初始化尚未完成而略過載入；之後只有 `auth.initialized` 改變，不會再次觸發目前的 watcher。

## Proposed Solution

- 讓 authenticated shell 同時回應 Auth 初始化完成與登入狀態，在重新整理還原有效 session 後可靠地載入擁有者會員資料。
- 會員資料載入期間保留身份文字區高度但不顯示任何身份文字；只有載入失敗時才使用安全 Email fallback，並保留錯誤與重試行為。
- 將個人資料頁的「會員使用名稱」標籤改為「會員名稱」。
- 以元件測試覆蓋重新整理初始化時序、側欄顯示與標籤文字。

## Non-Goals

- 不將會員資料寫入瀏覽器持久儲存空間。
- 不變更 Supabase schema、RLS、會員名稱驗證規則或載入失敗時 Email fallback 的錯誤處理。

## Success Criteria

- 重新整理後還原有效 session 且會員資料載入成功時，左側欄顯示資料庫中的會員名稱，不會停留在電子郵件。
- 重新整理或重新登入後等待會員資料期間不顯示「會員」、Email 或其他身份文字，成功後直接顯示會員名稱。
- 初始化完成前不提前查詢會員資料，且同一次有效狀態不重複載入。
- 個人資料頁的 username 欄位顯示「會員名稱」。
- 相關元件測試、完整前端測試與 production build 通過。

## Capabilities

### New Capabilities

無。

### Modified Capabilities

- `member-profile`: 明確定義重新整理還原 session 後必須載入並顯示擁有者會員名稱，以及個人資料頁採用「會員名稱」標籤。

## Impact

- Affected specs: `member-profile`
- Affected code:
  - Modified: `src/App.vue`
  - Modified: `src/components/common/AppSidebar.vue`
  - Modified: `src/views/Profile.vue`
  - Modified: `tests/app/App.spec.js`
  - Modified: `tests/components/common/AppSidebar.spec.js`
  - Modified: `tests/views/Profile.spec.js`
  - New: none
  - Removed: none
