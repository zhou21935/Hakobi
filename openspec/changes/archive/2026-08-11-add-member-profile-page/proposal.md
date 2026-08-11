## Why

Hakobi 已建立會員使用名稱與登入後的會員識別，但會員目前沒有集中查看與維護自身資料的入口。需要提供一個範圍精簡的個人資料頁，讓已驗證會員安全地查看 Email，並修改使用名稱與顯示名稱。

## What Changes

- 在受保護應用的左側欄新增「會員」區段與「個人資料」入口，導向新的個人資料頁。
- 允許會員修改既有使用名稱，沿用格式、正規化與唯一性契約。
- 新增必填顯示名稱欄位，接受 2–30 個中文、英文字母或數字，不接受空白或特殊符號，且不要求唯一。
- 顯示目前登入會員的 Supabase Auth Email，但保持唯讀，不複製至會員資料表。
- 提供明確的初始載入、載入失敗與重試、欄位驗證、使用名稱衝突、儲存中、儲存成功及儲存失敗狀態。
- 讓會員只能更新自己的會員資料，並在儲存成功後同步應用內顯示的會員識別。
- 精簡個人資料頁文案：移除頁首副標題，將 `display_name` 欄位標示為「真實姓名」，並讓側邊欄頁尾的會員使用名稱與登出控制一致置中。

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `member-profile`: 擴充會員資料為可檢視與編輯，新增顯示名稱契約、唯讀 Email 呈現、資料更新權限及可驗證的載入與儲存狀態。

## Impact

- Affected specs: `member-profile`
- Affected code:
  - New: `src/views/Profile.vue`, `src/views/__tests__/Profile.spec.js`, `supabase/migrations/20260812000000_add_member_profile_display_name.sql`
  - Modified: `src/stores/auth.js`, `src/domain/accountValidation.js`, `src/router/index.js`, `src/App.vue`, `src/components/AppSidebar.vue`, `src/stores/__tests__/auth.spec.js`, `src/domain/__tests__/accountValidation.spec.js`, `src/router/__tests__/authGuard.spec.js`, `src/components/__tests__/AppSidebar.spec.js`, `server/src/migration.test.ts`
  - Removed: none
- External systems: Supabase Auth remains the source of the read-only Email; Supabase Postgres stores editable member profile fields under row-level security.
