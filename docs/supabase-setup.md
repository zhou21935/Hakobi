# Supabase 後端設定

## 資料庫與環境

1. 建立 Supabase 專案並安裝 CLI，於 repository root 執行 `supabase login`。
2. 先以 `supabase start`、`supabase db reset` 在本機驗證 migration。
3. 執行 `supabase link --project-ref <project-ref>`，確認目標後執行 `supabase db push`。
4. 複製 `server/.env.example` 為 `server/.env`，填入 Project URL、PostgreSQL connection string 與允許的前端 origin；不可提交此檔。

在 Dashboard 的 Authentication → Providers → Email 關閉公開註冊，再於 Authentication → Users 建立個人帳號。後端不保存密碼，也不使用 service-role key。測試 access token 僅存於 shell 變數，勿寫入檔案或版本控制。

## 手動驗證

啟動後確認 `/health` 回 200、未帶 token 的 `/api/orders` 回 401。以 user A 建立訂單後，用 A 及 user B token 對其 UUID 執行 GET、PATCH、DELETE；A 可操作，B 必須一律收到 404 `ORDER_NOT_FOUND`。請勿對正式專案執行測試資料重設。
