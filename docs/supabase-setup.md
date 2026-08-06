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

後端從 `server/.env.example` 複製設定：

- `SUPABASE_URL`、`SUPABASE_DB_URL`、`CORS_ORIGIN`、`PORT`。
- `SUPABASE_DB_URL` 是 server secret，不得加上 `VITE_`、寫入前端設定、log 或版本控制。

在 Authentication → Providers → Email 關閉公開註冊，並建立兩個專用 verification users。應用後端不保存密碼，也不使用 service-role key。

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
