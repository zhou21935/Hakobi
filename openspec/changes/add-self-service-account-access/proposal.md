## Why

Hakobi 目前只允許管理員提供的既有帳號登入，使用者無法自行建立、驗證或復原帳號。產品需要完整的 Email 帳號生命週期，讓任何人都能安全註冊、以唯一使用名稱識別，並在完成 Email 驗證後使用受保護的訂單功能。

## What Changes

- 新增 Email、會員使用名稱、密碼與確認密碼的自行註冊流程。
- 為會員使用名稱建立 3–20 字元、中文／英文字母／數字／底線、禁止空白與符號、英文不分大小寫唯一的契約；名稱衝突時顯示「此名稱已被使用」。
- 新增 8–64 字元、至少一個英文字母與一個數字、禁止空白、不得等同會員使用名稱及拒絕弱密碼黑名單的密碼規則。
- 啟用強制 Email 驗證；未驗證會員不得登入受保護功能，並提供驗證等待、成功、失效及重新寄送流程。
- 新增忘記密碼與透過 Email 連結設定新密碼的自助復原流程，重設密碼沿用相同密碼規則。
- 登入成功後返回原本要求的受保護頁面，已登入會員不得進入登入、註冊或忘記密碼頁。
- 登入後在產品介面顯示會員使用名稱。
- 補充 Supabase Auth redirect URL、Email confirmation、正式環境 SMTP 與會員資料 migration 的部署契約。

## Non-Goals

- 不新增 Google、LINE 或其他第三方登入。
- 不新增管理員審核、會員後台、角色與權限分級。
- 不新增個人資料編輯、變更 Email、刪除帳號或多重要素驗證。
- 不以會員使用名稱取代 Email 作為登入憑證。

## Capabilities

### New Capabilities

- `account-registration`: 自行註冊、密碼規則、Email 強制驗證、驗證結果與重新寄送流程。
- `member-profile`: 會員使用名稱的格式、正規化、唯一性、建立與登入後顯示。
- `account-recovery`: 忘記密碼、重設連結與新密碼設定流程。

### Modified Capabilities

- `frontend-authentication`: 登入後原頁導回、公開帳號頁的已登入導向與僅允許已驗證 session 使用受保護功能。
- `supabase-environment-deployment`: 部署會員資料 migration，並設定 Email confirmation、允許的 redirect URL 與正式 SMTP。

## Impact

- Affected specs: `account-registration`, `member-profile`, `account-recovery`, `frontend-authentication`, `supabase-environment-deployment`
- Affected code:
  - New: `src/views/Register.vue`, `src/views/VerifyEmail.vue`, `src/views/ForgotPassword.vue`, `src/views/ResetPassword.vue`, `src/domain/accountValidation.js`, `supabase/migrations/20260810000000_create_member_profiles.sql`, `src/views/__tests__/Register.spec.js`, `src/views/__tests__/VerifyEmail.spec.js`, `src/views/__tests__/ForgotPassword.spec.js`, `src/views/__tests__/ResetPassword.spec.js`, `src/domain/__tests__/accountValidation.spec.js`
  - Modified: `src/views/Login.vue`, `src/stores/auth.js`, `src/router/index.js`, `src/App.vue`, `src/components/AppSidebar.vue`, `src/lib/supabase.js`, `src/stores/__tests__/auth.spec.js`, `src/router/__tests__/authGuard.spec.js`, `src/views/__tests__/Login.spec.js`, `src/components/__tests__/AppSidebar.spec.js`, `docs/supabase-setup.md`, `README.md`
  - Removed: none
- External systems: Supabase Auth Email confirmation, Auth email templates, redirect allowlist, SMTP provider, and Postgres member profile data.
