# Supabase 部署與驗證

## 本機基線

1. 安裝 Supabase CLI 並執行 `supabase login`。
2. 只在本機以 `supabase start`、`supabase db reset` 驗證 `supabase/migrations/`。
3. 執行前後端 tests、typecheck 與 build，確認部署前基線為綠燈。

## 核對並部署 migration

1. 從 Supabase Dashboard 複製目標 project ref，確認專案名稱與環境（staging/production）。
2. 執行 `supabase link --project-ref <project-ref>`，再用 `supabase projects list` 人工比對 link 目標。
3. 執行 `supabase migration list`，review local/remote 差異與即將套用的 SQL。正式環境若未有可還原備份，停止部署。
4. 只有在 project ref、migration plan 與備份都確認後，執行 `supabase db push`。
5. 再次執行 `supabase migration list`；local 與 remote 應一致，第二次 push 應無 pending migration。

`supabase db reset` 僅可用於本機容器，**不得對遠端執行**。若已部署 schema 需要修正，以經 review 的新 forward migration 回復相容狀態；不得刪除 migration history 或 reset 遠端資料。

## Runtime 環境

前端從 `.env.example` 複製設定：

- `VITE_SUPABASE_URL`：Supabase Project URL。
- `VITE_SUPABASE_ANON_KEY`：anonymous publishable key；不得使用 service-role key。
- `VITE_API_BASE_URL`：已部署 Fastify API base URL。

後端從 `backend/.env.example` 複製設定：

- `SUPABASE_URL`、`SUPABASE_DB_URL`、`CORS_ORIGIN`、`PORT`。
- `SUPABASE_DB_URL` 是 server secret，不得加上 `VITE_`、寫入前端設定、log 或版本控制。

## Auth 註冊、驗證與密碼政策

在 Supabase Dashboard 完成以下設定後才開放正式註冊入口：

1. Authentication → Providers → Email：開啟公開 Email signup 與 **Confirm Email**。
2. Authentication → Password Security：minimum length 設為 8，required characters 設為 letters and digits。Hakobi 前端另外限制最多 64 字元、禁止空白、不得等同使用名稱並拒絕專案弱密碼集合。
3. Authentication → URL Configuration：Site URL 設為正式前端 origin，Redirect URLs 明確加入：
   - `http://localhost:5173/verify-email`
   - `http://localhost:5173/reset-password`
   - `https://<frontend-host>/verify-email`
   - `https://<frontend-host>/reset-password`
4. Email confirmation 與 password recovery template 必須使用 `RedirectTo`／允許清單內的 Hakobi callback，不得導向使用者提供的任意 origin。

開發環境可使用 Supabase 預設寄信服務；正式環境必須在 Authentication → SMTP Settings 設定 custom SMTP，確認 sender domain、From name/address、provider rate limit 與退信監控。SMTP password/API key 只存於 Supabase，不得放入前端、repository 或部署 log。

應用後端不保存密碼，也不使用 service-role key。會員使用名稱由 `member_profiles` migration 的 unique normalized key、Auth trigger 與 RLS 保護。

### Auth Email smoke verification

使用一個專用、可接收信件的 test account：

1. 從 `/register` 註冊，確認未點信件前不能進入受保護頁面。
2. 確認 confirmation Email sender 正確，連結只導回正式 `/verify-email`，點擊後可進入 `/orders`。
3. 從 `/forgot-password` 申請 recovery Email，確認連結只導回正式 `/reset-password`，且新密碼須符合 8–64 字元、letter+digit 規則。
4. 測試 resend rate-limit 時只顯示稍後再試，不揭露帳號是否存在。
5. 成功或失敗後都從 Supabase Authentication Users 刪除 test account，確認 cascade 同時清除 profile；部署紀錄不得保存 Email、密碼或 Token。

若任一封信未送達、callback origin 不正確、未驗證帳號取得 session、或測試帳號無法清理，部署驗證失敗。

## 部署後 smoke verification

設定下列 process environment；不要寫入 repository：

- `VERIFY_API_URL`
- `VERIFY_SUPABASE_URL`
- `VERIFY_SUPABASE_ANON_KEY`
- `VERIFY_USER_A_EMAIL`、`VERIFY_USER_A_PASSWORD`
- `VERIFY_USER_B_EMAIL`、`VERIFY_USER_B_PASSWORD`

執行：

```sh
npm run verify:deployment
```

腳本驗證 `/health`、user A 的 create/read/update/delete，以及 user B 對 A 訂單的 GET/PATCH/DELETE 均為 404。測試訂單會在成功或失敗後以 user A 嘗試清理；若清理失敗，輸出的 UUID 必須由 user A 手動刪除。token 與密碼不會出現在成功或錯誤輸出。

部署完成後，在非秘密部署紀錄保存 project ref、前後端 URL、migration status、verification 時間與結果；不得記錄 email、password、access token、anon key 或 database URL。
