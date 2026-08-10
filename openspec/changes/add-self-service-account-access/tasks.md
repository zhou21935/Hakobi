## 1. 資料模型與驗證契約

- [x] 1.1 依「以 member_profiles 與正規化唯一鍵保存會員使用名稱」建立 migration，交付 `Member usernames have a canonical format`、`Member usernames are unique under normalized comparison`、`Every email-password member has one owned profile` 與 `The target Supabase database receives repository migrations`：包含 profile schema、case-insensitive unique key、格式驗證、Auth trigger、RLS、availability RPC、cascade 及既有 Auth users deterministic backfill；以 `server/src/migration.test.ts` 的 schema/RLS/trigger/並行衝突/backfill assertions 與本機 migration apply 驗證。
- [x] 1.2 依「共用帳號驗證規則並由 Supabase 提供密碼基線」在 `src/domain/accountValidation.js` 實作 username normalize/format、8–64 字元 letter+digit 密碼、空白、username equality、弱密碼與 confirmation 純函式，交付 `Registration passwords satisfy the Hakobi password policy`；以 `src/domain/__tests__/accountValidation.spec.js` 的規格 boundary table 驗證。

## 2. Supabase Auth 與會員狀態

- [x] 2.1 依「使用 Supabase Auth 完成 Email confirmation 與帳號復原」擴充 auth store 的 signup/resend/callback API，交付 `Anyone can register with email, username, and password`、`Email confirmation is mandatory before protected use` 與 `Confirmation email can be resent safely`，確保 unconfirmed response 不成為 authenticated、錯誤經安全映射；以 `src/stores/__tests__/auth.spec.js` 驗證 metadata、redirect、session 與 rate-limit branches。
- [x] 2.2 依「以 member_profiles 與正規化唯一鍵保存會員使用名稱」擴充 auth store 的 `profile`、`loadProfile()`、`checkUsernameAvailability()` 與清理流程，交付 `Authenticated interface displays the owned member username`，包含 race failure 後重查並固定回報「此名稱已被使用」；以 store tests 驗證 owner profile、retry、logout 與 401 不殘留上一位會員資料。
- [x] 2.3 依「使用 Supabase Auth 完成 Email confirmation 與帳號復原」加入 forgot/reset store operations，交付 `Members can request a password reset without account enumeration`、`Recovery links permit one password replacement` 與 `Password recovery does not expose credentials or tokens`；以 store tests 驗證 neutral response、recovery event、updateUser 一次、invalid link 與敏感值不出現在錯誤。

## 3. 公開帳號使用流程

- [x] 3.1 建立 `src/views/Register.vue`，串接共用驗證、username availability 與 signup，讓有效送出進入驗證等待、衝突顯示「此名稱已被使用」、欄位錯誤不呼叫 Supabase；以 `src/views/__tests__/Register.spec.js` 驗證輸入、pending、success、duplicate、confirmation mismatch 與 network failure。
- [x] 3.2 建立 `src/views/VerifyEmail.vue`，實現處理中、等待、成功、無效／過期與重寄狀態，成功時清除 callback 並 replace `/orders`，失敗不顯示 App shell；以 `src/views/__tests__/VerifyEmail.spec.js` 驗證 callback state machine 與 resend 中性文案。
- [x] 3.3 建立 `src/views/ForgotPassword.vue` 與 `src/views/ResetPassword.vue`，讓任何格式正確 Email 得到相同送出結果、僅 valid recovery session 可用同一密碼規則更新一次；以兩份 view tests 驗證 unknown Email indistinguishable、expired link、invalid password、success navigation 及 raw Token 不渲染。
- [x] 3.4 更新 `src/views/Login.vue` 的註冊／忘記密碼入口、未驗證提示與安全 redirect，交付 `Users authenticate with Supabase email credentials`；以 `src/views/__tests__/Login.spec.js` 驗證 confirmed login 回原路徑、unsafe redirect 回退 `/orders`、invalid credentials 與 unconfirmed member branches。

## 4. 路由與已登入介面整合

- [x] 4.1 依「公開帳號路由與原始目的地導向」新增四個公開 route 及 recovery-session guard，交付 `Public account routes respect authentication state`：anonymous 可開帳號頁、confirmed session 離開 login/register/forgot、ordinary session 不可重設；以 `src/router/__tests__/authGuard.spec.js` 驗證 route matrix 與 open-redirect rejection。
- [x] 4.2 在 App session coordination 與 sidebar 整合 profile loading/fallback/retry/username，確保 orders 與 profile 依 session 一致清理且 profile failure 不阻擋 confirmed member；以 `src/__tests__/App.spec.js`、`src/components/__tests__/AppSidebar.spec.js` 驗證載入順序、顯示名稱、fallback 與 user switch。

## 5. 部署安全與整體驗證

- [x] 5.1 依「使用不洩漏帳號存在性的 Email 回應」與部署規格更新 `docs/supabase-setup.md`、README 及環境 URL helper，交付 `Supabase Auth requires verified email and baseline password strength`、`Authentication redirects are explicitly allowlisted` 與 `Production authentication email uses configured SMTP`：記錄 signup/Confirm Email/8+letters+digits、local/production callbacks、template、SMTP/rate limit、dedicated test-account cleanup；以 config tests、內容審查及不含 secrets 的 production build 驗證。
- [ ] 5.2 依 Implementation Contract 執行完整回歸與部署前驗收：前端 domain/store/view/router tests、migration tests、兩個並行 username 註冊、confirmation/recovery Email smoke test、`npm test`、server test/typecheck/build、frontend build、`spectra validate add-self-service-account-access` 全部通過，並確認第三方登入、username login、Fastify 會員 API 與 profile 編輯未進入差異。
